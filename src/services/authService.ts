import { apiRequest } from '../utils/apiRequest';
import { decodeToken } from '../utils/http';
import { sanitizePlaceholder } from '../utils/sanitize';
import { authStorage } from '../utils/authStorage';
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  ApiResponse,
  SelectionScreenData,
} from '../types/api';
import { UserProfileResponse } from '../types/users/users.type';

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

interface ChangeEmailDto {
  newEmail: string;
  password: string;
}

class AuthService {
  async login(credentials: LoginDto): Promise<LoginResponse> {
    return apiRequest<LoginResponse>({
      method: 'POST',
      url: '/api/Auth/Login',
      data: credentials
    });
  }

  async register(userData: RegisterDto): Promise<ApiResponse<RegisterResponse>> {
    const { logger } = await import('../utils/logger');
    try {
      logger.info('Register isteği gönderiliyor:', { email: userData.email });
      
      const response = await apiRequest<RegisterResponse>({
        method: 'POST',
        url: '/api/Auth/Register',
        data: userData
      });
      
      logger.info('Register API yanıtı:', response);
      
      const apiResponse: ApiResponse<RegisterResponse> = {
        success: true,
        data: response,
        message: response.message
      };
      
      logger.info('Register başarılı:', apiResponse);
      return apiResponse;
    } catch (error) {
      logger.error('Register hatası:', error);
      throw error;
    }
  }

  async getSelectionScreenData(): Promise<ApiResponse<SelectionScreenData>> {
    const { logger } = await import('../utils/logger');
    try {
      logger.info('getSelectionScreenData çağrılıyor...');
      const response = await apiRequest<SelectionScreenData>({
        method: 'GET',
        url: '/api/Auth/GetSelectionScreenData'
      });
      logger.info('getSelectionScreenData API yanıtı:', response);

      // Response kontrolü
      if (!response) {
        throw new Error('API yanıtı boş');
      }

      // API direkt SelectionScreenData döndürüyor
      const selectionScreenData = response as SelectionScreenData;

      // SelectionScreenData verilerini kontrol et
      if (!selectionScreenData.restaurantId || !selectionScreenData.restaurantName) {
        throw new Error('Restoran bilgileri eksik');
      }

      // ApiResponse formatında döndür
      const apiResponse: ApiResponse<SelectionScreenData> = {
        success: true,
        data: selectionScreenData
      };

      logger.info('getSelectionScreenData başarılı:', apiResponse);
      return apiResponse;
    } catch (error) {
      logger.error('getSelectionScreenData hatası:', error);
      throw error;
    }
  }

  async getUserProfile(): Promise<ApiResponse<UserProfileResponse>> {
    const { logger } = await import('../utils/logger');
    try {
      logger.info('getUserProfile çağrılıyor...');

      // 1) SECURITY FIX: Use authStorage instead of localStorage
      const storedToken = authStorage.getToken();
      if (!storedToken) {
        throw new Error('Token bulunamadı');
      }

      const decoded = decodeToken(storedToken);
      if (!decoded) {
        throw new Error('Token geçersiz');
      }

      // 2) API'ye istek at - sadece bir kez dene
      let apiData: any = null;
      try {
        apiData = await apiRequest<any>({
          method: 'GET',
          url: '/api/Users/profile',
        });
      } catch (apiErr: any) {
        // 404 hatası normal - endpoint mevcut değil
        if (apiErr?.response?.status === 404) {
          logger.info('Profile endpoint mevcut değil, JWT kullanılacak');
        } else {
          logger.warn('/api/Users/profile isteği başarısız, JWT\'ye düşülecek:', apiErr);
        }
      }

      // 3) API yanıtı geçerli ise kullan
      if (apiData) {
        let userProfileData: UserProfileResponse;

        if (apiData.appUser && apiData.appRoles) {
          userProfileData = apiData as UserProfileResponse;
        } else if (apiData.data?.appUser && apiData.data?.appRoles) {
          userProfileData = apiData.data as UserProfileResponse;
        } else if (apiData.success !== undefined && apiData.data) {
          userProfileData = apiData.data as UserProfileResponse;
        } else {
          // Yeni API formatını kontrol et (direkt UserProfileApiResponse)
          if (apiData.id && apiData.email && apiData.roles && apiData.permissions) {
            // Yeni API formatını eski UserProfileResponse formatına dönüştür
            userProfileData = {
              appUser: {
                appUserId: apiData.id,
                name: apiData.name,
                surname: apiData.surname,
                userName: apiData.userName,
                email: apiData.email,
                restaurantId: apiData.restaurantId,
                restaurant: {
                  restaurantId: apiData.restaurantId,
                  restaurantName: apiData.restaurantName,
                  restaurantLogoPath: '',
                  restaurantStatus: true,
                },
                branchId: apiData.branchId,
                branch: null,
                profileImage: apiData.profileImage,
                isActive: apiData.isActive,
                createdDate: apiData.createdDate,
                modifiedDate: apiData.modifiedDate,
              },
              appRoles: apiData.roles.map((roleName: string, idx: number) => ({
                appRoleId: `api-role-${idx}`,
                name: roleName,
                description: roleName,
                restaurantId: apiData.restaurantId,
                branchId: apiData.branchId,
                category: roleName.includes('Branch') ? 'Branch' : 'Restaurant',
                isSystemRole: true,
                createdDate: apiData.createdDate,
                modifiedDate: null,
                permissions: apiData.permissions.map((perm: string, pIdx: number) => ({
                  permissionId: pIdx,
                  name: perm,
                  description: perm,
                  category: roleName.includes('Branch') ? 'Branch' : 'Restaurant',
                })),
              })),
            };
          } else {
            logger.warn('Bilinmeyen API yanıt formatı:', apiData);
            throw new Error('API yanıt formatı tanınmıyor');
          }
        }

        if (!userProfileData.appUser) {
          throw new Error('Kullanıcı bilgileri eksik');
        }

        // LocalStorage'a kaydet – başka sayfalarda fallback olarak kullanılsın
        if (userProfileData.appUser.restaurant?.restaurantName) {
          localStorage.setItem('restaurantName', userProfileData.appUser.restaurant.restaurantName);
        }

        logger.info('getUserProfile başarılı (API):', userProfileData);
        return { success: true, data: userProfileData };
      }

      // 4) API başarısızsa, JWT'den profil verilerini çöz
      logger.info('JWT içerisinden kullanıcı profili oluşturuluyor');

      const userProfileFromToken: UserProfileResponse = {
        appUser: {
          appUserId: decoded.user_id || decoded.sub || '',
          name: decoded.name || decoded.given_name || '',
          surname: decoded.surname || decoded.family_name || '',
          userName: decoded.unique_name || decoded.username || '',
          email: decoded.email || '',
          restaurantId: decoded.restaurant_id || 0,
          restaurant: {
            restaurantId: decoded.restaurant_id || 0,
            restaurantName: decoded.restaurant_name || '',
            restaurantLogoPath: decoded.restaurant_logo_path || '',
            restaurantStatus: decoded.restaurant_status ?? true,
          },
          branchId: decoded.branch_id || null,
          branch: null,
          profileImage: decoded.profile_image || '',
          isActive: decoded.is_active ?? true,
          createdDate: decoded.created_at || '',
          modifiedDate: decoded.modified_at || null,
        },
        // JWT içinde roller varsa string dizisini map'le, yoksa boş dizi
        appRoles: Array.isArray(decoded.roles)
          ? decoded.roles.map((roleName: string, idx: number) => ({
              appRoleId: `jwt-role-${idx}`,
              name: roleName,
              description: roleName,
              restaurantId: decoded.restaurant_id || null,
              branchId: decoded.branch_id || null,
              category: 'JWT',
              isSystemRole: false,
              createdDate: '',
              modifiedDate: null,
              permissions: Array.isArray(decoded.permissions)
                ? decoded.permissions.map((perm: string, pIdx: number) => ({
                    permissionId: pIdx,
                    name: perm,
                    description: perm,
                    category: roleName.includes('Branch') ? 'Branch' : 'Restaurant',
                  }))
                : [],
            }))
          : [],
      };

      return { success: true, data: userProfileFromToken };
    } catch (error) {
      logger.error('getUserProfile hatası:', error);
      throw error;
    }
  }

  async changePassword(data: ChangePasswordDto): Promise<ApiResponse<void>> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await apiRequest<ApiResponse<void>>({
        method: 'POST',
        url: '/api/Auth/ChangePassword',
        data: data
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async changeEmail(data: ChangeEmailDto): Promise<ApiResponse<void>> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await apiRequest<ApiResponse<void>>({
        method: 'POST',
        url: '/api/Auth/ChangeEmail',
        data: data
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await apiRequest<ApiResponse<void>>({
        method: 'POST',
        url: '/api/Auth/ForgotPassword',
        data: { email }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    // SECURITY FIX: Use authStorage for centralized auth clearing
    authStorage.clearAuth();
  }
}

export const authService = new AuthService(); 