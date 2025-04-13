import React from 'react';
import { View, Text, ScrollView } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Something went wrong</Text>
          <Text style={{ color: 'red' }}>{this.state.error?.toString()}</Text>
          <Text style={{ marginTop: 10 }}>
            {this.state.errorInfo ? this.state.errorInfo.componentStack : null}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
