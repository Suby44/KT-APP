import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../../components/ui/Button";
import { normalizeShareCode } from "../../utils/shareCode";
import { isPartnerSharingConfigured } from "../../firebase";

export function PartnerLinkPage({ onLink }: { onLink: (code: string) => void }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const normalized = normalizeShareCode(input);
    if (normalized) onLink(normalized);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-cream-50 px-6 text-center">
      <div className="mb-4 text-6xl">💞</div>
      <h1 className="text-2xl font-bold text-neutral-800">Connect with your partner</h1>
      <p className="mt-3 max-w-xs text-neutral-500">
        Enter the share code your partner sent you to see a live, read-only view of their cycle data.
      </p>

      {!isPartnerSharingConfigured && (
        <p className="mt-4 max-w-xs text-sm text-amber-600">Partner sharing isn't configured for this deployment yet.</p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 w-full max-w-xs">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. AB3D9F2K"
          maxLength={12}
          className="w-full rounded-2xl border border-bloom-200 bg-white px-4 py-3 text-center text-lg font-semibold uppercase tracking-[0.2em] text-neutral-800 focus:border-bloom-500 focus:outline-none"
        />
        <Button type="submit" className="mt-4 w-full" disabled={!input.trim()}>
          Connect
        </Button>
      </form>
    </div>
  );
}
