export const ROLE_ROUTES = {
  admin: "/admin/dasbor",
  mekanik: "/mekanik/dasbor",
  pemilik: "/pemilik/dasbor",
  pelanggan: "/app/dasbor",
} as const;

const LEGACY_ROLE_ALIASES = {
  owner: "pemilik",
  customer: "pelanggan",
  mechanic: "mekanik",
} as const;

export type CanonicalUserRole = keyof typeof ROLE_ROUTES;
export type LegacyUserRole = keyof typeof LEGACY_ROLE_ALIASES;
export type UserRole = CanonicalUserRole | LegacyUserRole;

function normalizeRoleKey(
  role: string | undefined | null,
): CanonicalUserRole | null {
  if (!role) {
    return null;
  }

  const normalizedRole = role.toLowerCase() as UserRole;
  if (normalizedRole in ROLE_ROUTES) {
    return normalizedRole as CanonicalUserRole;
  }

  return LEGACY_ROLE_ALIASES[normalizedRole as LegacyUserRole] || null;
}

export function normalizeUserRole(
  role: string | undefined | null,
): CanonicalUserRole {
  return normalizeRoleKey(role) || "pelanggan";
}

export function getRedirectPathForRole(
  role: string | undefined | null,
): string {
  return ROLE_ROUTES[normalizeUserRole(role)];
}
