export interface UpdateUserDto {
  appUserId: string;
  name: string;
  surname: string;
  userName: string;
  email: string;
  restaurantId?: number | null;
  branchId?: number | null;
  profileImage?: string | null;
  
  isActive: boolean;
}

export interface UpdateUserRolesDto {
  roleIds: string[];
}

export interface UserData {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  createdDate: string;
  roles: string[];
  permissions?: Permission[]; // Added this based on your sample
  restaurantId: number | null; // Changed to nullable
  restaurantName: string;
  branchId: number | null;
  profileImage?: string | null;
  branchName: string | null;
}
export interface CreateUserDto {
  name: string;
  surName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phoneNumber?: string | null;
  restaurantId?: number | null;
  branchId?: number | null;
  profileImage?: string | null;
  userCreatorId: string;
  roleIdsList: string[];
  isActive: boolean;
}

export interface UsersResponse {
  users: UserData[];
}
export interface AppUserData {
  appUserId: string;
  name: string;
  surname: string;
  userName: string;
  email: string;
  restaurantId: number | null;
  restaurant: any | null; // Or be more specific if you have a Restaurant type
  branchId: number;
  branch: ProfileBranchInfo;
  profileImage: string | null;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string | null;
}


export interface Permission {
  permissionId: number;
  name: string;
  key: string;
  description: string;
  category: string;
  isActive: boolean;
  createdDate: string;
  permissionName?:string,
  modifiedDate: string | null;
}
export interface RolePermission {
  permissionId: number;
  name: string;
  description: string;
  category: string;
}
export interface PermissionCatalog {
  category: string;
  permissions: Permission[];
}

export interface PermissionOption {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface CreateRoleResponse {
  roleId: number;
  message: string;
}

export interface AppPermission {
  permissionId: number;
  name: string;
  description: string;
  category: string;
}

export interface AppRole {
  roleId: string;
  name: string;
  description: string;
  restaurantId: number | null;
  branchId: number | null;
  category: string;
  isSystemRole: boolean;
  roleScope: number;
  createdDate: string;
  modifiedDate: string | null;
  permissions: AppPermission[];
}

// This is the new type for the /api/Users/{email} response
export interface UserDetails {
  appUserId: string;
  name: string;
  surname: string;
  userName: string;
  fullName: string;
  email: string;
  restaurantId: number | null;
  branchId: number;
  profileImage: string | null;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string | null;
  phoneNumber: string | null;
  roles: AppRole[];
}

export interface ProfileBranchInfo {
  branchId: number;
  branchName: string;
  branchStatus: boolean;
  isTemporarilyClosed: boolean;
  isOpenNow: boolean;
  branchLogoPath: string;
  restaurantId: number;
}
export interface GetAllUsersParams {
  BranchId?: number;
  RoleName?: string;
  IsActive?: boolean;
  Page?: number;
  PageSize?: number;
  Includes?: string;
}
export interface UserProfile {
  appUser: AppUserData;
  appRoles: AppRole[];
}

export interface UserProfileApiResponse {
  id: string;
  userName: string;
  email: string;
  name: string;
  surname: string;
  fullName: string;
  phoneNumber: string;
  profileImage: string;
  restaurantId: number;
  branchId: number | null;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
  userCreator: number;
  onboardingStatus: number;
  roles: string[];
  permissions: string[];
  restaurantName: string;
  branchName: string | null;
}

export interface CreateUserResponse {
  userId: string;
  message: string;
}

export interface Role {
  appRoleId: string;
  name: string;
  description: string | null;
  restaurantId: number | null;
  branchId: string | null;
  category: string;
  isSystemRole: boolean;
  roleScope: number;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string | null;
  permissions: Permission[]; 
}

export type RoleDetails = Role;

export interface UserProfileResponse {
  appUser: AppUser;
  appRoles: AppRole[];
}

export interface AppUser {
  appUserId: string;
  name: string;
  surname: string;
  userName: string;
  email: string;
  restaurantId: number;
  restaurant: {
    restaurantId: number;
    restaurantName: string;
    restaurantLogoPath: string;
    restaurantStatus: boolean;
  };
  branchId: string | null;
  branch: any | null;
  profileImage: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}


export interface CreateRoleDto {
  name: string;
  description?: string | null;
  restaurantId?: number | null;
  branchId?: number ;
  category?: string | null;
}

export interface SearchUsersParams {
  SearchTerm?: string;
  IsActive?: boolean;
  Page?: number;
  PageSize?: number;
  Includes?: string;
}

export interface AssignBranchDto {
  newBranchId: number;
}

export interface ChangePasswordDto {
  appUserId: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface UpdateRoleDto {
  name: string;
  description?: string | null;
  category?: string | null;
  branchId?:string
}

export interface UpdateRolePermissionsDto {
  permissionIds: number[];
}