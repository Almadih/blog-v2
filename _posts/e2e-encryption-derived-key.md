---
title: End-to-End Encrypted Chat with Derived Keys
date: "2025-09-01"
published: true
tags: [cryptography, typescript]
coverImage: "/assets/blog/images/cropped-e2e-min.png"
excerpt: "How I built an end-to-end encrypted chat system in Next.js using derived keys and SubtleCrypto’s ECDH implementation."
ogImage:
  url: "/assets/blog/images/cropped-e2e-min.png"
---

I recently ran into an interesting challenge:  
I wanted to build a chat system where **two parties can exchange messages with true end-to-end encryption**.

That sounds simple at first, but when you start digging into the details, you realize there are a lot of traps. Let’s walk through how I solved it, what didn’t work, and the solution I ended up with using `SubtleCrypto` in a Next.js + TypeScript app.

---

## The Challenge

Two users want to send messages to each other.  
The requirements are:

1. Messages should be encrypted end-to-end.
2. Only the intended recipient should be able to decrypt.
3. Messages are stored in a database and retrievable later.

At first, I explored the **usual suspects**.

---

## First Attempt: Symmetric Encryption

One option is to generate a **shared symmetric key** (AES for example) and use it for both encryption and decryption.

But here’s the issue:  
👉 You need to somehow **exchange the key securely** between the two users.  
If you send it over the network, you defeat the purpose. If you try to store it, you risk compromise.

Not ideal.

---

## Second Attempt: Asymmetric Encryption

The next idea: use **public/private key pairs**.

- Alice generates a key pair. Bob generates his.
- They exchange public keys.
- When Alice sends a message to Bob, she encrypts it with his public key.
- Bob decrypts with his private key. Perfect.

So where’s the problem?

The **messages live in a database**.  
When Bob retrieves the chat history, he can only decrypt **messages sent to him**. The messages Alice sent can’t be decrypted by Bob because they’re encrypted with Alice’s public key. Likewise, Alice can’t read Bob’s old messages.

One workaround could be storing unencrypted local copies of your own messages before sending them… but that’s neither secure nor practical.

---

## The Breakthrough: Derived Keys

This is where I stumbled upon the magic of **key derivation**.

Instead of exchanging a secret symmetric key directly, we use a **Key Derivation Function (KDF)**.  
The Web Crypto API (`SubtleCrypto`) has a neat method for this: [`deriveKey()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey).

### What’s a KDF?

A **Key Derivation Function** is a cryptographic algorithm that derives one or more secret keys from a secret value (like a master key, password, or passphrase). It usually involves hashing or block ciphers to generate strong, pseudorandom keys.

---

## New Flow with ECDH + KDF

Here’s the revised flow using **ECDH (Elliptic-Curve Diffie-Hellman)**:

1. Each user generates a public/private key pair.
2. When starting a chat, they exchange **public keys** only.
3. Each user uses their **private key** + the other person’s **public key** to derive a **shared secret key**.
4. Congratulations 🎉 — now both parties have the **exact same key** without exchanging anything private.

Now messages are encrypted/decrypted using **AES-GCM** with that shared key.  
Since the key is the same for both, **either party can fetch the conversation history and decrypt all messages**.

This feels like symmetric encryption… but without the headache of securely sharing the key.

---

## The New Problem

Of course, this introduces another challenge:  
👉 How do you **securely store the derived key**?

If an attacker compromises one of the clients, they can see the entire conversation history.  

But that’s a problem for another day (and another blog post 😅).

---

## Code Examples

### Generating a Key Pair

Here’s how to generate an ECDH key pair with `SubtleCrypto`:

```ts
export async function generateEncryptionKeyPair(): Promise<{ publicKey: CryptoKey; privateKey: CryptoKey }> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256", // Standard curve for ECDH
    },
    true, // Key pair is extractable
    ["deriveKey", "deriveBits"] // Usages for private key
  );

  return { publicKey: keyPair.publicKey, privateKey: keyPair.privateKey };
}
```

This gives you a `public key` you can share and a `private key` you must keep safe.

### Deriving the Shared Key

Once both users have exchanged public keys, each can derive the same symmetric key:

```ts
export async function deriveSharedKey(privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> {
  const sharedKey = await window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: publicKey, // The other party's public key
    },
    privateKey, // Your private key
    {
      name: "AES-GCM", // Algorithm for the derived key
      length: 256,     // Key length in bits
    },
    true, // Extractable
    ["encrypt", "decrypt"] // Usages
  );

  return sharedKey;
}

```


Now both Alice and Bob have the **exact same AES key** they can use for all encryption and decryption in the chat.



## Wrapping Up

What started as a simple "let’s make encrypted chat" turned into a fun journey through cryptography.
The combination of **ECDH + derived** keys gave me exactly what I needed: a secure, practical way to share messages with end-to-end encryption.

There are still open challenges (like securely storing the derived key), but that’s for another day.

For now, I’m just happy my chat app can truly call itself **end-to-end encrypted**. 🔐