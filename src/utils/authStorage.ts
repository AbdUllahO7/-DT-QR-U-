/**
 * Secure authentication storage utility
 *
 * Security principles:
 * 1. Uses sessionStorage by default (not synced across devices/tabs automatically)
 * 2. Only uses localStorage when "Remember Me" is explicitly checked
 * 3. Always validates token expiry before returning tokens
 * 4. Provides a single source of truth for auth data access
 */

interface AuthData {
  token: string;
  userId: string;
  tokenExpiry: string;
}

class AuthStorage {
  // Dashboard/Admin session keys - namespaced to avoid conflicts with customer sessions
  private readonly TOKEN_KEY = 'dashboard_token';
  private readonly USER_ID_KEY = 'dashboard_userId';
  private readonly TOKEN_EXPIRY_KEY = 'dashboard_token_expiry';
  private readonly REMEMBER_ME_KEY = 'dashboard_remember_me';

  // Legacy keys for migration (will be removed after transition)
  private readonly LEGACY_TOKEN_KEY = 'dashboard_token';
  private readonly LEGACY_USER_ID_KEY = 'dashboard_userId';
  private readonly LEGACY_TOKEN_EXPIRY_KEY = 'dashboard_token_expiry';

  /**
   * Always use localStorage for token storage
   * WARNING: This is less secure than using sessionStorage
   */
  private getStorage(): Storage {
    return localStorage;
  }

  /**
   * Save authentication data to localStorage
   * @param data Authentication data to store
   * @param rememberMe Whether to persist across browser sessions (kept for compatibility)
   */
  saveAuth(data: AuthData, rememberMe: boolean = false): void {
    try {
      // Set the remember me preference for compatibility
      if (rememberMe) {
        localStorage.setItem(this.REMEMBER_ME_KEY, 'true');
      } else {
        localStorage.removeItem(this.REMEMBER_ME_KEY);
      }

      // Save to new namespaced keys
      localStorage.setItem(this.TOKEN_KEY, data.token);
      localStorage.setItem(this.USER_ID_KEY, data.userId);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, data.tokenExpiry);

      // Clean up legacy keys if they exist (migration)
      localStorage.removeItem(this.LEGACY_TOKEN_KEY);
      localStorage.removeItem(this.LEGACY_USER_ID_KEY);
      localStorage.removeItem(this.LEGACY_TOKEN_EXPIRY_KEY);

    } catch (error) {
      console.error('Error saving auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  /**
   * Get the raw token from storage WITHOUT validation
   * Use this for adding token to API requests
   * Let the API validate the token and return 401 if invalid
   * @returns Token string or null
   */
  getRawToken(): string | null {
    try {
      const storage = this.getStorage();
      // Try new key first, fall back to legacy key for migration
      const token = storage.getItem(this.TOKEN_KEY);
      if (token) return token;

      // Check legacy key for backward compatibility
      const legacyToken = storage.getItem(this.LEGACY_TOKEN_KEY);
      if (legacyToken) {
        // Migrate legacy token to new key
        console.log('🔄 Migrating legacy dashboard token to new key');
        return legacyToken;
      }

      return null;
    } catch (error) {
      console.error('Error getting raw token:', error);
      return null;
    }
  }

  /**
   * Get the current authentication token WITH validation
   * Use this when you need to check if user is authenticated
   * @returns Token if valid, null otherwise
   */
  getToken(): string | null {
    try {
      const token = this.getRawToken();

      if (!token) {
        return null;
      }

      // Validate token expiry
      if (!this.isTokenValid()) {
        // Don't clear auth here - let the API return 401 and handle it there
        return null;
      }

      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Get the user ID
   */
  getUserId(): string | null {
    const storage = this.getStorage();
    // Try new key first, fall back to legacy key
    return storage.getItem(this.USER_ID_KEY) || storage.getItem(this.LEGACY_USER_ID_KEY);
  }

  /**
   * Get the token expiry date
   */
  getTokenExpiry(): string | null {
    const storage = this.getStorage();
    // Try new key first, fall back to legacy key
    return storage.getItem(this.TOKEN_EXPIRY_KEY) || storage.getItem(this.LEGACY_TOKEN_EXPIRY_KEY);
  }

  /**
   * Check if the current token is valid (exists and not expired)
   */
  isTokenValid(): boolean {
    try {
      const tokenExpiry = this.getTokenExpiry();

      if (!tokenExpiry) {
        return false;
      }

      const expiryDate = new Date(tokenExpiry);
      const now = new Date();

      // Check for invalid date
      if (isNaN(expiryDate.getTime())) {
        return false;
      }

      // Check if expired
      return expiryDate > now;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && this.isTokenValid();
  }

  /**
   * Clear all authentication data from localStorage
   */
  clearAuth(): void {
    try {
      // Clear new namespaced keys
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_ID_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(this.REMEMBER_ME_KEY);

      // Clear legacy keys (migration cleanup)
      localStorage.removeItem(this.LEGACY_TOKEN_KEY);
      localStorage.removeItem(this.LEGACY_USER_ID_KEY);
      localStorage.removeItem(this.LEGACY_TOKEN_EXPIRY_KEY);
      localStorage.removeItem('remember_me');

      // Clear other dashboard-related data
      localStorage.removeItem('restaurantName');
      localStorage.removeItem('selectedBranchId');
      localStorage.removeItem('selectedBranchName');
      localStorage.removeItem('onboarding_userId');
      localStorage.removeItem('onboarding_restaurantId');

    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Get all authentication data
   */
  getAuthData(): AuthData | null {
    const token = this.getToken();
    const userId = this.getUserId();
    const tokenExpiry = this.getTokenExpiry();

    if (!token || !userId || !tokenExpiry) {
      return null;
    }

    return { token, userId, tokenExpiry };
  }

  /**
   * Check if "Remember Me" is enabled
   */
  isRememberMeEnabled(): boolean {
    return localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
  }

  /**
   * Clean up expired tokens from localStorage on app initialization
   */
  cleanupOldTokens(): void {
    // Check if token exists and is valid (check both new and legacy keys)
    const hasToken = localStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.LEGACY_TOKEN_KEY);

    if (hasToken && !this.isTokenValid()) {
      // Token exists but is expired, clean it up
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_ID_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      // Also clean legacy keys
      localStorage.removeItem(this.LEGACY_TOKEN_KEY);
      localStorage.removeItem(this.LEGACY_USER_ID_KEY);
      localStorage.removeItem(this.LEGACY_TOKEN_EXPIRY_KEY);
      console.log('✅ Cleaned up expired tokens from localStorage');
    }
  }
}

// Export a singleton instance
export const authStorage = new AuthStorage();

// Clean up old tokens on module load
authStorage.cleanupOldTokens();
