'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdBelowChecker() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <div className="my-10 w-full overflow-hidden rounded-xl bg-white/50">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6171869463418529"
        data-ad-slot="2077662052"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
