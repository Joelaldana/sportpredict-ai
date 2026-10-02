import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  client?: string;
  label?: string;
}

export default function AdBanner({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  client = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-0000000000000000',
  label = 'Publicidad',
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !adRef.current) return;

    const initializeAd = () => {
      try {
        if (window.adsbygoogle && adRef.current) {
          window.adsbygoogle.push({});
          setAdLoaded(true);
        }
      } catch (err) {
        console.warn('AdSense notice: initialization waiting for live key or adblocker detected:', err);
        setAdError(true);
      }
    };

    if (client.includes('0000000000')) return;

    let script = document.querySelector<HTMLScriptElement>('script[data-sportpredict-adsense]');
    if (!script) {
      script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
      script.crossOrigin = 'anonymous';
      script.dataset.sportpredictAdsense = 'true';
      document.head.appendChild(script);
    }

    if (window.adsbygoogle) {
      initializeAd();
    } else {
      script.addEventListener('load', initializeAd, { once: true });
      return () => script?.removeEventListener('load', initializeAd);
    }
  }, [slot]);

  return (
    <aside 
      className={`w-full overflow-hidden my-6 flex flex-col items-center justify-center ${className}`}
      aria-label="Espacio de publicidad patrocinada"
    >
      <div className="w-full flex items-center justify-between px-2 mb-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
        <span>{label}</span>
        <span>Publicidad</span>
      </div>

      <div className="w-full min-h-[90px] md:min-h-[100px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex flex-col items-center justify-center p-3 relative transition-all">
        {/* Real AdSense Ins tag */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />

        {/* Fallback & dev visualization state when ads are pending or in simulation */}
        {(!adLoaded || adError || client.includes('0000000000')) && (
          <div className="text-center py-3 px-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Espacio publicitario</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Slot ID: <code className="font-mono text-slate-700 dark:text-slate-300">{slot}</code> • Formato: <span className="capitalize">{format}</span>
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
