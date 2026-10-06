import { useCallback, useEffect, useRef, useState } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/supabase";

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("Failed to load Turnstile"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export function useTurnstile(action: "appointment-request") {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenRef = useRef<string>("");
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setErrorCode(null);
    setState("loading");
    setAttempt((n) => n + 1);
  }, []);

  const reset = useCallback(() => {
    tokenRef.current = "";
    if (widgetIdRef.current !== null && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        widgetIdRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!TURNSTILE_SITE_KEY) {
      console.error("Turnstile site key is missing");
      setErrorCode("missing-sitekey");
      setState("error");
      return;
    }

    loadTurnstile()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: "interaction-only",
          "response-field": false,
          callback: (token: string) => {
            tokenRef.current = token;
            setState("ready");
          },
          "error-callback": (code?: string) => {
            console.error("Turnstile error:", code ?? "unknown");
            tokenRef.current = "";
            setErrorCode(code ?? "unknown");
            setState("error");
          },
          "expired-callback": () => {
            tokenRef.current = "";
            setState("loading");
          },
        });
      })
      .catch((err) => {
        console.error("Turnstile script failed:", err instanceof Error ? err.message : err);
        if (!cancelled) {
          setErrorCode("script-load-failed");
          setState("error");
        }
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* widget already gone */
        }
        widgetIdRef.current = null;
      }
    };
  }, [attempt]);

  return { containerRef, tokenRef, state, errorCode, reset, retry };
}
