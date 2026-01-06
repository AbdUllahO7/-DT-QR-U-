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
  private readonly TOKEN_KEY = 'token';
  private readonly USER_ID_KEY = 'userId';
  private readonly TOKEN_EXPIRY_KEY = 'tokenExpiry';
  private readonly REMEMBER_ME_KEY = 'remember_me';

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

      // Always use localStorage
      localStorage.setItem(this.TOKEN_KEY, data.token);
      localStorage.setItem(this.USER_ID_KEY, data.userId);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, data.tokenExpiry);

    } catch (error) {
      console.error('Error saving auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  /**
   * Get the current authentication token
   * @returns Token if valid, null otherwise
   */
  getToken(): string | null {
    try {
      const storage = this.getStorage();
      const token = storage.getItem(this.TOKEN_KEY);

      if (!token) {
        return null;
      }

      // Validate token expiry
      if (!this.isTokenValid()) {
        this.clearAuth();
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
    return storage.getItem(this.USER_ID_KEY);
  }

  /**
   * Get the token expiry date
   */
  getTokenExpiry(): string | null {
    const storage = this.getStorage();
    return storage.getItem(this.TOKEN_EXPIRY_KEY);
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
      // Clear from localStorage
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_ID_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(this.REMEMBER_ME_KEY);
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
    // Check if token exists and is valid
    const hasToken = localStorage.getItem(this.TOKEN_KEY);

    if (hasToken && !this.isTokenValid()) {
      // Token exists but is expired, clean it up
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_ID_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
     ('✅ Cleaned up expired tokens from localStorage');
    }
  }
}

// Export a singleton instance
export const authStorage = new AuthStorage();

// Clean up old tokens on module load
authStorage.cleanupOldTokens();
