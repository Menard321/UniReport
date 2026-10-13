export type Role = "STUDENT" | "ACADEMIC_STAFF" | "UNIREPORT_ADMIN";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
}



export const hasPermission = (userRole: Role, requiredRole: Role): boolean => {
  const roleHierarchy: Record<Role, number> = {
    "STUDENT": 1,
    "ACADEMIC_STAFF": 2,
    "UNIREPORT_ADMIN": 3
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};
