"use client";

import { useReadingTime } from "react-hook-reading-time";

export default function ReadTime({ text }: { text: string }) {
  const { text: readTime } = useReadingTime(text);
  return readTime;
}
