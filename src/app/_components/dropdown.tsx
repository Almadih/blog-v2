import { Share2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

export default function Dropdown({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Share article"
        aria-expanded={open}
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all border border-transparent hover:border-white/[0.08] focus:outline-none"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute z-50 mt-2 w-52 origin-top-right right-0 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/[0.12] shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          {children}
        </div>
      )}
    </div>
  );
}
