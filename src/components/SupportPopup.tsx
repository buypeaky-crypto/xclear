"use client";

import { useEffect, useRef, useState } from "react";
import { Fraunces } from "next/font/google";
import DonationButtons from "./DonationButtons";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

type SupportPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  isChecking: boolean;
};

export default function SupportPopup({ isOpen, onClose, isChecking }: SupportPopupProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeEnabledAt = useRef(0);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      closeEnabledAt.current = 0;
      return;
    }

    closeEnabledAt.current = Date.now() + 5_000;
    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((closeEnabledAt.current - Date.now()) / 1_000));
      setSecondsRemaining(remaining);
      if (remaining === 0) window.clearInterval(interval);
    }, 200);

    return () => window.clearInterval(interval);
  }, [isOpen]);

  function closePopup() {
    if (Date.now() < closeEnabledAt.current) return;
    closeEnabledAt.current = 0;
    setSecondsRemaining(5);
    onCloseRef.current();
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (Date.now() >= closeEnabledAt.current) {
          closeEnabledAt.current = 0;
          setSecondsRemaining(5);
          onCloseRef.current();
        }
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-stone-900/55 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-popup-title"
        aria-describedby="support-popup-description"
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-md border border-amber-200 bg-[#fdf6e3] p-6 text-stone-900 shadow-2xl outline-none sm:p-8"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-950">
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${isChecking ? "animate-pulse bg-emerald-600" : "bg-stone-400"}`} />
            {isChecking ? "Checking your results" : "Your results are ready"}
          </span>
          <button
            type="button"
            disabled={secondsRemaining > 0}
            onClick={closePopup}
            className="rounded-full border border-stone-400 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {secondsRemaining > 0 ? `Close (${secondsRemaining}s)` : "Close"}
          </button>
        </div>

        <div className="text-center">
          <p aria-hidden="true" className="mb-3 text-3xl">✳</p>
          <h2 id="support-popup-title" className={`${fraunces.className} text-3xl font-black italic leading-tight sm:text-4xl`}>
            We keep it clean &amp; free 💛
          </h2>
          <p id="support-popup-description" className="mx-auto mt-4 max-w-md text-sm leading-6 text-stone-700">
            ShadowbannChecker has no AdSense or ads. Google and Vercel Analytics are enabled. We pay Vercel + APIs ourselves to keep it clean. If this checker helped, kindly support with PayPal or Crypto — even $3 keeps us alive.
          </p>
        </div>

        <div className="mt-2 [&_a]:rounded-full [&_a]:bg-stone-900 [&_a]:text-white [&_a:hover]:bg-black [&_button]:rounded-full">
          <DonationButtons />
        </div>

        <p className="mt-5 text-center text-xs text-stone-500">
          This popup shows while checking — you can close after 5s
        </p>
      </div>
    </div>
  );
}