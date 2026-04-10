export const ROLE_ROUTES = {
  admin: "/admin/dasbor",
  mekanik: "/mechanic/dasbor",
  owner: "/owner/dasbor",
  customer: "/app/dasbor",
} as const;

export type UserRole = keyof typeof ROLE_ROUTES;

export function getRedirectPathForRole(
  role: string | undefined | null,
): string {
  if (!role) return ROLE_ROUTES.customer;
  return ROLE_ROUTES[role as UserRole] || ROLE_ROUTES.customer;
}
