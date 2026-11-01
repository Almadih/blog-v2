import { Share2 } from "lucide-react";
import React, { useState, useRef, useEffect, useId } from "react";

export default function Dropdown({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Close on outside click
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

  // When opened, move focus to the first option; Escape closes and returns focus.
  useEffect(() => {
    if (!open) return;

    panelRef.current
      ?.querySelector<HTMLElement>("button, a[href]")
      ?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Close when focus leaves the dropdown (e.g. tabbing past the last option).
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!dropdownRef.current?.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  };

  return (
    <div
      className="relative inline-block text-left"
      ref={dropdownRef}
      onBlur={handleBlur}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Share article"
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all border border-transparent hover:border-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {open && (
        <div
          id={panelId}
          ref={panelRef}
          className="absolute z-50 mt-2 w-52 origin-top-right right-0 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/[0.12] shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          {children}
        </div>
      )}
    </div>
  );
}
