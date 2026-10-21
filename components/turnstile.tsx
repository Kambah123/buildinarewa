'use client';

import {useEffect, useId, useRef, useState} from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

type TurnstileProps = {
  onToken: (token: string) => void;
};

export function Turnstile({onToken}: TurnstileProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const scriptId = useId().replace(/:/g, '');

  useEffect(() => {
    if (!siteKey || !container.current) return;
    const render = () => {
      if (!window.turnstile || !container.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(container.current, {
        sitekey: siteKey,
        theme: 'light',
        callback: (token: string) => onToken(token),
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken('')
      });
      setReady(true);
    };

    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile-script]');
    if (existing) {
      existing.addEventListener('load', render);
      render();
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      script.dataset.turnstileScript = 'true';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', render);
      document.head.appendChild(script);
    }

    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
    };
  }, [onToken, scriptId, siteKey]);

  if (!siteKey) return null;
  return (
    <div>
      <div ref={container} aria-label="Spam verification" />
      {!ready ? <p className="mt-2 text-xs text-stone-500">Loading verification…</p> : null}
    </div>
  );
}
