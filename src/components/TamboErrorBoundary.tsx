import React from 'react';

type Props = {
  children: React.ReactNode;
  onError?: (err: unknown) => void;
};

type State = {
  hasError: boolean;
};

export default class TamboErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      // We intentionally render nothing here; the parent decides the fallback UI.
      return null;
    }
    return this.props.children;
  }
}
