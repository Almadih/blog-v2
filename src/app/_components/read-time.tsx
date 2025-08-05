"use client";
import readingTime from "reading-time";

export default function ReadTime({ text }: { text: string }) {
  const { text: readTime } = readingTime(text);
  return readTime;
}
