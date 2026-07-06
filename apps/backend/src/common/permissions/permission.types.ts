import { UserRole } from '@prisma/client';

export enum PermissionResource {
  DASHBOARD = 'dashboard',
  CLIENTS = 'clients',
  CASES = 'cases',
  DIARY = 'diary',
  DOCUMENTS = 'documents',
  PAYMENTS = 'payments',
  EXPENSES = 'expenses',
  LEGAL_RESEARCH = 'legal_research',
}

export enum PermissionAction {
  VIEW = 'view',
  WRITE = 'write',
}

export const PERMISSION_RESOURCES = Object.values(PermissionResource);

export const MANAGEABLE_ROLES = [
  UserRole.SENIOR_LAWYER,
  UserRole.ASSOCIATE,
  UserRole.CLERK,
  UserRole.ACCOUNTANT,
] as const;

export type ManageableRole = (typeof MANAGEABLE_ROLES)[number];

export interface ResourceAccess {
  view: boolean;
  write: boolean;
}

export type RolePermissionMap = Record<PermissionResource, ResourceAccess>;

export type OrganizationRolePermissions = Partial<
  Record<ManageableRole, Partial<RolePermissionMap>>
>;

export interface UserAccessResponse {
  isAdmin: boolean;
  access: RolePermissionMap;
}

export interface RolePermissionsMatrixResponse {
  roles: ManageableRole[];
  resources: PermissionResource[];
  permissions: Record<ManageableRole, RolePermissionMap>;
}

export const RESOURCE_LABELS: Record<PermissionResource, string> = {
  [PermissionResource.DASHBOARD]: 'Dashboard',
  [PermissionResource.CLIENTS]: 'Clients',
  [PermissionResource.CASES]: 'Cases',
  [PermissionResource.DIARY]: 'Case Diary',
  [PermissionResource.DOCUMENTS]: 'Documents',
  [PermissionResource.PAYMENTS]: 'Payments',
  [PermissionResource.EXPENSES]: 'Expenses',
  [PermissionResource.LEGAL_RESEARCH]: 'Legal Research',
};

export const ROLE_LABELS: Record<ManageableRole, string> = {
  [UserRole.SENIOR_LAWYER]: 'Senior Lawyer',
  [UserRole.ASSOCIATE]: 'Associate',
  [UserRole.CLERK]: 'Clerk',
  [UserRole.ACCOUNTANT]: 'Accountant',
};
