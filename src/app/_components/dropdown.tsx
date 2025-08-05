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
        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white rounded-md hover:text-gray-100 focus:outline-none"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute left-1/2 transform -translate-x-1/2 z-10 mt-2 w-48 origin-top rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>

          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}
