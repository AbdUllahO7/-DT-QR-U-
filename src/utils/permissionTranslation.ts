import { Permission, RolePermission, AppPermission, AppRole } from '../types/users/users.type';

// Permission name translations - ALL PERMISSIONS
const permissionTranslations: Record<string, { en: string; tr: string; ar: string }> = {
  // Branch
  'branch.create': { en: 'Create Branch', tr: 'Şube Oluşturma', ar: 'إنشاء فرع' },
  'branch.delete': { en: 'Delete Branch', tr: 'Şube Silme', ar: 'حذف فرع' },
  'branch.update': { en: 'Update Branch', tr: 'Şube Güncelleme', ar: 'تحديث فرع' },
  'branch.read': { en: 'View Branch', tr: 'Şube Görüntüleme', ar: 'عرض فرع' },

  // Branch Category
  'branch.category.create': { en: 'Create Branch Category', tr: 'Şube Kategorisi Oluşturma', ar: 'إنشاء فئة فرع' },
  'branch.category.delete': { en: 'Delete Branch Category', tr: 'Şube Kategorisi Silme', ar: 'حذف فئة فرع' },
  'branch.category.update': { en: 'Update Branch Category', tr: 'Şube Kategorisi Güncelleme', ar: 'تحديث فئة فرع' },
  'branch.category.read': { en: 'View Branch Category', tr: 'Şube Kategorisi Görüntüleme', ar: 'عرض فئة فرع' },

  // Branch Money Case
  'branch.money.case.open': { en: 'Open Money Case', tr: 'Kasa Açma', ar: 'فتح الخزينة' },
  'branch.money.case.close': { en: 'Close Money Case', tr: 'Kasa Kapama', ar: 'إغلاق الخزينة' },
  'branch.money.case.read': { en: 'Read Money Case', tr: 'Kasa Görüntüleme', ar: 'عرض الخزينة' },
  'branch.money.case.summary': { en: 'Money Case Summary', tr: 'Kasa Özeti', ar: 'ملخص الخزينة' },

  // Branch Product
  'branch.product.create': { en: 'Create Branch Product', tr: 'Şube Ürünü Oluşturma', ar: 'إنشاء منتج فرع' },
  'branch.product.delete': { en: 'Delete Branch Product', tr: 'Şube Ürünü Silme', ar: 'حذف منتج فرع' },
  'branch.product.update': { en: 'Update Branch Product', tr: 'Şube Ürünü Güncelleme', ar: 'تحديث منتج فرع' },
  'branch.product.read': { en: 'View Branch Product', tr: 'Şube Ürünü Görüntüleme', ar: 'عرض منتج فرع' },

  // Branch Product Addon
  'branch.product.addon.create': { en: 'Create Branch Product Addon', tr: 'Şube Ürün Eklentisi Oluşturma', ar: 'إنشاء إضافة منتج فرع' },
  'branch.product.addon.delete': { en: 'Delete Branch Product Addon', tr: 'Şube Ürün Eklentisi Silme', ar: 'حذف إضافة منتج فرع' },
  'branch.product.addon.update': { en: 'Update Branch Product Addon', tr: 'Şube Ürün Eklentisi Güncelleme', ar: 'تحديث إضافة منتج فرع' },
  'branch.product.addon.read': { en: 'View Branch Product Addon', tr: 'Şube Ürün Eklentisi Görüntüleme', ar: 'عرض إضافة منتج فرع' },

  // Branch Product Extra
  'branch.product.extra.create': { en: 'Create Branch Product Extra', tr: 'Şube Ürün Ekstrası Oluşturma', ar: 'إنشاء إضافي منتج فرع' },
  'branch.product.extra.delete': { en: 'Delete Branch Product Extra', tr: 'Şube Ürün Ekstrası Silme', ar: 'حذف إضافي منتج فرع' },
  'branch.product.extra.update': { en: 'Update Branch Product Extra', tr: 'Şube Ürün Ekstrası Güncelleme', ar: 'تحديث إضافي منتج فرع' },
  'branch.product.extra.read': { en: 'View Branch Product Extra', tr: 'Şube Ürün Ekstrası Görüntüleme', ar: 'عرض إضافي منتج فرع' },

  // Branch Product Extra Category
  'branch.product.extra.category.create': { en: 'Create Branch Product Extra Category', tr: 'Şube Ürün Ekstra Kategorisi Oluşturma', ar: 'إنشاء فئة إضافي منتج فرع' },
  'branch.product.extra.category.delete': { en: 'Delete Branch Product Extra Category', tr: 'Şube Ürün Ekstra Kategorisi Silme', ar: 'حذف فئة إضافي منتج فرع' },
  'branch.product.extra.category.update': { en: 'Update Branch Product Extra Category', tr: 'Şube Ürün Ekstra Kategorisi Güncelleme', ar: 'تحديث فئة إضافي منتج فرع' },
  'branch.product.extra.category.read': { en: 'View Branch Product Extra Category', tr: 'Şube Ürün Ekstra Kategorisi Görüntüleme', ar: 'عرض فئة إضافي منتج فرع' },

  // Branch QR Code
  'branch.qrcode.create': { en: 'Create QR Code', tr: 'QR Kodu Oluşturma', ar: 'إنشاء رمز QR' },
  'branch.qrcode.delete': { en: 'Delete QR Code', tr: 'QR Kodu Silme', ar: 'حذف رمز QR' },
  'branch.qrcode.update': { en: 'Update QR Code', tr: 'QR Kodu Güncelleme', ar: 'تحديث رمز QR' },
  'branch.qrcode.read': { en: 'View QR Code', tr: 'QR Kodu Görüntüleme', ar: 'عرض رمز QR' },

  // Branch User
  'branch.user.create': { en: 'Create Branch User', tr: 'Şube Kullanıcısı Oluşturma', ar: 'إنشاء مستخدم فرع' },
  'branch.user.delete': { en: 'Delete Branch User', tr: 'Şube Kullanıcısı Silme', ar: 'حذف مستخدم فرع' },
  'branch.user.update': { en: 'Update Branch User', tr: 'Şube Kullanıcısı Güncelleme', ar: 'تحديث مستخدم فرع' },
  'branch.user.read': { en: 'View Branch User', tr: 'Şube Kullanıcısı Görüntüleme', ar: 'عرض مستخدم فرع' },

  // Branch Working Hour
  'branch.working.hour.update': { en: 'Update Working Hours', tr: 'Çalışma Saatleri Güncelleme', ar: 'تحديث ساعات العمل' },
  'branch.working.hour.read': { en: 'View Working Hours', tr: 'Çalışma Saatleri Görüntüleme', ar: 'عرض ساعات العمل' },

  // Category
  'category.create': { en: 'Create Category', tr: 'Kategori Oluşturma', ar: 'إنشاء فئة' },
  'category.delete': { en: 'Delete Category', tr: 'Kategori Silme', ar: 'حذف فئة' },
  'category.update': { en: 'Update Category', tr: 'Kategori Güncelleme', ar: 'تحديث فئة' },
  'category.read': { en: 'View Category', tr: 'Kategori Görüntüleme', ar: 'عرض فئة' },

  // Extra
  'extra.create': { en: 'Create Extra', tr: 'Ekstra Oluşturma', ar: 'إنشاء إضافي' },
  'extra.delete': { en: 'Delete Extra', tr: 'Ekstra Silme', ar: 'حذف إضافي' },
  'extra.update': { en: 'Update Extra', tr: 'Ekstra Güncelleme', ar: 'تحديث إضافي' },
  'extra.read': { en: 'View Extra', tr: 'Ekstra Görüntüleme', ar: 'عرض إضافي' },

  // Extra Category
  'extra.category.create': { en: 'Create Extra Category', tr: 'Ekstra Kategorisi Oluşturma', ar: 'إنشاء فئة إضافية' },
  'extra.category.delete': { en: 'Delete Extra Category', tr: 'Ekstra Kategorisi Silme', ar: 'حذف فئة إضافية' },
  'extra.category.update': { en: 'Update Extra Category', tr: 'Ekstra Kategorisi Güncelleme', ar: 'تحديث فئة إضافية' },
  'extra.category.read': { en: 'View Extra Category', tr: 'Ekstra Kategorisi Görüntüleme', ar: 'عرض فئة إضافية' },

  // Ingredient
  'ingredient.create': { en: 'Create Ingredient', tr: 'Malzeme Oluşturma', ar: 'إنشاء مكون' },
  'ingredient.delete': { en: 'Delete Ingredient', tr: 'Malzeme Silme', ar: 'حذف مكون' },
  'ingredient.update': { en: 'Update Ingredient', tr: 'Malzeme Güncelleme', ar: 'تحديث مكون' },
  'ingredient.read': { en: 'View Ingredient', tr: 'Malzeme Görüntüleme', ar: 'عرض مكون' },

  // Menu Table
  'menu.table.create': { en: 'Create Menu Table', tr: 'Masa Oluşturma', ar: 'إنشاء طاولة' },
  'menu.table.delete': { en: 'Delete Menu Table', tr: 'Masa Silme', ar: 'حذف طاولة' },
  'menu.table.update': { en: 'Update Menu Table', tr: 'Masa Güncelleme', ar: 'تحديث طاولة' },
  'menu.table.read': { en: 'View Menu Table', tr: 'Masa Görüntüleme', ar: 'عرض طاولة' },

  // Menu Table Category
  'menu.table.category.create': { en: 'Create Table Category', tr: 'Masa Kategorisi Oluşturma', ar: 'إنشاء فئة طاولة' },
  'menu.table.category.delete': { en: 'Delete Table Category', tr: 'Masa Kategorisi Silme', ar: 'حذف فئة طاولة' },
  'menu.table.category.update': { en: 'Update Table Category', tr: 'Masa Kategorisi Güncelleme', ar: 'تحديث فئة طاولة' },
  'menu.table.category.read': { en: 'View Table Category', tr: 'Masa Kategorisi Görüntüleme', ar: 'عرض فئة طاولة' },

  // Order
  'order.create': { en: 'Create Order', tr: 'Sipariş Oluşturma', ar: 'إنشاء طلب' },
  'order.delete': { en: 'Delete Order', tr: 'Sipariş Silme', ar: 'حذف طلب' },
  'order.update': { en: 'Update Order', tr: 'Sipariş Güncelleme', ar: 'تحديث طلب' },
  'order.read': { en: 'View Order', tr: 'Sipariş Görüntüleme', ar: 'عرض طلب' },
  'order.cancel': { en: 'Cancel Order', tr: 'Sipariş İptal Etme', ar: 'إلغاء طلب' },

  // Order Type
  'order.type.create': { en: 'Create Order Type', tr: 'Sipariş Tipi Oluşturma', ar: 'إنشاء نوع طلب' },
  'order.type.delete': { en: 'Delete Order Type', tr: 'Sipariş Tipi Silme', ar: 'حذف نوع طلب' },
  'order.type.update': { en: 'Update Order Type', tr: 'Sipariş Tipi Güncelleme', ar: 'تحديث نوع طلب' },
  'order.type.read': { en: 'View Order Type', tr: 'Sipariş Tipi Görüntüleme', ar: 'عرض نوع طلب' },

  // Product
  'product.create': { en: 'Create Product', tr: 'Ürün Oluşturma', ar: 'إنشاء منتج' },
  'product.delete': { en: 'Delete Product', tr: 'Ürün Silme', ar: 'حذف منتج' },
  'product.update': { en: 'Update Product', tr: 'Ürün Güncelleme', ar: 'تحديث منتج' },
  'product.read': { en: 'View Product', tr: 'Ürün Görüntüleme', ar: 'عرض منتج' },
  'product.edit': { en: 'Edit Product', tr: 'Ürün Düzenleme', ar: 'تعديل منتج' },

  // Product Addon
  'product.addon.create': { en: 'Create Product Addon', tr: 'Ürün Eklentisi Oluşturma', ar: 'إنشاء إضافة منتج' },
  'product.addon.delete': { en: 'Delete Product Addon', tr: 'Ürün Eklentisi Silme', ar: 'حذف إضافة منتج' },
  'product.addon.update': { en: 'Update Product Addon', tr: 'Ürün Eklentisi Güncelleme', ar: 'تحديث إضافة منتج' },
  'product.addon.read': { en: 'View Product Addon', tr: 'Ürün Eklentisi Görüntüleme', ar: 'عرض إضافة منتج' },

  // Product Extra
  'product.extra.create': { en: 'Create Product Extra', tr: 'Ürün Ekstrası Oluşturma', ar: 'إنشاء إضافي منتج' },
  'product.extra.delete': { en: 'Delete Product Extra', tr: 'Ürün Ekstrası Silme', ar: 'حذف إضافي منتج' },
  'product.extra.update': { en: 'Update Product Extra', tr: 'Ürün Ekstrası Güncelleme', ar: 'تحديث إضافي منتج' },
  'product.extra.read': { en: 'View Product Extra', tr: 'Ürün Ekstrası Görüntüleme', ar: 'عرض إضافي منتج' },

  // Product Extra Category
  'product.extra.category.create': { en: 'Create Product Extra Category', tr: 'Ürün Ekstra Kategorisi Oluşturma', ar: 'إنشاء فئة إضافي منتج' },
  'product.extra.category.delete': { en: 'Delete Product Extra Category', tr: 'Ürün Ekstra Kategorisi Silme', ar: 'حذف فئة إضافي منتج' },
  'product.extra.category.update': { en: 'Update Product Extra Category', tr: 'Ürün Ekstra Kategorisi Güncelleme', ar: 'تحديث فئة إضافي منتج' },
  'product.extra.category.read': { en: 'View Product Extra Category', tr: 'Ürün Ekstra Kategorisi Görüntüleme', ar: 'عرض فئة إضافي منتج' },

  // Product Ingredient
  'product.ingredient.create': { en: 'Add Ingredient to Product', tr: 'Ürüne Malzeme Ekleme', ar: 'إضافة مكون إلى منتج' },
  'product.ingredient.delete': { en: 'Remove Ingredient from Product', tr: 'Üründen Malzeme Çıkarma', ar: 'إزالة مكون من منتج' },
  'product.ingredient.read': { en: 'View Product Ingredients', tr: 'Ürün Malzemelerini Görüntüleme', ar: 'عرض مكونات المنتج' },

  // Restaurant
  'restaurant.create': { en: 'Create Restaurant', tr: 'Restoran Oluşturma', ar: 'إنشاء مطعم' },
  'restaurant.delete': { en: 'Delete Restaurant', tr: 'Restoran Silme', ar: 'حذف مطعم' },
  'restaurant.update': { en: 'Update Restaurant', tr: 'Restoran Güncelleme', ar: 'تحديث مطعم' },
  'restaurant.read': { en: 'View Restaurant', tr: 'Restoran Görüntüleme', ar: 'عرض مطعم' },

  // Restaurant User
  'restaurant.user.create': { en: 'Create Restaurant User', tr: 'Restoran Kullanıcısı Oluşturma', ar: 'إنشاء مستخدم مطعم' },
  'restaurant.user.delete': { en: 'Delete Restaurant User', tr: 'Restoran Kullanıcısı Silme', ar: 'حذف مستخدم مطعم' },
  'restaurant.user.update': { en: 'Update Restaurant User', tr: 'Restoran Kullanıcısı Güncelleme', ar: 'تحديث مستخدم مطعم' },
  'restaurant.user.read': { en: 'View Restaurant User', tr: 'Restoran Kullanıcısı Görüntüleme', ar: 'عرض مستخدم مطعم' },

  // Table Session
  'table.session.create': { en: 'Create Table Session', tr: 'Masa Oturumu Oluşturma', ar: 'إنشاء جلسة طاولة' },
  'table.session.delete': { en: 'Delete Table Session', tr: 'Masa Oturumu Silme', ar: 'حذف جلسة طاولة' },
  'table.session.update': { en: 'Update Table Session', tr: 'Masa Oturumu Güncelleme', ar: 'تحديث جلسة طاولة' },
  'table.session.read': { en: 'View Table Session', tr: 'Masa Oturumu Görüntüleme', ar: 'عرض جلسة طاولة' },

  // Table Summary
  'table.summary.read': { en: 'View Table Summary', tr: 'Masa Özeti Görüntüleme', ar: 'عرض ملخص الطاولة' },

  // Admin
  'admin.api.control': { en: 'API Control', tr: 'API Kontrolü', ar: 'التحكم في API' }
};

// Role name translations
const roleTranslations: Record<string, { en: string; tr: string; ar: string }> = {
  'RestaurantOwner': { en: 'Restaurant Owner', tr: 'Restoran Sahibi', ar: 'مالك المطعم' },
  'RestaurantManager': { en: 'Restaurant Manager', tr: 'Restoran Yöneticisi', ar: 'مدير المطعم' },
  'RestaurantStaff': { en: 'Restaurant Staff', tr: 'Restoran Personeli', ar: 'موظف المطعم' },
  'BranchManager': { en: 'Branch Manager', tr: 'Şube Yöneticisi', ar: 'مدير الفرع' },
  'BranchStaff': { en: 'Branch Staff', tr: 'Şube Personeli', ar: 'موظف الفرع' }
};

// Category name translations - ALL CATEGORIES
const categoryTranslations: Record<string, { en: string; tr: string; ar: string }> = {
  'Branch': { en: 'Branch Management', tr: 'Şube Yönetimi', ar: 'إدارة الفروع' },
  'Branch Category': { en: 'Branch Category Management', tr: 'Şube Kategori Yönetimi', ar: 'إدارة فئات الفروع' },
  'Branch Money Case': { en: 'Money Case Management', tr: 'Kasa Yönetimi', ar: 'إدارة الخزينة' },
  'Branch Product': { en: 'Branch Product Management', tr: 'Şube Ürün Yönetimi', ar: 'إدارة منتجات الفرع' },
  'Branch Product Addon': { en: 'Branch Product Addon Management', tr: 'Şube Ürün Eklentisi Yönetimi', ar: 'إدارة إضافات منتجات الفرع' },
  'Branch Product Extra': { en: 'Branch Product Extra Management', tr: 'Şube Ürün Ekstrası Yönetimi', ar: 'إدارة إضافيات منتجات الفرع' },
  'Branch Product Extra Category': { en: 'Branch Product Extra Category Management', tr: 'Şube Ürün Ekstra Kategorisi Yönetimi', ar: 'إدارة فئات إضافيات منتجات الفرع' },
  'Branch QR Code': { en: 'QR Code Management', tr: 'QR Kod Yönetimi', ar: 'إدارة رموز QR' },
  'Branch User': { en: 'Branch User Management', tr: 'Şube Kullanıcı Yönetimi', ar: 'إدارة مستخدمي الفرع' },
  'Branch Working Hour': { en: 'Working Hours Management', tr: 'Çalışma Saatleri Yönetimi', ar: 'إدارة ساعات العمل' },
  'Category': { en: 'Category Management', tr: 'Kategori Yönetimi', ar: 'إدارة الفئات' },
  'Extra': { en: 'Extra Management', tr: 'Ekstra Yönetimi', ar: 'إدارة الإضافيات' },
  'Extra Category': { en: 'Extra Category Management', tr: 'Ekstra Kategorisi Yönetimi', ar: 'إدارة فئات الإضافيات' },
  'Ingredient': { en: 'Ingredient Management', tr: 'Malzeme Yönetimi', ar: 'إدارة المكونات' },
  'Menu Table': { en: 'Table Management', tr: 'Masa Yönetimi', ar: 'إدارة الطاولات' },
  'Menu Table Category': { en: 'Table Category Management', tr: 'Masa Kategorisi Yönetimi', ar: 'إدارة فئات الطاولات' },
  'Order': { en: 'Order Management', tr: 'Sipariş Yönetimi', ar: 'إدارة الطلبات' },
  'Order Type': { en: 'Order Type Management', tr: 'Sipariş Tipi Yönetimi', ar: 'إدارة أنواع الطلبات' },
  'Product': { en: 'Product Management', tr: 'Ürün Yönetimi', ar: 'إدارة المنتجات' },
  'Product Addon': { en: 'Product Addon Management', tr: 'Ürün Eklentisi Yönetimi', ar: 'إدارة إضافات المنتجات' },
  'Product Extra': { en: 'Product Extra Management', tr: 'Ürün Ekstrası Yönetimi', ar: 'إدارة إضافيات المنتجات' },
  'Product Extra Category': { en: 'Product Extra Category Management', tr: 'Ürün Ekstra Kategorisi Yönetimi', ar: 'إدارة فئات إضافيات المنتجات' },
  'Product Ingredient': { en: 'Product Ingredient Management', tr: 'Ürün Malzemesi Yönetimi', ar: 'إدارة مكونات المنتجات' },
  'Restaurant': { en: 'Restaurant Management', tr: 'Restoran Yönetimi', ar: 'إدارة المطاعم' },
  'Restaurant User': { en: 'Restaurant User Management', tr: 'Restoran Kullanıcı Yönetimi', ar: 'إدارة مستخدمي المطعم' },
  'Table Session': { en: 'Table Session Management', tr: 'Masa Oturumu Yönetimi', ar: 'إدارة جلسات الطاولة' },
  'Table Summary': { en: 'Table Summary', tr: 'Masa Özeti', ar: 'ملخص الطاولة' },
  'Admin': { en: 'Admin Operations', tr: 'Yönetici İşlemleri', ar: 'عمليات الإدارة' }
};

/**
 * Get current language from localStorage or default to 'en'
 */
const getCurrentLanguage = (): 'en' | 'tr' | 'ar' => {
  try {
    const lang = localStorage.getItem('language') || 'en';
    return ['en', 'tr', 'ar'].includes(lang) ? (lang as 'en' | 'tr' | 'ar') : 'en';
  } catch {
    return 'en';
  }
};

/**
 * Get translated permission name
 * @param permission - Permission object (can be Permission, RolePermission, AppPermission, or AppRole)
 * @param t - Translation function from useLanguage
 * @returns Translated permission name
 */
export const getTranslatedPermissionName = (
  permission: Permission | RolePermission | AppPermission | AppRole,
  t: (key: string) => string
): string => {
  // Try to get the permission key - use 'key' field first, then fall back to 'name'
  const permissionKey = 'key' in permission ? permission.key : permission.name;

  // If no key available, use description or name as fallback
  if (!permissionKey) {
    console.warn('Permission has no key or name:', permission);
    return permission.description || 'Unknown Permission';
  }

  // Get current language
  const currentLang = getCurrentLanguage();

  // Check if we have a translation for this permission key
  if (permissionTranslations[permissionKey]) {
    return permissionTranslations[permissionKey][currentLang];
  }

  // Try the i18n translation as fallback
  const translationKey = `profile.permissionNames.${permissionKey}`;
  const translated = t(translationKey);

  // If translation returns the key itself (not found), use description or the key
  if (translated === translationKey) {
    console.warn(`No translation found for permission: ${permissionKey}`);
    return permission.description || permissionKey;
  }

  return translated;
};

/**
 * Get translated category name
 * @param category - Category name
 * @param t - Translation function from useLanguage
 * @returns Translated category name
 */
export const getTranslatedCategoryName = (
  category: string,
  t: (key: string) => string
): string => {
  if (!category) {
    return 'Unknown Category';
  }

  // Get current language
  const currentLang = getCurrentLanguage();

  // Check if we have a translation for this category
  if (categoryTranslations[category]) {
    return categoryTranslations[category][currentLang];
  }

  // Try the i18n translation as fallback
  const translationKey = `profile.categories.${category}`;
  const translated = t(translationKey);

  // If translation returns the key itself (not found), use the original category
  if (translated === translationKey) {
    console.warn(`No translation found for category: ${category}`);
    return category;
  }

  return translated;
};

/**
 * Get translated role name
 * @param roleName - Role name
 * @param t - Translation function from useLanguage
 * @returns Translated role name
 */
export const getTranslatedRoleName = (
  roleName: string,
  t: (key: string) => string
): string => {
  if (!roleName) {
    return 'Unknown Role';
  }

  // Get current language
  const currentLang = getCurrentLanguage();

  // Check if we have a translation for this role
  if (roleTranslations[roleName]) {
    return roleTranslations[roleName][currentLang];
  }

  // Try the i18n translation as fallback
  const translationKey = `roles.${roleName}`;
  const translated = t(translationKey);

  // If translation returns the key itself (not found), use the original role name
  if (translated === translationKey) {
    console.warn(`No translation found for role: ${roleName}`);
    return roleName;
  }

  return translated;
};
