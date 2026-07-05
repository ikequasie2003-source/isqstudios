// ─── Admin password gate ──────────────────────────────────────────────────────
// Change ADMIN_PASSWORD to something only you know.
// For production, replace this with proper backend auth (Supabase, Clerk, etc.)

const ADMIN_PASSWORD = "isqstudios2024";
const SESSION_KEY = "isq_admin_session";
const SESSION_VALUE = "granted";

export function isAdminAuthenticated(): boolean {
  try {
    return localStorage.getItem(SESSION_KEY) === SESSION_VALUE;
  } catch {
    return false;
  }
}

export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(SESSION_KEY, SESSION_VALUE);
    return true;
  }
  return false;
}

export function adminLogout(): void {
  localStorage.removeItem(SESSION_KEY);
}
