---
title: Reliable Background OCR Processing with Inngest and Next.js
date: "2026-02-3"
published: false
tags: ['nextjs','inngest', 'ocr', 'background-processing']
coverImage: "/assets/blog/images/inngest.png"
excerpt: "Processing files with AI can be unpredictable. When a user uploads ten bank receipts at once, performing OCR on each one sequentially within a single request is a recipe for disaster."
ogImage:
  url: "/assets/blog/images/inngest.png"
---

## Reliable Background OCR Processing with Inngest and Next.js

Processing files with AI can be unpredictable. When a user uploads ten bank receipts at once, performing OCR on each one sequentially within a single request is a recipe for disaster: you'll hit serverless timeouts, memory limits, and provide a terrible user experience.

In this post, I'll explain how we used **Inngest** to build a durable, event-driven background processing pipeline for BayanPlus.

## The Challenge: The Serverless "Wall"

Standard Next.js Server Actions or API routes have strict execution limits (usually 10-60 seconds on platforms like Vercel). If you try to process multiple images using a heavy LLM like Mistral:
1.  **Timeouts**: The request will likely get killed before the 3rd or 4th image is done.
2.  **UX**: The user has to wait with a loading spinner for the entire duration.
3.  **Reliability**: If one image fails, do you roll back the others? What if the network blips mid-way?

## Enter Inngest: Event-Driven Next.js

Inngest allows us to trigger "events" that run background functions outside the main request thread. It handles retries, state management, and orchestration automatically.

### 1. Defining the Event Schema

First, we define what a "process receipt" event looks like. This gives us type safety across our app.

```typescript
// src/inngest/client.ts
export const inngest = new Inngest({
  id: "bankak-ocr",
  schemas: new EventSchemas().fromRecord<{
    "receipt/process": {
      data: {
        userId: string;
        fileKey: string;
        type: string;
        category: string;
        originalName: string;
      };
    };
  }>(),
});
```

### 2. The Background Function (The "Worker")

The core logic lives in an Inngest function. We use `step.run` to break the process into durable steps. If the "process-receipt" step fails, Inngest will retry it without re-downloading the file.

```typescript
// src/inngest/functions/process-receipt.ts
export const processReceipt = inngest.createFunction(
  { id: "process-receipt" },
  { event: "receipt/process" },
  async ({ event, step }) => {
    const { userId, fileKey, type, category, originalName } = event.data;

    // Step 1: Download from R2
    const buffer = await step.run("download-file", async () => {
      const url = await getSignedUrlForDownload(fileKey);
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer).toString("base64");
    });

    // Step 2: Perform AI OCR and Save
    const result = await step.run("process-receipt-ai", async () => {
      const fileBuffer = Buffer.from(buffer, "base64");
      return await processReceiptFromBuffer({
        userId,
        buffer: fileBuffer,
        fileKey,
        type,
        category,
        originalName,
      });
    });

    return result;
  }
);
```

### 3. Triggering in Bulk

When a user performs a bulk upload, we don't process anything immediately. Instead, we upload the files to R2 and then fire off multiple events. This happens almost instantly from the user's perspective.

```typescript
// src/app/(dashboard)/dashboard/actions.ts
export async function bulkUploadReceipts(formData: FormData) {
  // ... auth and limit checks ...

  const uploadPromises = files.map(async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `temp_${crypto.randomUUID()}_${userId}.${extension}`;
    await uploadFile(buffer, key);

    return { name: "receipt/process", data: { userId, fileKey: key, ... } };
  });

  const events = await Promise.all(uploadPromises);
  
  // Send all events to Inngest at once
  await inngest.send(events);

  return { success: true, message: `Processing ${files.length} receipts in the background...` };
}
```

## Why This Wins

1.  **Instant Feedback**: The user sees a "Processing..." message immediately. They can navigate away or even close the tab.
2.  **Parallelism**: Inngest can trigger multiple instances of the function in parallel, processing 10 receipts much faster than a sequential loop would.
3.  **Durability**: If the AI model is down or rate-limited, Inngest will automatically retry with exponential backoff.
4.  **Observability**: You get a beautiful dashboard to see exactly which step failed and why, with full logs and payload inspection.

## Conclusion

By moving heavy AI processing to Inngest, we've made BayanPlus significantly more robust and responsive. It's the difference between an application that feels like a toy and one that handles real-world workloads reliably.
