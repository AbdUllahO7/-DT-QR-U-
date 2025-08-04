export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface QRCodeData {
  id: string;
  name: string;
  location: string;
  scans: number;
  lastScan: string;
  status: 'active' | 'inactive';
  url: string;
  description: string;
  type: 'global' | 'branch';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface RegisterUserDto {
  name: string;
  surName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phoneNumber: string;
  profileImagePath: string;
  termsofUserService: boolean;
}

export { CuisineType } from './api';

// Re-export other types as needed
export type { CreateRestaurantDto, ApiError, ApiResponse } from './api'; 