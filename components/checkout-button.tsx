"use client";

import { useState } from "react";

import { getApiErrorMessage } from "@/lib/api";

export function CheckoutButton({
  label,
  action,
}: {
  label: string;
  action: () => Promise<string>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setIsLoading(true);
    setError("");

    try {
      const checkoutUrl = await action();
      window.location.assign(checkoutUrl);
    } catch (actionError) {
      setError(getApiErrorMessage(actionError));
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={isLoading}
        onClick={handleClick}
        className="inline-flex items-center justify-center rounded-full bg-[#7b9a70] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#93b586] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Redirecting..." : label}
      </button>
      {error ? (
        <p className="max-w-xl rounded-2xl border border-[#7a3f3f] bg-[#241212] px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}
