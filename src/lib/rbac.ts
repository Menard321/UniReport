export type Role = "STUDENT" | "ACADEMIC_STAFF" | "UNIREPORT_ADMIN";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// Current mocked session globally
export const getCurrentSession = (): UserSession => {
  return {
    id: "admin_u1",
    name: "System Administrator",
    email: "admin@unireport.tz",
    role: "UNIREPORT_ADMIN"
  };
};

export const hasPermission = (userRole: Role, requiredRole: Role): boolean => {
  const roleHierarchy: Record<Role, number> = {
    "STUDENT": 1,
    "ACADEMIC_STAFF": 2,
    "UNIREPORT_ADMIN": 3
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};
