---
title: Server-Side Data Fetching + URL Search Params with nuqs in Next.js
date: "2025-08-15"
published: true
tags: ['react', 'nextjs','typescript']
coverImage: "/assets/blog/images/nextjs.webp"
excerpt: "When building dashboards in Next.js, you often need filters such as search bars, dropdowns, and pagination controls..."
ogImage:
  url: "/assets/blog/images/nextjs.webp"
---

When building dashboards in Next.js, you often need **filters** such as search bars, dropdowns, and pagination controls — all while keeping **server-side rendering (SSR)** for SEO and performance.  
One great tool for managing URL search parameters is [`nuqs`](https://nuqs.47ng.com/). It makes it easy to read, write, and sync query params in Next.js.

In this post, we'll focus on:

- Using `nuqs` for query params in a **server-side data fetching** setup
- Avoiding slow, laggy typing in search bars
- Keeping concerns separated for maintainability

---

## The Problem

You have a **Next.js app** with:

- A dashboard page
- A server-side fetched transactions table
- A search bar that updates the URL's query string
- Data fetched server-side based on those query params

The setup looks like this:

### Client-side Filter Component

```tsx
// app/_components/search-bar.tsx
"use client";

import { useQueryState, parseAsString } from "nuqs";

export default function SearchBar() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ shallow: false })
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
  };

  return (
    <input
      type="text"
      value={search}
      onChange={handleSearch}
      placeholder="Search transactions..."
      className="border p-2 rounded"
    />
  );
}
```

### Server-side Page

```tsx
// app/dashboard/page.tsx
import { createSearchParamsCache, parseAsString } from "nuqs/server";
import { auth } from "@/lib/auth";
import { fetchTransactions } from "@/lib/transactions";

type SearchParams = {
  search?: string;
}

const searchParamsCache = createSearchParamsCache({
  search: parseAsString.withDefault(""),
  // other params...
});

export default async function DashboardPage(props: { searchParams: Promise<SearchParams> }) {
  const session = await auth.getSession();
  const searchParams = await searchParamsCache.parse(props.searchParams);

  const filters = {
    search: searchParams.search,
    // other filters...
  };

  const transactions = await fetchTransactions(filters, session.user.id);

  return (
    <div>
      {/* render filters and table */}
    </div>
  );
}
```

---

## The Issue

When typing quickly in the search bar, it feels **slow** — characters sometimes don't show immediately.  
Why? Because every keystroke **updates the URL** → triggers a React state change → transitions → potentially heavy re-renders.

Even though the data is fetched server-side, the client input updates are tied too closely to URL updates.

---

## The Solution: Debounce the URL Updates

Instead of **updating the query param on every keystroke**, we debounce the updates.  
This means:

- The input value updates immediately for the user
- The URL (and thus server refetch) only updates after the user stops typing for a short delay

### Updated Search Component with Debounce

w'll use `use-debounce` package to debounce the updates.
install it with `npm i use-debounce` or `yarn add use-debounce`

```tsx
"use client";

import { useQueryState, parseAsString } from "nuqs";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";

export default function SearchBar() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ shallow: false })
  );

  const [inputValue, setInputValue] = useState(search);
  const [debouncedValue] = useDebounce(inputValue, 250);

  useEffect(() => {
    startSearchTransition(() => {
      setSearch(debouncedValue);
    });
    console.log(debouncedValue);
  }, [debouncedValue, setSearch]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Search transactions..."
      className="border p-2 rounded"
    />
  );
}
```

---

## Why This Works

- **Immediate feedback:** The `inputValue` state updates instantly, so the user sees their typing without delay.
- **Reduced URL churn:** The `setSearch` call only happens after 500ms of inactivity.
- **Efficient SSR:** The server still receives query params and fetches filtered data on page load or param changes.
- **Separation of concerns:** Client-side handles UI responsiveness; server-side handles the heavy lifting.

---

## General Best Practices

1. **Keep filters/search params in the URL** for shareability and SSR.
2. **Use `nuqs`** for safe, typed query param parsing.
3. **Debounce inputs** that trigger server refetches.
4. **Separate components**:
   - Search/filter dropdowns → **client**
   - Data fetching & rendering → **server**
5. **Pass props** from server to client components for initial state, but always let the server be the source of truth.

---

## Final Thoughts

By using `nuqs` with a debounce strategy, you can have **instant, smooth search input** while keeping your data fetching **server-driven** and **SEO-friendly**.

This approach is clean, maintainable, and keeps **performance** in check — especially for dashboards where filtering is frequent.