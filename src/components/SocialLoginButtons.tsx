import { useState, useEffect, useRef, useCallback } from 'react';
import { getSocialAuthUrl } from '../api/client';
import { useAuth } from '../auth/useAuth';

export function SocialLoginButtons() {
  const { loginWithToken } = useAuth();
  const [status, setStatus] = useState<'idle' | 'waiting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const handledRef = useRef(false);

  const handleTokenReceived = useCallback((token: string, source: string) => {
    if (handledRef.current) return; // prevent double-handling
    handledRef.current = true;
    console.log(`[OAuth] Token received via ${source}`);
    setStatus('idle');
    if (pollRef.current) clearInterval(pollRef.current);
    // Clean up localStorage fallback token
    try { localStorage.removeItem('oauth_token'); } catch {}
    loginWithToken(token);
  }, [loginWithToken]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // PostMessage listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      if (data?.token && data?.status === 'success') {
        handleTokenReceived(data.token, 'postMessage');
      }
      if (typeof data === 'string' && data.length > 20) {
        handleTokenReceived(data, 'postMessage (raw string)');
      }
    };

    // Storage event (fires when OTHER tabs/windows modify localStorage)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'oauth_token' && event.newValue) {
        handleTokenReceived(event.newValue, 'storage event');
      }
    };

    // BroadcastChannel (modern browsers, works cross-tab)
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('terry_auth');
      bc.onmessage = (event) => {
        if (event.data?.token) {
          handleTokenReceived(event.data.token, 'BroadcastChannel');
        }
      };
    } catch {
      // BroadcastChannel not supported
    }

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, [handleTokenReceived]);

  const openOAuth = (type: 'google' | 'apple') => {
    setStatus('waiting');
    setErrorMsg('');
    handledRef.current = false;

    // Clear any leftover token from previous attempts
    try { localStorage.removeItem('oauth_token'); } catch {}

    const url = getSocialAuthUrl(type);
    console.log('[OAuth] Opening popup:', url);

    const w = 500;
    const h = 650;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;

    const popup = window.open(
      url,
      'TerryOAuth',
      `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`,
    );

    if (!popup || popup.closed) {
      console.error('[OAuth] Popup was blocked by browser');
      setStatus('error');
      setErrorMsg('Popup geblokkeerd. Sta pop-ups toe voor deze site en probeer opnieuw.');
      return;
    }

    popupRef.current = popup;
    popup.focus();

    // Poll localStorage as extra fallback (for Safari where storage event may not fire
    // from a cross-origin popup, we actively check)
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      // Check localStorage for token (set by callback page)
      try {
        const storedToken = localStorage.getItem('oauth_token');
        if (storedToken) {
          handleTokenReceived(storedToken, 'localStorage poll');
          return;
        }
      } catch {}

      // Check if popup closed without token
      if (popupRef.current?.closed) {
        clearInterval(pollRef.current);
        // Wait a bit for any async token delivery
        setTimeout(() => {
          if (!handledRef.current) {
            console.log('[OAuth] Popup closed without token received');
            setStatus('idle');
          }
        }, 2000);
      }
    }, 500);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => openOAuth('google')}
        disabled={status === 'waiting'}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {status === 'waiting' ? 'Wachten op login...' : 'Inloggen met Google'}
      </button>

      <button
        type="button"
        onClick={() => openOAuth('apple')}
        disabled={status === 'waiting'}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
        {status === 'waiting' ? 'Wachten op login...' : 'Inloggen met Apple'}
      </button>

      {status === 'error' && (
        <p className="text-sm text-red-600 text-center">{errorMsg}</p>
      )}
    </div>
  );
}
