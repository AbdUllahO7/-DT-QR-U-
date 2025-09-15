import { table } from "console";
import { ref } from "process";

export const tr = {
  // Common
  common: {
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'Düzenle',
    add: 'Ekle',
    search: 'Ara',
    filter: 'Filtrele',
    close: 'Kapat',
    open: 'Aç',
    yes: 'Evet',
    no: 'Hayır',
    next: 'İleri',
    previous: 'Geri',
    continue: 'Devam Et',
    refresh: 'Sayfayı Yenile',
    clear: 'Temizle',
    filters: 'Filtreler',
    allStatuses: 'Tüm Durumlar',
    pending: 'Beklemede',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal Edildi',
    dateRange: 'Tarih Aralığı',
    today: 'Bugün',
    yesterday: 'Dün',
    last7Days: 'Son 7 Gün',
    last30Days: 'Son 30 Gün',
    thisMonth: 'Bu Ay',
    lastMonth: 'Geçen Ay',
    retry: 'Tekrar Dene'
  },
    filter: {
      "status": "Durum",
      "all": "Tümü",
      "active": "Aktif",
      "inactive": "Pasif", 
      "categories": "Kategoriler",
       allergenic:"alerjenik",
      nonallergenic:"alerjenik olmayan",
      specific:{
        allergens : "alerjenler"
      },
      "price": {
        "range": "Fiyat Aralığı",
        "min": "Min Fiyat",
        "max": "Max Fiyat"
      }
    },
    sort: {
      "title": "Sırala",
      "name": {
        "asc": "İsim (A-Z)",
        "desc": "İsim (Z-A)"
      },
      "price": {
        "asc": "Fiyat (Düşükten Yükseğe)",
        "desc": "Fiyat (Yüksekten Düşüğe)"
      },
      "order": {
        "asc": "Görüntü Sırası (İlkten Sona)",
        "desc": "Görüntü Sırası (Sondan İlke)"
      },
      "created": {
        "asc": "Oluşturulma Tarihi (En Eskiden)",
        "desc": "Oluşturulma Tarihi (En Yeniden)"
      },

    },
    clear: {
      "filters": "Filtreleri Temizle",
      "all": "Tümünü Temizle"
    },
  restaurantManagement : {
    tabs : {
      general : "Genel",
       legal : "Yasal",
        about : "Hakkında",
    },
    GenelBilgiler : "Genel Bilgiler"

  },
  // Navigation
  nav: {
    home: 'Ana Sayfa',
    features: 'Özellikler',
    pricing: 'Fiyatlandırma',
    testimonials: 'Yorumlar',
    faq: 'SSS',
    contact: 'İletişim',
    login: 'Giriş',
    register: 'Kayıt Ol',
    logout: 'Çıkış',
    profile: 'Profil',
    settings: 'Ayarlar',
    dashboard: 'Panel',
    goToPanel: 'Panele Git'
  },

  // Auth
  auth: {
    login: 'Giriş Yap',
    register: 'Kayıt Ol',
    logout: 'Çıkış Yap',
    email: 'E-posta',
    password: 'Şifre',
    confirmPassword: 'Şifre Onayı',
    forgotPassword: 'Şifremi Unuttum',
    rememberMe: 'Beni Hatırla',
    alreadyHaveAccount: 'Zaten hesabınız var mı?',
    dontHaveAccount: 'Hesabınız yok mu?',
    signIn: 'Giriş Yap',
    signUp: 'Kayıt Ol'
  },

  // Hero Section
  hero: {
    title: {
      line1: 'QR Menü ile',
      line2: 'Restoranınızı',
      line3: 'Dijitalleştirin'
    },
    subtitle: 'Müşterileriniz QR kod tarayarak menünüze anında erişebilir. Temassız, hızlı ve modern bir deneyim sunun.',
    features: {
      qrAccess: 'QR Kod ile Hızlı Erişim',
      mobileOptimized: 'Mobil Optimizasyon',
      instantUpdate: 'Anlık Güncelleme'
    },
    cta: {
      getStarted: 'Hemen Başla',
      features: 'Özellikler'
    },
    socialProof: {
      restaurants: '500+ Mutlu Restoran',
      satisfaction: '%99 Müşteri Memnuniyeti'
    }
  },

  // Dashboard Navigation
  dashboard: {
    overview: {
      title: 'Genel Bakış',
      description: 'Restoranınızın genel durumunu görüntüleyin.',
      kpis: {
        totalViews: 'Toplam Görüntülenme',
        qrScans: 'QR Kod Taramaları',
        totalOrders: 'Toplam Sipariş',
        customerRating: 'Müşteri Puanı',
        changeTexts: {
          lastWeek: 'geçen haftaya göre',
          lastMonth: 'geçen aya göre',
          thisWeek: 'bu hafta'
        }
      },
      quickStats: {
        thisMonth: 'Bu Ay',
        totalOrders: 'Toplam sipariş',
        average: 'Ortalama',
        dailyOrders: 'Günlük sipariş',
        new: 'Yeni',
        customers: 'Müşteriler',
        rating: 'Değerlendirme',
        totalCount: 'Toplam sayı'
      },
      charts: {
        weeklyActivity: 'Haftalık Aktivite',
        popularProducts: 'Popüler Ürünler',
        monthlyRevenue: 'Aylık Gelir'
      }
    },
    branches: {
      title: 'Şube Yönetimi',
      description: 'Şubelerinizi yönetin ve yeni şubeler ekleyin.',
      error: {
        loadFailed: 'Şubeler yüklenirken bir hata oluştu',
        createFailed: 'Şube oluşturulurken bir hata oluştu',
        updateFailed: 'Şube güncellenirken bir hata oluştu',
        deleteFailed: 'Şube silinirken bir hata oluştu',
        statusUpdateFailed: 'Şube durumu güncellenirken bir hata oluştu',
        detailsLoadFailed: 'Şube detayları yüklenirken bir hata oluştu',
        restaurantIdNotFound: 'Restaurant ID bulunamadı'
      },
      delete: {
        title: 'Şubeyi Sil',
        confirmMessage: '"{branchName}" şubesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
      }
    },
    orders: {
      title: 'Siparişler',
      description: 'Siparişleri görüntüleyin ve yönetin.',
      loading: 'Siparişler yükleniyor...',
      refresh: 'Yenile',
      newOrder: 'Yeni Sipariş',
      tabs: {
        all: 'Tümü',
        pending: 'Bekleyen',
        preparing: 'Hazırlanan',
        ready: 'Hazır',
        delivered: 'Teslim Edilen',
        cancelled: 'İptal Edilen'
      },
      status: {
        pending: 'Bekliyor',
        preparing: 'Hazırlanıyor',
        ready: 'Hazır',
        delivered: 'Teslim Edildi',
        cancelled: 'İptal Edildi'
      },
      stats: {
        totalOrders: 'Toplam Sipariş',
        totalRevenue: 'Toplam Gelir',
        pendingOrders: 'Bekleyen Siparişler',
        avgOrderValue: 'Ortalama Sipariş Değeri'
      }
    },
  orderType: {
        title: "Sipariş Türü Ayarları",
        subtitle: "Sipariş türlerinin aktiflik durumu, minimum tutar ve servis ücretlerini yönetin",
        loading: "Sipariş türleri yükleniyor...",
        pleaseWait: "Lütfen bekleyin",
        settingsUpdated: "ayarları başarıyla güncellendi",
        updateError: "Ayarlar güncellenirken hata oluştu",
        loadingError: "Sipariş türleri yüklenirken hata oluştu",
        active: "aktif",
        minutes: "dakika",
        requirements: "Gereksinimler",
        table: "Masa",
        address: "Adres",
        phone: "Telefon",
        activeStatus: "Aktif Durum",
        activeStatusDescription: "Bu sipariş türünü etkinleştir/devre dışı bırak",
        minOrderAmount: "Minimum Sipariş Tutarı",
        serviceCharge: "Servis Ücreti",
        saveSettings: "Ayarları Kaydet",
        updating: "Güncelleniyor...",
        totalOrderTypes: "Toplam Sipariş Türü",
        activeTypes: "Aktif Türler",
        totalActiveOrders: "Toplam Aktif Sipariş",
        estimatedTime: "Tahmini Süre"
      },
    products: {
      title: 'Ürünler',
      description: 'Ürünlerinizi görüntüleyin ve yönetin.'
    },
    ingredients : {
      title : "İçerik"
    },
    tables: {
      title: 'Masa Yönetimi',
      description: 'Masa yönetimi işlemleri.',
      loading: 'Masalar yükleniyor...',
      selectBranch: 'Masa yönetimi için lütfen bir şube seçin',
      noCategories: 'Bu şubede henüz masa kategorisi bulunmuyor',
      tableCount: 'masa',
      newTable: 'Yeni Masa Ekle'
    },
    users: {
      title: 'Kullanıcı Yönetimi',
      description: 'Kullanıcıları, rolleri ve izinleri yönetin.',
      loading: 'Kullanıcılar yükleniyor...',
      tabs: {
        users: 'Kullanıcılar',
        roles: 'Roller'
      },
      stats: {
        total: 'Toplam',
        active: 'Aktif',
        users: 'kullanıcı',
        roles: 'rol',
        system: 'Sistem',
        custom: 'Özel',
        totalUsers: 'Toplam Kullanıcı'
      },
      error: {
        loadFailed: 'Kullanıcılar yüklenirken bir hata oluştu',
        rolesLoadFailed: 'Roller yüklenirken bir hata oluştu',
        createRoleFailed: 'Rol oluşturulamadı',
        createUserFailed: 'Kullanıcı oluşturulamadı'
      }
    },
    settings: {
      title: 'Ayarlar',
      description: 'Hesap ayarlarınızı yönetin.'
    },
    profile: {
      title: 'Profil',
      description: 'Kişisel bilgilerinizi görüntüleyin.',
      error: {
        loadFailed: 'Profil bilgileri yüklenirken bir hata oluştu'
      },
      restaurantInfo: 'Restoran Bilgileri'
    },
    restaurant: {
      title: 'Restorant Yönetimi',
      description: 'Restorant bilgilerinizi ve ayarlarınızı yönetin.',
      loading: 'Restoran bilgileri yükleniyor...',
      restaurantName: 'Restoran Adı',
      restaurantStatus: 'Restoran Durumu',
      restaurantLogo: 'Restoran Logosu',
      companyInfo: 'Şirket Bilgileri',
      addAboutInfo: 'Restoran Hakkında Bilgisi Ekle',
      placeholders: {
        restaurantName: 'Restoran adını girin',
        aboutStory: 'Restoranımızın hikayesi',
        aboutDetails: 'Restoranınız hakkında detaylı bilgi verin...'
      }
    },
    branchManagementTitle: "Şube Yönetimi" ,

    sidebar: {
       title : "QR Menü",
      logout: 'Çıkış Yap',
      branch: 'Şube'
    }
  },

  // Theme
  theme: {
    toggleToDark: 'Dark mode\'a geç',
    toggleToLight: 'Light mode\'a geç',
    dark: 'Karanlık',
    light: 'Aydınlık'
  },

  // Language
  language: {
    turkish: 'Türkçe',
    english: 'English',
    arabic: 'العربية',
    selectLanguage: 'Dil Seç'
  },

  // Settings
  settings: {
    title: 'Ayarlar',
    description: 'Hesap ayarlarınızı ve tercihlerinizi yönetin',
    save: 'Kaydet',
    saveSuccess: 'Ayarlar başarıyla kaydedildi.',
    tabs: {
      general: 'Genel',
      notifications: 'Bildirimler',
      privacy: 'Gizlilik',
      appearance: 'Görünüm',
      data: 'Veri'
    },
    general: {
      title: 'Genel Ayarlar',
      description: 'Temel hesap ayarlarınızı yapılandırın',
      language: 'Dil',
      timezone: 'Saat Dilimi',
      dateFormat: 'Tarih Formatı',
      currency: 'Para Birimi',
      autoSave: {
        title: 'Otomatik Kaydetme',
        description: 'Otomatik kaydetme ayarlarınızı yönetin',
        enabled: 'Otomatik Kaydetme',
        enabledDesc: 'Değişikliklerinizi otomatik olarak kaydeder',
        dataSync: 'Veri Senkronizasyonu',
        dataSyncDesc: 'Verilerinizi cihazlar arasında senkronize eder'
      }
    },
    notifications: {
      title: 'Bildirim Ayarları',
      description: 'Bildirim tercihlerinizi yönetin',
      enabled: 'Bildirimleri Aç',
      enabledDesc: 'Tüm bildirimleri etkinleştirir',
      email: 'E-posta Bildirimleri',
      emailDesc: 'Önemli güncellemeler için e-posta alın',
      push: 'Push Bildirimleri',
      pushDesc: 'Anlık bildirimler alın',
      sound: 'Ses Bildirimleri',
      soundDesc: 'Bildirim seslerini etkinleştirir'
    },
    privacy: {
      title: 'Gizlilik ve Güvenlik',
      description: 'Hesap güvenliğinizi ve gizlilik ayarlarınızı yönetin',
      twoFactor: 'İki Faktörlü Doğrulama',
      twoFactorDesc: 'Hesabınızı ekstra güvenlikle koruyun',
      autoLogout: 'Otomatik Oturum Kapatma',
      autoLogoutDesc: '30 dakika hareketsizlik sonrası oturumu kapatır',
      analytics: 'Analitik Veri Paylaşımı',
      analyticsDesc: 'Geliştirme için anonim veri paylaşımı'
    },
    appearance: {
      title: 'Görünüm Ayarları',
      description: 'Arayüz tercihlerinizi özelleştirin',
      darkMode: 'Karanlık Modu Aç',
      lightMode: 'Aydınlık Modu Aç',
      darkModeDesc: 'Karanlık tema kullanın',
      lightModeDesc: 'Aydınlık tema kullanın',
      compact: 'Kompakt Görünüm',
      compactDesc: 'Daha az boşluk kullanan kompakt tasarım',
      animations: 'Animasyonlar',
      animationsDesc: 'Arayüz animasyonlarını etkinleştirir'
    },
    data: {
      title: 'Veri Yönetimi',
      description: 'Verilerinizi yedekleyin veya silin',
      download: 'Veri İndir',
      downloadDesc: 'Tüm verilerinizi indirin',
      upload: 'Veri Yükle',
      uploadDesc: 'Yedekten veri yükleyin',
      delete: 'Veri Sil',
      deleteDesc: 'Tüm verileri silin',
      storage: 'Depolama',
      storageDesc: 'Depolama alanını yönetin'
    }
  },

  // Notifications
  notifications: {
    title: 'Bildirimler',
    empty: 'Bildirim yok',
    markAllAsRead: 'Tümünü okundu işaretle'
  },

  // Brand
  brand: {
    name: 'QR Menu',
    slogan: 'Dijital Restoran Çözümü'
  },

  // Features
  features: {
    title: 'Neden',
    titleHighlight: 'QR Menu?',
    subtitle: 'Modern restoranlar için tasarlanmış güçlü özellikler ile müşteri deneyimini artırın ve işletmenizi dijital çağa taşıyın.',
    list: {
      qrAccess: {
        title: 'QR Kod ile Anında Erişim',
        description: 'Müşterileriniz masadaki QR kodu tarayarak menünüze anında erişebilir. Uygulama indirme gerektirmez.'
      },
      mobileOptimized: {
        title: 'Mobil Optimizasyon',
        description: 'Tüm cihazlarda mükemmel görünüm. Responsive tasarım ile telefon, tablet ve masaüstünde optimum deneyim.'
      },
      instantUpdate: {
        title: 'Anlık Güncelleme',
        description: 'Menü değişiklikleriniz anında yayınlanır. Fiyat güncellemeleri, yeni ürünler hemen görünür.'
      },
      analytics: {
        title: 'Detaylı Analitikler',
        description: 'Hangi ürünler daha çok bakılıyor, müşteri davranışları ve satış trendleri hakkında rapor alın.'
      },
      alwaysOpen: {
        title: '7/24 Erişim',
        description: 'Müşterileriniz istediği zaman menünüze bakabilir. Restoran saatleri dışında da erişilebilir.'
      },
      secure: {
        title: 'Güvenli ve Hızlı',
        description: 'SSL sertifikası ile güvenli, hızlı yüklenen sayfalar. Müşteri bilgileri korunur.'
      },
      customizable: {
        title: 'Özelleştirilebilir Tasarım',
        description: 'Restoranınızın tarzına uygun renk, font ve tasarım seçenekleri. Marka kimliğinizi yansıtın.'
      },
      multiLanguage: {
        title: 'Çoklu Dil Desteği',
        description: 'Menünüzü birden fazla dilde sunabilirsiniz. Uluslararası müşterilerinize hitap edin.'
      }
    },
    cta: {
      title: 'Restoranınızı Dijitalleştirmeye Hazır mısınız?',
      subtitle: 'Bugün başlayın ve müşterilerinize modern bir deneyim sunun. Kurulum sadece 5 dakika!',
      button: 'Ücretsiz Deneyin'
    }
  },

  // Footer
  footer: {
    description: 'Restoranlar için modern, hızlı ve güvenli dijital menü çözümü. Müşteri deneyimini artırın, işletmenizi dijitalleştirin.',
    contact: {
      phone: '+90 212 345 67 89',
      email: 'info@qrmenu.com',
      address: 'Maslak, İstanbul'
    },
    sections: {
      product: {
        title: 'Ürün',
        links: {
          features: 'Özellikler',
          pricing: 'Fiyatlandırma', 
          demo: 'Demo',
          api: 'API Dokümantasyonu'
        }
      },
      company: {
        title: 'Şirket',
        links: {
          about: 'Hakkımızda',
          blog: 'Blog',
          careers: 'Kariyer',
          contact: 'İletişim'
        }
      },
      support: {
        title: 'Destek',
        links: {
          helpCenter: 'Yardım Merkezi',
          faq: 'SSS',
          liveSupport: 'Canlı Destek',
          tutorials: 'Eğitim Videoları'
        }
      },
      legal: {
        title: 'Yasal',
        links: {
          privacy: 'Gizlilik Politikası',
          terms: 'Kullanım Şartları',
          cookies: 'Çerez Politikası',
          gdpr: 'GDPR'
        }
      }
    },
    newsletter: {
      title: 'Güncellemelerden Haberdar Olun',
      subtitle: 'Yeni özellikler ve güncellemeler hakkında bilgi alın.',
      placeholder: 'E-posta adresiniz',
      button: 'Abone Ol'
    },
    bottom: {
      copyright: 'Tüm hakları saklıdır.',
      madeWith: 'Türkiye\'de tasarlandı ve geliştirildi ❤️'
    }
  },

  // Auth Pages
  pages: {
    login: {
      title: 'Giriş Yap',
      subtitle: 'QR Menu hesabınıza giriş yapın',
      backToHome: 'Ana Sayfaya Dön',
      email: 'E-posta',
      password: 'Şifre',
      rememberMe: 'Beni Hatırla',
      forgotPassword: 'Şifremi Unuttum',
      signIn: 'Giriş Yap',
      signingIn: 'Giriş Yapılıyor...',
      noAccount: 'Hesabınız yok mu?',
      registerNow: 'Hemen Kaydolun',
      errors: {
        emailRequired: 'E-posta gereklidir',
        emailInvalid: 'Geçerli bir e-posta adresi giriniz',
        passwordRequired: 'Şifre gereklidir',
        invalidCredentials: 'E-posta veya şifre hatalı',
        generalError: 'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.'
      }
    },
    register: {
      title: 'Hesap Oluştur',
      subtitle: 'QR Menu ailesine katılın ve restoranınızı dijitalleştirin',
      backToHome: 'Ana Sayfaya Dön',
      firstName: 'Ad',
      lastName: 'Soyad',
      email: 'E-posta',
      phone: 'Telefon Numarası',
      password: 'Şifre',
      confirmPassword: 'Şifre Tekrarı',
      createAccount: 'Hesap Oluştur',
      creating: 'Hesap Oluşturuluyor...',
      haveAccount: 'Zaten hesabınız var mı?',
      signInNow: 'Giriş Yapın',
      formProgress: 'Form tamamlama',
      placeholders: {
        firstName: 'Adınız',
        lastName: 'Soyadınız',
        email: 'ornek@email.com',
        phone: '05XX XXX XX XX',
        password: '••••••••',
        confirmPassword: 'Şifrenizi tekrar girin'
      },
      validation: {
        nameRequired: 'Ad gereklidir',
        nameMin: 'Ad en az 2 karakter olmalıdır',
        surnameRequired: 'Soyad gereklidir',
        surnameMin: 'Soyad en az 2 karakter olmalıdır',
        emailRequired: 'E-posta gereklidir',
        emailInvalid: 'Geçerli bir e-posta adresi giriniz',
        phoneRequired: 'Telefon numarası gereklidir',
        phoneInvalid: 'Geçerli bir telefon numarası giriniz (örn: 05XX XXX XX XX)',
        passwordRequired: 'Şifre gereklidir',
        passwordMin: 'Şifre en az 8 karakter olmalıdır',
        passwordPattern: 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
        passwordConfirmRequired: 'Şifre tekrarı gereklidir',
        passwordMismatch: 'Şifreler eşleşmiyor',
        termsRequired: 'Kullanım şartlarını kabul etmelisiniz',
        emailExists: 'Bu e-posta adresi zaten kullanımda'
      },
      passwordStrength: {
        veryWeak: 'Çok Zayıf',
        weak: 'Zayıf',
        medium: 'Orta',
        good: 'İyi',
        strong: 'Güçlü'
      },
      terms: {
        service: 'Kullanım Şartları',
        and: 've',
        privacy: 'Gizlilik Politikası',
        accept: 'nı kabul ediyorum'
      },
      errors: {
        validation: 'Kayıt bilgilerinizi kontrol edin',
        invalidData: 'Girilen bilgiler geçersiz. Lütfen kontrol edin.',
        general: 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.'
      },
      success: {
        message: 'Kayıt başarılı! Şimdi restaurant bilgilerinizi girebilirsiniz.'
      }
    },
    forgotPassword: {
      title: 'Şifremi Unuttum',
      subtitle: 'E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim',
      backToLogin: 'Giriş Sayfasına Dön',
      email: 'E-posta',
      sendResetLink: 'Sıfırlama Bağlantısı Gönder',
      sending: 'Gönderiliyor...',
      resendCode: 'Tekrar Gönder',
      countdown: 'saniye sonra tekrar gönderebilirsiniz',
      placeholders: {
        email: 'ornek@email.com'
      },
      success: {
        title: 'E-posta Gönderildi!',
        message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.'
      },
      errors: {
        emailRequired: 'E-posta gereklidir',
        emailInvalid: 'Geçerli bir e-posta adresi giriniz',
        emailNotFound: 'Bu e-posta adresi ile kayıtlı hesap bulunamadı',
        general: 'Şifre sıfırlama bağlantısı gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
      }
    }
  },

  // Pricing
  pricing: {
    title: 'Size Uygun',
    titleHighlight: 'Planı',
    titleEnd: 'Seçin',
    subtitle: 'İhtiyaçlarınıza göre tasarlanmış esnek fiyatlandırma seçenekleri. İstediğiniz zaman plan değiştirebilir veya iptal edebilirsiniz.',
    monthly: 'Aylık',
    yearly: 'Yıllık',
    freeMonths: '2 AY ÜCRETSİZ',
    mostPopular: 'En Popüler',
    plans: {
      basic: {
        name: 'Başlangıç',
        features: {
          '0': '1 Restoran',
          '1': '50 Ürün',
          '2': 'Temel Analitikler',
          '3': 'Email Destek',
          '4': 'QR Kod Oluşturucu',
          '5': 'Mobil Optimizasyon'
        },
        button: 'Başla'
      },
      pro: {
        name: 'Profesyonel',
        features: {
          '0': '3 Restoran',
          '1': 'Sınırsız Ürün',
          '2': 'Gelişmiş Analitikler',
          '3': 'Öncelikli Destek',
          '4': 'Özel Tasarım',
          '5': 'Çoklu Dil Desteği',
          '6': 'API Erişimi',
          '7': 'Beyaz Etiket'
        },
        button: 'En Popüler'
      },
      enterprise: {
        name: 'Kurumsal',
        features: {
          '0': 'Sınırsız Restoran',
          '1': 'Sınırsız Ürün',
          '2': 'Kurumsal Analitikler',
          '3': '7/24 Telefon Desteği',
          '4': 'Özel Entegrasyon',
          '5': 'Dedike Hesap Yöneticisi',
          '6': 'SLA Garantisi',
          '7': 'Eğitim ve Danışmanlık'
        },
        button: 'İletişime Geç'
      }
    },
    additionalInfo: 'Tüm planlar 14 gün ücretsiz deneme içerir • Kredi kartı gerekli değil • İstediğiniz zaman iptal edin',
    vatInfo: 'Fiyatlar KDV dahildir. Kurumsal planlar için özel fiyatlandırma mevcuttur.',
    perMonth: 'ay',
    perYear: 'yıl',
    monthlyEquivalent: 'Aylık ₺{amount} (2 ay ücretsiz)'
  },

  // Testimonials
  testimonials: {
    title: 'Müşterilerimiz Ne',
    titleHighlight: 'Diyor?',
    subtitle: 'Türkiye\'nin dört bir yanından 500+ restoranın güvendiği QR Menu sistemi hakkında gerçek kullanıcı deneyimleri.',
    customers: [
      {
        name: 'Mehmet Özkan',
        role: 'Restoran Sahibi',
        company: 'Lezzet Durağı',
        content: 'QR Menu sayesinde müşteri memnuniyetimiz %40 arttı. Özellikle pandemi döneminde temassız menü büyük avantaj sağladı. Sistem çok kolay kullanılıyor.'
      },
      {
        name: 'Ayşe Demir',
        role: 'Genel Müdür',
        company: 'Bella Vista Restaurant',
        content: 'Müşterilerimiz artık garsonları beklemeden menüye bakabiliyor. Sipariş alma süremiz yarıya indi. Gerçekten mükemmel bir çözüm!'
      },
      {
        name: 'Can Yılmaz',
        role: 'İşletme Ortağı',
        company: 'Keyif Cafe',
        content: 'Analitik raporları sayesinde hangi ürünlerin daha popüler olduğunu görüyoruz. Menümüzü optimize ettik ve satışlarımız %25 arttı.'
      },
      {
        name: 'Fatma Kaya',
        role: 'Restoran Müdürü',
        company: 'Anadolu Sofrası',
        content: 'Fiyat güncellemeleri anında yansıyor. Artık menü baskısı ile uğraşmıyoruz. Hem maliyet tasarrufu hem de çevre dostu.'
      },
      {
        name: 'Emre Şahin',
        role: 'Zincir Restoran Sahibi',
        company: 'Burger House',
        content: 'Tüm şubelerimizi tek yerden yönetiyoruz. Her şube için ayrı menü ve fiyatlandırma yapabiliyoruz. Muhteşem sistem!'
      },
      {
        name: 'Zeynep Arslan',
        role: 'Cafe Sahibi',
        company: 'Kahve Köşesi',
        content: 'Müşteri desteği harika. Kurulum sırasında her adımda yardım aldık. Şimdi teknolojik bir cafe olduk ve müşterilerimiz çok memnun.'
      }
    ],
    stats: {
      restaurants: 'Mutlu Restoran',
      satisfaction: 'Memnuniyet Oranı',
      support: 'Müşteri Desteği',
      setup: 'Kurulum Süresi'
    }
  },

  // FAQ
  faq: {
    title: 'Sıkça Sorulan',
    titleHighlight: 'Sorular',
    subtitle: 'QR Menu hakkında merak ettiğiniz her şey burada. Sorunuz yoksa bize ulaşabilirsiniz.',
    questions: {
      '1': {
        question: 'QR Menu nasıl çalışıyor?',
        answer: 'QR Menu sistemimiz çok basit. Restoranınız için bir QR kod oluşturuyoruz. Müşterileriniz bu QR kodu telefonlarıyla tarayarak menünüze anında erişebilir. Herhangi bir uygulama indirmeye gerek yok.'
      },
      '2': {
        question: 'Kurulum ne kadar sürer?',
        answer: 'Kurulum sadece 5 dakika sürer! Hesabınızı oluşturduktan sonra menünüzü yükleyip özelleştirirsiniz. QR kodunuz hemen kullanıma hazır hale gelir.'
      },
      '3': {
        question: 'Müşteri verilerini görebilir miyim?',
        answer: 'Evet! Hangi ürünlerin en çok görüntülendiği, peak saatler, müşteri davranışları gibi detaylı analitikler sunarız. Bu verilerle menünüzü optimize edebilirsiniz.'
      },
      '4': {
        question: 'Fiyatları kolayca değiştirebilir miyim?',
        answer: 'Tabii ki! Admin panelinizden istediğiniz zaman fiyat güncelleyebilir, yeni ürün ekleyebilir veya mevcut ürünleri düzenleyebilirsiniz. Değişiklikler anında yayınlanır.'
      },
      '5': {
        question: 'Mobil cihazlarda nasıl görünüyor?',
        answer: 'Menünüz tüm cihazlarda mükemmel görünür. Responsive tasarım sayesinde telefon, tablet ve bilgisayarlarda optimum deneyim sunar.'
      },
      '6': {
        question: 'Müşteri desteği var mı?',
        answer: 'Elbette! Email, telefon ve canlı chat ile 7/24 destek veriyoruz. Kurulumdan kullanıma kadar her adımda yanınızdayız.'
      },
      '7': {
        question: 'İptal etmek istediğimde ne olur?',
        answer: 'İstediğiniz zaman iptal edebilirsiniz. Hiçbir sözleşme veya ceza yok. İptal ettikten sonra verilerinizi size güvenli şekilde teslim ederiz.'
      },
      '8': {
        question: 'Çoklu restoran yönetebilir miyim?',
        answer: 'Profesyonel ve Kurumsal planlarımızla birden fazla restoranı tek hesaptan yönetebilirsiniz. Her restoran için ayrı menü ve analitikler.'
      }
    },
    cta: {
      title: 'Başka sorunuz var mı?',
      subtitle: 'Cevabını bulamadığınız sorular için bize ulaşın. 24 saat içinde yanıtlıyoruz.',
      button: 'İletişime Geç'
    }
  },

  // Contact
  contact: {
    title: 'Bizimle',
    titleHighlight: 'İletişime',
    titleEnd: 'Geçin',
    subtitle: 'QR Menu sistemi hakkında sorularınız mı var? Bizimle iletişime geçin.',
    info: {
      title: 'İletişim Bilgileri',
      phone: 'Telefon',
      email: 'E-posta',
      address: 'Adres'
    },
    form: {
      title: 'Bize Yazın',
      name: 'Ad Soyad',
      nameRequired: 'Ad Soyad *',
      namePlaceholder: 'Adınızı yazın',
      email: 'E-posta',
      emailRequired: 'E-posta *',
      emailPlaceholder: 'E-posta adresiniz',
      company: 'Restoran/Şirket Adı',
      companyPlaceholder: 'İşletmenizin adı',
      message: 'Mesajınız',
      messageRequired: 'Mesajınız *',
      messagePlaceholder: 'Mesajınızı yazın...',
      sending: 'Gönderiliyor...',
      send: 'Mesaj Gönder',
      success: {
        title: 'Mesajınız Gönderildi!',
        subtitle: 'En kısa sürede size geri dönüş yapacağız.'
      }
    }
  },

  // Accessibility
  accessibility: {
    menu: 'Menüyü aç/kapat',
    theme: 'Tema değiştir',
    language: 'Dil değiştir',
    profile: 'Profil menüsü',
    notifications: 'Bildirimler'
  },

  // Orders
  orders: {
    loading: 'Siparişler yükleniyor...',
    title: 'Siparişler',
    description: 'Tüm siparişlerinizi yönetin ve takip edin',
    orderNumber: 'Sipariş',
    table: 'Masa',
    items: 'Ürün',
    tabs: {
      all: 'Tüm Siparişler',
      pending: 'Bekleyen',
      preparing: 'Hazırlanıyor',
      ready: 'Hazır',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    },
    status: {
      pending: 'Beklemede',
      preparing: 'Hazırlanıyor',
      ready: 'Hazır',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    },
    filters: {
      status: 'Durum',
      dateRange: 'Tarih Aralığı',
      paymentType: 'Ödeme Türü',
      today: 'Bugün',
      yesterday: 'Dün',
      lastWeek: 'Geçen Hafta',
      lastMonth: 'Geçen Ay',
      custom: 'Özel'
    },
    actions: {
      refresh: 'Yenile',
      export: 'Dışa Aktar',
      filter: 'Filtrele',
      search: 'Sipariş ara...',
      viewDetails: 'Detayları Görüntüle',
      changeStatus: 'Durumu Değiştir'
    },
    stats: {
      totalOrders: 'Toplam Sipariş',
      totalRevenue: 'Toplam Gelir',
      pendingOrders: 'Bekleyen Sipariş',
      avgOrderValue: 'Ortalama Sipariş Değeri'
    }
  },

  // Table Management
  tableManagement: {
    loading: 'Masalar yükleniyor...',
    title: 'Masa Yönetimi',
    description: 'QR kodlarınızı ve masalarınızı yönetin',
        noCategories :"Kategoriler Bulunmadı",
    createFirstCategory: "Birinci Kategori Oluştur",
    error: {
      loadFailed: 'Şube listesi yüklenemedi',
      dataLoadFailed: 'Veriler yüklenirken bir hata oluştu'
    },
      deleteModal :{ title : "Öğeyi silmek istediğinizden emin misiniz? " },

    actions: {
      addTable: 'Masa Ekle',
      addQRCode: 'QR Kod Ekle',
      generateQR: 'QR Kod Oluştur',
      downloadQR: 'QR Kodu İndir',
      editTable: 'Masa Düzenle',
      deleteTable: 'Masa Sil'
    },
    categories: {
      title: 'Kategori Yönetimi',
      addCategory: 'Kategori Ekle',
      editCategory: 'Kategori Düzenle',
      deleteCategory: 'Kategori Sil',
      categoryName: 'Kategori Adı',
      tableCount: 'Masa Sayısı'
    },
    qrCodes: {
      title: 'QR Kodlar',
      tableNumber: 'Masa Numarası',
      category: 'Kategori',
      status: 'Durum',
      actions: 'İşlemler',
      active: 'Aktif',
      inactive: 'Pasif'
    }
  },

  // User Management
  userManagement: {
    loading: 'Kullanıcılar yükleniyor...',
    title: 'Kullanıcı Yönetimi',
    description: 'Kullanıcıları, rolleri ve izinleri yönetin',
    error: {
      loadFailed: 'Kullanıcılar yüklenirken bir hata oluştu',
      rolesLoadFailed: 'Roller yüklenirken bir hata oluştu',
      createFailed: 'Kullanıcı oluşturulurken bir hata oluştu',
      updateFailed: 'Kullanıcı güncellenirken bir hata oluştu',
      deleteFailed: 'Kullanıcı silinirken bir hata oluştu'
    },
    actions: {
      addUser: 'Kullanıcı Ekle',
      editUser: 'Kullanıcı Düzenle',
      deleteUser: 'Kullanıcı Sil',
      resetPassword: 'Şifre Sıfırla',
      changeRole: 'Rol Değiştir'
    },
    roles: {
      admin: 'Yönetici',
      manager: 'Müdür',
      staff: 'Personel',
      viewer: 'Görüntüleyici'
    },
    status: {
      active: 'Aktif',
      inactive: 'Pasif',
      suspended: 'Askıya Alınmış'
    }
  },



  // Subscription
  subscription: {
    title: 'Abonelik',
    description: 'Abonelik planınızı yönetin ve faturalarınızı görüntüleyin',
    currentPlan: 'Mevcut Plan',
    planDetails: 'Plan Detayları',
    billing: 'Faturalama',
    usage: 'Kullanım',
    plan: 'Plan',
    renewal: 'Yenileme',
    changePlan: 'Planı Değiştir',
    availablePlans: 'Kullanılabilir Planlar',
    selectPlan: 'İhtiyaçlarınıza uygun planı seçin',
    tabs: {
      overview: 'Genel Bakış',
      billing: 'Faturalar',
      usage: 'Kullanım'
    },
    actions: {
      upgrade: 'Yükselt',
      downgrade: 'Düşür',
      cancel: 'İptal Et',
      renew: 'Yenile',
      settings: 'Ayarlar'
    }
  },

  // Products
  products: {
    status: {
      outOfStock: 'Stokta Yok',
      inStock: 'Stokta Var',
      available: 'Mevcut',
      unavailable: 'Mevcut Değil'
    },
    count: 'ürün',
    empty: 'Bu kategoride henüz ürün yok',
    actions: {
      addFirst: 'İlk ürünü ekle',
      addProduct: 'Ürün Ekle',
      editProduct: 'Ürün Düzenle',
      deleteProduct: 'Ürün Sil'
    }
  },
  branchSelector: {
  status: {
    loading: 'Yükleniyor...',
    error: 'Şube listesi alınamadı'
  },
  empty: 'Seçenek bulunamadı',
  actions: {
    changeBranchRestaurant: 'Şube/Restoran Değiştir'
  },
  labels: {
    mainRestaurant: 'Ana Restorant',
    branches: 'Şubeler'
  }
  
  },
  popularProducts: {
    title: 'Popüler Ürünler',
    empty: 'Ürün satışları burada görünecek',
    labels: {
      orders: 'sipariş',
      percentage: '%'
    },
    tooltip: {
      ordersFormat: (value: any, percentage: any) => `${value} sipariş (${percentage}%)`,
      noData: 'Veri bulunamadı'
    }
  },
  weeklyActivity: {
    title: 'Haftalık Aktivite',
    empty: {
      primary: 'Henüz aktivite verisi bulunmuyor',
      secondary: 'Veriler yakında burada görünecek'
    },
    labels: {
      views: 'Görüntülenme',
      qrScans: 'QR Tarama'
    },
    legend: {
      views: 'Görüntülenme',
      qrScans: 'QR Tarama'
    }
  },
  monthlyRevenue: {
    QuickStats : "Hızlı İstatistikler",
    title: 'Aylık Gelir Trendi',
    empty: {
      primary: 'Henüz gelir verisi bulunmuyor',
      secondary: 'Gelir verileri burada görünecek'
    },
    labels: {
      total: 'Toplam:',
      revenue: 'Gelir'
    },
    currency: {
      symbol: '₺',
      format: (value: { toLocaleString: (arg0: string) => any; }) => `₺${value.toLocaleString('tr-TR')}`
    }
  },
  branchCard: {
    status: {
      temporaryClosed: 'Geçici Kapalı',
      open: 'Açık',
      closed: 'Kapalı',
      active: 'Aktif',
      inactive: 'Pasif',
      hidden: 'Gizli'
    },
    actions: {
      edit: 'Düzenle',
      delete: 'Sil'
    },
    labels: {
      customerVisibility: 'Müşteriye Açık/Kapalı',
      apiBranchOpen: 'API BranchIsOpen:'
    },
    alt: {
      logo: 'logo'
    }
  },
  addBranchCard: {
    title: 'Add New Branch',
    description: 'Click to add a new branch'
  },
  branchModal: {
    title: {
      add: 'Yeni Şube Ekle',
      edit: 'Şube Düzenle'
    },
    subtitle: 'Şube bilgilerini adım adım girebilirsiniz',
    steps: {
      basic: 'Temel Bilgiler',
      address: 'Adres Bilgileri', 
      contact: 'İletişim & Çalışma Saatleri'
    },
    sections: {
      basicInfo: 'Temel Bilgiler',
      addressInfo: 'Adres Bilgileri',
      contactInfo: 'İletişim Bilgileri',
      workingHours: 'Çalışma Saatleri'
    },
    fields: {
      branchName: {
        label: 'Şube Adı *',
        placeholder: 'Şube adını girin'
      },
      whatsappNumber: {
        label: 'WhatsApp Sipariş Numarası *',
        placeholder: 'WhatsApp sipariş numarasını girin'
      },
      branchLogo: {
        label: 'Şube Logosu (Opsiyonel)',
        select: 'Logo Seç',
        uploading: 'Yükleniyor...',
        success: '✓ Logo başarıyla yüklendi',
        preview: 'Şube logosu önizleme',
        supportText: 'PNG, JPG, GIF formatları desteklenir. Maksimum dosya boyutu: 5MB'
      },
      country: {
        label: 'Ülke *',
        placeholder: 'Ülke adını girin'
      },
      city: {
        label: 'Şehir *',
        placeholder: 'Şehir adını girin'
      },
      street: {
        label: 'Sokak *',
        placeholder: 'Sokak adını girin'
      },
      zipCode: {
        label: 'Posta Kodu *',
        placeholder: 'Posta kodunu girin'
      },
      addressLine1: {
        label: 'Adres Satırı 1 *',
        placeholder: 'Detaylı adres bilgisi girin'
      },
      addressLine2: {
        label: 'Adres Satırı 2 (Opsiyonel)',
        placeholder: 'Ek adres bilgisi girin (opsiyonel)'
      },
      phone: {
        label: 'Telefon Numarası *',
        placeholder: 'Telefon numarasını girin'
      },
      email: {
        label: 'E-posta Adresi *',
        placeholder: 'E-posta adresini girin'
      },
      location: {
        label: 'Konum Bilgisi *',
        placeholder: 'Konum bilgisini girin (Örn: 40.9795,28.7225)'
      },
      contactHeader: {
        label: 'İletişim Başlığı (Opsiyonel)',
        placeholder: 'İletişim başlığını girin (opsiyonel)'
      },
      footerTitle: {
        label: 'Footer Başlığı (Opsiyonel)',
        placeholder: 'Footer başlığını girin (opsiyonel)'
      },
      footerDescription: {
        label: 'Footer Açıklaması (Opsiyonel)',
        placeholder: 'Footer açıklamasını girin (opsiyonel)'
      },
      openTitle: {
        label: 'Çalışma Saatleri Başlığı (Opsiyonel)',
        placeholder: 'Çalışma saatleri başlığını girin (opsiyonel)'
      },
      openDays: {
        label: 'Açık Günler (Opsiyonel)',
        placeholder: 'Açık günleri girin (opsiyonel)'
      },
      openHours: {
        label: 'Açık Saatler (Opsiyonel)',
        placeholder: 'Açık saatleri girin (opsiyonel)'
      }
    },
    workingHours: {
      description: 'İşletmenizin çalışma saatlerini belirleyin',
      days: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
      open: 'Açık',
      closed: 'Kapalı',
      openTime: 'Açılış',
      closeTime: 'Kapanış',
      canOrder: '✓ Bu gün müşteriler sipariş verebilecek',
      infoTitle: 'Çalışma Saatleri Hakkında',
      infoText: 'Burada belirlediğiniz saatler, müşterilerin QR menünüz üzerinden sipariş verebileceği zamanları belirler. Kapalı günlerde sipariş alınmaz.'
    },
    errors: {
      branchName: 'Şube adı gereklidir',
      whatsappNumber: 'WhatsApp sipariş numarası gereklidir',
      country: 'Ülke gereklidir',
      city: 'Şehir gereklidir',
      street: 'Sokak gereklidir',
      zipCode: 'Posta kodu gereklidir',
      addressLine1: 'Adres satırı 1 gereklidir',
      phone: 'Telefon numarası gereklidir',
      email: 'E-posta adresi gereklidir',
      location: 'Konum bilgisi gereklidir'
    },
    buttons: {
      cancel: 'İptal',
      back: 'Geri',
      next: 'İleri',
      save: 'Kaydet',
      saving: 'Kaydediliyor...'
    }
  },
  branchManagement: {
    title: 'Şube Yönetimi',
    description: 'Restoran şubelerini yönetin ve bilgilerini güncelleyin',
    loading: 'Şubeler yükleniyor...',
    addBranch: 'Yeni Şube Ekle',
    
    // Error messages
    error: {
      loadFailed: 'Şubeler yüklenemedi',
      createFailed: 'Şube oluşturulamadı',
      updateFailed: 'Şube güncellenemedi',
      deleteFailed: 'Şube silinemedi',
      restaurantIdNotFound: 'Restoran ID bulunamadı',
      detailsLoadFailed: 'Şube detayları yüklenemedi',
      statusUpdateFailed: 'Şube durumu güncellenemedi',
      sessionExpired: 'Oturum süresi doldu. Lütfen tekrar giriş yapın.',
      noPermission: 'Bu işlem için yetkiniz bulunmuyor.',
      branchNotFound: 'Şube bulunamadı.',
      connectionError: 'İnternet bağlantınızı kontrol edin.',
      unknownError: 'Beklenmeyen bir hata oluştu'
    },

    // No branches state
    noBranches: {
      title: 'Henüz şube yok',
      description: 'Restoranınızın ilk şubesini eklemeye başlayın'
    },

    // Delete confirmation
    deleteConfirm: {
      title: 'Şube Silme Onayı',
      description: '"{{branchName}}" şubesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
    },

    // Form labels and fields
    form: {
      branchName: 'Şube Adı',
      branchNamePlaceholder: 'Şube adını girin',
      branchNameRequired: 'Şube adı gereklidir',
      whatsappNumber: 'WhatsApp Sipariş Numarası',
      whatsappPlaceholder: 'WhatsApp numarasını girin',
      branchLogo: 'Şube Logosu',
      logoUpload: 'Logo Yükle',
      logoChange: 'Logo Değiştir',
      logoRemove: 'Logoyu Kaldır',
      logoNotSelected: 'Logo seçilmedi',
      logoInstructions: 'JPG, PNG veya GIF formatında, maksimum 5MB boyutunda dosya yükleyebilirsiniz.',

      // Address fields
      country: 'Ülke',
      countryPlaceholder: 'Ülke adını girin',
      city: 'Şehir',
      cityPlaceholder: 'Şehir adını girin',
      street: 'Sokak',
      streetPlaceholder: 'Sokak adını girin',
      zipCode: 'Posta Kodu',
      zipCodePlaceholder: 'Posta kodunu girin',
      addressLine1: 'Adres Satırı 1',
      addressLine1Placeholder: 'Adres detayını girin',
      addressLine2: 'Adres Satırı 2',
      addressLine2Placeholder: 'Ek adres bilgisi (opsiyonel)',

      // Contact fields
      phone: 'Telefon',
      phonePlaceholder: 'Telefon numarasını girin',
      email: 'E-posta',
      emailPlaceholder: 'E-posta adresini girin',
      location: 'Konum',
      locationPlaceholder: 'Konum bilgisini girin',
      contactHeader: 'İletişim Başlığı',
      contactHeaderPlaceholder: 'İletişim başlığını girin',
      footerTitle: 'Footer Başlığı',
      footerTitlePlaceholder: 'Footer başlığını girin',
      footerDescription: 'Footer Açıklaması',
      footerDescriptionPlaceholder: 'Footer açıklamasını girin',
      openTitle: 'Açılış Saatleri Başlığı',
      openTitlePlaceholder: 'Açılış saatleri başlığını girin',
      openDays: 'Açık Günler',
      openDaysPlaceholder: 'Açık günleri girin',
      openHours: 'Açık Saatler',
      openHoursPlaceholder: 'Açık saatleri girin',

      // Working hours
      workingHours: 'Çalışma Saatleri',
      workingHoursRequired: 'En az bir çalışma günü seçmelisiniz',
      isOpen: 'Açık',
      dayNames: {
        0: 'Pazar',
        1: 'Pazartesi',
        2: 'Salı',
        3: 'Çarşamba',
        4: 'Perşembe',
        5: 'Cuma',
        6: 'Cumartesi'
      }
    },

    // Modal titles and tabs
    modal: {
      createTitle: 'Yeni Şube Ekle',
      createDescription: 'Yeni şube bilgilerini girin',
      editTitle: 'Şube Düzenle - {{branchName}}',
      editDescription: 'Şube bilgilerini düzenleyin',
      
      tabs: {
        general: 'Genel Bilgiler',
        address: 'Adres',
        contact: 'İletişim',
        workingHours: 'Çalışma Saatleri'
      },

      buttons: {
        creating: 'Oluşturuluyor...',
        updating: 'Güncelleniyor...',
        create: 'Şube Oluştur',
        update: 'Şubeyi Güncelle'
      },

      errors: {
        updateError: 'Güncelleme Hatası',
        validationFailed: 'Lütfen formdaki hataları düzeltin ve tekrar deneyin.',
        dataValidationError: 'Güncelleme sırasında bir hata oluştu. Lütfen girdiğiniz verileri kontrol edin.',
        imageUploadError: 'Resim yüklenirken hata oluştu. Lütfen tekrar deneyin.',
        imageRemoveError: 'Resim silinirken hata oluştu.',
        uploadingImage: 'Resim yükleniyor...',
        invalidFileType: 'Lütfen geçerli bir resim dosyası seçin',
        fileSizeError: 'Dosya boyutu 5MB\'dan küçük olmalıdır'
      }
    },

    // Branch card actions
    card: {
      edit: 'Düzenle',
      delete: 'Sil',
      temporaryClose: 'Geçici Kapat',
      temporaryOpen: 'Geçici Aç',
      status: {
        open: 'Açık',
        closed: 'Kapalı',
        temporarilyClosed: 'Geçici Kapalı'
      }
    }
  },
  commonBranch: {
    cancel: 'İptal',
    delete: 'Sil',
    save: 'Kaydet',
    edit: 'Düzenle',
    create: 'Oluştur',
    update: 'Güncelle',
    close: 'Kapat',
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    warning: 'Uyarı',
    info: 'Bilgi',
    required: 'Gerekli',
    optional: 'Opsiyonel'
  },
  productsContent: {
        branch : {
    selectAll:"Hepsi",

    },
  title: 'Ürün Yönetimi',
  description: 'Menü kategorileri ve ürünlerini yönetin',
  
  // Search and filters
  search: {
    placeholder: 'Menü öğelerini ara...',
    filter: 'Filtrele',
    sort: 'Sırala',
    noResults: 'Ürün bulunamadı'
  },

  // View modes
  viewMode: {
    list: 'Liste görünümü',
    grid: 'Izgara görünümü'
  },

  // Buttons and actions
  actions: {
    addFirstCategory: 'İlk Kategori Ekle',
    addCategory: 'Yeni Kategori',
    newCategory: 'Yeni Kategori',
    addProduct: 'Yeni Ürün',
    newProduct: 'Yeni Ürün',
    editCategory: 'Kategoriyi Düzenle',
    deleteCategory: 'Kategoriyi Sil',
    editProduct: 'Ürünü Düzenle',
    deleteProduct: 'Ürünü Sil',
    manageIngredients: 'Malzemeleri Yönet',
    updateIngredients: 'Malzemeleri Güncelle',
    manageAddons: 'Eklentileri Yönet',
    importSampleMenu: 'Örnek Menü İçe Aktar',
    addFirstCategoryTitle: 'İlk Kategoriyi Ekle'
  },

  // Empty states
  emptyState: {
    noCategories: {
      title: 'Henüz menü kategoriniz bulunmuyor',
      description: 'Restoranınızın menüsünü oluşturmaya başlamak için ilk kategoriyi ekleyin. Örneğin "Ana Yemekler", "İçecekler" veya "Tatlılar" gibi.',
      addFirstCategory: 'İlk Kategoriyi Ekle'
    }
  },

  // Loading states
  loading: {
    categories: 'Kategoriler yükleniyor...',
    products: 'Ürünler yükleniyor...',
    savingOrder: 'Sıralama kaydediliyor...',
    savingCategoryOrder: 'Kategori sıralaması kaydediliyor...',
    savingProductOrder: 'Ürün sıralaması kaydediliyor...',
    movingProduct: 'Ürün taşınıyor...',
    deleting: 'Siliniyor...'
  },

  // Drag and drop
  dragDrop: {
    categoryReordering: 'Kategori sıralaması kaydediliyor...',
    productReordering: 'Ürün sıralaması kaydediliyor...',
    productMoving: 'Ürün taşınıyor...',
    categoryOrderSaveError: 'Kategori sıralaması kaydedilirken bir hata oluştu.',
    productOrderSaveError: 'Ürün sıralaması kaydedilirken bir hata oluştu.',
    productMoveError: 'Ürün taşıma işlemi kaydedilirken bir hata oluştu.'
  },

  // Delete confirmations
  delete: {
    product: {
      title: 'Ürünü Sil',
      message: '"{{productName}}" adlı ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      success: 'Ürün başarıyla silindi'
    },
    category: {
      title: 'Kategoriyi Sil',
      messageWithProducts: '"{{categoryName}}" kategorisinde {{productCount}} ürün bulunuyor. Bu kategoriyi silmek tüm ürünleri de silecektir. Devam etmek istediğinizden emin misiniz?',
      messageEmpty: '"{{categoryName}}" kategorisini silmek istediğinizden emin misiniz?',
      success: 'Kategori başarıyla silindi'
    }
  },

  // Error messages
  error: {
    loadFailed: 'Veriler yüklenemedi',
    categoryNotFound: 'Kategori bulunamadı',
    productNotFound: 'Ürün bulunamadı',
    deleteFailed: 'Silme işlemi başarısız',
    updateFailed: 'Güncelleme başarısız',
    createFailed: 'Oluşturma başarısız',
    reorderFailed: 'Sıralama başarısız',
    invalidData: 'Geçersiz veri',
    networkError: 'Ağ bağlantı hatası',
    refreshPage: 'Lütfen sayfayı yenileyin ve tekrar deneyin.'
  },

  // Success messages
  success: {
    categoryCreated: 'Kategori başarıyla oluşturuldu',
    categoryUpdated: 'Kategori başarıyla güncellendi',
    categoryDeleted: 'Kategori başarıyla silindi',
    productCreated: 'Ürün başarıyla oluşturuldu',
    productUpdated: 'Ürün başarıyla güncellendi',
    productDeleted: 'Ürün başarıyla silindi',
    orderSaved: 'Sıralama başarıyla kaydedildi',
    ingredientsUpdated: 'Malzemeler başarıyla güncellendi',
    addonsUpdated: 'Eklentiler başarıyla güncellendi'
  },

  // Categories
  category: {
    products: 'ürün',
    productCount: 'ürün',
    noProducts: 'Bu kategoride ürün bulunmuyor',
    expand: 'Genişlet',
    collapse: 'Daralt'
  },

  // Products
  product: {
    price: 'Fiyat',
    description: 'Açıklama',
    ingredients: 'Malzemeler',
    addons: 'Eklentiler',
    category: 'Kategori',
    image: 'Resim',
    status: 'Durum',
    available: 'Mevcut',
    unavailable: 'Mevcut değil'
  },

  // Currency
  currency: {
    symbol: '₺',
    format: '{{amount}} ₺'
  },

  // Status indicators
  status: {
    active: 'Aktif',
    inactive: 'Pasif',
    available: 'Mevcut',
    unavailable: 'Mevcut değil'
  },

  // Tooltips
  tooltips: {
    dragToReorder: 'Sıralamak için sürükleyin',
    dragToMoveCategory: 'Ürünü başka kategoriye taşımak için sürükleyin',
    expandCategory: 'Kategoriyi genişlet',
    collapseCategory: 'Kategoriyi daralt',
    editCategory: 'Kategoriyi düzenle',
    deleteCategory: 'Kategoriyi sil',
    editProduct: 'Ürünü düzenle',
    deleteProduct: 'Ürünü sil',
    manageIngredients: 'Ürün malzemelerini yönet',
    manageAddons: 'Ürün eklentilerini yönet'
  }
  },
  createCategoryModal: {
  // Header
  title: 'Yeni Kategori Ekle',
  subtitle: 'Menü kategorisi oluşturun',
  close: 'Kapat',

  // Form fields
  form: {
    categoryName: {
      label: 'Kategori Adı *',
      placeholder: 'Örn: Ana Yemekler, İçecekler, Tatlılar',
      required: 'Kategori adı gereklidir'
    },
    status: {
      label: 'Kategoriyi aktif et',
      description: 'Aktif kategoriler menüde görünür'
    }
  },

  // Buttons
  buttons: {
    cancel: 'İptal',
    create: 'Kategori Ekle',
    creating: 'Ekleniyor...'
  },

  // Error messages
  errors: {
    general: 'Kategori eklenirken bir hata oluştu. Lütfen tekrar deneyin.',
    categoryExists: 'Bu isimde bir kategori zaten mevcut. Lütfen farklı bir isim seçin.',
    invalidData: 'Girilen bilgiler geçersiz. Lütfen kontrol edip tekrar deneyin.',
    serverError: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
    networkError: 'Ağ bağlantı hatası. Bağlantınızı kontrol edin ve tekrar deneyin.',
    unknownError: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
    errorLabel: 'Hata:'
  },

  // Success messages
  success: {
    categoryCreated: 'Kategori başarıyla oluşturuldu',
    categoryAdded: 'Kategori başarıyla menüye eklendi'
  },

  // Validation messages
  validation: {
    nameRequired: 'Kategori adı gereklidir',
    nameMinLength: 'Kategori adı 2 karakterden fazla olmalıdır',
    nameMaxLength: 'Kategori adı 50 karakterden az olmalıdır',
    invalidCharacters: 'Kategori adı geçersiz karakterler içeriyor'
  },

  // Accessibility
  accessibility: {
    closeModal: 'Kategori ekleme modalını kapat',
    formTitle: 'Yeni kategori ekleme formu',
    requiredField: 'Zorunlu alan',
    optionalField: 'İsteğe bağlı alan'
  }
  },
  createProductModal: {
  // Header
  title: 'Yeni Ürün Ekle',
  subtitle: 'Menünüze ürün ekleyin',
  close: 'Kapat',

  // Form fields
  form: {
    productImage: {
      label: 'Ürün Görseli',
      dragActive: 'Dosyayı buraya bırakın',
      uploadText: 'Görsel yükleyin',
      supportedFormats: 'PNG, JPG, GIF (5MB max)',
      removeImage: 'Görseli kaldır'
    },
    productName: {
      label: 'Ürün Adı',
      placeholder: 'Örn: Margherita Pizza',
      required: 'Ürün adı gereklidir'
    },
    price: {
      label: 'Fiyat (₺)',
      placeholder: '0',
      required: 'Fiyat gereklidir',
      mustBePositive: 'Fiyat 0\'dan büyük olmalıdır',
      currency: '₺'
    },
    category: {
      label: 'Kategori',
      placeholder: 'Kategori seçin',
      required: 'Kategori seçimi gereklidir',
      invalidCategory: 'Seçilen kategori geçersiz. Mevcut kategoriler: {{categories}}'
    },
    description: {
      label: 'Açıklama',
      placeholder: 'Ürün açıklaması...',
      required: 'Ürün açıklaması gereklidir'
    },
    status: {
      label: 'Ürünü aktif et',
      description: 'Menüde görüntülenir',
      active: 'Aktif',
      inactive: 'Pasif'
    }
  },

  // Buttons
  buttons: {
    cancel: 'İptal',
    create: 'Ürün Ekle',
    creating: 'Ekleniyor...',
    uploading: 'Yükleniyor...'
  },

  // Image upload
  imageUpload: {
    dragToUpload: 'Görseli buraya sürükleyin veya yüklemek için tıklayın',
    clickToUpload: 'Görsel yüklemek için tıklayın',
    dragActive: 'Dosyayı buraya bırakın',
    supportedFormats: 'PNG, JPG, GIF',
    maxSize: '5MB max',
    preview: 'Görsel önizleme',
    remove: 'Kaldır'
  },

  // Error messages
  errors: {
    general: 'Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.',
    nameRequired: 'Ürün adı gereklidir',
    descriptionRequired: 'Ürün açıklaması gereklidir',
    priceRequired: 'Fiyat gereklidir',
    priceMustBePositive: 'Fiyat 0\'dan büyük olmalıdır',
    categoryRequired: 'Kategori seçimi gereklidir',
    categoryInvalid: 'Seçilen kategori geçersiz',
    imageInvalid: 'Lütfen geçerli bir görsel dosyası seçin',
    imageTooLarge: 'Görsel dosyası 5MB\'dan küçük olmalıdır',
    imageUploadFailed: 'Görsel yüklenirken bir hata oluştu',
    networkError: 'Ağ bağlantı hatası. Bağlantınızı kontrol edin ve tekrar deneyin.',
    serverError: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
    unknownError: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
    errorLabel: 'Hata:'
  },

  // Success messages
  success: {
    productCreated: 'Ürün başarıyla oluşturuldu',
    productAdded: 'Ürün başarıyla menüye eklendi'
  },

  // Validation messages
  validation: {
    nameMinLength: 'Ürün adı 2 karakterden fazla olmalıdır',
    nameMaxLength: 'Ürün adı 100 karakterden az olmalıdır',
    descriptionMinLength: 'Açıklama 5 karakterden fazla olmalıdır',
    descriptionMaxLength: 'Açıklama 500 karakterden az olmalıdır',
    priceMin: 'Fiyat 0\'dan büyük olmalıdır',
    priceMax: 'Fiyat 10000\'den küçük olmalıdır'
  },

  // Accessibility
  accessibility: {
    closeModal: 'Ürün ekleme modalını kapat',
    formTitle: 'Yeni ürün ekleme formu',
    requiredField: 'Zorunlu alan',
    optionalField: 'İsteğe bağlı alan',
    imageUpload: 'Ürün görseli yükle',
    removeImage: 'Ürün görselini kaldır',
    priceInput: 'Ürün fiyatını girin',
    categorySelect: 'Ürün kategorisi seçin',
    statusToggle: 'Ürün durumunu değiştir'
  }
  },
    productAddonsModal: {
      // Header
      title: 'Ürün Eklentileri',
      subtitle: 'için eklenti ürünleri yönetin',
      close: 'Kapat',

      // Panel titles
      panels: {
        currentAddons: {
          title: 'Mevcut Eklentiler',
          count: '({{count}})',
          dragInstruction: 'Sürükleyerek sıralayabilirsiniz',
          emptyState: {
            title: 'Henüz eklenti eklenmemiş.',
            subtitle: 'Sağ panelden ürün seçin.'
          }
        },
        availableProducts: {
          title: 'Eklenti Olarak Eklenebilir Ürünler',
          searchPlaceholder: 'Ürün ara...',
          emptyState: {
            noResults: 'Arama kriterlerine uygun ürün bulunamadı.',
            noProducts: 'Eklenebilir ürün bulunamadı.'
          }
        }
      },

      // Addon item actions
      actions: {
        edit: 'Düzenle',
        save: 'Kaydet',
        cancel: 'İptal',
        remove: 'Kaldır',
        recommended: 'Önerilen'
      },

      // Form fields
      form: {
        marketingText: {
          placeholder: 'Pazarlama metni...',
          label: 'Pazarlama Metni'
        },
        isRecommended: {
          label: 'Önerilen eklenti olarak işaretle',
          badge: 'Önerilen'
        }
      },

      // Product status
      status: {
        outOfStock: 'Stokta Yok',
        available: 'Mevcut',
        unavailable: 'Mevcut Değil'
      },

      // Loading states
      loading: {
        addons: 'Eklentiler yükleniyor...',
        products: 'Ürünler yükleniyor...',
        saving: 'Kaydediliyor...'
      },

      // Buttons
      buttons: {
        cancel: 'İptal',
        saveAddons: 'Eklentileri Kaydet',
        saving: 'Kaydediliyor...'
      },

      // Counter texts
      counters: {
        selectedProducts: '{{count}} ürün seçili',
        availableProducts: '{{count}} mevcut ürün'
      },

      // Error messages
      errors: {
        loadingData: 'Eklenti verileri yüklenirken bir hata oluştu.',
        updatingAddon: 'Eklenti güncellenirken bir hata oluştu.',
        deletingAddon: 'Eklenti silinirken bir hata oluştu.',
        savingOrder: 'Eklenti sıralaması kaydedilirken bir hata oluştu.',
        savingAddons: 'Eklentiler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.',
        general: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
        networkError: 'Ağ bağlantı hatası. Bağlantınızı kontrol edin ve tekrar deneyin.'
      },

      // Success messages
      success: {
        addonsSaved: 'Ürün eklentileri başarıyla kaydedildi',
        orderUpdated: 'Eklenti sıralaması başarıyla güncellendi',
        addonUpdated: 'Eklenti başarıyla güncellendi',
        addonRemoved: 'Eklenti başarıyla kaldırıldı'
      },

      // Accessibility
      accessibility: {
        closeModal: 'Ürün eklentileri modalını kapat',
        dragHandle: 'Eklenti sırasını değiştirmek için sürükle',
        editAddon: 'Eklenti detaylarını düzenle',
        removeAddon: 'Eklentiyi üründen kaldır',
        selectProduct: 'Ürünü eklenti olarak seç',
        productImage: 'Ürün resmi',
        toggleRecommended: 'Önerilen durumunu değiştir'
      }
    },
      editCategoryModal: {
      // Header
      title: 'Kategori Düzenle',
      subtitle: 'Kategori bilgilerini güncelle',
      close: 'Kapat',

      // Form fields
      form: {
        categoryName: {
          label: 'Kategori Adı',
          placeholder: 'Kategori adını girin...',
          required: 'Kategori adı gereklidir',
          minLength: 'Kategori adı en az 2 karakter olmalıdır',
          maxLength: 'Kategori adı 100 karakterden az olmalıdır'
        },
        description: {
          label: 'Açıklama',
          placeholder: 'Kategori açıklamasını girin...',
          optional: 'Opsiyonel',
          maxLength: 'Açıklama 500 karakterden az olmalıdır'
        },
        status: {
          label: 'Aktif',
          description: 'Aktif olduğunda kategori menüde görünür',
          active: 'Aktif',
          inactive: 'Pasif'
        }
      },

      // Buttons
      buttons: {
        cancel: 'İptal',
        save: 'Kaydet',
        saving: 'Kaydediliyor...',
        update: 'Kategoriyi Güncelle',
        updating: 'Güncelleniyor...'
      },

      // Error messages
      errors: {
        updateFailed: 'Kategori güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
        nameRequired: 'Kategori adı gereklidir',
        nameMinLength: 'Kategori adı en az 2 karakter olmalıdır',
        nameMaxLength: 'Kategori adı 100 karakterden az olmalıdır',
        descriptionMaxLength: 'Açıklama 500 karakterden az olmalıdır',
        general: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
        networkError: 'Ağ bağlantı hatası. Bağlantınızı kontrol edin ve tekrar deneyin.',
        serverError: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'
      },

      // Success messages
      success: {
        categoryUpdated: 'Kategori başarıyla güncellendi',
        changesSaved: 'Değişiklikler başarıyla kaydedildi'
      },

      // Validation messages
      validation: {
        nameRequired: 'Lütfen bir kategori adı girin',
        nameMinLength: 'Kategori adı çok kısa',
        nameMaxLength: 'Kategori adı çok uzun',
        descriptionMaxLength: 'Açıklama çok uzun'
      },

      // Accessibility
      accessibility: {
        closeModal: 'Kategori düzenleme modalını kapat',
        formTitle: 'Kategori düzenleme formu',
        requiredField: 'Zorunlu alan',
        optionalField: 'Opsiyonel alan',
        statusToggle: 'Kategori durumunu değiştir',
        nameInput: 'Kategori adı girişi',
        descriptionInput: 'Kategori açıklama girişi'
      }
    },
     confirmDeleteModal: {
      // Common titles (can be overridden by props)
      defaultTitle: 'Silmeyi Onayla',
      deleteTitle: 'Öğeyi Sil',
      
      // Warning message
      warning: 'Bu işlem geri alınamaz. Öğe kalıcı olarak silinecektir.',
      
      // Item types
      itemTypes: {
        category: 'Kategori',
        product: 'Ürün',
        addon: 'Eklenti',
        user: 'Kullanıcı',
        order: 'Sipariş',
        coupon: 'Kupon',
        discount: 'İndirim',
        promotion: 'Promosyon',
        review: 'Değerlendirme',
        comment: 'Yorum',
        image: 'Resim',
        file: 'Dosya',
        item: 'Öğe'
      },

      // Buttons
      buttons: {
        cancel: 'İptal',
        delete: 'Sil',
        deleting: 'Siliniyor...',
        confirm: 'Onayla',
        confirming: 'Onaylanıyor...'
      },

      // Pre-built messages for common scenarios
      messages: {
        category: 'Bu kategoriyi silmek istediğinizden emin misiniz? Bu kategorideki tüm ürünler de etkilenecektir.',
        product: 'Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
        addon: 'Bu eklentiyi silmek istediğinizden emin misiniz? Tüm ilişkili ürünlerden kaldırılacaktır.',
        user: 'Bu kullanıcıyı silmek istediğinizden emin misiniz? Tüm verileri kalıcı olarak kaldırılacaktır.',
        general: 'Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
      },

      // Error messages
      errors: {
        deleteFailed: 'Silme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        networkError: 'Ağ bağlantı hatası. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.',
        serverError: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
        permissionError: 'Bu öğeyi silme yetkiniz bulunmamaktadır.',
        notFound: 'Silinecek öğe bulunamadı.',
        hasRelations: 'Bu öğe ilişkili veriler içerdiği için silinemez.',
        general: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
      },

      // Success messages
      success: {
        deleted: 'Öğe başarıyla silindi',
        categoryDeleted: 'Kategori başarıyla silindi',
        productDeleted: 'Ürün başarıyla silindi',
        addonDeleted: 'Eklenti başarıyla silindi'
      },

      // Confirmation prompts
      confirmations: {
        typeToConfirm: 'Onaylamak için "SİL" yazın',
        enterName: 'Silmeyi onaylamak için adını girin',
        areYouSure: 'Kesinlikle emin misiniz?',
        lastChance: 'İptal etmek için son şansınız.'
      },

      // Accessibility
      accessibility: {
        closeModal: 'Silme onay modalını kapat',
        deleteDialog: 'Silme onay diyaloğu',
        warningIcon: 'Uyarı ikonu',
        deleteButton: 'Silmeyi onayla',
        cancelButton: 'Silmeyi iptal et',
        errorAlert: 'Hata mesajı'
      }
    },
     editProductModal: {
      // Header
      title: 'Ürün Düzenle',
      subtitle: 'Ürün bilgilerini güncelle',
      close: 'Kapat',

      // Form fields
      form: {
        productImage: {
          label: 'Ürün Görseli',
          optional: 'Opsiyonel'
        },
        productName: {
          label: 'Ürün Adı',
          placeholder: 'örn: Margherita Pizza',
          required: 'Ürün adı gereklidir'
        },
        description: {
          label: 'Açıklama',
          placeholder: 'Ürün açıklaması...',
          optional: 'Opsiyonel'
        },
        price: {
          label: 'Fiyat (₺)',
          placeholder: '0',
          required: 'Fiyat gereklidir',
          currency: '₺'
        },
        category: {
          label: 'Kategori',
          placeholder: 'Kategori seçin',
          required: 'Kategori seçimi gereklidir'
        },
        status: {
          label: 'Stokta Var',
          description: 'Mevcut olduğunda ürün menüde görünür',
          available: 'Mevcut',
          unavailable: 'Mevcut Değil'
        }
      },

      // Buttons
      buttons: {
        cancel: 'İptal',
        update: 'Ürünü Güncelle',
        updating: 'Güncelleniyor...',
        save: 'Değişiklikleri Kaydet',
        saving: 'Kaydediliyor...',
        uploading: 'Görsel Yükleniyor...'
      },

      // Image upload
      imageUpload: {
        clickToUpload: 'Görsel yüklemek için tıklayın',
        dragToUpload: 'Görseli buraya sürükleyin veya tıklayın',
        dragActive: 'Dosyayı buraya bırakın',
        supportedFormats: 'PNG, JPG, GIF',
        maxSize: 'maksimum 5MB',
        preview: 'Görsel önizleme',
        remove: 'Görseli kaldır',
        changeImage: 'Görseli değiştir'
      },

      // Error messages
      errors: {
        errorLabel: 'Hata:',
        updateFailed: 'Ürün güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
        nameRequired: 'Ürün adı gereklidir',
        nameAlreadyExists: 'Bu isimde bir ürün zaten mevcut. Lütfen farklı bir isim seçin.',
        descriptionRequired: 'Ürün açıklaması gereklidir',
        priceRequired: 'Fiyat gereklidir',
        priceMustBePositive: 'Fiyat 0\'dan büyük olmalıdır',
        categoryRequired: 'Kategori seçimi gereklidir',
        imageInvalid: 'Lütfen geçerli bir görsel dosyası seçin',
        imageTooLarge: 'Görsel dosyası 5MB\'dan küçük olmalıdır',
        imageUploadFailed: 'Görsel yüklenirken bir hata oluştu',
        productNotFound: 'Ürün bulunamadı',
        permissionDenied: 'Bu ürünü güncelleme yetkiniz bulunmamaktadır',
        networkError: 'Ağ bağlantı hatası. Bağlantınızı kontrol edin ve tekrar deneyin.',
        serverError: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
        unknownError: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
      },

      // Success messages
      success: {
        productUpdated: 'Ürün başarıyla güncellendi',
        changesSaved: 'Değişiklikler başarıyla kaydedildi',
        imageUploaded: 'Görsel başarıyla yüklendi'
      },

      // Validation messages
      validation: {
        nameMinLength: 'Ürün adı 2 karakterden fazla olmalıdır',
        nameMaxLength: 'Ürün adı 100 karakterden az olmalıdır',
        descriptionMaxLength: 'Açıklama 500 karakterden az olmalıdır',
        priceMin: 'Fiyat 0\'dan büyük olmalıdır',
        priceMax: 'Fiyat 10000\'den az olmalıdır',
        imageSize: 'Görsel 5MB\'dan küçük olmalıdır',
        imageType: 'Sadece görsel dosyalarına izin verilir'
      },

      // Accessibility
      accessibility: {
        closeModal: 'Ürün düzenleme modalını kapat',
        formTitle: 'Ürün düzenleme formu',
        requiredField: 'Zorunlu alan',
        optionalField: 'Opsiyonel alan',
        imageUpload: 'Ürün görseli yükle',
        removeImage: 'Ürün görselini kaldır',
        priceInput: 'Ürün fiyatını girin',
        categorySelect: 'Ürün kategorisi seçin',
        statusToggle: 'Ürün durumunu değiştir',
        imagePreview: 'Ürün görseli önizleme'
      }
    },
     productIngredientModal: {
      // Header
      title: 'Ürün Malzemeleri',
      subtitle: 'için malzemeleri seçin',
      close: 'Kapat',

      // Search
      search: {
        placeholder: 'Malzemeleri ara...',
        label: 'Malzeme ara',
        noResults: 'Malzeme bulunamadı'
      },

      // Summary section
      summary: {
        selectedCount: 'Seçilen malzemeler',
        hasChanges: 'Değişiklik var',
        noChanges: 'Değişiklik yok'
      },

      // Form fields
      form: {
        quantity: {
          label: 'Miktar',
          placeholder: 'Miktar',
          required: 'Miktar gereklidir'
        },
        unit: {
          label: 'Birim',
          placeholder: 'Birim seçin',
          required: 'Birim gereklidir'
        }
      },

      // Measurement units
      units: {
        grams: 'gr',
        milliliters: 'ml',
        pieces: 'adet',
        tablespoons: 'yemek kaşığı',
        teaspoons: 'çay kaşığı',
        cups: 'su bardağı',
        kilograms: 'kg',
        liters: 'lt'
      },

      // Status indicators
      status: {
        available: 'Kullanılabilir',
        unavailable: 'Kullanılamaz',
        containsAllergens: 'Alerjen İçerir',
        toBeAdded: 'Eklenecek',
        toBeRemoved: 'Kaldırılacak',
        selected: 'Seçili',
        unselected: 'Seçili değil'
      },

      // Allergen information
      allergenInfo: {
        count: '{{count}} alerjen',
        count_plural: '{{count}} alerjen',
        details: 'Alerjen detayları',
        warning: 'Bu malzeme alerjen içerir'
      },

      // Loading states
      loading: {
        ingredients: 'Malzemeler yükleniyor...',
        saving: 'Malzemeler kaydediliyor...',
        data: 'Veriler yükleniyor...'
      },

      // Empty states
      emptyState: {
        noIngredients: 'Henüz malzeme eklenmemiş.',
        noSearchResults: 'Arama kriterlerine uygun malzeme bulunamadı.',
        noAvailableIngredients: 'Kullanılabilir malzeme bulunamadı.'
      },

      // Buttons
      buttons: {
        cancel: 'İptal',
        skip: 'Atla',
        save: 'Kaydet',
        saveIngredients: 'Malzemeleri Kaydet',
        saving: 'Kaydediliyor...',
        add: 'Malzeme Ekle',
        update: 'Malzemeleri Güncelle'
      },

      // Footer
      footer: {
        totalCount: 'Toplam: {{count}} malzeme',
        selectedInfo: '{{total}} malzemeden {{selected}} tanesi seçili'
      },

      // Error messages
      errors: {
        loadingData: 'Malzeme verileri yüklenirken bir hata oluştu.',
        savingIngredients: 'Malzemeler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.',
        quantityRequired: 'Tüm malzemeler için miktar 0\'dan büyük olmalıdır.',
        unitRequired: 'Tüm malzemeler için birim seçilmelidir.',
        networkError: 'Ağ bağlantı hatası. Bağlantınızı kontrol edin ve tekrar deneyin.',
        serverError: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
        general: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
        invalidQuantity: 'Lütfen geçerli bir miktar girin',
        ingredientNotFound: 'Malzeme bulunamadı',
        permissionDenied: 'Malzemeleri değiştirme yetkiniz bulunmamaktadır'
      },

      // Success messages
      success: {
        ingredientsSaved: 'Malzemeler başarıyla kaydedildi',
        ingredientsUpdated: 'Malzemeler başarıyla güncellendi',
        ingredientAdded: 'Malzeme başarıyla eklendi',
        ingredientRemoved: 'Malzeme başarıyla kaldırıldı'
      },

      // Validation messages
      validation: {
        quantityMin: 'Miktar 0\'dan büyük olmalıdır',
        quantityMax: 'Miktar 1000\'den az olmalıdır',
        unitRequired: 'Lütfen bir birim seçin',
        ingredientRequired: 'Lütfen en az bir malzeme seçin'
      },

      // Accessibility
      accessibility: {
        closeModal: 'Malzeme seçim modalını kapat',
        searchInput: 'Malzeme ara',
        quantityInput: 'Malzeme miktarını girin',
        unitSelect: 'Ölçü birimini seçin',
        ingredientCheckbox: 'Malzeme seç',
        selectedIndicator: 'Malzeme seçildi',
        allergenWarning: 'Alerjen içerir',
        availabilityStatus: 'Kullanılabilirlik durumu'
      }
    },
    ProductIngredientUpdateModal: {
  title: 'Malzemeleri Güncelle',
  searchPlaceholder: 'Malzeme ara...',
  selectedCount: 'malzeme seçili',
  loadingIngredients: 'Malzemeler yükleniyor...',
  noIngredientsFound: 'Malzeme bulunamadı',
  noIngredientsFoundSearch: 'Arama kriterlerine uygun malzeme bulunamadı',
  unit: 'Birim:',
  price: 'Fiyat:',
  quantity: 'Miktar',
  cancel: 'İptal',
  save: 'Kaydet',
  saving: 'Kaydediliyor...',
  errors: {
    loadingIngredients: 'Malzemeler yüklenirken bir hata oluştu',
    savingIngredients: 'Malzemeler kaydedilirken bir hata oluştu'
  },
  accessibility: {
    closeModal: 'Malzeme güncelleme modalını kapat',
    formTitle: 'Ürün malzemeleri güncelleme formu',
    searchInput: 'Malzeme ara',
    ingredientToggle: 'Malzeme seçimini değiştir',
    quantityInput: 'Malzeme miktarını gir',
    selectedIndicator: 'Malzeme seçili',
    unselectedIndicator: 'Malzeme seçili değil',
    ingredientCard: 'Malzeme seçim kartı',
    saveButton: 'Malzeme değişikliklerini kaydet',
    cancelButton: 'Malzeme güncellemesini iptal et'
  }
},
SortableCategory: {
  product: 'ürün',
  products: 'ürün',
  editCategory: 'Kategoriyi düzenle',
  deleteCategory: 'Kategoriyi sil', 
  reorderingProducts: 'Ürün sıralaması kaydediliyor...',
  noCategoryProducts: 'Bu kategoride henüz ürün yok.',
  expandCategory: 'Kategoriyi genişlet',
  collapseCategory: 'Kategoriyi daralt',
  dragCategory: 'Kategori sırasını değiştirmek için sürükle',
  accessibility: {
    categoryActions: 'Kategori işlemleri',
    productCount: 'Ürün sayısı',
    expandToggle: 'Kategori genişletme durumunu değiştir',
    editCategoryButton: 'Kategoriyi düzenle',
    deleteCategoryButton: 'Kategoriyi sil',
    dragHandle: 'Kategori sırasını değiştirmek için sürükleme kolu',
    categoryCard: 'Kategori kartı',
    emptyCategory: 'Boş kategori',
    reorderingStatus: 'Kategori yeniden sıralanıyor'
  }
},
SortableProduct: {
  outOfStock: 'Stokta Yok',
  loadingIngredients: 'Malzemeler yükleniyor...',
  ingredients: 'Malzemeler',
  noIngredients: 'Malzeme eklenmemiş',
  loadingAddons: 'Eklentiler yükleniyor...',
  addons: 'Eklentiler',
  noAddons: 'Eklenti eklenmemiş',
  manageAddons: 'Eklentileri yönet',
  editProduct: 'Ürünü düzenle',
  deleteProduct: 'Ürünü sil',
  dragProduct: 'Ürün sırasını değiştirmek için sürükle',
  allergenic: 'Alerjen içerir',
  recommended: 'Önerilen',
  price: 'Fiyat',
  errors: {
    loadingIngredients: 'Malzemeler yüklenirken bir hata oluştu.',
    loadingAddons: 'Eklentiler yüklenirken bir hata oluştu.'
  },
  accessibility: {
    productImage: 'Ürün resmi',
    productCard: 'Ürün kartı',
    productActions: 'Ürün işlemleri',
    dragHandle: 'Ürün sırasını değiştirmek için sürükleme kolu',
    outOfStockBadge: 'Ürün stokta yok',
    ingredientsList: 'Ürün malzemeleri listesi',
    addonsList: 'Ürün eklentileri listesi',
    allergenWarning: 'Alerjen içerir',
    recommendedAddon: 'Önerilen eklenti',
    editButton: 'Ürünü düzenle',
    deleteButton: 'Ürünü sil',
    addonsButton: 'Ürün eklentilerini yönet'
  }
},
  IngredientsContent: {
    // Search and filters
    searchPlaceholder: 'Malzemeleri ara...',
    filter: 'Filtrele',
    sort: 'Sırala',
    newIngredient: 'Yeni Malzeme',
    
    // Table headers
    ingredientName: 'Malzeme Adı',
    status: 'Durum',
    allergenInfo: 'Alerjen Bilgisi',
    actions: 'İşlemler',
    
    // Status labels
    available: 'Kullanılabilir',
    unavailable: 'Kullanılamaz',
    containsAllergens: 'Alerjen İçerir',
    noAllergens: 'Alerjen İçermez',
    
    // Actions
    edit: 'Düzenle',
    delete: 'Sil',
    
    // Empty states
    noIngredientsFound: 'Arama kriterlerine uygun malzeme bulunamadı.',
    noIngredientsYet: 'Henüz malzeme eklenmemiş.',
    
    // Delete modal
    deleteIngredient: 'Malzeme Sil',
    deleteConfirmMessage: '"{name}" malzemesini silmek istediğinizden emin misiniz?',
    deleteError: 'Silme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.',
    cancel: 'İptal',
    deleting: 'Siliniyor...',
    
    // Form modal
    editIngredient: 'Malzeme Düzenle',
    addNewIngredient: 'Yeni Malzeme Ekle',
    basicInfo: 'Temel Bilgiler',
    ingredientNameRequired: 'Malzeme adı gereklidir',
    enterIngredientName: 'Malzeme adını girin',
    containsAllergensCheckbox: 'Alerjen İçerir',
    availableForUse: 'Kullanım İçin Uygun',
    allergenInfoContent: 'Alerjen Bilgileri',
    selectAllergensMessage: 'Bu malzemenin içerdiği alerjenleri seçin:',
    enableAllergenMessage: 'Alerjen seçmek için önce "Alerjen İçerir" seçeneğini işaretleyin.',
    allergenDetails: 'Alerjen Detayları',
    containsThisAllergen: 'Bu alerjeni içerir',
    additionalNotes: 'Ek notlar (isteğe bağlı)',
    updateError: 'Malzeme güncellenirken bir hata oluştu.',
    createError: 'Malzeme eklenirken bir hata oluştu.',
    updating: 'Güncelleniyor...',
    adding: 'Ekleniyor...',
    update: 'Güncelle',
    add: 'Ekle',
    
    accessibility: {
      ingredientsTable: 'Malzeme yönetimi tablosu',
      searchInput: 'Malzeme ara',
      filterButton: 'Malzemeleri filtrele',
      sortButton: 'Malzemeleri sırala',
      addButton: 'Yeni malzeme ekle',
      editButton: 'Malzemeyi düzenle',
      deleteButton: 'Malzemeyi sil',
      ingredientCard: 'Malzeme bilgi kartı',
      allergenSelection: 'Alerjen seçimi',
      formModal: 'Malzeme formu modalı',
      deleteModal: 'Silme onay modalı',
      statusBadge: 'Malzeme durumu',
      allergenBadge: 'Alerjen bilgisi',
      closeModal: 'Modalı kapat',
      dragToReorder: 'Yeniden sıralamak için sürükle'
    }
  },
  TableCard: {
    active: 'Aktif',
    inactive: 'Pasif',
    occupied: 'Dolu',
    empty: 'Boş',
    capacity: 'Kişi',
    capacityPlural: 'Kişi',
    edit: 'Düzenle',
    downloadQR: 'QR Kodu İndir',
    disable: 'Devre Dışı Bırak',
    enable: 'Aktifleştir',
    delete: 'Sil',
    viewQRCode: 'QR Kodunu Görüntüle',
    moreOptions: 'Daha fazla seçenek',
    accessibility: {
      tableCard: 'Masa bilgi kartı',
      statusBadge: 'Masa durumu',
      occupancyBadge: 'Masa doluluk durumu',
      actionsMenu: 'Masa işlemleri menüsü',
      qrCodePreview: 'QR kod önizlemesi',
      editButton: 'Masayı düzenle',
      downloadButton: 'QR kodu indir',
      toggleButton: 'Masa durumunu değiştir',
      deleteButton: 'Masayı sil'
    }
  },
  QRCodeModal: {
    // Step selection
    tableAddOption: 'Masa Ekleme Seçeneği',
    howToAddTables: 'Nasıl masa eklemek istiyorsunuz?',
    singleTable: 'Tek Masa Ekle',
    bulkTable: 'Toplu Masa Ekle',
    createSingleTable: 'Tek bir masa oluştur',
    createMultipleTables: 'Birden fazla masa oluştur',
    
    // Branch selection
    branchSelection: 'Şube Seçimi',
    selectBranch: 'Şube Seçin',
    branchRequired: 'Gerekli',
    loadingBranches: 'Şubeler yükleniyor...',
    
    // Single table form
    editTable: 'Masayı Düzenle',
    addSingleTable: 'Tek Masa Ekle',
    tableName: 'Masa Adı',
    tableNamePlaceholder: 'Örn: Masa 1',
    autoNameNote: 'Boş bırakılırsa otomatik isim verilir',
    tableCategory: 'Masa Kategorisi',
    selectCategory: 'Kategori Seçin',
    loadingCategories: 'Kategoriler yükleniyor...',
    noCategories: 'Kategori bulunamadı',
    capacity: 'Kapasite',
    capacityPlaceholder: 'Kişi sayısı',
    displayOrder: 'Görünüm Sırası',
    displayOrderPlaceholder: 'Sıralama için numara',
    autoOrderNote: 'Boş bırakılırsa otomatik sıralama yapılır',
    tableActive: 'Masa aktif olsun',
    
    // Bulk table form
    addBulkTables: 'Toplu Masa Ekle',
    categoryQuantities: 'Kategori Bazında Masa Miktarları',
    addCategory: 'Kategori Ekle',
    category: 'Kategori',
    tableCount: 'Masa Sayısı',
    allTablesActive: 'Tüm masalar aktif olsun',
    tableSummary: 'Oluşturulacak Masalar Özeti:',
    total: 'Toplam',
    tables: 'masa',
    
    // Actions
    cancel: 'İptal',
    adding: 'Ekleniyor...',
    addTable: 'Masa Ekle',
    update: 'Güncelle',
    updating: 'Güncelleniyor...',
    creating: 'Oluşturuluyor... ({count} masa)',
    createTables: '{count} Masa Oluştur',
    
    // Validation
    branchRequiredValidation: 'Şube seçimi gereklidir',
    categoryRequired: 'En az bir kategori gereklidir',
    
    accessibility: {
      modal: 'Masa oluşturma modalı',
      stepSelection: 'Masa oluşturma yöntemi seçimi',
      branchSelector: 'Şube seçimi dropdown',
      categorySelector: 'Masa kategorisi seçimi',
      tableForm: 'Masa oluşturma formu',
      bulkForm: 'Toplu masa oluşturma formu',
      backButton: 'Önceki adıma dön',
      closeButton: 'Modalı kapat'
    }
  },
  TableCategoryModal: {
    title: 'Masa Kategorisi Ekle',
    subtitle: 'Yeni masa kategorisi oluşturun',
    categoryName: 'Kategori Adı',
    categoryNamePlaceholder: 'Örn: VIP Masalar, Bahçe Masaları',
    description: 'Açıklama (Opsiyonel)',
    descriptionPlaceholder: 'Kategori hakkında kısa açıklama...',
    colorSelection: 'Renk Seçimi',
    customColor: 'Özel renk',
    iconSelection: 'Icon Seçimi',
    branchSelection: 'Şube Seçimi',
    cancel: 'İptal',
    addCategory: 'Kategori Ekle',
    saving: 'Kaydediliyor...',
    
    // Icons
    table: 'Masa',
    chair: 'Sandalye',
    service: 'Servis',
    label: 'Etiket',
    layer: 'Katman',
    
    // Validation errors
    categoryNameRequired: 'Kategori adı gereklidir',
    iconRequired: 'Bir icon seçmelisiniz',
    branchRequired: 'Şube seçimi gereklidir',
    invalidData: 'Geçersiz veri gönderildi',
    unauthorized: 'Yetkiniz bulunmuyor. Lütfen tekrar giriş yapın.',
    forbidden: 'Bu işlem için yetkiniz bulunmuyor.',
    branchNotFound: 'Seçilen şube bulunamadı.',
    serverError: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
    unexpectedError: 'Kategori eklenirken beklenmeyen bir hata oluştu',
    
    accessibility: {
      modal: 'Masa kategorisi oluşturma modalı',
      colorPalette: 'Renk seçimi paleti',
      colorPreset: 'Hazır renk seçeneği',
      customColorPicker: 'Özel renk seçici',
      iconGrid: 'Icon seçimi grid',
      iconOption: 'Icon seçeneği',
      branchDropdown: 'Şube seçimi dropdown',
      form: 'Kategori oluşturma formu'
    }
  },
  AddQRCodeCard: {
    title: 'Yeni Masa Ekle',
    subtitle: 'Yeni masa eklemek için tıklayın',
    accessibility: {
      addButton: 'Yeni masa ekle butonu',
      addCard: 'Yeni masa ekle kartı'
    }
  },
  userManagementPage: {
    // Page header and navigation
    title: 'Kullanıcı Yönetimi',
    loading: 'Yükleniyor...',
    error: {
      title: 'Hata',
      loadFailed: 'Kullanıcılar yüklenirken hata oluştu',
      rolesLoadFailed: 'Roller yüklenirken hata oluştu',
      retry: 'Tekrar Dene',
      createUserFailed: 'Kullanıcı oluşturulamadı',
      createRoleFailed: 'Rol oluşturulamadı'
    },

    // Statistics
    stats: {
      total: 'Toplam',
      active: 'Aktif',
      users: 'kullanıcı',
      roles: 'rol',
      system: 'Sistem',
      custom: 'Özel',
      totalUsers: 'Toplam Kullanıcı',
      owner: 'Sahip',
      manager: 'Müdür', 
      staff: 'Personel'
    },

    // Tabs
    tabs: {
      users: 'Kullanıcılar',
      roles: 'Roller'
    },

    // Controls and filters
    controls: {
      search: 'Kullanıcı, email veya telefon ara...',
      searchRoles: 'Rol, açıklama veya kategori ara...',
      filterAll: 'Tüm Kategoriler',
      filterOwner: 'Restoran Sahibi',
      filterManager: 'Şube Müdürü',
      filterStaff: 'Personel',
      filterActive: 'Aktif Kullanıcılar',
      filterInactive: 'Pasif Kullanıcılar',
      addUser: 'Kullanıcı Ekle',
      addRole: 'Rol Ekle'
    },

    // Table headers
    table: {
      user: 'Kullanıcı',
      contact: 'İletişim',
      roles: 'Roller',
      location: 'Restoran/Şube',
      status: 'Durum',
      registrationDate: 'Kayıt Tarihi',
      actions: 'İşlemler',
      role: 'Rol',
      description: 'Açıklama',
      statistics: 'İstatistikler',
      position: 'Konum'
    },

    // Status indicators
    status: {
      active: 'Aktif',
      inactive: 'Pasif',
      enabled: 'Etkin',
      disabled: 'Devre Dışı',
      systemRole: 'Sistem Rolü'
    },

    // Role types
    roleTypes: {
      RestaurantOwner: 'Sahip',
      BranchManager: 'Müdür',
      Staff: 'Personel'
    },

    // Actions menu
    actions: {
      viewDetails: 'Detayları Görüntüle',
      edit: 'Düzenle',
      activate: 'Aktifleştir',
      deactivate: 'Devre Dışı Bırak'
    },

    // No results messages
    noResults: {
      usersNotFound: 'Kullanıcı Bulunamadı',
      rolesNotFound: 'Rol Bulunamadı',
      usersEmpty: 'Henüz kullanıcı eklenmemiş.',
      rolesEmpty: 'Henüz rol eklenmemiş.',
      searchEmpty: 'Arama kriterlerinize uygun kullanıcı bulunamadı.',
      searchEmptyRoles: 'Arama kriterlerinize uygun rol bulunamadı.'
    },

    // Create Role Modal
    createRole: {
      title: 'Yeni Rol Oluştur',
      basicInfo: 'Temel Bilgiler',
      roleName: 'Rol Adı',
      roleNamePlaceholder: 'Örn: Şube Müdürü',
      category: 'Kategori',
      categoryPlaceholder: 'Örn: Yönetim',
      description: 'Açıklama',
      descriptionPlaceholder: 'Rolün görev ve sorumluluklarını açıklayın...',
      restaurantId: 'Restoran ID',
      restaurantIdPlaceholder: 'Varsayılan: Mevcut restoran',
      branchId: 'Şube ID',
      branchIdPlaceholder: 'Boş: Tüm şubeler',
      isActive: 'Rol aktif olsun',
      permissions: 'İzinler',
      permissionsSelected: 'seçildi',
      cancel: 'İptal',
      create: 'Rol Oluştur',
      creating: 'Oluşturuluyor...',
      validation: {
        nameRequired: 'Rol adı en az 3 karakter olmalıdır',
        nameMaxLength: 'Rol adı en fazla 50 karakter olabilir',
        descriptionMaxLength: 'Açıklama en fazla 200 karakter olabilir',
        categoryMaxLength: 'Kategori en fazla 50 karakter olabilir'
      }
    },

    // Create User Modal
    createUser: {
      title: 'Yeni Kullanıcı Oluştur',
      personalInfo: 'Kişisel Bilgiler',
      contactInfo: 'İletişim Bilgileri',
      passwordInfo: 'Şifre Bilgileri',
      locationInfo: 'Konum Bilgileri',
      roleAssignment: 'Yetki ve Rol Ataması',
      
      // Form fields
      firstName: 'Ad',
      firstNamePlaceholder: 'Örn: Ahmet',
      lastName: 'Soyad',
      lastNamePlaceholder: 'Örn: Yılmaz',
      userName: 'Kullanıcı Adı',
      userNamePlaceholder: 'Otomatik oluşturulacak',
      userNameHint: 'Boş bırakılırsa otomatik olarak ad.soyad formatında oluşturulacak',
      email: 'Email',
      emailPlaceholder: 'ahmet@example.com',
      phone: 'Telefon',
      phonePlaceholder: '+90 555 123 4567',
      password: 'Şifre',
      passwordPlaceholder: 'En az 6 karakter',
      passwordConfirm: 'Şifre Tekrarı',
      passwordConfirmPlaceholder: 'Şifrenizi tekrar giriniz',
      
      // Location
      locationType: 'Konum Türü',
      restaurant: 'Restoran',
      branch: 'Şube',
      restaurantId: 'Restoran ID',
      restaurantIdPlaceholder: 'Örn: 123',
      branchId: 'Şube ID',
      branchIdPlaceholder: 'Örn: 456',
      profileImage: 'Profil Resmi URL',
      profileImagePlaceholder: 'https://example.com/avatar.jpg',
      userCreatorId: 'Oluşturan Kullanıcı ID',
      userCreatorIdPlaceholder: 'Mevcut kullanıcı ID',
      
      // Role assignment
      assignmentType: 'Atama Türü',
      rolesSelection: 'Mevcut Rollerden Seçim (Önerilen)',
      permissionsSelection: 'Doğrudan İzin Seçimi (Şu anda desteklenmiyor)',
      apiWarning: '⚠️ API sadece rol tabanlı kullanıcı oluşturmayı destekliyor. Önce rol oluşturup, sonra kullanıcıya atayın.',
      rolesLabel: 'Roller',
      rolesSelected: 'seçildi',
      
      // No roles state
      noRoles: {
        title: 'Henüz rol tanımlanmamış',
        description: 'Kullanıcı oluşturmadan önce roller sekmesinden rol oluşturun',
        tip: '💡 İpucu: Önce "Roller" sekmesine geçerek gerekli rolleri oluşturun',
        warning: 'Rol Gerekli',
        warningDescription: 'Kullanıcı oluşturmak için en az bir rol tanımlanmalı. "Roller" sekmesinden yeni rol oluşturabilirsiniz.'
      },
      
      isActive: 'Kullanıcı aktif olsun',
      cancel: 'İptal',
      create: 'Kullanıcı Oluştur',
      creating: 'Oluşturuluyor...',
      createRoleFirst: 'Önce Rol Oluşturun',
      
      // Validation messages
      validation: {
        nameRequired: 'Ad alanı zorunludur',
        nameMaxLength: 'Ad en fazla 50 karakter olabilir',
        surnameRequired: 'Soyad alanı zorunludur',
        surnameMaxLength: 'Soyad en fazla 50 karakter olabilir',
        emailRequired: 'Email alanı zorunludur',
        emailInvalid: 'Geçerli bir email adresi giriniz',
        passwordRequired: 'Şifre en az 6 karakter olmalıdır',
        passwordMaxLength: 'Şifre en fazla 100 karakter olabilir',
        passwordConfirmRequired: 'Şifre tekrarı zorunludur',
        passwordMismatch: 'Şifreler eşleşmiyor',
        phoneRequired: 'Telefon numarası zorunludur',
        restaurantIdRequired: 'Geçerli bir restoran ID giriniz',
        branchIdRequired: 'Geçerli bir şube ID giriniz',
        rolesRequired: 'En az bir rol seçmelisiniz',
        permissionsNotSupported: 'API sadece rol tabanlı kullanıcı oluşturmayı destekliyor. Lütfen mevcut rollerden birini seçin.'
      }
    },

    // Role details
    roleDetails: {
      userCount: 'Kullanıcı Sayısı',
      permissionCount: 'İzin Sayısı',
      restaurant: 'Restoran',
      branch: 'Şube',
      noDescription: 'Açıklama bulunmuyor',
      users: 'kullanıcı',
      permissions: 'izin'
    },

    // Permission categories
    permissionCategories: {
      'User Management': 'Kullanıcı Yönetimi',
      'Restaurant Management': 'Restoran Yönetimi', 
      'Branch Management': 'Şube Yönetimi',
      'Order Management': 'Sipariş Yönetimi',
      'Product Management': 'Ürün Yönetimi',
      'Analytics': 'Analitik'
    },

    // Success messages
    success: {
      userCreated: 'Kullanıcı başarıyla oluşturuldu',
      roleCreated: 'Rol başarıyla oluşturuldu',
      userUpdated: 'Kullanıcı başarıyla güncellendi',
      roleUpdated: 'Rol başarıyla güncellendi'
    }
  },
  BranchtableManagement: {

  title: "Masa Yönetimi",
  subtitle: "Restoran masalarınızı ve kategorilerinizi yönetin",
  tabs: {
    tables: "Masalar",
    categories: "Kategoriler", 
    statistics: "İstatistikler",
    batchCreate: "Toplu Oluştur"
  },
  buttons: {
    addTable: "Masa Ekle",
    addCategory: "Kategori Ekle",
    batchCreate: "Toplu Oluştur",
    edit: "Düzenle",
    delete: "Sil",
    save: "Kaydet",
    cancel: "İptal",
    refresh: "Yenile",
    selectAll: "Tümünü Seç",
    clearSelection: "Seçimi Temizle",
    export: "Dışa Aktar",
    import: "İçe Aktar"
  },
  labels: {
    tableName: "Masa Adı",
    category: "Kategori",
    capacity: "Kapasite",
    status: "Durum",
    occupation: "Doluluk",
    displayOrder: "Görüntüleme Sırası",
    search: "Masalarda ara...",
    filterByCategory: "Kategoriye Göre Filtrele",
    viewMode: "Görünüm Modu",
    totalTables: "Toplam Masa",
    activeTables: "Aktif Masalar",
    occupiedTables: "Dolu Masalar", 
    availableTables: "Boş Masalar"
  },
  status: {
    active: "Aktif",
    inactive: "Pasif",
    occupied: "Dolu",
    available: "Boş",
    outOfService: "Hizmet Dışı"
  },
  actions: {
    markOccupied: "Dolu Olarak İşaretle",
    markAvailable: "Boş Olarak İşaretle", 
    activate: "Aktifleştir",
    deactivate: "Pasifleştir",
    viewDetails: "Detayları Görüntüle"
  },
  messages: {
    tableCreated: "Masa başarıyla oluşturuldu",
    tableUpdated: "Masa başarıyla güncellendi",
    tableDeleted: "Masa başarıyla silindi",
    statusUpdated: "Durum başarıyla güncellendi", 
    error: "Bir hata oluştu",
    noTables: "Masa bulunamadı",
    confirmDelete: "Bu masayı silmek istediğinizden emin misiniz?",
    loading: "Yükleniyor...",
    saving: "Kaydediliyor...",
    deleting: "Siliniyor..."
  },
  statistics: {
    title: "Masa İstatistikleri",
    occupancyRate: "Doluluk Oranı",
    averageCapacity: "Ortalama Kapasite",
    categoryBreakdown: "Kategori Dağılımı",
    dailyOccupancy: "Günlük Doluluk",
    peakHours: "Yoğun Saatler"
  },
  forms: {
    createTable: "Yeni Masa Oluştur",
    editTable: "Masayı Düzenle", 
    batchCreateTables: "Birden Fazla Masa Oluştur",
    quantity: "Miktar",
    namePrefix: "Ad Öneki",
    startingNumber: "Başlangıç Numarası"
  }
  },
  BranchTableManagement: {
  "clear Table": "Tablo temizleniyor",
  "refresh Table": "Durumu güncelle",
   "clearing": "Temizleniyor...",
             loading : "Yükleniyor...",
             category: "Kategori",
             SelectCategory: "Kategori Seçin",
             Quantity: "Miktar",
             Capacity: "Kapasite",
             createTables: "Tablolar Oluşturuluyor...",
             creatingTables: "Tablolar Oluşturuluyor...",
    multiCategory: "Farklı kategorilerde aynı anda birden fazla tablo oluşturun",
    batchCreateTables: "Toplu Tablo Oluştur",
    header: "Category & Table Management",
    subheader: "Manage restaurant categories and tables with accordion view",
    totalCategories: "Total Categories",
    totalTables: "Total Tables",
    occupiedTables: "Occupied Tables",
    availableTables: "Available Tables",
    searchPlaceholder: "Search categories...",
    refresh: "Refresh",
    addCategory: "Add Category",
    addCategoryTitle: "Add New Category",
    categoryNameLabel: "Category Name",
    categoryNamePlaceholder: "Enter category name",
    colorLabel: "Color",
    iconLabel: "Icon",
    save: "Save",
    cancel: "Cancel",
    noCategories: "No categories found",
    addFirstCategory: "Add Your First Category",
    tablesCount: "tables",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
    occupation: "Occupation",
    occupied: "Occupied",
    available: "Available",
    addTable: "Add Table",
    tableNamePlaceholder: "Table name",
    capacityPlaceholder: "Capacity",
    noTables: "No tables in this category",
    qrCodeTitle: "QR Code - {tableName}",
    qrCodeDescription: "Scan this QR code to access the table menu",
    downloadQR: "Download QR Code",
    downloading: "Downloading...",
    copyQRUrl: "Copy QR URL",
    copied: "Copied!",
    success: {
      "tableCleared": "{{tableName}} tablosu temizlendi ve artık kullanılabilir",
"tableOccupied": "{{tableName}} tablosunun durumu 'dolu' olarak güncellendi",
"tableClearedGeneric": "Tablo başarıyla temizlendi",
"tableStatusUpdated": "Tablo durumu başarıyla güncellendi",
      categoryAdded: "Category added successfully",
      categoryUpdated: "Category updated successfully",
      categoryDeleted: "Category deleted successfully",
      tableAdded: "Table added successfully",
      tableUpdated: "Table updated successfully",
      tableDeleted: "Table deleted successfully",
      categoryActivated: "Category activated successfully",
      categoryDeactivated: "Category deactivated successfully",
      tableActivated: "Table activated successfully",
      tableDeactivated: "Table deactivated successfully",
      tableAvailable: "Table marked as available",
      dataRefreshed: "Data refreshed successfully"
    },
    error: {
      "clearTableFailed": "Tablo temizlenemedi. Lütfen tekrar deneyin.",
      fetchCategoriesFailed: "Failed to fetch categories",
      fetchTablesFailed: "Failed to fetch tables",
      categoryNameRequired: "Category name is required",
      addCategoryFailed: "Failed to add category",
      updateCategoryFailed: "Failed to update category",
      deleteCategoryFailed: "Failed to delete category",
      categoryHasTables: "Cannot delete category with existing tables",
      categoryNotFound: "Category not found",
      addTableFailed: "Failed to add table",
      updateTableFailed: "Failed to update table",
      deleteTableFailed: "Failed to delete table",
      tableNameRequired: "Table name is required",
      tableNotFound: "Table not found",
      updateCategoryStatusFailed: "Failed to update category status",
      updateTableStatusFailed: "Failed to update table status",
      updateTableOccupationFailed: "Failed to update table occupation",
      refreshFailed: "Failed to refresh data"
    }
  },
  branchManagementBranch: {
    title: 'Şube Yönetimi',
    description: 'Şube bilgilerinizi ve ayarlarınızı yönetin.',
    loading: 'Şube bilgileri yükleniyor...',
    noBranchFound: 'Herhangi bir şube bulunamadı',
    uploadLogo: 'Logoyu Yükle',
    status: {
      open: 'Açık',
      closed: 'Kapalı',
      temporarilyClosed: 'Geçici Kapalı',
      reopenBranch: 'Şubeyi Aç',
      temporaryClose: 'Geçici Kapat'
    },
    
    actions: {
      edit: 'Düzenle',
      save: 'Kaydet',
      cancel: 'İptal',
      delete: 'Sil',
      deleting: 'Siliniyor...',
      confirmDelete: 'Silmeyi Onayla',
      deleteWarning: 'Bu şubeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    },
    
    basicInfo: {
      title: 'Temel Bilgiler',
      branchName: 'Şube Adı',
      whatsappNumber: 'WhatsApp Numarası',
      email: 'E-posta',
      notSpecified: 'Belirtilmemiş'
    },
    
    addressInfo: {
      title: 'Adres Bilgileri',
      country: 'Ülke',
      city: 'Şehir',
      street: 'Sokak',
      postalCode: 'Posta Kodu',
      region: 'Bölge'
    },
    
    workingHours: {
      title: 'Çalışma Saatleri',
      workingDay: 'Çalışma günü',
      openTime: 'Açılış Saati',
      closeTime: 'Kapanış Saati',
      noWorkingHours: 'Çalışma saatleri belirtilmemiş',
      days: {
        0: 'Pazar',
        1: 'Pazartesi',
        2: 'Salı',
        3: 'Çarşamba',
        4: 'Perşembe',
        5: 'Cuma',
        6: 'Cumartesi'
      }
    },
    
    messages: {
      updateSuccess: 'Şube bilgileri başarıyla güncellendi',
      deleteSuccess: 'Şube başarıyla silindi',
      temporaryCloseSuccess: 'Şube geçici olarak kapatıldı',
      reopenSuccess: 'Şube tekrar açıldı',
      updateError: 'Güncelleme sırasında hata oluştu',
      deleteError: 'Silme işlemi sırasında hata oluştu',
      statusChangeError: 'Durum değiştirme sırasında hata oluştu',
      loadError: 'Şube bilgileri yüklenirken hata oluştu'
    },
    
    placeholders: {
      branchName: 'Şube adını girin',
      whatsappNumber: 'WhatsApp numarasını girin',
      email: 'E-posta adresini girin',
      country: 'Ülke adını girin',
      city: 'Şehir adını girin',
      street: 'Sokak adını girin',
      postalCode: 'Posta kodunu girin',
      region: 'Bölge adını girin'
    }
  },
  branchCategories: {
    // Header and Stats
    header: 'Şube Kategori Yönetimi',
    subheader: '{branchId} Şubesi için kategorileri ve ürünleri yönet',
    lastUpdated: 'Son Güncelleme',
    
    stats: {
      availableCategories: 'Mevcut Kategoriler',
      readyToAdd: 'Eklemeye hazır',
      activeCategories: 'Aktif Kategoriler',
      currentlyInBranch: 'Şu anda şubede',
      selectedCategories: 'Seçilen Kategoriler',
      toBeAdded: 'Eklenecek',
      selectedProducts: 'Seçilen Ürünler',
      fromCategories: 'Kategorilerden',
      avalibleAddons: 'Mevcut Eklentiler',
    },

    // Tab Navigation
    tabs: {
      addNew: 'Yeni Ekle',
      manageExisting: 'Mevcut Olanları Yönet'
    },

    // Step Progress
    steps: {
      chooseCategories: 'Kategori Seç',
      selectProducts: 'Ürün Seç',
      reviewAdd: 'İncele ve Ekle',
      finalStep: 'Son adım',
      selected: 'seçili',
      back: 'Geri'
    },

    // Add New Categories
    addCategories: {
      title: 'Kategori Seç',
      subtitle: 'Şubenize eklemek istediğiniz kategorileri seçin',
      noAvailable: 'Mevcut kategori yok',
      allAdded: 'Mevcut tüm kategoriler bu şubeye eklenmiş',
      categoriesSelected: 'kategori seçildi',
      clearSelection: 'Seçimi Temizle',
      nextSelectProducts: 'Sonraki: Ürün Seç'
    },

    // Select Products
    selectProducts: {
      title: 'Ürün Seç',
      subtitle: 'Seçilen kategorilerden ürünleri seçin',
      selectAll: 'Tümünü Seç',
      clearAll: 'Tümünü Temizle',
      noProducts: 'Ürün bulunamadı',
      noProductsInCategories: 'Seçilen kategorilerde herhangi bir ürün yok',
      available: 'mevcut',
      productsSelectedFrom: 'ürün seçildi',
      categories: 'kategoriden',
      reviewSelection: 'Seçimi İncele'
    },

    // Review and Add
    review: {
      title: 'İncele ve Ekle',
      subtitle: 'Şubeye eklemeden önce seçiminizi inceleyin',
      of: '/',
      productsSelected: 'ürün seçildi',
      all: 'Tüm',
      productsWillBeAdded: 'ürün eklenecek',
      totalValue: 'Toplam değer',
      selectedProducts: 'Seçilen Ürünler',
      readyToAdd: 'Eklemeye hazır',
      with: 'ile',
      availableInBranch: 'Şubede Mevcut',
      startOver: 'Baştan Başla',
      adding: 'Ekleniyor...',
      addToBranch: 'Şubeye Ekle'
    },

    // Manage Existing
    manage: {
      title: 'Mevcut Kategorileri Yönet',
      subtitle: 'Şubenizdeki kategorileri ve ürünleri yönetin',
      saving: 'Kaydediliyor...',
      saveOrder: 'Sırayı Kaydet',
      exitReorder: 'Sıralamadan Çık',
      reorder: 'Yeniden Sırala',
      noCategoriesAdded: 'Hiç kategori eklenmemiş',
      noCategoriesAddedDesc: 'Bu şubeye henüz hiç kategori eklenmemiş',
      addCategories: 'Kategori Ekle',
      original: 'Orijinal:',
      added: 'eklendi',
      available: 'mevcut',
      total: 'Toplam',
      active: 'Aktif',
      inactive: 'Pasif',
      protected: 'Korumalı'
    },

    // Products Section
    products: {
      inCategory: 'Kategorideki Ürünler',
      added: 'Eklendi',
      available: 'Mevcut',
      ingredients: 'içerik',
      allergens: 'alerjen',
      viewDetails: 'Detayları Görüntüle',
      removeFromBranch: 'Şubeden Kaldır',
      addToBranch: 'Şubeye Ekle',
      addedToBranch: 'şubeye eklenen ürün',
      moreAvailableToAdd: 'daha eklenebilir',
      withDetailedInfo: 'detaylı bilgili',
      products: 'ürün'
    },

    // Product Details Modal
    productDetails: {
      addedToBranch: 'Şubeye Eklendi',
      allergens: 'Alerjenler',
      contains: 'İçerir',
      mayContain: 'İçerebilir',
      ingredients: 'İçerikler',
      allergenic: 'Alerjenik',
      available: 'Mevcut',
      unavailable: 'Mevcut Değil',
      quantity: 'Miktar:',
      ingredientId: 'İçerik ID:',
      allergenInformation: 'Alerjen Bilgisi:',
      additionalInformation: 'Ek Bilgiler',
      originalProduct: 'Orijinal Ürün',
      originalPrice: 'Orijinal Fiyat:',
      originalStatus: 'Orijinal Durum:',
      originalDisplayOrder: 'Orijinal Görüntü Sırası:',
      orderDetails: 'Sipariş Detayları',
      lastUpdated: 'Son Güncelleme:',
      close: 'Kapat'
    },

    // Common Actions
    actions: {
      refresh: 'Yenile',
      delete: 'Sil',
      edit: 'Düzenle',
      save: 'Kaydet',
      cancel: 'İptal',
      confirm: 'Onayla',
      loading: 'Yükleniyor...'
    },

    // Search and Filters
    search: {
      categories: 'Kategorilerde ara...',
      products: 'Ürünlerde ara...'
    },

    // Status
    status: {
      active: 'Aktif',
      inactive: 'Pasif',
      available: 'Mevcut',
      unavailable: 'Mevcut Değil'
    },

    // Messages
    messages: {
      success: {
        categoryAdded: 'Kategori başarıyla eklendi',
        categoryDeleted: 'Kategori başarıyla silindi',
        productAdded: '{name} ürünü başarıyla eklendi',
        productRemoved: '{name} ürünü başarıyla kaldırıldı',
        orderSaved: 'Kategori sırası başarıyla kaydedildi'
      },
      error: {
        cannotDelete: '"{name}" kategorisi {count} ürün içerdiği için silinemez. Lütfen önce tüm ürünleri kaldırın.',
        cannotDeleteTooltip: 'Silinemez: Kategori {count} ürün içeriyor. Önce tüm ürünleri kaldırın.',
        productNotFound: 'Ürün bulunamadı',
        addingProduct: 'Ürün eklenirken hata',
        removingProduct: 'Ürün kaldırılırken hata',
        savingOrder: 'Sıra kaydedilirken hata',
        loadingCategories: 'Kategoriler yüklenirken hata',
        loadingProducts: 'Ürünler yüklenirken hata'
      }
    },

    // Delete Modal
    deleteModal: {
      title: 'Kategoriyi Sil',
      message: '"{name}" kategorisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      confirm: 'Sil',
      cancel: 'İptal'
    },

    // Placeholders
    placeholders: {
      searchCategories: 'Kategorilerde ara...',
      searchProducts: 'Ürünlerde ara...'
    }
  },
 profile: {
      title: 'Profil',
      personalInfo: 'Kişisel Bilgiler',
      editProfile: 'Profili Düzenle',
      accountStatus: {
        active: 'Aktif Hesap',
        inactive: 'Pasif Hesap',
        status: 'Hesap Durumu'
      },
      fields: {
        firstName: 'Ad',
        lastName: 'Soyad',
        username: 'Kullanıcı Adı',
        email: 'E-posta',
        registrationDate: 'Kayıt Tarihi',
        restaurantName: 'Restoran Adı',
        status: 'Durum'
      },
      restaurant: {
        info: 'Restoran Bilgileri',
        name: 'Restoran Adı',
        status: {
          active: 'Aktif',
          inactive: 'Pasif'
        }
      },
      permissions: {
        summary: 'Yetki Özeti',
        totalCategories: 'Toplam Kategori',
        totalPermissions: 'Toplam İzin',
        rolesAndPermissions: 'Kategoriler ve İzinler',
        systemRole: 'Sistem Rolü'
      },
      categories: {
        'Category': 'Kategori Yönetimi',
        'BranchCategory': 'Şube Kategori Yönetimi',
        'Product': 'Ürün Yönetimi',
        'BranchProduct': 'Şube Ürün Yönetimi',
        'BranchQRCode': 'QR Kod Yönetimi',
        'Order': 'Sipariş Yönetimi',
        'Restaurant': 'Restoran Yönetimi',
        'Branch': 'Şube Yönetimi',
        'Admin': 'Yönetici İşlemleri'
      },
      permissionNames: {
        'category.create': 'Kategori Oluşturma',
        'category.delete': 'Kategori Silme',
        'category.update': 'Kategori Güncelleme',
        'category.read': 'Kategori Görüntüleme',
        'branch.category.create': 'Şube Kategorisi Oluşturma',
        'branch.category.delete': 'Şube Kategorisi Silme',
        'branch.category.update': 'Şube Kategorisi Güncelleme',
        'branch.category.read': 'Şube Kategorisi Görüntüleme',
        'product.create': 'Ürün Oluşturma',
        'product.delete': 'Ürün Silme',
        'product.update': 'Ürün Güncelleme',
        'product.read': 'Ürün Görüntüleme',
        'product.edit': 'Ürün Düzenleme',
        'branch.product.create': 'Şube Ürünü Oluşturma',
        'branch.product.delete': 'Şube Ürünü Silme',
        'branch.product.update': 'Şube Ürünü Güncelleme',
        'branch.product.read': 'Şube Ürünü Görüntüleme',
        'branch.qrcode.create': 'QR Kodu Oluşturma',
        'branch.qrcode.delete': 'QR Kodu Silme',
        'branch.qrcode.update': 'QR Kodu Güncelleme',
        'branch.qrcode.read': 'QR Kodu Görüntüleme',
        'order.create': 'Sipariş Oluşturma',
        'order.delete': 'Sipariş Silme',
        'order.update': 'Sipariş Güncelleme',
        'order.read': 'Sipariş Görüntüleme',
        'order.view': 'Sipariş Detay Görüntüleme',
        'order.cancel': 'Sipariş İptal Etme',
        'restaurant.create': 'Restoran Oluşturma',
        'restaurant.delete': 'Restoran Silme',
        'restaurant.update': 'Restoran Güncelleme',
        'restaurant.read': 'Restoran Görüntüleme',
        'restaurant.user.create': 'Restoran Kullanıcısı Oluşturma',
        'restaurant.user.delete': 'Restoran Kullanıcısı Silme',
        'restaurant.user.update': 'Restoran Kullanıcısı Güncelleme',
        'restaurant.user.read': 'Restoran Kullanıcısı Görüntüleme',
        'branch.create': 'Şube Oluşturma',
        'branch.delete': 'Şube Silme',
        'branch.update': 'Şube Güncelleme',
        'branch.read': 'Şube Görüntüleme',
        'branch.user.create': 'Şube Kullanıcısı Oluşturma',
        'branch.user.delete': 'Şube Kullanıcısı Silme',
        'branch.user.update': 'Şube Kullanıcısı Güncelleme',
        'branch.user.read': 'Şube Kullanıcısı Görüntüleme',
        'admin.api.control': 'API Kontrolü'
      },
      error: {
        loadFailed: 'Profil verisi alınamadı'
      }
    },
      addonModal: {
      title: 'Eklentileri Yapılandır',
      loading: 'Eklentiler yükleniyor...',
      refresh: 'Yenile',
      search: {
        placeholder: 'Eklentileri ad, açıklama veya kategoriye göre arayın...'
      },
      stats: {
        available: 'Mevcut',
        assigned: 'Atanmış',
        recommended: 'Önerilen'
      },
      sections: {
        assignedAddons: 'Atanmış Eklentiler',
        availableAddons: 'Mevcut Eklentiler'
      },
      emptyState: {
        title: 'Mevcut eklenti yok',
        description: 'Bu ürün için eklenti kombinasyonları tanımlamak için restoran yönetimiyle iletişime geçin',
        productId: 'Ürün ID:'
      },
      actions: {
        add: 'Ekle',
        remove: 'Kaldır',
        configure: 'Yapılandır',
        done: 'Tamam',
        saveChanges: 'Değişiklikleri Kaydet'
      },
      status: {
        assigned: 'ATANMIŞ',
        recommended: 'Önerilen'
      },
      configuration: {
        title: 'Yapılandırma Ayarları',
        specialPrice: 'Özel Fiyat',
        maxQuantity: 'Maksimum Miktar',
        minQuantity: 'Minumum Miktar',

        marketingText: 'Pazarlama Metni',
        markRecommended: 'Önerilen olarak işaretle',
        placeholders: {
          marketingText: 'örn., Popüler seçim, En iyi değer, Müşteri favorisi...'
        }
      },
      messages: {
        success: {
          addonAdded: 'Eklenti başarıyla eklendi',
          addonRemoved: 'Eklenti başarıyla kaldırıldı',
          addonUpdated: 'Eklenti başarıyla güncellendi'
        },
        errors: {
          loadFailed: 'Ürün eklentileri yüklenemedi',
          updateFailed: 'Eklenti ataması güncellenemedi',
          propertiesFailed: 'Eklenti özellikleri güncellenemedi'
        }
      },
      footer: {
        summary: 'of', // "5 of 10" -> "10 dan 5"
        addon: 'eklenti',
        addons: 'eklenti',
        assigned: 'atanmış'
      }
    },
     menu: {
      title: "Menü",
      loading: "Menü Yükleniyor",
      loadingSubtitle: "Lezzetli seçimlerimizi sizin için hazırlıyoruz...",
      error: {
        title: "Menü Mevcut Değil",
        tryAgain: "Tekrar Dene"
      },
      search: {
        placeholder: "Lezzetli yemekler ara..."
      },
      categories: "Kategoriler",
      ingredients: "Malzemeler",
      open: "Açık",
      closed: "Kapalı",
      chefsChoice: "Şef'in Önerisi",
      add: "Ekle",
      remove: "Kaldır",
      items: "öğe",
      item: "öğe",
      available: "mevcut",
      deliciousItems: "lezzetli",
      exploreMenu: "Menümüzü Keşfedin",
      noResults: "Sonuç bulunamadı",
      noResultsDesc: "Farklı anahtar kelimeler deneyin veya diğer kategorilere göz atın",
      noItemsCategory: "Bu kategoride öğe yok",
      noItemsCategoryDesc: "Lezzetli seçenekler için diğer kategorileri kontrol edin",
      selectCategory: "Özenle hazırlanmış mutfak tekliflerimizi keşfetmeye başlamak için bir kategori seçin",
      whyChooseUs: {
        title: "Neden Bizi Seçmelisiniz?",
        subtitle: "Kalite, tazelik ve olağanüstü hizmet taahhüdümüzle mutfak mükemmelliğini deneyimleyin",
        freshIngredients: {
          title: "Taze Malzemeler",
          description: "Yerel kaynaklı, premium kalite malzemeler günlük hazırlanır"
        },
        fastDelivery: {
          title: "Hızlı Teslimat",
          description: "Kapınıza hızlı ve güvenilir teslimat hizmeti"
        },
        qualityAssured: {
          title: "Kalite Garantisi",
          description: "Titiz kalite kontrol ve hijyen standartları"
        },
        expertChefs: {
          title: "Uzman Şefler",
          description: "Unutulmaz deneyimler yaratan deneyimli mutfak profesyonelleri"
        }
      },

      footer: {
        brand: "MenuHub",
        description: "Seçkin restoran ve lezzetli mutfak seçkimizle olağanüstü yemek deneyimleri keşfedin.",
        quickLinks: "Hızlı Bağlantılar",
        services: "Hizmetler",
        getInTouch: "İletişime Geçin",
        visitUs: "Bizi Ziyaret Edin",
        callUs: "Bizi Arayın",
        emailUs: "Bize Mail Gönderin",
        copyright: "Tüm hakları saklıdır.",
        privacyPolicy: "Gizlilik Politikası",
        termsOfService: "Hizmet Şartları",
        poweredBy: "Destekleyen",
        links: {
          ourMenu: "Menümüz",
          aboutUs: "Hakkımızda",
          locations: "Lokasyonlar",
          reservations: "Rezervasyonlar",
          specialOffers: "Özel Teklifler",
          giftCards: "Hediye Kartları"
        },
        services: {
          onlineOrdering: "Online Sipariş",
          tableBooking: "Masa Rezervasyonu",
          privateEvents: "Özel Etkinlikler",
          catering: "Catering",
          takeaway: "Paket Servis",
          corporateMeals: "Kurumsal Yemekler"
        }
      },
      cart: {
      title: 'Sepet',
      orderType: 'Sipariş Türü:',
      table: 'Masa:',
      notes: 'Notlar:',
      refresh: 'Yenile',
      refreshing: 'Yenileniyor...',
      remove: 'Kaldır',
      empty: 'Sepetiniz boş',
      newOrder: 'Yeni Sipariş',
      orders: 'Siparişler',
      placeOrder: "Sipariş Ver",
      emptyDesc: 'Sepetinize ürün ekleyerek başlayın',
      total: 'Toplam',
      proceed: 'Siparişe Geç',
      processing: 'İşleniyor...',
      clear: 'Sepeti Temizle',
      item: 'ürün',
      items: 'ürün',
      variant: 'varyant',
      variants: 'varyant',
      plain: 'Sade',
      customized: 'Özelleştirilmiş',
      addons: 'Ekstralar',
      variantTotal: 'Varyant Toplam',
      quantity: 'Miktar',
      each: 'adet',
      min: 'Min',
      max: 'Maks',
      qty: 'Adet',
      minQuantityError: '{name} için minimum miktar {min}',
      maxQuantityError: '{name} için maksimum miktar {max}',
      decreaseQuantity: 'Miktarı azalt',
      increaseQuantity: 'Miktarı artır'
      }
  },
  order: {
    form: {
      title: 'Sipariş Detayları',
      orderType: 'Sipariş Türü',
      orderTypeRequired: 'Sipariş türü gerekli',
      selectOrderType: 'Sipariş türünü seçin...',
      customerName: 'Müşteri Adı',
      customerNameRequired: 'Müşteri adı gerekli',
      customerNamePlaceholder: 'Müşteri adını girin',
      deliveryAddress: 'Teslimat Adresi',
      deliveryAddressRequired: 'Bu sipariş türü için teslimat adresi gerekli',
      deliveryAddressPlaceholder: 'Teslimat adresini girin',
      phoneNumber: 'Telefon Numarası',
      phoneNumberRequired: 'Bu sipariş türü için telefon numarası gerekli',
      phoneNumberPlaceholder: 'Telefon numarasını girin',
      specialInstructions: 'Özel Talimatlar',
      specialInstructionsPlaceholder: 'Siparişiniz için özel talimatlar...',
      orderSummary: 'Sipariş Özeti',
      subtotal: 'Ara Toplam',
      serviceCharge: 'Servis Ücreti',
      minimumRequired: 'Minimum gerekli',
      estimatedTime: 'Tahmini süre',
      minutes: 'dakika',
      backToCart: 'Sepete Geri Dön',
      createOrder: 'Sipariş Oluştur',
      creating: 'Oluşturuluyor...',
      loadingOrderTypes: 'Sipariş türleri yükleniyor...',
      noOrderTypes: 'Mevcut sipariş türü yok. Lütfen destek ile iletişime geçin.',
      minimumOrder: 'Minimum sipariş',
      service: 'servis',
      minimumOrderError: '{type} için minimum sipariş tutarı ${amount}. Mevcut toplam: ${current}'
    },
    validation: {
      fixErrors: 'Lütfen aşağıdaki hataları düzeltin:',
      customerNameRequired: 'Müşteri adı gerekli',
      orderTypeRequired: 'Lütfen bir sipariş türü seçin',
      addressRequired: 'Bu sipariş türü için teslimat adresi gerekli',
      phoneRequired: 'Bu sipariş türü için telefon numarası gerekli'
    }
  },
  priceChange: {
    title: 'Fiyat Değişiklikleri Tespit Edildi',
    description: 'Sepetinizdeki bazı ürünlerin fiyat değişiklikleri var ve siparişe devam etmeden önce onaylanması gerekiyor.',
    changesRequired: 'Gerekli Değişiklikler:',
    defaultMessage: 'Devam etmek için fiyat güncellemelerinin onaylanması gerekiyor.',
    cancel: 'İptal',
    confirm: 'Onayla ve Devam Et',
    confirming: 'Onaylanıyor...'
  },
    "productModal": {
      "customizeOrder": "Siparişinizi Özelleştirin",
      "allergenInformation": "Alerjen Bilgileri",
      "ingredients": "İçindekiler",
      "availableAddons": "Mevcut Ekstralar",
      "add": "Ekle",
      "recommended": "Önerilen",
      "min": "Minimum",
      "max": "Maksimum",
      "orderSummary": "Sipariş Özeti",
      "quantity": "Miktar",
      "total": "Toplam",
      "addToCart": "Sepete Ekle"
    },
  errors: {
    loadingBasket: 'Sepet yüklenemedi',
    loadingOrderTypes: 'Sipariş türleri yüklenemedi',
    removingItem: 'Ürün sepetten kaldırılamadı',
    increasingQuantity: 'Ürün miktarı artırılamadı',
    decreasingQuantity: 'Ürün miktarı azaltılamadı',
    increasingAddonQuantity: 'Ekstra miktarı artırılamadı',
    clearingBasket: 'Sepet temizlenemedi',
    creatingOrder: 'Sipariş oluşturulamadı',
    orderAlreadyProcessing: 'Bu sipariş zaten işleniyor',
    priceChangeDetails: 'Fiyat değişikliği detayları yüklenemedi',
    confirmingPriceChanges: 'Fiyat değişiklikleri onaylanamadı',
    sessionIdRequired: 'Fiyat değişikliği onayı için oturum kimliği gerekli',
    addonProductNotFound: 'Ekstra ürün kimliği bulunamadı',
    cartItemNotFound: 'Sepet ürünü bulunamadı'
    },
    "ordersManager": {
      total : 'Toplam',
      OrderType : 'Sipariş Türü',
      DeliveryAddress : 'Teslimat Adresi',
      OrderNotesInformation : 'Sipariş Notları & Bilgiler',
      OrderMetadata: 'Sipariş Meta Verisi',
      ItemCount : 'Ürün Sayısı',
      TotalItems: 'Toplam Ürünler',
      OrderTimeline: 'Sipariş Zaman Çizelgesi',
      "title": "Sipariş Yönetimi",
      "description": "Restoranınızın siparişlerini kolayca yönetin ve takip edin.",
      "pendingOrders": "Bekleyen Siparişler",
      "branchOrders": "Şube Siparişleri",
      "allStatuses": "Tüm Durumlar",
      "statusFilter": "Durum Filtresi",
      "noOrders": "Henüz {viewMode} sipariş yok.",
      "customer": "Müşteri",
      "orderNumber": "Sipariş No",
      "status": "Durum",
      "table": "Masa",
      "amount": "Tutar",
      "date": "Tarih",
      "actions": "İşlemler",
      "viewDetails": "Detayları Görüntüle",
      "confirm": "Onayla",
      "reject": "Reddet",
      "changeStatus": "Durum Değiştir",
      "orderItems": "Sipariş Ürünleri",
      "createdAt": "Oluşturulma",
      "confirmedAt": "Onaylanma",
      "rowVersion": "Row Version",
      "confirmOrderTitle": "Siparişi Onayla",
      "confirmOrderPrompt": "Bu siparişi onaylamak istediğinizden emin misiniz?",
      "rejectOrderTitle": "Siparişi Reddet",
      "rejectOrderPrompt": "Reddetme nedenini girin:",
      "rejectReasonPlaceholder": "Reddetme nedeni...",
      "updateStatusTitle": "Durumu Güncelle",
      "updateStatusPrompt": "Sipariş durumunu {status} olarak güncellemek istediğinizden emin misiniz?",
      "cancel": "İptal",
      "confirmAction": "Onayla",
      "rejectAction": "Reddet",
      "updateAction": "Güncelle",
      "confirming": "Onaylanıyor...",
      "rejecting": "Reddediliyor...",
      "updating": "Güncelleniyor...",
      "orderDetailsTitle": "Sipariş Detayları",
      "successNotification": "İşlem Başarılı",
      "orderConfirmedSuccess": "Sipariş başarıyla onaylandı!",
      "orderRejectedSuccess": "Sipariş başarıyla reddedildi!",
      "orderStatusUpdatedSuccess": "Sipariş durumu başarıyla güncellendi!",
      "errorInvalidStatusTransition": "Geçersiz durum geçişi: Lütfen önce siparişi onaylayın (Onaylandı durumuna geçin).",
      "errorCannotConfirm": "Bu sipariş onaylanamaz. Mevcut durum: {currentStatus}.",
      "quantity": "Miktar",
      "unitPrice": "Birim Fiyat",
      "addonPrice": "Ekstra Fiyat",
      "notes": "Not",
      "amountLabel": "Toplam Tutar"
    },
    "orderService": {
      "statuses": {
        "pending": "Bekliyor",
        "confirmed": "Onaylandı",
        "preparing": "Hazırlanıyor",
        "ready": "Hazır",
        "completed": "Tamamlandı",
        "delivered": "Teslim Edildi",
        "cancelled": "İptal Edildi",
        "rejected": "Reddedildi",
        "unknown": "Bilinmeyen"
      },
      "errors": {
        "createSessionOrder": "Session order oluşturulurken hata oluştu",
        "getPendingOrders": "Pending orders getirilirken hata oluştu",
        "getTableOrders": "Table orders getirilirken hata oluştu",
        "getOrder": "Order getirilirken hata oluştu",
        "getBranchOrders": "Branch orders getirilirken hata oluştu",
        "confirmOrder": "Order onaylanırken hata oluştu",
        "rejectOrder": "Order reddedilirken hata oluştu",
        "updateOrderStatus": "Order status güncellenirken hata oluştu",
        "trackOrder": "Order tracking getirilirken hata oluştu",
        "getOrderTrackingQR": "Order tracking QR getirilirken hata oluştu",
        "smartCreateOrder": "Smart order oluşturulurken hata oluştu",
        "getTableBasketSummary": "Table basket summary getirilirken hata oluştu",
        "validationError": "Doğrulama hatası: {errors}",
        "invalidRequest": "Geçersiz istek. Lütfen verileri kontrol edin.",
        "sessionExpired": "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.",
        "unauthorized": "Bu işlem için yetkiniz bulunmuyor.",
        "orderNotFound": "Sipariş bulunamadı.",
        "invalidStatus": "Sipariş durumu bu işleme uygun değil.",
        "noInternet": "İnternet bağlantınızı kontrol edin.",
        "unknownError": "Bilinmeyen hata",
        "getOrderTypeText": "Order type text getirme hatası",
        "getOrderType": "Order type getirme hatası",
        "getActiveOrderTypes": "Active order types getirme hatası",
        "getAllOrderTypes": "All order types getirme hatası",
        "orderTotalCalculation": "Order total calculation hatası",
        "getEstimatedTime": "Estimated time getirme hatası",
        "getOrderTypeByCode": "Order type by code getirme hatası",
        "getOrderTypesForDisplay": "Order types for display getirme hatası",
        "unknownOrderType": "Bilinmeyen Sipariş Türü"
      }
    },
     branchPreferences: {
    "title": "Şube Tercihleri",
    "description": "Şubeye özel ayarları ve tercihleri yapılandırın",
    "loading": "Şube tercihleri yükleniyor...",
    "saving": "Kaydediliyor...",
    "refresh": "Yenile",
    "saveChanges": "Değişiklikleri Kaydet",
    "saveSuccess": "Şube tercihleri başarıyla kaydedildi!",
    "cleanupModes": {
      "afterTimeout": "Zaman Aşımından Sonra",
      "afterClosing": "Kapatmadan Sonra",
      "disabled": "Devre Dışı"
    },
    "sections": {
      "orderManagement": {
        "title": "Sipariş Yönetimi",
        "description": "Siparişlerin nasıl işlendiğini ve yönetildiğini yapılandırın",
        "autoConfirmOrders": "Siparişleri Otomatik Onayla",
        "autoConfirmOrdersDesc": "Gelen siparişleri manuel onay olmadan otomatik olarak onaylayın",
        "useWhatsappForOrders": "Siparişler için WhatsApp",
        "useWhatsappForOrdersDesc": "Sipariş bildirimleri için WhatsApp entegrasyonunu etkinleştirin"
      },
      "displaySettings": {
        "title": "Görüntü Ayarları",
        "description": "Müşterilere hangi bilgilerin gösterileceğini yapılandırın",
        "showProductDescriptions": "Ürün Açıklamalarını Göster",
        "showProductDescriptionsDesc": "Müşterilere detaylı ürün açıklamalarını göster",
        "enableAllergenDisplay": "Alerjen Bilgilerini Göster",
        "enableAllergenDisplayDesc": "Alerjen uyarılarını ve bilgilerini göster",
        "enableIngredientDisplay": "İçerikleri Göster",
        "enableIngredientDisplayDesc": "Ürünler için içerik listelerini göster"
      },
      "paymentMethods": {
        "title": "Ödeme Yöntemleri",
        "description": "Kabul edilen ödeme yöntemlerini yapılandırın",
        "acceptCash": "Nakit Ödemeleri Kabul Et",
        "acceptCashDesc": "Müşterilerin nakit ile ödeme yapmalarına izin ver",
        "acceptCreditCard": "Kredi Kartlarını Kabul Et",
        "acceptCreditCardDesc": "Müşterilerin kredi/banka kartları ile ödeme yapmalarına izin ver",
        "acceptOnlinePayment": "Online Ödemeleri Kabul Et",
        "acceptOnlinePaymentDesc": "Müşterilerin dijital ödeme yöntemleri ile online ödeme yapmalarına izin ver"
      },
      "localization": {
        "title": "Yerelleştirme",
        "description": "Dil ve bölgesel ayarları yapılandırın",
        "defaultLanguage": "Varsayılan Dil",
        "defaultCurrency": "Varsayılan Para Birimi",
        "timeZone": "Saat Dilimi",
        "supportedLanguages": "Desteklenen Diller"
      },
      "sessionManagement": {
        "title": "Oturum Yönetimi",
        "description": "Oturum zaman aşımı ve temizleme ayarlarını yapılandırın",
        "sessionTimeout": "Oturum Zaman Aşımı (Dakika)",
        "cleanupMode": "Temizleme Modu",
        "cleanupDelay": "Kapanış Sonrası Temizleme Gecikmesi (Dakika)",
         "cleanupModeDesc": "Süresi dolan oturumların ne zaman temizleneceğini seçin",
    "sessionTimeoutDesc": "Hareketsizlik nedeniyle oturumun sona ermesinden önceki dakikalar",
    "cleanupDelayDesc": "Kapatmadan sonra temizlikten önce beklenecek dakikalar",
    "cleanupDisabledMessage": "Oturum temizliği devre dışı. Oturumlar otomatik olarak temizlenmeyecek."
      }
    },
    "currencies": {
      "TRY": "Türk Lirası (₺)",
      "USD": "Amerikan Doları ($)",
      "EUR": "Euro (€)"
    },
    "languages": {
      "tr": "Türkçe",
      "en": "İngilizce",
      "ar": "Arapça",
      "de": "Almanca", 
      "fr": "Fransızca",
      "ru": "Rusça",
      "es": "İspanyolca"
    },
    "timezones": {
      "Europe/Istanbul": "İstanbul (UTC+3)",
      "Europe/London": "Londra (UTC+0)",
      "America/New_York": "New York (UTC-5)"
    },
    "errors": {
      "loadFailed": "Şube tercihleri yüklenemedi",
      "saveFailed": "Şube tercihleri kaydedilemedi",
      "validationError": "Doğrulama hatası: {errors}",
      "invalidRequest": "Geçersiz istek. Lütfen verileri kontrol edin.",
      "sessionExpired": "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.",
      "unauthorized": "Bu işlem için yetkiniz bulunmuyor.",
      "notFound": "Şube tercihleri bulunamadı.",
      "conflict": "Veriler güncel değil. Sayfayı yenileyip tekrar deneyin.",
      "noInternet": "İnternet bağlantınızı kontrol edin.",
      "unknownError": "Bilinmeyen bir hata oluştu",
      "invalidPaymentSettings": "Geçersiz ödeme ayarları. En az bir ödeme yöntemi seçilmelidir.",
      "invalidSessionSettings": "Geçersiz oturum ayarları. Lütfen değerleri kontrol edin."
    }
    },
    whatsapp: {
  confirmation: {
    title: 'WhatsApp\'a Gönder?',
    subtitle: 'Restoranı WhatsApp ile bilgilendir',
    sendTo: 'Sipariş detaylarınız şuraya gönderilecek:',
    restaurant: 'Restoran',
    whatWillBeSent: 'Gönderilecek bilgiler:',
    orderDetails: '• Sipariş detayları ve ürünler',
    customerInfo: '• Müşteri adı ve masa numarası',
    totalPrice: '• Toplam fiyat ve özel notlar',
    timestamp: '• Sipariş zamanı',
    note: 'Not:',
    noteDescription: 'Bu işlem cihazınızda WhatsApp\'ı açacaktır. WhatsApp\'a göndermemeyi seçseniz bile siparişiniz işlenecektir.',
    skipWhatsApp: 'WhatsApp\'ı Atla',
    sendToWhatsApp: 'WhatsApp\'a Gönder',
    sending: 'Gönderiliyor...'
  }
}
}; 