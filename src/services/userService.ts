import { apiRequest } from '../utils/apiRequest';
import { logger } from '../utils/logger';
import type { UserData, ApiResponse, CreateRoleDto, CreateRoleResponse, Role, CreateUserDto, CreateUserResponse } from '../types/api';

class UserService {
  async getAllUsers(): Promise<ApiResponse<UserData[]>> {
    try {
      logger.info('🔍 getAllUsers çağrılıyor...', null, { prefix: 'UserService' });
      
      const response = await apiRequest<UserData[]>({
        method: 'GET',
        url: '/api/Users'
      });

      logger.info('✅ getAllUsers başarılı', response, { prefix: 'UserService' });
      
      // API'den dönen verinin array olduğundan emin ol
      const usersData = Array.isArray(response) ? response : [];
      
      // ApiResponse formatında wrap ediyoruz
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
      
      // API'den dönen verinin array olduğundan emin ol
      const rolesData = Array.isArray(response) ? response : [];
      
      // ApiResponse formatında wrap ediyoruz
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
}

export const userService = new UserService(); 