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

export const PERMISSION_RESOURCES = Object.values(PermissionResource);

export const MANAGEABLE_ROLES = [
  'SENIOR_LAWYER',
  'ASSOCIATE',
  'CLERK',
  'ACCOUNTANT',
] as const;

export type ManageableRole = (typeof MANAGEABLE_ROLES)[number];

export interface ResourceAccess {
  view: boolean;
  write: boolean;
}

export type RolePermissionMap = Record<PermissionResource, ResourceAccess>;

export interface UserAccess {
  isAdmin: boolean;
  access: RolePermissionMap;
}

export interface RolePermissionsMatrix {
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
  SENIOR_LAWYER: 'Senior Lawyer',
  ASSOCIATE: 'Associate',
  CLERK: 'Clerk',
  ACCOUNTANT: 'Accountant',
};
