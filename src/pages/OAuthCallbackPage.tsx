import { useEffect } from 'react';
import { useAuth } from '../auth/useAuth';

/**
 * OAuth Callback Page — Safari fallback
 *
 * When Safari's popup loses window.opener after cross-origin redirects,
 * the API callback page redirects the popup back to this SPA page with
 * the token in the URL. Since this page runs on the same origin as the
 * main SPA window, we can use localStorage to pass the token across.
 *
 * Flow:
 * 1. Popup: api.terry.earth/auth/social-auth/google → Google → callback
 * 2. Blade template detects no window.opener, redirects popup to: SPA/#/oauth-callback?token=xxx
 * 3. This component reads the token, stores it in localStorage
 * 4. The main SPA window picks up the token via localStorage polling or storage event
 * 5. This popup auto-closes
 */
export function OAuthCallbackPage() {
  const { loginWithToken } = useAuth();

  useEffect(() => {
    // Read token from URL query params
    const params = new URLSearchParams(window.location.search);
    let token = params.get('token');

    // HashRouter: params might be after the hash, e.g. #/oauth-callback?token=xxx
    // React Router should parse this, but as fallback check the hash too
    if (!token) {
      const hashParts = window.location.hash.split('?');
      if (hashParts.length > 1) {
        const hashParams = new URLSearchParams(hashParts[1]);
        token = hashParams.get('token');
      }
    }

    if (token) {
      console.log('[OAuth Callback] Token received via URL redirect, delivering to main window...');

      // 1. Store in localStorage — the main window polls for this
      try {
        localStorage.setItem('oauth_token', token);
        console.log('[OAuth Callback] Token saved to localStorage');
      } catch (e) {
        console.warn('[OAuth Callback] localStorage not available:', e);
      }

      // 2. BroadcastChannel — fires instantly in the main window (same origin)
      try {
        const bc = new BroadcastChannel('terry_auth');
        bc.postMessage({ token, status: 'success' });
        bc.close();
        console.log('[OAuth Callback] Token sent via BroadcastChannel');
      } catch (e) {
        console.warn('[OAuth Callback] BroadcastChannel not available:', e);
      }

      // 3. Try postMessage to opener (in case window.opener exists)
      try {
        if (window.opener) {
          window.opener.postMessage({ token, status: 'success' }, '*');
          console.log('[OAuth Callback] Token sent via postMessage');
        }
      } catch (e) {
        console.warn('[OAuth Callback] postMessage failed:', e);
      }

      // 4. Also login directly in this window context (in case this is not a popup)
      loginWithToken(token);

      // 5. Auto-close the popup after a short delay
      setTimeout(() => {
        console.log('[OAuth Callback] Closing popup...');
        window.close();
      }, 1500);
    } else {
      console.error('[OAuth Callback] No token found in URL');
    }
  }, [loginWithToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4" />
        <p className="text-gray-600">Login succesvol! Dit venster sluit automatisch...</p>
      </div>
    </div>
  );
}
