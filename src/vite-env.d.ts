/// <reference types="vite/client" />

interface Window {
  turnstile?: {
    render: (
      el: HTMLElement | string,
      options: {
        sitekey: string;
        appearance?: "always" | "execute" | "interaction-only";
        "response-field"?: boolean;
        callback?: (token: string) => void;
        "error-callback"?: () => void;
        "expired-callback"?: () => void;
        timeout?: number;
      }
    ) => string;
    reset: (widgetId?: string) => void;
    remove: (widgetId: string) => void;
  };
}
