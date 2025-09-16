import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';
import { ErrorBoundaryProps, ErrorBoundaryState } from '../types/BranchManagement/type';



// Basit global ErrorBoundary – prod ortamında kullanıcı dostu mesaj, dev modda hatayı konsola basar
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Geliştirici ortamında detaylı log
    if (import.meta.env.DEV) {
      logger.error('React ErrorBoundary yakaladı:', {
        error,
        componentStack: info.componentStack
      });
    } else {
      // Production'da sadece hata mesajını logla
      logger.error('Uygulama hatası:', {
        message: error.message,
        stack: error.stack,
        componentStack: info.componentStack
      });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;
      // Basit geridönüş UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center p-6">
          <h1 className="text-2xl font-semibold mb-4 text-red-600 dark:text-red-400">Bir şeyler ters gitti</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">Sayfa görüntülenemiyor. Lütfen daha sonra tekrar deneyin.</p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-left bg-gray-200 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-w-xl whitespace-pre-wrap">
              {this.state.error.message}\n{this.state.error.stack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 