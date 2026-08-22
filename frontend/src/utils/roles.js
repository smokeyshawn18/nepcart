export const STAFF_ROLES = ["admin", "support"];

export function isStaffRole(role) {
  return STAFF_ROLES.includes(role);
}
