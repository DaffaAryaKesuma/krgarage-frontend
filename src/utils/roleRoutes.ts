// Mapping role resmi ke halaman dasbor masing-masing.
export const ROLE_ROUTES = {
  admin: "/admin/dasbor",
  mekanik: "/mekanik/dasbor",
  pemilik: "/pemilik/dasbor",
  pelanggan: "/app/dasbor",
} as const;

// Alias role lama/Inggris agar tetap diarahkan ke role Indonesia.
const LEGACY_ROLE_ALIASES = {
  owner: "pemilik",
  customer: "pelanggan",
  mechanic: "mekanik",
} as const;

// Role resmi yang dipakai sistem sekarang.
export type CanonicalUserRole = keyof typeof ROLE_ROUTES;
// Role lama yang masih diterima.
export type LegacyUserRole = keyof typeof LEGACY_ROLE_ALIASES;
// UserRole bisa role resmi atau alias lama.
export type UserRole = CanonicalUserRole | LegacyUserRole;

// Mengubah string role mentah menjadi role resmi.
function normalizeRoleKey(
  role: string | undefined | null,
): CanonicalUserRole | null {
  if (!role) {
    return null;
  }

  // Lowercase supaya "Admin" dan "admin" tetap sama.
  const normalizedRole = role.toLowerCase() as UserRole;
  // Jika sudah role resmi, langsung pakai.
  if (normalizedRole in ROLE_ROUTES) {
    return normalizedRole as CanonicalUserRole;
  }

  // Jika role alias lama, ubah ke role resmi.
  return LEGACY_ROLE_ALIASES[normalizedRole as LegacyUserRole] || null;
}

// Public helper: fallback ke pelanggan jika role tidak dikenali.
export function normalizeUserRole(
  role: string | undefined | null,
): CanonicalUserRole {
  return normalizeRoleKey(role) || "pelanggan";
}

// Mengambil path redirect setelah login berdasarkan role user.
export function getRedirectPathForRole(
  role: string | undefined | null,
): string {
  return ROLE_ROUTES[normalizeUserRole(role)];
}
