export const API_CONFIG = {
  BASE_URL: import.meta.env.DEV ? 'http://localhost:7001/api' : 'http://api.mertcode.com/api',
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/Auth/Register',
      LOGIN: '/Auth/Login'
    },
    RESTAURANTS: {
      CREATE: '/Restaurants',
      GET_BY_USER: '/Restaurants/GetByUserId',
      UPDATE: '/Restaurants/Update'
    },
    MEDIAS: {
      UPLOAD: '/Medias'
    },
    BRANCHES: {
      CREATE: '/Branches',
      CREATE_ONBOARDING: '/Branches/onboarding',
      GET_BY_RESTAURANT: '/Branches/GetByRestaurantId',
      UPDATE: '/Branches/Update'
    },
    USERS: {
      GET_ALL: '/Users',
      CREATE_USER: '/Users',
      CREATE_ROLE: '/Roles',
      GET_ROLES: '/Roles'
    }
  },
  TIMEOUT: 30000, // 30 seconds
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
} as const; 