"use client";

import { useState } from "react";

export default function DonationButtons() {
  const [showCrypto, setShowCrypto] = useState(false);

  return (
    <>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href="https://paypal.me/BDXII"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-amber-400 px-7 py-2.5 text-sm font-semibold text-stone-900 shadow-sm transition-colors hover:bg-amber-300"
        >
          Buy Me a Coffee
        </a>
        <button
          type="button"
          onClick={() => setShowCrypto(true)}
          className="rounded-full bg-stone-900 px-7 py-2.5 text-sm text-white transition-colors hover:bg-black"
        >
          Crypto
        </button>
      </div>

      {showCrypto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowCrypto(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="crypto-donation-title"
            className="w-full max-w-sm space-y-3 rounded-md bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="crypto-donation-title" className="text-center text-lg font-bold">
              Donate Crypto
            </h2>
            <div>
              <p className="mb-1 text-xs font-bold text-stone-800">BTC</p>
              <p className="select-all break-all rounded bg-stone-100 p-2 text-[10px]">bc1qham6hxw6hx9p95rhq27nnzlmzyrr39w6p2gfm2</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold text-stone-800">ETH</p>
              <p className="select-all break-all rounded bg-stone-100 p-2 text-[10px]">0x438E7Be244e46D414f097B211cC4fa7549fB3C3b</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold text-stone-800">SOL</p>
              <p className="select-all break-all rounded bg-stone-100 p-2 text-[10px]">G2dYPPTMorSSoUb68fKYbX55pARzrT1FccRfjgYQFy9V</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCrypto(false)}
              className="mt-2 w-full rounded-full bg-stone-900 py-2.5 text-white transition-colors hover:bg-black"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </>
  );
}