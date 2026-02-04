/**
 * Centralized Session Storage Management
 *
 * This utility handles different session contexts to avoid conflicts:
 * - Dashboard: For admin/staff users (requires login)
 * - TableQR: For customers scanning QR codes at tables
 * - OnlineMenu: For customers accessing online menu via public link
 * - OrderTracker: For customers tracking their orders (uses TableQR or OnlineMenu session)
 */

export type SessionContext = 'dashboard' | 'tableQR' | 'onlineMenu' | 'orderTracker';

// Session storage keys
const SESSION_KEYS = {
  // Dashboard (admin) session
  dashboard: {
    token: 'token',
    tokenExpiry: 'tokenExpiry',
    userId: 'userId',
  },
  // TableQR session (customer scans QR at table)
  tableQR: {
    token: 'table_session_token',
    customerIdentifier: 'customerIdentifier',
  },
  // OnlineMenu session (customer accesses via public link)
  onlineMenu: {
    token: 'online_menu_token',
    sessionId: 'online_menu_session_id',
    branchId: 'online_menu_branch_id',
    tokenExpiry: 'online_menu_token_expiry',
  },
  // Tracked orders storage
  trackedOrders: {
    dashboard: 'trackedOrders',
    onlineMenu: 'onlineTrackedOrders',
    tableQR: 'tableTrackedOrders',
  },
} as const;

/**
 * Determine the current session context based on URL path
 */
export function getCurrentContext(): SessionContext {
  const path = window.location.pathname;

  if (path.includes('/table/qr/')) {
    return 'tableQR';
  }
  if (path.includes('/OnlineMenu')) {
    return 'onlineMenu';
  }
  if (path.includes('/track/')) {
    return 'orderTracker';
  }
  if (path.includes('/dashboard')) {
    return 'dashboard';
  }

  // Default to dashboard for other paths
  return 'dashboard';
}

/**
 * Get the appropriate session token for the current context
 */
export function getSessionToken(context?: SessionContext): string | null {
  const currentContext = context || getCurrentContext();

  switch (currentContext) {
    case 'tableQR':
      return localStorage.getItem(SESSION_KEYS.tableQR.token);

    case 'onlineMenu':
      return localStorage.getItem(SESSION_KEYS.onlineMenu.token);

    case 'orderTracker':
      // Order tracker can use either tableQR or onlineMenu session
      return localStorage.getItem(SESSION_KEYS.tableQR.token)
          || localStorage.getItem(SESSION_KEYS.onlineMenu.token);

    case 'dashboard':
    default:
      return localStorage.getItem(SESSION_KEYS.dashboard.token);
  }
}

/**
 * Check if there's a valid session for the given context
 */
export function hasValidSession(context?: SessionContext): boolean {
  const currentContext = context || getCurrentContext();
  const token = getSessionToken(currentContext);

  if (!token) return false;

  // For contexts with expiry, check if still valid
  if (currentContext === 'onlineMenu') {
    const expiry = localStorage.getItem(SESSION_KEYS.onlineMenu.tokenExpiry);
    if (expiry) {
      return new Date(expiry) > new Date();
    }
  }

  if (currentContext === 'dashboard') {
    const expiry = localStorage.getItem(SESSION_KEYS.dashboard.tokenExpiry);
    if (expiry) {
      return new Date(expiry) > new Date();
    }
  }

  return true;
}

/**
 * Set session data for a specific context
 */
export function setSession(context: Exclude<SessionContext, 'orderTracker'>, data: Record<string, string>): void {
  const keys = SESSION_KEYS[context];
  if (!keys) return;

  Object.entries(data).forEach(([key, value]) => {
    const storageKey = (keys as Record<string, string>)[key];
    if (storageKey) {
      localStorage.setItem(storageKey, value);
    }
  });
}

/**
 * Clear session for a specific context
 */
export function clearSession(context: Exclude<SessionContext, 'orderTracker'>): void {
  const keys = SESSION_KEYS[context];
  if (!keys) return;

  Object.values(keys).forEach((storageKey) => {
    if (typeof storageKey === 'string') {
      localStorage.removeItem(storageKey);
    }
  });
}

/**
 * Get tracked orders for the current context
 */
export function getTrackedOrders(context?: SessionContext): string | null {
  const currentContext = context || getCurrentContext();

  switch (currentContext) {
    case 'tableQR':
      return localStorage.getItem(SESSION_KEYS.trackedOrders.tableQR);
    case 'onlineMenu':
      return localStorage.getItem(SESSION_KEYS.trackedOrders.onlineMenu);
    case 'dashboard':
    default:
      return localStorage.getItem(SESSION_KEYS.trackedOrders.dashboard);
  }
}

/**
 * Set tracked orders for the current context
 */
export function setTrackedOrders(orders: any[], context?: SessionContext): void {
  const currentContext = context || getCurrentContext();
  const storageKey = SESSION_KEYS.trackedOrders[currentContext === 'orderTracker' ? 'onlineMenu' : currentContext]
                    || SESSION_KEYS.trackedOrders.onlineMenu;

  if (orders.length > 0) {
    localStorage.setItem(storageKey, JSON.stringify(orders));
  } else {
    localStorage.removeItem(storageKey);
  }
}

/**
 * Check if the current page is a public page (doesn't require dashboard login)
 */
export function isPublicPage(): boolean {
  const context = getCurrentContext();
  return context === 'tableQR' || context === 'onlineMenu' || context === 'orderTracker';
}

export { SESSION_KEYS };
