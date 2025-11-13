// Form validasyon yardımcı fonksiyonları

export interface ValidationErrors {
  [key: string]: string;
}

// E-posta validasyonu
export const validateEmail = (email: string): string => {
  if (!email?.trim()) {
    return 'E-posta adresi gereklidir';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Geçerli bir e-posta adresi giriniz';
  }
  return '';
};

// Telefon validasyonu
export const validatePhone = (phone: string): string => {
  if (!phone?.trim()) {
    return 'Telefon numarası gereklidir';
  }
  const phoneRegex = /^(\+90|0)?[5-9][0-9]{9}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    return 'Geçerli bir telefon numarası giriniz (örn: 05XX XXX XX XX)';
  }
  return '';
};

// Şifre validasyonu
export const validatePassword = (password: string, minLength: number = 6): string => {
  if (!password?.trim()) {
    return 'Şifre gereklidir';
  }
  if (password.length < minLength) {
    return `Şifre en az ${minLength} karakter olmalıdır`;
  }
  return '';
};

// Şifre eşleşme validasyonu
export const validatePasswordMatch = (password: string, confirmPassword: string): string => {
  if (!confirmPassword?.trim()) {
    return 'Şifre onayı gereklidir';
  }
  if (password !== confirmPassword) {
    return 'Şifreler eşleşmiyor';
  }
  return '';
};

// Zorunlu alan validasyonu
export const validateRequired = (value: string, fieldName: string): string => {
  if (!value?.trim()) {
    return `${fieldName} gereklidir`;
  }
  return '';
};

// Minimum karakter validasyonu
export const validateMinLength = (value: string, minLength: number, fieldName: string): string => {
  if (value && value.trim().length < minLength) {
    return `${fieldName} en az ${minLength} karakter olmalıdır`;
  }
  return '';
};

// Form validasyon sonuçlarını işleyen yardımcı fonksiyon
export const processValidationErrors = (validationResults: string[]): ValidationErrors => {
  const errors: ValidationErrors = {};
  validationResults.forEach((error, index) => {
    if (error) {
      errors[`field_${index}`] = error;
    }
  });
  return errors;
};

// Şube form validasyonu
export const validateBranchForm = (formData: any): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Temel bilgiler
  if (!formData.branchName?.trim()) {
    errors.branchName = 'Şube adı gereklidir';
  }
  if (!formData.whatsappOrderNumber?.trim()) {
    errors.whatsappOrderNumber = 'WhatsApp sipariş numarası gereklidir';
  }

  // Adres bilgileri
  if (!formData.createAddressDto?.country?.trim()) {
    errors['address.country'] = 'Ülke gereklidir';
  }
  if (!formData.createAddressDto?.city?.trim()) {
    errors['address.city'] = 'Şehir gereklidir';
  }
  if (!formData.createAddressDto?.street?.trim()) {
    errors['address.street'] = 'Sokak gereklidir';
  }
  if (!formData.createAddressDto?.addressLine1?.trim()) {
    errors['address.addressLine1'] = 'Adres satırı  gereklidir';
  }
  if (!formData.createAddressDto?.zipCode?.trim()) {
    errors['address.zipCode'] = 'Posta kodu gereklidir';
  }

  // İletişim bilgileri
  if (!formData.createContactDto?.phone?.trim()) {
    errors['contact.phone'] = 'Telefon numarası gereklidir';
  }
  if (!formData.createContactDto?.mail?.trim()) {
    errors['contact.mail'] = 'E-posta adresi gereklidir';
  }
  if (!formData.createContactDto?.location?.trim()) {
    errors['contact.location'] = 'Konum bilgisi gereklidir';
  }

  return errors;
}; 