"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { createLogger } from "@/lib/logger";
import { Button } from "@/components/ui/button";

const log = createLogger("ui.error-boundary");

interface Props {
  children: ReactNode;
  resetKey?: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    log.error("Render error captured", error, { componentStack: info.componentStack });
  }

  componentDidUpdate(previous: Props): void {
    if (this.state.error && previous.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <h2 className="text-xl font-semibold text-ink">Something went wrong</h2>
        <p className="text-sm text-muted">The error has been recorded. You can retry or return to the dashboard.</p>
        <div className="flex gap-2">
          <Button onClick={() => this.setState({ error: null })}>Try again</Button>
          <Button variant="secondary" href="/dashboard">
            Go to dashboard
          </Button>
        </div>
      </div>
    );
  }
}
