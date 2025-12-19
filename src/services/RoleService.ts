// services/RoleService.ts

import { apiRequest } from '../utils/apiRequest';
import { logger } from '../utils/logger';
import type { 
  ApiResponse,
} from '../types/api';
import { CreateRoleDto, PermissionCatalog, Role, RoleDetails, RolePermission, UpdateRoleDto, UpdateRolePermissionsDto } from '../types/users/users.type';

/**
 * Interface for optional parameters when fetching roles.
 */
interface GetRolesParams {
  branchId?: number;
  restaurantId?: number;
  includePermissions?: boolean;
}

class RoleService {

  /**
   * GET /api/Roles
   * Fetches all roles, optionally filtered by branchId or restaurantId.
   * Includes permissions by default.
   */
  async getRoles(params: GetRolesParams = {}): Promise<ApiResponse<Role[]>> {
    try {
      // Set defaults: includePermissions is true unless explicitly set to false
      const apiParams: GetRolesParams = {
        includePermissions: true,
        ...params, 
      };

      logger.info('🔍 getRoles çağrılıyor...', apiParams, { prefix: 'RoleService' });

      
      const response = await apiRequest<Role[]>({
        method: 'GET',
        url: '/api/Roles/',
        params: apiParams
      });

      logger.info('✅ getRoles başarılı', response, { prefix: 'RoleService' });
      
      const rolesData = Array.isArray(response) ? response : [];
        
      return {
        success: true,
        data: rolesData
      };
    } catch (error) {
      logger.error('❌ getRoles hatası', error, { prefix: 'RoleService' });
      throw error;
    }
  }

    async getRolesAssignable(params: GetRolesParams = {}): Promise<ApiResponse<Role[]>> {
    try {
      // Set defaults: includePermissions is true unless explicitly set to false
      const apiParams: GetRolesParams = {
        includePermissions: true,
        ...params, 
      };

      logger.info('🔍 getRoles çağrılıyor...', apiParams, { prefix: 'RoleService' });

      
      const response = await apiRequest<Role[]>({
        method: 'GET',
        url: '/api/Roles/assignable',
        params: apiParams
      });

      logger.info('✅ getRoles başarılı', response, { prefix: 'RoleService' });
      
      const rolesData = Array.isArray(response) ? response : [];
        
      return {
        success: true,
        data: rolesData
      };
    } catch (error) {
      logger.error('❌ getRoles hatası', error, { prefix: 'RoleService' });
      throw error;
    }
  }
  /**
   * GET /api/Roles/{roleId}
   * Fetches a single role by its ID.
   */
  async getRoleById(params: GetRolesParams = {}, roleId: string): Promise<ApiResponse<RoleDetails>> {
    try {
      logger.info(`🔍 getRoleById çağrılıyor: ${roleId}`, null, { prefix: 'RoleService' });


       const apiParams: GetRolesParams = {
        includePermissions: true,
        ...params, 
      };


      const response = await apiRequest<RoleDetails>({
        method: 'GET',
        url: `/api/Roles/${roleId}`,
        params: apiParams

      });


      logger.info('✅ getRoleById başarılı', response, { prefix: 'RoleService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ getRoleById hatası', error, { prefix: 'RoleService' });
      throw error;
    }
  }

  /**
   * POST /api/Roles
   * Creates a new role.
   */
async createRole(roleData: CreateRoleDto): Promise<ApiResponse<Role>> {
    try {
      logger.info('🔍 createRole çağrılıyor...', roleData, { prefix: 'RoleService' });
      
      // 1. Destructure to separate branchId from the rest of the data
      const { branchId, ...roleBodyData } = roleData;

      // 2. Create the request configuration object
      const requestConfig = {
        method: 'POST' as const,
        url: `/api/Roles`,
        data: roleBodyData, // Send the rest of the data as the request body
        params: {} as { branchId?: number } // Initialize params object
      };

      // 3. Conditionally add branchId to the query parameters
      if (branchId) {
        requestConfig.params.branchId = branchId;
      }
      
        
      // 4. Send the request with the new configuration
      const response = await apiRequest<Role>(requestConfig);

      logger.info('✅ createRole başarılı', response, { prefix: 'RoleService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ createRole hatası', error, { prefix: 'RoleService' });
      throw error;
    }
  }
  /**
   * PUT /api/Roles/{roleId}
   * Updates an existing role's details.
   */
  async updateRole(roleId: string, roleData: UpdateRoleDto): Promise<ApiResponse<any>> {
    try {
      logger.info(`🔍 updateRole çağrılıyor: ${roleId}`, roleData, { prefix: 'RoleService' });
      
      const response = await apiRequest<any>({
        method: 'PUT',
        url: `/api/Roles/${roleId}`,
        data: roleData
      });

      logger.info('✅ updateRole başarılı', response, { prefix: 'RoleService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ updateRole hatası', error, { prefix: 'RoleService' });
      throw error;
    }
  }

  /**
   * DELETE /api/Roles/{roleId}
   * Deletes a role.
   */
  async deleteRole(roleId: string): Promise<ApiResponse<any>> {
    try {
      logger.info(`🔍 deleteRole çağrılıyor: ${roleId}`, null, { prefix: 'RoleService' });
      const response = await apiRequest<any>({
        method: 'DELETE',
        url: `/api/Roles/${roleId}`
      });

      logger.info('✅ deleteRole başarılı', response, { prefix: 'RoleService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ deleteRole hatası', error, { prefix: 'RoleService' });
      throw error;
    }
  }

  /**
   * GET /api/Permissions/catalog
   * Fetches the catalog of all available permissions, grouped by category.
   * Optionally filters by branchId.
   */
  async getPermissionCatalog(params: { branchId?: number } = {}): Promise<ApiResponse<PermissionCatalog[]>> {
    try {
      logger.info('🔍 getPermissionCatalog çağrılıyor...', params, { prefix: 'RoleService' });
      
      // Create a copy to ensure we only send valid parameters
      const apiParams = { ...params };
      // If branchId is falsy (0, null, undefined), don't send it.
      if (!apiParams.branchId) {
        delete apiParams.branchId;
      }

      const response = await apiRequest<PermissionCatalog[]>({
        method: 'GET',
        url: '/api/Permissions/catalog',
        params: apiParams // Send the cleaned params
      });

      logger.info('✅ getPermissionCatalog başarılı', response, { prefix: 'RoleService' });
      
      const catalogData = Array.isArray(response) ? response : [];
      
      return {
        success: true,
        data: catalogData
      };
    } catch (error) {
      logger.error('❌ getPermissionCatalog hatası', error, { prefix: 'RoleService' });
      throw error;
    }
  }

  // --- NEW METHODS ---

  /**
   * GET /api/Roles/{roleId}/permissions
   * Fetches all permissions for a specific role.
   */
  async getRolePermissions(roleId: string): Promise<ApiResponse<RolePermission[]>> {
    try {
      logger.info(`🔍 getRolePermissions çağrılıyor: ${roleId}`, null, { prefix: 'RoleService' });
      
      const response = await apiRequest<RolePermission[]>({
        method: 'GET',
        url: `/api/Roles/${roleId}/permissions`
      });

      logger.info('✅ getRolePermissions başarılı', response, { prefix: 'RoleService' });
      
      return {
        success: true,
        data: Array.isArray(response) ? response : []
      };
    } catch (error) {
      logger.error('❌ getRolePermissions hatası', error, { prefix: 'RoleService' });
      throw error;
    }
  }

  /**
   * POST /api/Roles/{roleId}/permissions
   * Updates the permissions for a specific role.
   */
  async updateRolePermissions(roleId: string, permissionsData: UpdateRolePermissionsDto): Promise<ApiResponse<any>> {
    try {
      logger.info(`🔍 updateRolePermissions çağrılıyor: ${roleId}`, permissionsData, { prefix: 'RoleService' });
      
      const response = await apiRequest<any>({
        method: 'POST',
        url: `/api/Roles/${roleId}/permissions`,
        data: permissionsData
      });

      logger.info('✅ updateRolePermissions başarılı', response, { prefix: 'RoleService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ updateRolePermissions hatası', error, { prefix: 'RoleService' });
      throw error;
    }
  }

  /**
   * POST /api/Roles/{roleId}/activate
   * Activates a role.
   */
  async activateRole(roleId: string): Promise<ApiResponse<any>> {
    try {
      logger.info(`🔍 activateRole çağrılıyor: ${roleId}`, null, { prefix: 'RoleService' });
      
      const response = await apiRequest<any>({
        method: 'POST',
        url: `/api/Roles/${roleId}/activate`
      });

      logger.info('✅ activateRole başarılı', response, { prefix: 'RoleService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ activateRole hatası', error, { prefix: 'RoleService' });
      throw error;
    }
  }

  /**
   * POST /api/Roles/{roleId}/deactivate
   * Deactivates a role.
   */
  async deactivateRole(roleId: string): Promise<ApiResponse<any>> {
    try {
      logger.info(`🔍 deactivateRole çağrılıyor: ${roleId}`, null, { prefix: 'RoleService' });
      
      const response = await apiRequest<any>({
        method: 'POST',
        url: `/api/Roles/${roleId}/deactivate`
      });

      logger.info('✅ deactivateRole başarılı', response, { prefix: 'RoleService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ deactivateRole hatası', error, { prefix: 'RoleService' });
      throw error;
    }
  }
}

export const roleService = new RoleService();