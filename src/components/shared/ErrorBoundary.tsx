import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <h2 className="font-semibold text-[var(--color-error)] text-lg">Something went wrong</h2>
          <p className="text-[var(--color-text-secondary)] text-sm">{this.state.error?.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
