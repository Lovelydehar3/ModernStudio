import { memo, useEffect, useRef, useCallback } from "react";
import apiClient from "../../../services/apiClient";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const GoogleAuthButton = memo(function GoogleAuthButton({ onSuccess, onError }) {
  const buttonRef = useRef(null);

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      const res = await apiClient.post("/auth/google", {
        credential: response.credential
      });
      const data = res.data;
      if (data.success) {
        onSuccess?.(data.data);
      } else {
        onError?.(data.message || "Google login failed.");
      }
    } catch (err) {
      onError?.(err?.response?.data?.message || "Google login failed. Please try again.");
    }
  }, [onSuccess, onError]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
          shape: "pill"
        });
      }
    };

    if (!document.getElementById("google-identity-script")) {
      const script = document.createElement("script");
      script.id = "google-identity-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    } else {
      initGoogle();
    }
  }, [handleCredentialResponse]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        onClick={() => onError?.("Google login is not configured.")}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--accent-pink)]/[0.12] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-secondary)] transition-all duration-400 hover:border-[var(--accent-pink)]/30 hover:bg-[var(--accent-pink)]/[0.04] hover:text-[var(--text-primary)]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M15.68 8.18c0-.57-.05-1.12-.15-1.64H8v3.1h4.3a3.68 3.68 0 01-1.6 2.42v2.01h2.59c1.51-1.39 2.39-3.44 2.39-5.89z" fill="#4285F4" />
          <path d="M8 16c2.16 0 3.97-.72 5.3-1.93l-2.59-2.01c-.72.48-1.63.76-2.71.76-2.08 0-3.85-1.41-4.48-3.3H.84v2.07A8 8 0 008 16z" fill="#34A853" />
          <path d="M3.52 9.52A4.81 4.81 0 013.26 8c0-.53.09-1.04.26-1.52V4.41H.84A8 8 0 000 8c0 1.29.31 2.51.84 3.59l2.68-2.07z" fill="#FBBC05" />
          <path d="M8 3.18c1.17 0 2.23.4 3.06 1.2l2.29-2.3A7.96 7.96 0 008 0 8 8 0 00.84 4.41l2.68 2.07C4.15 4.59 5.92 3.18 8 3.18z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>
    );
  }

  return (
    <div ref={buttonRef} className="w-full [&>div]:w-full [&>div>iframe]:w-full" />
  );
});

export default GoogleAuthButton;
