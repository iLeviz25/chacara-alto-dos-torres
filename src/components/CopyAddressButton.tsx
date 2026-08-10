"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyAddressButtonProps {
  address: string;
  label: string;
  copiedLabel: string;
}

export function CopyAddressButton({
  address,
  label,
  copiedLabel,
}: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#f3904f]/45 bg-[#f3904f]/8 px-5 py-3 text-sm font-extrabold text-[#f7ab79] transition hover:bg-[#f3904f]/16"
      onClick={copyAddress}
      type="button"
    >
      {copied ? <Check aria-hidden="true" size={18} /> : <Copy aria-hidden="true" size={18} />}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}

export default CopyAddressButton;
