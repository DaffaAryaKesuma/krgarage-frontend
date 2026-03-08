/**
 * Authentication utility functions
 */

/**
 * Get authentication headers with Bearer token
 * @returns Headers object with Authorization token or empty if no token
 */
export function getAuthHeaders(): { Authorization: string } | {} {
  const token = localStorage.getItem("token");
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Get current user from localStorage
 * @returns User object or null if not logged in
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns true if user has valid token
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

/**
 * Clear authentication data
 */
export function clearAuth(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
