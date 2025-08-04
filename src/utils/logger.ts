/* Basit logger arayüzü – yalnızca geliştirme ortamında konsola yazar */

// Centralized logger utility for consistent logging format and environment-based filtering

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;
  private isTest = import.meta.env.MODE === 'test';

  private formatMessage(level: LogLevel, message: string, prefix?: string): string {
    const timestamp = new Date().toISOString();
    const levelIcon = this.getLevelIcon(level);
    const prefixStr = prefix ? `[${prefix}] ` : '';
    
    return `${levelIcon} ${timestamp} ${prefixStr}${message}`;
  }
  
  private getLevelIcon(level: LogLevel): string {
    switch (level) {
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      case 'debug': return '🔍';
      default: return '📝';
    }
  }
  
  private shouldLog(level: LogLevel): boolean {
    // Test ortamında hiç log gösterme
    if (this.isTest) {
      return false;
    }
    
    // Production'da sadece error ve warn loglarını göster
    if (this.isProduction) {
      return level === 'error' || level === 'warn';
    }
    
    // Development'ta tüm logları göster
    return true;
  }

  private shouldLogSignalR(level: LogLevel): boolean {
    // Test ortamında hiç log gösterme
    if (this.isTest) {
      return false;
    }
    
    // SignalR hatalarını production'da da göster
    if (this.isProduction) {
      return level === 'error' || level === 'warn';
    }
    
    // Development'ta tüm SignalR loglarını göster
    return true;
  }

  private shouldLogDebug(level: LogLevel): boolean {
    // Debug logları sadece development'ta ve özel durumlarda göster
    if (level === 'debug') {
      // Dashboard endpoint'leri için debug loglarını azalt
      return this.isDevelopment && !this.isProduction;
    }
    return this.shouldLog(level);
  }
  
  info(message: string, data?: any, options?: LogOptions): void {
    if (!this.shouldLog('info')) return;
    
    const formattedMessage = this.formatMessage('info', message, options?.prefix);
    console.log(formattedMessage, data || '');
  }
  
  warn(message: string, data?: any, options?: LogOptions): void {
    if (!this.shouldLog('warn')) return;
    
    const formattedMessage = this.formatMessage('warn', message, options?.prefix);
    console.warn(formattedMessage, data || '');
  }
  
  error(message: string, data?: any, options?: LogOptions): void {
    if (!this.shouldLog('error')) return;
    
    const formattedMessage = this.formatMessage('error', message, options?.prefix);
    console.error(formattedMessage, data || '');
  }
  
  debug(message: string, data?: any, options?: LogOptions): void {
    if (!this.shouldLogDebug('debug')) return;
    
    const formattedMessage = this.formatMessage('debug', message, options?.prefix);
    console.log(formattedMessage, data || '');
  }

  // SignalR için özel log metodu
  signalR(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLogSignalR(level)) return;
    
    const formattedMessage = this.formatMessage(level, `[SignalR] ${message}`);
    const logMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    logMethod(formattedMessage, data || '');
  }
  
  // Legacy support for existing code
  log(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(message, data || '');
    }
  }
}

export const logger = new Logger(); 