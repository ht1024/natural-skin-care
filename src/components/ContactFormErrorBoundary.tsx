import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ContactFormErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Contact form crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-charcoal/70 text-base">
            The appointment form could not load. Please refresh the page or email{" "}
            <a
              href="mailto:skincarenpsa@gmail.com"
              className="text-gold-600 underline"
            >
              skincarenpsa@gmail.com
            </a>
            .
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
