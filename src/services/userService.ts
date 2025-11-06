import { apiRequest } from '../utils/apiRequest';
import { logger } from '../utils/logger';
import type { 
  UserData, 
  ApiResponse, 
  CreateRoleDto, 
  CreateRoleResponse, 
  Role, 
  CreateUserDto, 
  CreateUserResponse,
  UserProfile,
  GetAllUsersParams,
  UserDetails,
  SearchUsersParams,
  UpdateUserDto,
  UpdateUserRolesDto,
  AssignBranchDto,     
  ChangePasswordDto    
} from '../types/api';

class UserService {

  async searchUsers(params: SearchUsersParams): Promise<ApiResponse<UserData[]>> {
    try {
      logger.info('🔍 searchUsers çağrılıyor...', params, { prefix: 'UserService' });
      
      const response = await apiRequest<UserData[]>({
        method: 'GET',
        url: '/api/Users/search',
        params: params
      });

      logger.info('✅ searchUsers başarılı', response, { prefix: 'UserService' });
      
      const usersData = Array.isArray(response) ? response : [];
      
      return {
        success: true,
        data: usersData
      };
    } catch (error) {
      logger.error('❌ searchUsers hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  async getUserByEmail(email: string, includes: string = 'roles,permissions'): Promise<ApiResponse<UserDetails>> {
    try {
      logger.info(`🔍 getUserByEmail çağrılıyor: ${email}`, { includes }, { prefix: 'UserService' });
      
      const response = await apiRequest<UserDetails>({
        method: 'GET',
        url: `/api/Users/${email}`,
        params: { includes } 
      });

      logger.info('✅ getUserByEmail başarılı', response, { prefix: 'UserService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ getUserByEmail hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      logger.info('🔍 getProfile çağrılıyor...', null, { prefix: 'UserService' });
      
      const response = await apiRequest<UserProfile>({
        method: 'GET',
        url: '/api/Users/profile'
      });

      logger.info('✅ getProfile başarılı', response, { prefix: 'UserService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ getProfile hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  async getAllUsers(params?: GetAllUsersParams): Promise<ApiResponse<UserData[]>> {
    try {
      logger.info('🔍 getAllUsers çağrılıyor...', params, { prefix: 'UserService' });
      
      const response = await apiRequest<UserData[]>({
        method: 'GET',
        url: '/api/Users',
        params: params 
      });

      logger.info('✅ getAllUsers başarılı', response, { prefix: 'UserService' });
      
      const usersData = Array.isArray(response) ? response : [];
      
      return {
        success: true,
        data: usersData
      };
    } catch (error) {
      logger.error('❌ getAllUsers hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  async createUser(userData: CreateUserDto): Promise<ApiResponse<CreateUserResponse>> {
    try {
      logger.info('🔍 createUser çağrılıyor...', userData, { prefix: 'UserService' });
      
      const response = await apiRequest<CreateUserResponse>({
        method: 'POST',
        url: '/api/Users',
        data: userData
      });

      logger.info('✅ createUser başarılı', response, { prefix: 'UserService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ createUser hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  async getRoles(): Promise<ApiResponse<Role[]>> {
    try {
      logger.info('🔍 getRoles çağrılıyor...', null, { prefix: 'UserService' });
      
      const response = await apiRequest<Role[]>({
        method: 'GET',
        url: '/api/Roles'
      });

      logger.info('✅ getRoles başarılı', response, { prefix: 'UserService' });
      
      const rolesData = Array.isArray(response) ? response : [];
      
      return {
        success: true,
        data: rolesData
      };
    } catch (error) {
      logger.error('❌ getRoles hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  async createRole(roleData: CreateRoleDto): Promise<ApiResponse<CreateRoleResponse>> {
    try {
      logger.info('🔍 createRole çağrılıyor...', roleData, { prefix: 'UserService' });
      
      const response = await apiRequest<CreateRoleResponse>({
        method: 'POST',
        url: '/api/Roles',
        data: roleData
      });

      logger.info('✅ createRole başarılı', response, { prefix: 'UserService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ createRole hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<ApiResponse<any>> {
    try {
      logger.info(`🔍 updateUser çağrılıyor: ${id}`, userData, { prefix: 'UserService' });
      
      const response = await apiRequest<any>({
        method: 'PUT',
        url: `/api/Users/${id}`,
        data: userData
      });

      logger.info('✅ updateUser başarılı', response, { prefix: 'UserService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ updateUser hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  async deleteUser(id: string): Promise<ApiResponse<any>> {
    try {
      logger.info(`🔍 deleteUser çağrılıyor: ${id}`, null, { prefix: 'UserService' });
      
      const response = await apiRequest<any>({
        method: 'DELETE',
        url: `/api/Users/${id}`
      });

      logger.info('✅ deleteUser başarılı', response, { prefix: 'UserService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ deleteUser hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  async updateUserRoles(id: string, rolesData: UpdateUserRolesDto): Promise<ApiResponse<any>> {
    try {
      logger.info(`🔍 updateUserRoles çağrılıyor: ${id}`, rolesData, { prefix: 'UserService' });
      
      const response = await apiRequest<any>({
        method: 'PUT',
        url: `/api/Users/${id}/roles`,
        data: rolesData
      });

      logger.info('✅ updateUserRoles başarılı', response, { prefix: 'UserService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ updateUserRoles hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  // --- NEW FUNCTIONS ---

  async assignBranchToUser(id: string, branchData: AssignBranchDto): Promise<ApiResponse<any>> {
    try {
      logger.info(`🔍 assignBranchToUser çağrılıyor: ${id}`, branchData, { prefix: 'UserService' });
      
      const response = await apiRequest<any>({
        method: 'PUT',
        url: `/api/Users/${id}/branch`,
        data: branchData
      });

      logger.info('✅ assignBranchToUser başarılı', response, { prefix: 'UserService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ assignBranchToUser hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  async changeUserPassword(id: string, passwordData: ChangePasswordDto): Promise<ApiResponse<any>> {
    try {
      logger.info(`🔍 changeUserPassword çağrılıyor: ${id}`, 'password data (hidden)', { prefix: 'UserService' });
      
      const response = await apiRequest<any>({
        method: 'PUT',
        url: `/api/Users/${id}/password`,
        data: passwordData
      });

      logger.info('✅ changeUserPassword başarılı', response, { prefix: 'UserService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ changeUserPassword hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  async lockUser(id: string): Promise<ApiResponse<any>> {
    try {
      logger.info(`🔍 lockUser çağrılıyor: ${id}`, null, { prefix: 'UserService' });
      
      const response = await apiRequest<any>({
        method: 'PUT',
        url: `/api/Users/${id}/lock`,
        data: {} // Send empty object as payload if required by API
      });

      logger.info('✅ lockUser başarılı', response, { prefix: 'UserService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ lockUser hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }

  async unlockUser(id: string): Promise<ApiResponse<any>> {
    try {
      logger.info(`🔍 unlockUser çağrılıyor: ${id}`, null, { prefix: 'UserService' });
      
      const response = await apiRequest<any>({
        method: 'PUT',
        url: `/api/Users/${id}/unlock`,
        data: {} // Send empty object as payload if required by API
      });

      logger.info('✅ unlockUser başarılı', response, { prefix: 'UserService' });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('❌ unlockUser hatası', error, { prefix: 'UserService' });
      throw error;
    }
  }
}

export const userService = new UserService();