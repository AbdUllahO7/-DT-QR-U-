
export const tr = {
  // Common
  common: {
    loading: 'Yükleniyor...',
    change: 'Değiştir',
    error: 'Hata',
    success: 'Başarılı',
     "emailAddress": "E-posta Adresi",
      "emailPlaceholder": "you@example.com",
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
    retry: 'Tekrar Dene',
    remove: 'Kaldır',
    dismiss: 'Kapat',
    download: 'İndir'
  },

  filter: {
      status: "Durum",
      all: "Tümü",
      active: "Aktif",
      inactive: "Pasif", 
      categories: "Kategoriler",
       allergenic:"alerjenik",
      nonallergenic:"alerjenik olmayan",
      specific:{
        allergens : "alerjenler"
      },
      price: {
        range: "Fiyat Aralığı",
        min: "Min Fiyat",
        max: "Max Fiyat"
      }
  },

  sort: {
      title: "Sırala",
      name: {
        asc: "İsim (A-Z)",
        desc: "İsim (Z-A)"
      },
      "status": {
      "label": "Durum",
      "asc": "Durum (A-Z)",
      "desc": "Durum (Z-A)"
    },
    "allergen": {
      "label": "Alerjen",
      "asc": "Alerjen (A-Z)",
      "desc": "Alerjen (Z-A)"
    },
      price: {
        asc: "Fiyat (Düşükten Yükseğe)",
        desc: "Fiyat (Yüksekten Düşüğe)"
      },
      order: {
        asc: "Görüntü Sırası (İlkten Sona)",
        desc: "Görüntü Sırası (Sondan İlke)"
      },
      created: {
        asc: "Oluşturulma Tarihi (En Eskiden)",
        desc: "Oluşturulma Tarihi (En Yeniden)"
      },

  },

  clear: {
      filters: "Filtreleri Temizle",
      all: "Tümünü Temizle"
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
  },
  mockup: {
    restaurantName: 'iDIGITEK',
    scanPrompt: 'Menümüzü görüntülemek için QR kodu tarayın',
    pizza: 'Margherita Pizza',
    salad: 'Sezar Salata',
    dessert: 'Tiramisu'
  }
},

  // Dashboard Navigation
  dashboard: {
    overview: {
      title: 'Genel Bakış',
      description: 'Restoranınızın finansal ve operasyonel durumunu görüntüleyin.',
      loading: 'Panel verileri yükleniyor...',
      refresh: 'Yenile',
      errorTitle: 'Panel verileri yüklenemedi',
      kpis: {
        totalViews: 'Toplam Görüntüleme',
        qrScans: 'QR Taramaları',
        totalOrders: 'Toplam Sipariş',
        customerRating: 'Müşteri Puanı',
        todaySales: 'Bugünkü Satışlar',
        currentBalance: 'Güncel Bakiye',
        weekRevenue: 'Haftalık Gelir',
        monthRevenue: 'Aylık Gelir',
        avgOrderValue: 'Ort. Sipariş Değeri',
        totalShifts: 'Toplam Vardiyalar',
        changeTexts: {
          lastWeek: 'Geçen Haftaya Göre',
          lastMonth: 'Geçen Aya Göre',
          thisWeek: 'Bu Hafta',
          today: 'Bugün'
        }
      },
      quickStats: {
        thisMonth: 'Bu Ay',
        totalOrders: 'Toplam Sipariş',
        average: 'Ortalama',
        dailyOrders: 'Günlük Siparişler',
        new: 'Yeni',
        customers: 'Müşteriler',
        rating: 'Puan',
        totalCount: 'Toplam Sayı',
        cashSales: 'Nakit Satış',
        cardSales: 'Kartlı Satış',
        status: 'Durum',
        open: 'Açık',
        closed: 'Kapalı'
      },
      charts: {
        weeklyActivity: 'Haftalık Aktivite',
        popularProducts: 'Popüler Ürünler',
        monthlyRevenue: 'Aylık Gelir',
        paymentMethods: 'Ödeme Yöntemleri',
        revenueComparison: 'Gelir Karşılaştırması',
        noData: 'Veri mevcut değil'
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
        confirmMessage: ' şubesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
      }
    },
    orders: {
      title: 'Siparişler',
      description: 'Siparişleri görüntüleyin ve yönetin.',
      loading: 'Siparişler yükleniyor...',
      refresh: 'Yenile',
      newOrder: 'Yeni Sipariş',
      selectBranch: "Şube Seç",
      selectBranchToView: "Görüntülenecek Şube Seç",
      noBranches: "Şube Yok",
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
    moneyCase : {
      title : "Para Kasası Yönetimi"
    },
    orderType: {
        requiresPhone: "Telefon Numarası Gerektirir",
        requiresName: "İsim Gerektirir",
        requiresTable: "Masa Seçimi Gerektirir",
        estimatedMinutes: "Tahmini Dakika",
        requiresAddress: "Adres Gerektirir",
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
    extras : {
      title : "Ekstralar",
    },
    tables: {
      title: 'Masa Yönetimi',
      description: 'Masa yönetimi işlemleri.',
      loading: 'Masalar yükleniyor...',
      selectBranch: 'Masa yönetimi için lütfen bir şube seçin',
      noCategories: 'Bu şubede henüz masa Alanı bulunmuyor',
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
      refresh:"Yenile",
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
     ResturantManagment : {
      title : "Restoran Yönetimi"
    },
    sidebar: {
       title : "QR Menü",
      logout: 'Çıkış Yap',
      branch: 'Şube',
      backToRestaurant: 'Restoran Paneline Geri Dön'
    },
    branchProducts: {
      title: 'Şube Ürünleri'
    },
    branchManagement: {
      title: 'Şube Yönetimi'
    },
    changePhoto: 'Değiştir'
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
      phone: '+90 531 732 47 31',
      email: 'services@idigitek.com',
      address: 'Istanbul , Kayaşehir'
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
          pricing: 'Fiyatlandırma',
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
          confirimEmail : "E-posta Onayla",
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
         email: 'example@email.com',
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
    monthlyEquivalent: 'Aylık {amount} (2 ay ücretsiz)'
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
    
          selectBranch: "Şube Seç",
      selectBranchToView: "Görüntülenecek Şube Seç",
      noBranches: "Şube Yok",
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
    addTable: 'Masa Ekle',
  ActiveStatus :"Aktif Durum", 
       selectBranch: "Şube Seç",
      selectBranchPrompt:"Şube Yok",
  descriptionActive : "Kategori etkin ve görünür", 
  descriptionInActive : "Kategori etkin değil ve gizli",
    loading: 'Masalar yükleniyor...',
    title: 'Masa Alan',
    description: 'QR kodlarınızı ve masalarınızı yönetin',
    noCategories :"Alan Bulunmadı",
    createFirstCategory: "Birinci Alan Oluştur",
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
      title: 'Alan Yönetimi',
      addCategory: 'Alan Ekle',
      editCategory: 'Alan Düzenle',
      deleteCategory: 'Alan Sil',
      categoryName: 'Alan Adı',
      tableCount: 'Masa Sayısı'
    },
    qrCodes: {
      title: 'QR Kodlar',
      tableNumber: 'Masa Numarası',
      category: 'Alan',
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
      inStock: 'Aktif',
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
      symbol: '',
      format: (value: { toLocaleString: (arg0: string) => any; }) => `${value.toLocaleString('tr-TR')}`
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
      delete: 'Sil',
      purge: 'Verileri Temizle'
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
        label: 'Şube Adı',
        placeholder: 'Şube adını girin'
      },
      whatsappNumber: {
        label: 'WhatsApp Sipariş Numarası',
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
        label: 'Posta Kodu ',
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
      addressLine1: 'Adres satırı  gereklidir',
      phone: 'Telefon numarası gereklidir',
      email: 'E-posta adresi gereklidir',
      location: 'Konum bilgisi gereklidir',
      branchModal: "Logo gerekli",
      addressLine2: "Ayrıntılı adres gerekli"
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
      description: ' şubesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
    },

    // Purge onayı (kalıcı silme)
    purgeConfirm: {
      title: 'Kalıcı Silme Uyarısı',
      description: 'Bu işlem şubeyi ve TÜM ilişkili verileri KALICI OLARAK silecektir. Bu işlem GERİ ALINAMAZ!'
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
      editTitle: 'Şube Düzenle ',
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
    addFirstCategoryTitle: 'İlk Kategoriyi Ekle',
    RecycleBin:"Geri Dönüşüm Kutusu"

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
      messageWithProducts: '"{categoryName}" kategorisinde {productCount} ürün bulunuyor. Bu kategoriyi silmek tüm ürünleri de silecektir. Devam etmek istediğinizden emin misiniz?',
      messageEmpty: '"{categoryName}" kategorisini silmek istediğinizden emin misiniz?',
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
    symbol: '',
    format: '{{amount}}'
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
      label: 'Fiyat ',
      placeholder: '0',
      required: 'Fiyat gereklidir',
      mustBePositive: 'Fiyat 0\'dan büyük olmalıdır',
      currency: ''
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
      deleteTableWarning: "Masayı silmeden önce bekleyen bir istek olmadığından emin olun.",
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
          label: 'Fiyat',
          placeholder: '0',
          required: 'Fiyat gereklidir',
          currency: ''
        },
        category: {
          label: 'Kategori',
          placeholder: 'Kategori seçin',
          required: 'Kategori seçimi gereklidir'
        },
        status: {
          label: 'Aktif ',
          description: 'Aktif olduğunda ürün menüde görünür',
          available: 'Aktif',
          unavailable: 'Aktif Değil'
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
    extras: 'Ekstralar',
    loadingExtras: 'Ekstralar yükleniyor...',
    editCategory: 'Kategoriyi düzenle',
    status : {
      active : "active",
      inactive : "inactive"
    },
    deleteCategory: 'Kategoriyi sil',
    editProduct: 'Ürünü Düzenle',
    deleteProduct: 'Ürünü Sil',
    manageAddons: 'Eklentileri Yönet',
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
    loadingExtras: 'Ekstralar yükleniyor...',
    extras: 'Ekstralar',
    noExtras: 'Ekstra eklenmedi',
    uncategorized: 'Kategorisiz',
    manageExtras: 'Ürün ekstralarını yönet',
    manageAddons: 'Eklentileri yönet',
    manageIngredients: 'Malzemeleri yönet',
    editProduct: 'Ürünü düzenle',
    deleteProduct: 'Ürünü sil',
    dragProduct: 'Ürün sırasını değiştirmek için sürükle',
    allergenic: 'Alerjen içerir',
    recommended: 'Önerilen',
    price: 'Fiyat',
    buttons: {
      view: 'Görüntüle',
      addons: 'Eklentiler',
      extras: 'Ekstralar',
      edit: 'Düzenle',
      delete: 'Sil',
      ingredients: 'Malzemeler',
      add: 'Ekle',
      remove: 'Kaldır'
    },
    errors: {
      loadingIngredients: 'Malzemeler yüklenirken bir hata oluştu.',
      loadingAddons: 'Eklentiler yüklenirken bir hata oluştu.',
      loadingExtras: 'Ekstralar yüklenirken bir hata oluştu.'
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
    availableForUse: 'Görünür',
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
      ingredientsTable: 'Malzeme yönetimi Masası',
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
    tableCategory: 'Masa Alanı',
    selectCategory: 'Alan Seçin',
    loadingCategories: 'Kategoriler yükleniyor...',
    noCategories: 'Alan bulunamadı',
    capacity: 'Kapasite',
    capacityPlaceholder: 'Kişi sayısı',
    displayOrder: 'Görünüm Sırası',
    displayOrderPlaceholder: 'Sıralama için numara',
    autoOrderNote: 'Boş bırakılırsa otomatik sıralama yapılır',
    tableActive: 'Masa aktif olsun',
    
    // Bulk table form
    addBulkTables: 'Toplu Masa Ekle',
    categoryQuantities: 'Alan Bazında Masa Miktarları',
    addCategory: 'Alan Ekle',
    category: 'Alan',
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
      categorySelector: 'Masa Alanı seçimi',
      tableForm: 'Masa oluşturma formu',
      bulkForm: 'Toplu masa oluşturma formu',
      backButton: 'Önceki adıma dön',
      closeButton: 'Modalı kapat'
    }
  },

  TableCategoryModal: {
    title: 'Masa Alan Ekle',
    subtitle: 'Yeni masa Alan oluşturun',
    categoryName: 'Alan Adı',
    categoryNamePlaceholder: 'Örn: VIP Masalar, Bahçe Masaları',
    description: 'Açıklama (Opsiyonel)',
    descriptionPlaceholder: 'Alan hakkında kısa açıklama...',
    colorSelection: 'Renk Seçimi',
    customColor: 'Özel renk',
    iconSelection: 'Icon Seçimi',
    branchSelection: 'Şube Seçimi',
    cancel: 'İptal',
    addCategory: 'Alan Ekle',
    saving: 'Kaydediliyor...',
    
    // Icons
    table: 'Masa',
    chair: 'Sandalye',
    service: 'Servis',
    label: 'Etiket',
    layer: 'Katman',
    
    // Validation errors
    categoryNameRequired: 'Alan adı gereklidir',
    iconRequired: 'Bir icon seçmelisiniz',
    branchRequired: 'Şube seçimi gereklidir',
    invalidData: 'Geçersiz veri gönderildi',
    unauthorized: 'Yetkiniz bulunmuyor. Lütfen tekrar giriş yapın.',
    forbidden: 'Bu işlem için yetkiniz bulunmuyor.',
    branchNotFound: 'Seçilen şube bulunamadı.',
    serverError: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
    unexpectedError: 'Alan eklenirken beklenmeyen bir hata oluştu',
    
    accessibility: {
      modal: 'Masa Alanı oluşturma modalı',
      colorPalette: 'Renk seçimi paleti',
      colorPreset: 'Hazır renk seçeneği',
      customColorPicker: 'Özel renk seçici',
      iconGrid: 'Icon seçimi grid',
      iconOption: 'Icon seçeneği',
      branchDropdown: 'Şube seçimi dropdown',
      form: 'Alan oluşturma formu'
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
   rolePermissionsModal:{
      title:"Görüntüleme izinleri",
      noPermissions:"İzin Yok"
    },
   editRole :{
      title:"Rol Güncellemesi",
      save:"kaydet"
    },
  confirmation: {
    activateTitle: "Kullanıcıyı Etkinleştir",
    activateMessage: "{name} adlı kullanıcıyı etkinleştirmek istediğinizden emin misiniz?",
    deleteRoleTitle: "Rolü Sil",
    deleteRoleMessage: "Bu rolü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
    deactivateTitle:"Kullanıcıyı Devre Dışı Bırak?",
    deactivateMessage:"{name} adlı kullanıcıyı devre dışı bırakmak istediğinizden emin misiniz? Sisteme erişimini kaybedecek."

      },

    title: 'Kullanıcı Yönetimi',
    loading: 'Yükleniyor...',
    error: {
      title: 'Hata',
      loadFailed: 'Kullanıcılar yüklenirken hata oluştu',
      rolesLoadFailed: 'Roller yüklenirken hata oluştu',
      retry: 'Tekrar Dene',
      createUserFailed: 'Kullanıcı oluşturulamadı',
      createRoleFailed: 'Rol oluşturulamadı',
       "changePasswordFailed": "Şifre değiştirilemedi",
      "assignBranchFailed": "Şube ataması başarısız"
    },
     "changePasswordModal": {
      "title": "Şifre Değiştir",
      "info": "Bu kullanıcı için yeni bir şifre girin. Yeni şifre ile hemen giriş yapabilecektir.",
      "newPassword": "Yeni Şifre",
      currentPassword: "Mevcut şifre", 
      currentPasswordPlaceholder: "Mevcut şifreyi girin",
      currentPasswordEntered:"Mevcut şifre",
      "newPasswordPlaceholder": "Yeni şifre girin",
      "confirmPassword": "Şifre Onayı",
      "confirmPasswordPlaceholder": "Yeni şifreyi onaylayın",
      "requirements": "Şifre Gereksinimleri:",
      "minLength": "En az 6 karakter",
      "passwordsMatch": "Şifreler eşleşiyor",
      "submit": "Şifreyi Değiştir",
      "cancel": "İptal",
      "changing": "Değiştiriliyor...",
      "validation": {
        "passwordRequired": "Şifre gereklidir",
        "passwordMinLength": "Şifre en az 6 karakter olmalıdır",
        "confirmPasswordRequired": "Lütfen şifreyi onaylayın",
        "passwordMismatch": "Şifreler eşleşmiyor"
      }
    },
  "assignBranchModal": {
  "title": "Şube Ata",
  "assigningTo": "Atanan Kişi",
  "selectDestinationType": "Kapsam Türünü Seçin",
  "toNewBranch": "yeni bir şubeye",
  "currentBranch": "Mevcut Şube",
  "assignedToRestaurant": "Restoran Seviyesi (Merkez)",
  "alreadyAtRestaurant": "Zaten Merkezde",
  "groupBranches": "Şubeye Ata",
  "assignToRestaurant": "Restorana Ata",
  "selectBranch": "Şube Seçin",
  "selectBranchPlaceholder": "Bir şube seçin",
  "confirmRestaurantTitle": "Restoran Atamasını Onayla",
  "confirmRestaurantDesc": "{{name}} mevcut şubesinden çıkarılacak ve Restoran seviyesine atanacaktır.",
  "submitButton": "Ata",
  "submitButtonLoading": "Atanıyor...",
  "validation": {
    "branchRequired": "Lütfen bir şube seçin"
  }
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
      deactivate: 'Devre Dışı Bırak',
      delete: 'Sil',
      updateRoles: 'Rolleri Güncelle',
      assignBranch: 'Şube Ata',
      viewPermissions:"İzinleri Görüntüle",
       "changePassword": "Şifre Değiştir",
    },

    updateRoles:{
      title:"Kullanıcı Rollerini Güncelle",
      update : "Güncelleme",
    },


    
   permissionsModal:{
      title:"İzinler",
      close:"Kapat",
      userRoles: "Kullanıcı Rolleri", 
      permissions:"İzinler",
      permissionsCount:"Sayı",
      noPermissions :"Izin Yok"
    },

    "editUserModal": {
      "title": "Kullanıcıyı Düzenle",
      "firstNameLabel": "Ad",
      "lastNameLabel": "Soyad",
      "emailLabel": "E-posta",
      "usernameLabel": "Kullanıcı Adı",
      "isActiveLabel": "Kullanıcı Aktif",
      "saveButton": "Değişiklikleri Kaydet",
      "saveButtonLoading": "Kaydediliyor...",
      "validation": {
        "firstNameRequired": "Ad alanı zorunludur",
        "lastNameRequired": "Soyad alanı zorunludur",
        "emailRequired": "E-posta alanı zorunludur",
        "usernameRequired": "Kullanıcı adı zorunludur"
      }
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


      systemRoleInfo: 'Sistem rolleri önceden tanımlanmıştır ve değiştirilemez.',

    // Create Role Modal
    createRole: {
      title: 'Yeni Rol Oluştur',
      stepBasicInfo: 'Temel Bilgiler',
      stepPermissions:"İzinler",
      deselectAll:"Seçimi Kaldır",
      selectBranch: 'Şube Seçimi',
      permissionsRequired: "* En az bir izin gereklidir",
      step1Info: "Rol Oluştur",
      clear:"Seçimi Kaldır",
      step1Description: "Yeni rol için temel bilgileri girin",
      continue: "İzinlere Devam Et",
      branch: 'Şube',
      selectAll: 'Tüm Roller',
      noBranch: 'Şube Yok',
      finish: "Bitir",
      creating: "Oluşturuluyor...",
      saving: "Kaydediliyor...",
      step2Info: "Kullanıcı izinlerini seçin",
      step2Description: "Artık bu rol için izinleri tanımlayabilirsiniz.",
      branchHint: 'Bu rolü belirli bir şubeye atayın veya tüm şubelerde geçerli olsun',
      roleName: 'Rol Adı',
      back:"Dön",
        skipPermissions: "Atla (Daha Sonra Ekle)",
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
      selectBranch: 'Şube Seçimi',
      passwordInfo: 'Şifre Bilgileri',
      locationInfo: 'Konum Bilgileri',
      roleAssignment: 'Yetki ve Rol Ataması',
      fullNumber:"Telefon numarası",
        phoneNumber: 'Telefon Numarası',
      confirmPassword: 'Şifreyi Onayla',
      location: 'Konum',
      roles: 'Roller',
      userIsActive: 'Kullanıcı Aktif',
      
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
      systemRoleInfo: 'Sistem rolleri önceden tanımlanmıştır ve değiştirilemez.',
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
      created: "Oluşturulma Tarihi",
      system: "Sistem Rolü",
      branch: 'Şube',
      noDescription: 'Açıklama bulunmuyor',
      users: 'kullanıcı',
      permissions: 'izin',
            branchSpecific: 'Şube Spesifik',

    },

    // Permission categories
    permissionCategories: {
      UserManagement: 'Kullanıcı Yönetimi',
      RestaurantManagement: 'Restoran Yönetimi', 
      BranchManagement: 'Şube Yönetimi',
      OrderManagement: 'Sipariş Yönetimi',
      ProductManagement: 'Ürün Yönetimi',
      Analytics: 'Analitik'
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
    tableNameLabel: "Masa Adı",
    capacityLabel: "Kapasite",
    clearTable: "Masayı Boşalt", // Changed from "Masayı temizleniyor" to imperative action
    refreshTable: "Masayı Güncelle",
    clearin: "Temizleniyor...",
    loading: "Yükleniyor...",
    category: "Bölge",
    SelectCategory: "Bölge Seçin",
    Quantity: "Miktar",
    Capacity: "Kapasite",
    createTables: "Masalar Oluşturuluyor...",
    creatingTables: "Masalar Oluşturuluyor...",
    multiCategory: "Farklı bölgelerde aynı anda birden fazla masa oluşturun",
    batchCreateTables: "Toplu Masa Oluştur",
    header: "Bölge ve Masa Yönetimi",
    subheader: "Restoran bölgelerini ve masalarını akordiyon görünümüyle yönetin",
    totalCategories: "Toplam Bölge",
    totalTables: "Toplam Masa",
    occupiedTables: "Dolu Masalar",
    availableTables: "Boş Masalar",
    searchPlaceholder: "Bölge ara...",
    refresh: "Yenile",
    addCategory: "Bölge Ekle",
    addCategoryTitle: "Yeni Bölge Ekle",
    categoryNameLabel: "Bölge Adı",
    categoryNamePlaceholder: "Bölge adını girin",
    colorLabel: "Renk",
    iconLabel: "İkon",
    save: "Kaydet",
    cancel: "İptal",
    edit: "Düzenle",
    delete: "Sil",
    qrCode: "QR Kod",
    showQRCode: "QR Kodunu Göster",
    noCategories: "Bölge bulunamadı",
    addFirstCategory: "İlk bölgeyi ekle",
    tablesCount: "masa",
    status: "Durum",
    active: "Aktif",
    inactive: "Pasif",
    occupation: "Doluluk",
    occupied: "Dolu",
    available: "Boş",
    addTable: "Masa Ekle",
    tableNamePlaceholder: "Masa adı",
    capacityPlaceholder: "Kapasite",
    noTables: "Bu bölgede masa yok",
    qrCodeTitle: "QR Kod - {tableName}",
    qrCodeDescription: "Masa menüsüne erişmek için bu QR kodu taratın",
    downloadQR: "QR Kodunu İndir",
    downloading: "İndiriliyor...",
    copyQRUrl: "QR Linkini Kopyala",
    copied: "Kopyalandı!",
    success: {
      tableCleared: "{{tableName}} masası temizlendi ve kullanıma hazır",
      tableOccupied: "{{tableName}} masası 'dolu' olarak güncellendi",
      tableClearedGeneric: "Masa başarıyla temizlendi",
      tableStatusUpdated: "Masa durumu başarıyla güncellendi",
      categoryAdded: "Bölge başarıyla eklendi",
      categoryUpdated: "Bölge başarıyla güncellendi",
      categoryDeleted: "Bölge başarıyla silindi",
      tableAdded: "Masa başarıyla eklendi",
      tableUpdated: "Masa başarıyla güncellendi",
      tableDeleted: "Masa başarıyla silindi",
      categoryActivated: "Bölge başarıyla aktifleştirildi",
      categoryDeactivated: "Bölge başarıyla pasife alındı",
      tableActivated: "Masa başarıyla aktifleştirildi",
      tableDeactivated: "Masa başarıyla pasife alındı",
      tableAvailable: "Masa 'boş' olarak işaretlendi",
      dataRefreshed: "Veriler başarıyla yenilendi"
    },
    error: {
      clearTableFailed: "Masa temizlenemedi. Lütfen tekrar deneyin.",
      fetchCategoriesFailed: "Bölgeler getirilemedi",
      fetchTablesFailed: "Masalar getirilemedi",
      categoryNameRequired: "Bölge adı zorunludur",
      createCategoryFirst: "Lütfen önce bir bölge oluşturun",
      addCategoryFailed: "Bölge eklenemedi",
      updateCategoryFailed: "Bölge güncellenemedi",
      deleteCategoryFailed: "Bölge silinemedi",
      categoryHasTables: "Mevcut masaları olan bir bölge silinemez",
      categoryNotFound: "Bölge bulunamadı",
      addTableFailed: "Masa eklenemedi",
      updateTableFailed: "Masa güncellenemedi",
      deleteTableFailed: "Masa silinemedi",
      tableNameRequired: "Masa adı zorunludur",
      tableNotFound: "Masa bulunamadı",
      updateCategoryStatusFailed: "Bölge durumu güncellenemedi",
      updateTableStatusFailed: "Masa durumu güncellenemedi",
      updateTableOccupationFailed: "Masa doluluk durumu güncellenemedi",
      refreshFailed: "Veri yenileme başarısız oldu"
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
      onlineMenu: 'Çevrimiçi Menüye Git'
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
    header: 'Şube Kategori Yönetimi',
    subheader: ' Şubesi için kategorileri ve ürünleri yönet',
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
      selected: 'seçildi',
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
      products: 'ürün',
      activate: 'Ürünü Aktifleştir',
      deactivate: 'Ürünü Devre Dışı Bırak',
      markInStock: 'Stokta Olarak İşaretle',
      markOutOfStock: 'Stokta Yok Olarak İşaretle',
      configureAddons: 'Ek Seçenekleri Yapılandır',
      manageExtras: 'Ekstraları Yönet'
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
      inactive: 'Devre Dışı',
      available: 'Mevcut',
      unavailable: 'Mevcut Değil'
    },
     stock : {
      inStock: 'Aktif',
      outOfStock: 'Stokta Yok'
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
      title: 'Alan Sil',
      message: '"{name}" Alanısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
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
        Category: 'Kategori Yönetimi',
        BranchCategory: 'Şube Kategori Yönetimi',
        Product: 'Ürün Yönetimi',
        BranchProduct: 'Şube Ürün Yönetimi',
        BranchQRCode: 'QR Kod Yönetimi',
        Order: 'Sipariş Yönetimi',
        Restaurant: 'Restoran Yönetimi',
        Branch: 'Şube Yönetimi',
        Admin: 'Yönetici İşlemleri'
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
      basePrice: "Temel Fiyat",
      availableExtras: "Mevcut Ekstralar",
      loading: "Menü Yükleniyor",
      allergens: "Alerjen Bilgisi",
      noCategories: "Liste yok",
      customizations: "Özelleştirmeler",
      no: "Hayır",
      quantity: "Miktar",
      extras: "Ekstralar",
      required: "Gerekli",
      addons: "Eklentiler",
      product: "Ürün",
      addToBasket: "Sepete Ekle",
      addToOrder: "Siparişe Ekle",
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
    "title": "Sepet",
    "order_can_be_updated": "Sipariş güncellenebilir",
    "time_remaining": "Kalan süre",
    "modified_times": "{{count}} kez değiştirildi",
    "error": "Hata",
    "price_change_title": "Fiyat değişikliği",
    "cancel_reason_prompt_title": "İptal Nedeni",
    "reason": "İptal Nedeni",
    "submit": "Gönder",
    "confirm": "Onayla",
    removal_item_toggle: "Bu öğeyi siparişten kaldır",
    "confirm_cancel_title": "Yazdığınız sebep restorana iletilecektir",
    "cancel_order_confirm": "Siparişi iptal etmek istediğinizden emin misiniz?",
    "order_cancelled_success": "Siparişiniz Başarıyla İptal edildi",
    "cancel": "Reddet",
    "success": "Başarılı",
    "edit_order": "Siparişi düzenle",
    "edit_order_items": "Sipariş Öğelerini Düzenle",
    "update_reason": "Güncelleme Nedeni",
    "update_reason_placeholder": "Bu siparişi neden güncelliyorsunuz?",
    "update_reason_required": "Lütfen güncelleme için bir neden belirtin",
    "no_changes_detected": "Değişiklik algılanmadı. Lütfen güncellemeden önce öğeleri değiştirin.",
    "characters": "karakter",
    "updating": "Güncelleniyor...",
    "update_order": "Siparişi Güncelle",
    "was": "önceden",
    "add_note": "Not ekle...",
    "marked_for_deletion": "Silinmek üzere işaretlendi",
    "restore_item": "Öğeyi geri yükle",
    "delete_item": "Öğeyi sil",
    "order_updated_success": "Sipariş başarıyla güncellendi!",
    "order_update_failed": "Sipariş güncellenemedi",
    "price_change_confirm": "Siparişi verdiğinizden beri bazı fiyatlar değişti. Güncellemeye devam etmek istiyor musunuz?",
    "cancel_order": "Siparişi İptal Et",
    "orderType": "Sipariş Türü:",
    "table": "Masa:",
    "notes": "Notlar:",
    "refresh": "Yenile",
    "refreshing": "Yenileniyor...",
    "remove": "Kaldır",
    "empty": "Sepetiniz boş",
    "newOrder": "Yeni Sipariş",
    "orders": "Siparişler",
    "placeOrder": "Sipariş Ver",
    "emptyDesc": "Sepetinize ürün ekleyerek başlayın",
    "total": "Toplam",
    "proceed": "Siparişe Geç",
    "processing": "İşleniyor...",
    "clear": "Sepeti Temizle",
    "item": "ürün",
    "items": "ürün",
    "variant": "varyant",
    "variants": "varyant",
    "plain": "Sade",
    "customized": "Özelleştirilmiş",
    "addons": "Ekstralar",
    "variantTotal": "Varyant Toplam",
    "quantity": "Miktar",
    "each": "adet",
    "min": "Min",
    "max": "Maks",
    "qty": "Adet",
    "minQuantityError": "{name} için minimum miktar {min}",
    "maxQuantityError": "{name} için maksimum miktar {max}",
    "decreaseQuantity": "Miktarı azalt",
    "increaseQuantity": "Miktarı artır",
    "creating_order": "Sipariş oluşturuluyor...",
    "order_created_success": "Sipariş başarıyla oluşturuldu!",
    "order_creation_failed": "Sipariş oluşturulamadı. Lütfen tekrar deneyin.",
    "sending_whatsapp": "WhatsApp mesajı gönderiliyor...",
    "whatsapp_sent_success": "WhatsApp mesajı başarıyla gönderildi!",
    "whatsapp_send_failed": "WhatsApp mesajı gönderilemedi",
    "clearing_basket": "Sepet temizleniyor...",
    "basket_cleared": "Sepet başarıyla temizlendi!",
    "clear_basket_failed": "Sepet temizlenemedi",
    "load_order_types_failed": "Sipariş türleri yüklenemedi",
    "confirming_price_changes": "Fiyat değişiklikleri onaylanıyor...",
    "price_changes_confirmed": "Fiyat değişiklikleri başarıyla onaylandı!",
    "price_changes_failed": "Fiyat değişiklikleri onaylanamadı",
    "session_required": "Oturum kimliği gerekli",
    "extras": "Seçenekler",
    "without": "Çıkarılan",
    "extra": "Ekstra",
    "add": "Ekle",
    "edit": "Düzenle",
    "cancel_edit": "İptal",
    "restore": "Geri Yükle",
    "delete": "Sil",
    "duplicate": "Çoğalt"
  },
  },

  order: {
    form: {
      title: 'Sipariş Detayları',
      orderType: 'Sipariş Türü',
      pleaseFillRequiredFields:"Lütfen Gerekli Alanları Doldurun",
      tableNumberRequired:"Masa numarası zorunlu",
      paymentMethod: 'Ödeme Yöntemi',
      name: 'İsim',
      tableNumber:"Masa Numrası",
      tableNumberPlaceholder:"Masa numarası burada giriniz...",
      address: 'Adres',
      phone: 'Telefon',
      specialInstructions: 'Özel Talimatlar',
      paymentMethods: 'Ödeme Yöntemleri',
      
      cashDescription: 'Nakit ödeme teslimatta yapılacak',
      creditCardDescription: 'Kredi kartı ile çevrimiçi ödeme',
      onlinePaymentDescription: 'Çevrimiçi ödeme portalı üzerinden ödeme',
      otherDescription: 'Diğer ödeme yöntemleri hakkında restoranla iletişime geçin',
      paymentMethodRequired: 'Ödeme yöntemi gerekli',
      selectPaymentMethod: 'Ödeme Yöntemini seçin...',
      cash: 'Nakit',
      creditCard: 'Kredi Kartı',
      onlinePayment: 'Online Ödeme',
      other: 'Diğer',
      information: 'Bilgi',
      orderTypeRequired: 'Sipariş türü gerekli',
      selectOrderType: 'Sipariş türünü seçin...',
      orderInformation: 'Sipariş Bilgileri',
      customerName: 'Müşteri Adı',
      customerNameRequired: 'Müşteri adı gerekli',
      customerNamePlaceholder: 'Müşteri adını girin',
      deliveryAddress: 'Teslimat Adresi',
      deliveryAddressRequired: 'Bu sipariş türü için teslimat adresi gerekli',
      deliveryAddressPlaceholder: 'Teslimat adresini girin',
      phoneNumber: 'Telefon Numarası',
      phoneNumberRequired: 'Bu sipariş türü için telefon numarası gerekli',
      phoneNumberPlaceholder: 'Telefon numarasını girin',
      specialInstructionsPlaceholder: 'Siparişiniz için özel talimatlar...',
      orderSummary: 'Sipariş Özeti',
      notes: "Sipariş Notları",
      notesPlaceholder: "Özel bir isteğiniz var mı? (Örneğin soğan yok)",
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
  
productModal: {
    "customizeOrder": "Siparişinizi Özelleştirin",
    "allergenInformation": "Alerjen Bilgileri",
    "ingredients": "İçindekiler",
    "availableAddons": "Mevcut Ekstralar",
    "add": "Ekle",
    "recommended": "Önerilen",
    "min": "Min",
    "max": "Maks",
    "orderSummary": "Sipariş Özeti",
    "quantity": "Miktar",
    "total": "Toplam",
    "addToCart": "Sepete Ekle",
    "addons": "Ekstralar",
    "extras": "Seçenekler",
    "required": "Zorunlu",
    "selected": "seçildi",
    "select": "Seç",
    "minSelect": "Min",
    "maxSelect": "Maks",
    "qty": "Adet",
    "removal": "Çıkarma",
    "remove": "Çıkar",
    "removed": "Çıkarıldı",
    "categoryRequired": "{{name}} zorunludur",
    "minSelectionError": "{{name}} için en az {{min}} seçim yapın",
    "maxSelectionError": "{{name}} için en fazla {{max}} seçim yapılabilir",
    "extraRequired": "{{name}} seçimi zorunludur"
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

  ordersManager: {
      total : 'Toplam',
      updateAction:"Güncele",
      subTotal:"Ara Toplam",
      modificationHistory:"değişiklik Geçmişi",
      showing:"Gösteriliyor",
      lastModifiedAt:"Son Değiştirilme Tarihi",
      modifiedBy:"Değiştiren",
      modificationDetails:"DeğişiklikAyrıntıları",
      items:"öğeler",
      loadingOrders:"Siparişler Yükleniyor...",
      filtered:"Filtrelenen",
      clearFilters:"Filtreleri Temizle",
      serviceFeeApplied:"Servis ücreti",
      OrderType : 'Sipariş Türü',
      DeliveryAddress : 'Teslimat Adresi',
      OrderNotesInformation : 'Sipariş Notları & Bilgiler',
      OrderMetadata: 'Sipariş Meta Verisi',
      ItemCount : 'Ürün Sayısı',
      TotalItems: 'Toplam Ürünler',
      OrderTimeline: 'Sipariş Zaman Çizelgesi',
      searchPlaceholder:"Burada Yaz",
    showAdvancedFilter:"Gelişmiş Filtreleri Göster",
    hideAdvancedFilter:"Gelişmiş Filtreleri Gizle",
    of:"in",
    orders:"siparişler",
    clearFilter:"Filtreleri Temizle",
    customerName:"Müşteri Adı",
    tableName:"Masa Adı",
    orderType:"Sipariş Türü",
    minPrice:"Minimum Fiyat",
    maxPrice:"Maksimum Fiyat",
     Showing:"Gösteriliyor",
      to:"a",
      perpage : "Sayfa Başına",
      cancelOrder:"Siparişi İptal Et",
      cancelOrderConfirmation:"Siparişi iptal etmek istediğinizden emin misiniz?",
      deletedOrders:"Slienen Siparişler",
      title: "Sipariş Yönetimi",
      description: "Restoranınızın siparişlerini kolayca yönetin ve takip edin.",
      pendingOrders: "Bekleyen Siparişler",
      branchOrders: "Şube Siparişleri",
      allStatuses: "Tüm Durumlar",
      statusFilter: "Durum Filtresi",
      noOrders: "Henüz  sipariş yok.",
      customer: "Müşteri",
      orderNumber: "Sipariş No",
      status: "Durum",
      table: "Masa",
      amount: "Tutar",
      date: "Tarih",
      actions: "İşlemler",
      viewDetails: "Detayları Görüntüle",
      confirm: "Onayla",
      reject: "Reddet",
      changeStatus: "Durum Değiştir",
      orderItems: "Sipariş Ürünleri",
      createdAt: "Oluşturulma",
      confirmedAt: "Onaylanma",
      rowVersion: "Row Version",
      confirmOrderTitle: "Siparişi Onayla",
      confirmOrderPrompt: "Bu siparişi onaylamak istediğinizden emin misiniz?",
      rejectOrderTitle: "Siparişi Reddet",
      rejectOrderPrompt: "Reddetme nedenini girin:",
      rejectReasonPlaceholder: "Reddetme nedeni...",
      updateStatusTitle: "Durumu Güncelle",
      updateStatusPrompt: "Sipariş durumunu  olarak güncellemek istediğinizden emin misiniz?",
      cancel: "İptal",
      confirmAction: "Onayla",
      rejectAction: "Reddet",
      updateActio: "Güncelle",
      confirming: "Onaylanıyor...",
      rejecting: "Reddediliyor...",
      updating: "Güncelleniyor...",
      orderDetailsTitle: "Sipariş Detayları",
      successNotification: "İşlem Başarılı",
      orderConfirmedSuccess: "Sipariş başarıyla onaylandı!",
      orderRejectedSuccess: "Sipariş başarıyla reddedildi!",
      orderStatusUpdatedSuccess: "Sipariş durumu başarıyla güncellendi!",
      errorInvalidStatusTransition: "Geçersiz durum geçişi: Lütfen önce siparişi onaylayın (Onaylandı durumuna geçin).",
      errorCannotConfirm: "Bu sipariş onaylanamaz. Mevcut durum: {currentStatus}.",
      quantity: "Miktar",
      unitPrice: "Birim Fiyat",
      addonPrice: "Ekstra Fiyat",
      notes: "Not",
      amountLabel: "Toplam Tutar",
      DeliveryInformation: "Teslimat Bilgileri",
      TableInformation: "Masa Bilgileri",
      CustomerInformation: "Müşteri Bilgileri",
      CustomerName: "Müşteri Adı",
      PhoneNumber: "Telefon Numarası",
      OrderTag: "Etiket",
      OrderNotes: "Sipariş Notları",
      MinOrderAmount: "Minimum Sipariş Tutarı",
      CompletedAt: "Tamamlanma Tarihi",
      time: "saat",
      Status: "Durum",
  },

  orderService: {
      statuses: {
        pending: "Bekliyor",
        confirmed: "Onaylandı",
        preparing: "Hazırlanıyor",
        ready: "Hazır",
        completed: "Tamamlandı",
        delivered: "Teslim Edildi",
        cancelled: "İptal Edildi",
        rejected: "Reddedildi",
        unknown: "Bilinmeyen"
      },
      errors: {
        createSessionOrder: "Session order oluşturulurken hata oluştu",
        getPendingOrders: "Pending orders getirilirken hata oluştu",
        getTableOrders: "Table orders getirilirken hata oluştu",
        getOrder: "Order getirilirken hata oluştu",
        getBranchOrders: "Branch orders getirilirken hata oluştu",
        confirmOrder: "Order onaylanırken hata oluştu",
        rejectOrder: "Order reddedilirken hata oluştu",
        updateOrderStatus: "Order status güncellenirken hata oluştu",
        trackOrder: "Order tracking getirilirken hata oluştu",
        getOrderTrackingQR: "Order tracking QR getirilirken hata oluştu",
        smartCreateOrder: "Smart order oluşturulurken hata oluştu",
        getTableBasketSummary: "Table basket summary getirilirken hata oluştu",
        validationError: "Doğrulama hatası: {errors}",
        invalidRequest: "Geçersiz istek. Lütfen verileri kontrol edin.",
        sessionExpired: "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.",
        unauthorized: "Bu işlem için yetkiniz bulunmuyor.",
        orderNotFound: "Sipariş bulunamadı.",
        invalidStatus: "Sipariş durumu bu işleme uygun değil.",
        noInternet: "İnternet bağlantınızı kontrol edin.",
        unknownError: "Bilinmeyen hata",
        getOrderTypeText: "Order type text getirme hatası",
        getOrderType: "Order type getirme hatası",
        getActiveOrderTypes: "Active order types getirme hatası",
        getAllOrderTypes: "All order types getirme hatası",
        orderTotalCalculation: "Order total calculation hatası",
        getEstimatedTime: "Estimated time getirme hatası",
        getOrderTypeByCode: "Order type by code getirme hatası",
        getOrderTypesForDisplay: "Order types for display getirme hatası",
        unknownOrderType: "Bilinmeyen Sipariş Türü"
      }
  },
  
  branchPreferences: {
    title: "Şube Tercihleri",
    description: "Şubeye özel ayarları ve tercihleri yapılandırın",
    loading: "Şube tercihleri yükleniyor...",
    saving: "Kaydediliyor...",
    refresh: "Yenile",
    saveChanges: "Değişiklikleri Kaydet",
    saveSuccess: "Şube tercihleri başarıyla kaydedildi!",
    cleanupModes: {
      afterTimeout: "Zaman Aşımından Sonra",
      afterClosing: "Kapatmadan Sonra",
      disabled: "Devre Dışı"
    },
    sections: {
      orderManagement: {
        title: "Sipariş Yönetimi",
        description: "Siparişlerin nasıl işlendiğini ve yönetildiğini yapılandırın",
        autoConfirmOrders: "Siparişleri Otomatik Onayla",
        autoConfirmOrdersDesc: "Gelen siparişleri manuel onay olmadan otomatik olarak onaylayın",
        useWhatsappForOrders: "Siparişler için WhatsApp",
        useWhatsappForOrdersDesc: "Sipariş bildirimleri için WhatsApp entegrasyonunu etkinleştirin"
      },
      displaySettings: {
        title: "Görüntü Ayarları",
        description: "Müşterilere hangi bilgilerin gösterileceğini yapılandırın",
        showProductDescriptions: "Ürün Açıklamalarını Göster",
        showProductDescriptionsDesc: "Müşterilere detaylı ürün açıklamalarını göster",
        enableAllergenDisplay: "Alerjen Bilgilerini Göster",
        enableAllergenDisplayDesc: "Alerjen uyarılarını ve bilgilerini göster",
        enableIngredientDisplay: "İçerikleri Göster",
        enableIngredientDisplayDesc: "Ürünler için içerik listelerini göster"
      },
      paymentMethods: {
        title: "Ödeme Yöntemleri",
        description: "Kabul edilen ödeme yöntemlerini yapılandırın",
        acceptCash: "Nakit Ödemeleri Kabul Et",
        acceptCashDesc: "Müşterilerin nakit ile ödeme yapmalarına izin ver",
        acceptCreditCard: "Kredi Kartlarını Kabul Et",
        acceptCreditCardDesc: "Müşterilerin kredi/banka kartları ile ödeme yapmalarına izin ver",
        acceptOnlinePayment: "Online Ödemeleri Kabul Et",
        acceptOnlinePaymentDesc: "Müşterilerin dijital ödeme yöntemleri ile online ödeme yapmalarına izin ver"
      },
      localization: {
        title: "Yerelleştirme",
        description: "Dil ve bölgesel ayarları yapılandırın",
        defaultLanguage: "Varsayılan Dil",
        defaultCurrency: "Varsayılan Para Birimi",
        timeZone: "Saat Dilimi",
        supportedLanguages: "Desteklenen Diller"
      },
      sessionManagement: {
        title: "Oturum Yönetimi",
        description: "Oturum zaman aşımı ve temizleme ayarlarını yapılandırın",
        sessionTimeout: "Oturum Zaman Aşımı (Dakika)",
        cleanupMode: "Temizleme Modu",
        cleanupDelay: "Kapanış Sonrası Temizleme Gecikmesi (Dakika)",
        cleanupModeDesc: "Süresi dolan oturumların ne zaman temizleneceğini seçin",
        sessionTimeoutDesc: "Hareketsizlik nedeniyle oturumun sona ermesinden önceki dakikalar",
        cleanupDelayDesc: "Kapatmadan sonra temizlikten önce beklenecek dakikalar",
        cleanupDisabledMessage: "Oturum temizliği devre dışı. Oturumlar otomatik olarak temizlenmeyecek."
      }
    },
    currencies: {
      TRY: "Türk Lirası ",
      USD: "Amerikan Doları ",
      EUR: "Euro"
    },
    languages: {
      tr: "Türkçe",
      en: "İngilizce",
      ar: "Arapça",
      de: "Almanca", 
      fr: "Fransızca",
      ru: "Rusça",
      es: "İspanyolca"
    },
    timezones: {
      "Europe/Istanbul": "İstanbul (UTC+3)",
      "Europe/London": "Londra (UTC+0)",
      "America/New_York": "New York (UTC-5)"
    },
    errors: {
      loadFailed: "Şube tercihleri yüklenemedi",
      saveFailed: "Şube tercihleri kaydedilemedi",
      validationError: "Doğrulama hatası: {errors}",
      invalidRequest: "Geçersiz istek. Lütfen verileri kontrol edin.",
      sessionExpired: "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.",
      unauthorized: "Bu işlem için yetkiniz bulunmuyor.",
      notFound: "Şube tercihleri bulunamadı.",
      conflict: "Veriler güncel değil. Sayfayı yenileyip tekrar deneyin.",
      noInternet: "İnternet bağlantınızı kontrol edin.",
      unknownError: "Bilinmeyen bir hata oluştu",
      invalidPaymentSettings: "Geçersiz ödeme ayarları. En az bir ödeme yöntemi seçilmelidir.",
      invalidSessionSettings: "Geçersiz oturum ayarları. Lütfen değerleri kontrol edin."
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
    sending: 'Gönderiliyor...',
  }
  },

  recycleBin: {
    title: 'Geri Dönüşüm Kutusu',
    titleProducts: 'Silinmiş Ürünler ve Kategoriler',
    titleBranches: 'Silinmiş Şubeler',
    titleTables: 'Silinmiş Masalar',
    titleBranchProducts: 'Silinmiş Şube Ürünleri ve Kategorileri',
    titleBranchCategories: 'Silinmiş Şube Kategorileri',
    titleTableCategories: 'Silinmiş Masa Kategorileri',
    description: 'Silinmiş şubeler, kategoriler, ürünler ve masaları yönetin',
    descriptionProducts: 'Silinmiş ürünler ve kategorileri yönetin',
    descriptionBranches: 'Silinmiş şubeleri yönetin',
    descriptionTables: 'Silinmiş masaları yönetin',
    descriptionBranchProducts: 'Silinmiş şube ürünleri ve kategorileri yönetin',
    descriptionBranchCategories: 'Silinmiş şube kategorilerini yönetin',
    descriptionTableCategories: 'Silinmiş masa kategorilerini yönetin',
    branchRestore:{
      title: 'Şube Geri Yükleme Seçenekleri',
      subtitle: 'Geri yükleme işlemi için tercihlerinizi seçin',
      simpleTitle: 'Şube Geri Yükle',
    simpleDesc: 'Bu Şube geri yüklendiğinde yalnızca genel Şube bilgileri geri yüklenir.',
    cascadeTitle: 'Bu Şube geri yüklendiğinde tüm ilişkili ürünler ve kategoriler de geri yüklenir.',
    cascadeDesc: 'Yalnızca dalı mı yoksa tüm ilişkili ürünleri ve kategorileri de geri yüklemek ister misiniz?',
    recommended: 'Recommended',
    includeProducts: 'Ürünleri ve Kategorileri Dahil Et',
    includeTables: 'Masaları Dahil Et',
    includeAll: 'Tüm İlişkili Verileri Dahil Et',
    },
    productRestore : {
title: 'Ürün Seçeneklerini Geri Yükle',
subtitle: 'Ürünü nasıl geri yüklemek istediğinizi seçin',
simpleTitle: 'Ürünü Geri Yükle',
simpleDesc: 'Bu ürünü geri yüklemek yalnızca genel ürün bilgilerini geri yükleyecektir.',
cascadeTitle: 'Bu ürünü geri yüklemek, tüm ilişkili varyantları ve eklentileri de geri yükleyecektir.',
cascadeDesc: 'Yalnızca ürünü mü yoksa tüm ilişkili varyantları ve eklentileri de geri yüklemek mi istiyorsunuz?',
includeOptions: 'Varyantları ve Eklentileri Dahil Et',
includeImages: 'Ürün Görselini Dahil Et',
includeAll: 'Tüm İlişkili Verileri Dahil Et',
recommended: 'Tavsiye Edilen',
},
categoryRestore: {
title: "Kategoriyi Geri Yükle",
subtitle: "Kategoriyi nasıl geri yüklemek istediğinizi seçin",
simpleTitle: "Basit Geri Yükleme (Yalnızca Genel Bilgiler)",
simpleDesc: "Yalnızca temel kategori bilgilerini geri yükle (ad, açıklama)",
cascadeTitle: "Tam Geri Yükleme (Tüm Verilerle)",
cascadeDesc: "Kategoriyi tüm ilişkili verilerle geri yükle:",
includeProducts: "Bu kategorideki tüm ürünler",
includeAll: "Tüm ilişkili yapılandırmalar",
recommended: "Önerilen",
},
branchCategoryRestore: {
title: "Şube Kategorisini Geri Yükle",
subtitle: "Şube kategorisini nasıl geri yüklemek istediğinizi seçin",
simpleTitle: "Basit Geri Yükleme (Yalnızca Genel Bilgiler)",
simpleDesc: "Yalnızca temel şube kategorisi bilgilerini geri yükle",
cascadeTitle: "Tam Geri Yükleme (Tüm Verilerle)",
cascadeDesc: "Şube kategorisini tüm ilişkili verilerle geri yükle:",
includeProducts: "Bu kategorideki tüm şube ürünleri",
includeAll: "Tüm ilişkili yapılandırmalar",
recommended: "Önerilen",
},
tableCategoryRestore: {
title: "Masa Kategorisini Geri Yükle",
subtitle: "Masa kategorisini nasıl geri yüklemek istediğinizi seçin",
simpleTitle: "Basit Geri Yükleme (Yalnızca Genel Bilgiler)",
simpleDesc: "Yalnızca temel masa kategorisi bilgilerini geri yükle",
cascadeTitle: "Tam Geri Yükleme (Tüm Verilerle)",
cascadeDesc: "Masa kategorisini tüm ilişkili verilerle geri yükle:",
includeTables: "Bu kategorideki tüm masalar",
includeAll: "Tüm ilişkili yapılandırmalar",
recommended: "Önerilen",
},
extraCategoryRestore: {
title: "Ekstra Kategorisini Geri Yükle",
subtitle: "Ekstra kategorisini nasıl geri yüklemek istediğinizi seçin",
simpleTitle: "Basit Geri Yükleme (Yalnızca Genel Bilgiler)",
simpleDesc: "Yalnızca temel ekstra kategorisi bilgilerini geri yükle",
cascadeTitle: "Tam Geri Yükleme (Tüm Verilerle)",
cascadeDesc: "Ekstra kategorisini tüm ilişkili verilerle geri yükle:",
includeExtras: "Bu kategorideki tüm ekstralar",
includeAll: "Tüm ilişkili yapılandırmalar",
recommended: "Önerilen",
},
branchProductRestore: {
title: "Şube Ürünü Geri Yükle",
subtitle: "Şube ürününü nasıl geri yüklemek istediğinizi seçin",
simpleTitle: "Basit Geri Yükleme (Yalnızca Genel Bilgiler)",
simpleDesc: "Yalnızca temel şube ürünü bilgilerini geri yükle",
cascadeTitle: "Tam Geri Yükleme (Tüm Verilerle)",
cascadeDesc: "Şube ürününü tüm ilişkili verilerle geri yükle:",
includeOptions: "Şube ürün seçenekleri ve ayarları",
includeAll: "Tüm ilişkili yapılandırmalar",
recommended: "Önerilen",
},
extraRestore: {
title: "Ekstrayı Geri Yükle",
subtitle: "Ekstrayı nasıl geri yüklemek istediğinizi seçin",
simpleTitle: "Basit Geri Yükleme (Yalnızca Genel Bilgiler)",
simpleDesc: "Yalnızca temel ekstra bilgilerini geri yükle",
cascadeTitle: "Tam Geri Yükleme (Tüm Verilerle)",
cascadeDesc: "Ekstrayı tüm ilişkili verilerle geri yükle:",
includeOptions: "Ekstra seçenekleri ve ayarları",
includeAll: "Tüm ilişkili yapılandırmalar",
recommended: "Önerilen",
},
    search: 'Öğe ara...',
    filter: {
      all: 'Tümü',
      group1: 'Tüm Grup 1',
      group2: 'Tüm Grup 2',
      group1Label: '📋 Restoran Seviyesi (Şubeler, Ürünler, Masalar)',
      group2Label: '🏢 Şube Seviyesi (Şube Ürünleri ve Kategorileri)',
      branches: 'Şubeler',
      categories: 'Kategoriler',
      products: 'Ürünler',
      tables: 'Masalar',
      branchProducts: 'Şube Ürünleri',
      branchCategories: 'Şube Kategorileri',
      tableCategories: 'Masa Kategorileri'
    },
    refresh: 'Yenile',
    loading: 'Yükleniyor...',
    stats: {
      group1: 'Restoran Seviyesi',
      group1Desc: 'Şubeler, Ürünler, Masalar',
      extras: 'Ekstralar',
      extrasDesc: 'Ekstra Ürünler ve Kategoriler',
      group2: 'Şube Seviyesi',
      group2Desc: 'Şube Ürünleri ve Kategorileri',
      totalDeleted: 'Toplam Silinmiş',
      totalDesc: 'Tüm silinmiş öğeler',
      filtered: 'Gösterilen',
      filteredDesc: 'Mevcut filtre sonuçları',
      deletedBranch: 'Silinmiş Şube',
      deletedCategory: 'Silinmiş Kategori',
      deletedProduct: 'Silinmiş Ürün',
      deletedTable: 'Silinmiş Masa',
      deletedBranchProduct: 'Silinmiş Şube Ürünü',
      deletedBranchCategory: 'Silinmiş Şube Kategorisi',
      deletedTableCategory: 'Silinmiş Masa Alanı'
    },
    entityTypes: {
      category: 'Kategori',
      product: 'Ürün',
      branch: 'Şube',
      table: 'Masa',
      branchProduct: 'Şube Ürünü',
      extraCategory:"Ekstra Kategori",
      extra: 'Ekstra',
      branchCategory: 'Şube Kategorisi',
      tableCategory: 'Masa Alanı',
      other: 'Diğer'
    },
    contextInfo: {
      category: 'Kategori:',
      branch: 'Şube:',
      restaurant: 'Restoran:'
    },
    deletedAt: 'Silinme:',
    restore: {
      button: 'Geri Yükle',
      restoring: 'Geri yükleniyor...',
      successCategory: '"{name}" kategorisi başarıyla geri yüklendi',
      successCategoryCascade: '"{name}" kategorisi ve tüm ilişkili ürünler başarıyla geri yüklendi',
      successProduct: '"{name}" ürünü başarıyla geri yüklendi',
      successProductCascade: '"{name}" ürünü ve tüm ilişkili veriler başarıyla geri yüklendi',
      successBranch: '"{name}" şubesi başarıyla geri yüklendi',
      successBranchCascade: '"{name}" şubesi ve tüm ilişkili veriler başarıyla geri yüklendi',
      successTable: '"{name}" masası başarıyla geri yüklendi',
      successBranchProduct: '"{name}" şube ürünü başarıyla geri yüklendi',
      successBranchCategory: '"{name}" şube kategorisi başarıyla geri yüklendi',
      successTableCategory: '"{name}" masa Alanı başarıyla geri yüklendi',
      successExtra: '"{name}" ekstrası başarıyla geri yüklendi',
      successExtraCategory: '"{name}" ekstra kategorisi başarıyla geri yüklendi',
      error: 'Geri yükleme işlemi başarısız oldu'
    },
    empty: {
      title: 'Geri dönüşüm kutusu boş',
      titleFiltered: 'Sonuç bulunamadı',
      description: 'Henüz silinmiş öğe bulunmuyor',
      descriptionFiltered: 'Arama kriterlerinize uygun silinmiş öğe bulunmadı'
    },
    errors: {
      loadingError: 'Silinmiş öğeler yüklenirken hata oluştu'
    }
  },

  management: {
      title: "Yönetim Bilgileri",
      subtitle: "Şirket ve yasal detaylar",
      noDataTitle: "Yönetim Bilgisi Yok",
      noDataMessage: "Yönetim bilgileri henüz ayarlanmadı. Başlamak için lütfen restoran detaylarını ekleyin.",
      dangerZone:{
        title: "Tehlikeli Bölge",
        description: "Restoran yönetim bilgilerini kalıcı olarak silme işlemi geri alınamaz. Lütfen dikkatli olun.",
      },
            messages : {
      purgeSuccess : "نجاح إزالة المحذوفات"
    },
      buttons: {
        edit: "Düzenle",
        cancel: "İptal",
        save: "Değişiklikleri Kaydet",
        saving: "Kaydediliyor...",
        delete:" Sil",
        purge:" Temizle",
        viewFile:"Dosya Aç",
        viewLogo:"View Logo"
      },

      sections: {
        restaurantDetails: "Restoran Detayları",
        companyInfo: "Şirket Bilgileri",
        taxInfo: "Vergi ve Kayıt",
        certificates: "Sertifikalar ve İzinler",
        additionalSettings: "Ek Ayarlar"
      },

      fields: {
        restaurantName: "Restoran Adı",
        restaurantLogo: "Restoran Logosu",
        companyTitle: "Şirket Unvanı",
        legalType: "Yasal Tür",
        taxNumber: "Vergi Numarası",
        taxOffice: "Vergi Dairesi",
        mersisNumber: "MERSIS Numarası",
        tradeRegistry: "Ticaret Sicil Numarası",
        workPermit: "Çalışma İzni",
        foodCertificate: "Gıda Sertifikası",
        logo: "Logo"
      },

      placeholders: {
        restaurantName: "Restoran adını girin",
        companyTitle: "Şirket unvanını girin",
        taxNumber: "Vergi numarasını girin",
        taxOffice: "Vergi dairesini girin",
        mersisNumber: "MERSIS numarasını girin",
        tradeRegistry: "Ticaret sicil numarasını girin",
        selectLegalType: "Yasal Tür Seçin"
      },

      legalTypes: {
        llc: "Limited Şirket",
        corporation: "Anonim Şirket",
        partnership: "Ortaklık"
      },

      status: {
        uploaded: "Yüklendi",
        notUploaded: "Yüklenmedi",
        available: "Mevcut",
        notAvailable: "Mevcut Değil",
      },

      common: {
        na: "Mevcut Değil"
      }
  },

  branches: {
    status: {
      active: "Aktif",
      inactive: "Pasif"
    },
    "fields": {
      "branchType": "Şube Türü",
      "branchTag": "Şube Etiketi"
    }
  },

  restaurants: {
    status: {
      active: "Aktif",
      inactive: "Pasif"
    },
    actions: {
      edit: "Restoranı Düzenle",
      delete: "Restoranı Sil"
    },
    stats: {
      totalBranches: "Toplam Şube",
      active: "Aktif",
      inactive: "Pasif",
    },
    common: {
      yes: "Evet",
      no: "Hayır"
    }
  },

  restaurantsTab: {
    status: {
      active: "Aktif",
      inactive: "Pasif"
    },
    actions: {
      edit: "Restoranı Düzenle",
      delete: "Restoranı Sil"
    },
    stats: {
      totalBranches: "Toplam Şube",
      active: "Aktif",
      inactive: "Pasif",
    },
    common: {
      yes: "Evet",
      no: "Hayır"
    },
    modal: {
      editTitle: "Restoranı Düzenle",
      placeholders: {
      restaurantName: "Restoran Adı",
      cuisineType: "Mutfak Türü"
      },

      "buttons": {
        "update": "Restoranı Güncelle",
        "updating": "Güncelleniyor..."
      }
    }
  },

  tabs: {
    restaurants: "Restoranlar",
    branches: "Şubeler",
    management: "Yönetim Bilgileri",
    deleted: "Silinmiş"
  },
  
  allergens: {
    GLUTEN: {
      name: "Gluten",
      description: "Buğday, çavdar, arpa, yulaf"
    },
    CRUSTACEANS: {
      name: "Kabuklu Deniz Ürünleri",
      description: "Karides, yengeç, ıstakoz"
    },
    EGGS: {
      name: "Yumurta",
      description: "Yumurta ve yumurta ürünleri"
    },
    FISH: {
      name: "Balık",
      description: "Tüm balık ürünleri"
    },
    PEANUTS: {
      name: "Yer Fıstığı",
      description: "Yer fıstığı ve yer fıstığı ürünleri"
    },
    SOYBEANS: {
      name: "Soya",
      description: "Soya ve soya ürünleri"
    },
    MILK:{
      name: "Süt",
      description: "Süt ve süt ürünleri"
    },
    NUTS: {
      name: "Sert Kabuklu Meyveler",
      description: "Badem, fındık, ceviz, kaju vb."
    },
    CELERY: {
      name: "Kereviz",
      description: "Kereviz ve kereviz kökü"
    },
    MUSTARD: {
      name: "Hardal",
      description: "Hardal ve hardal ürünleri"
    },
    SESAME: {
      name: "Susam",
      description: "Susam tohumu ve ürünleri"
    },
    SULPHITES: {
      name: "Sülfitler",
      description: "Kükürt dioksit ve sülfitler (>10mg/kg)"
    },
    LUPIN: {
      name: "Acı Bakla",
      description: "Acı bakla ve acı bakla ürünleri"
    },
    MOLLUSCS: {
      name: "Yumuşakçalar",
      description: "Midye, istiridye, salyangoz, kalamar"
    }
  },
  tableQR: {
    loading: {
      validatingQR: "QR Kod Doğrulanıyor",
      fetchingTableInfo: "Masa bilgileri alınıyor..."
    },
    error: {
      title: "Hata",
      tryAgain: "Tekrar Dene",
      sessionFeatureComingSoon: "Oturum başlatma özelliği yakında eklenecek.",
      sessionStartFailed: "Oturum başlatılamadı."
    },
    header: {
      title: "Restoran Menüsü",
      subtitle: "Dijital Menü Deneyimi",
      active: "Aktif"
    },
    welcome: {
      greeting: "Hoş Geldiniz!",
      connectedToTable: "masasına başarıyla bağlandınız",
      tableStatus: "Masa Durumu",
      occupied: "Dolu",
      available: "Müsait",
      capacity: "Kapasite",
      person: "Kişi",
      people: "Kişi",
      session: "Oturum",
      sessionActive: "Aktif",
      sessionPending: "Bekleniyor",
      welcomeMessage: "Hoş Geldiniz Mesajı"
    },
    actions: {
      viewMenu: "Menüyü Görüntüle",
      callWaiter: "Garson Çağır"
    },
    footer: {
      connectedViaQR: "QR Kod ile bağlandınız • Güvenli oturum"
    }
  },
  productCard: {
    chefsPick: "Şefin Seçimi",
    customizable: "Özelleştirilebilir",
    addons: "+ekstralar",
    allergens: "Alerjenler",
    ingredients: "Malzemeler",
    inCart: "sepette",
    customizeOrder: "Siparişi Özelleştir",
    addToCart: "Sepete Ekle",
    prepTime: "15-20 dakika",
    popular: "Popüler",
    rating: "4.8",
    more: "daha fazla"
  },
   "moneyCase": {
    "title": "Kasa Yönetimi",
    "subtitle": "Şube nakit işlemlerinizi yönetin",
    "selectBranch": "Bir şube seçin",
    "selectBranchToView": "Şube Seçin",
    "branchSelector": "Şube Seçici",
    "noBranches": "Şube bulunamadı",
    totalRevenue: "Toplam Gelir",
    periodSummary: "Dönem Özeti",
    totalOrders: "Toplam Sipariş",
    totalTransactions: "Toplam İşlem",
    openedBy: "Açan",
    closedBy: "Kapatan",
    shiftDuration: "Vardiya Süresi",
    showSummary: "Özeti Göster",
    hideSummary: "Özeti Gizle",
    netCashFlow: "Net Nakit Akışı",
    netCashDesc: "Belirtilen dönemde kasaya giren ve çıkan toplam nakit miktarı",
    serviceFeeDesc: "Belirtilen dönemde alınan toplam servis ücreti miktarı",
    avgOrderValueDesc: "Belirtilen dönemdeki ortalama sipariş tutarı",
    totalShiftsDesc: "Belirtilen dönemde tamamlanan toplam kasa vardiyası sayısı",
    cashDiscrepancyDesc: "Belirtilen dönemdeki toplam nakit farkı miktarı",
    cashDiscrepancy: "Nakit Farkı",
    totalOrdersDesc: "Belirtilen dönemde işlenen toplam sipariş sayısı",
    showingResults: "Sonuçlar gösteriliyor",
    from: "den",
    to: "e",
    netCash: "Net Nakit",
    financialOverview: "Finansal Genel Bakış",
    grossSalesDesc: "Belirtilen dönemdeki toplam satış geliri miktarı",
    operationalMetrics: "Operasyonel Metrikler",
    loadingSummary: "Özetler yükleniyor...",
    pleaseWait: "Lütfen bekleyin...",
    lastClosedAt  : "Son Kapanış Zamanı",
    previousCloseInfo : "Önceki Kapanış Bilgisi",
    suggestedBalance : "Önerilen Bakiye",
    lastClosed: "Son Kapanış",
    filtreler: {
      title: "Filtreler",
      quickSelect: "Hızlı Seçim",
      today: "Bugün",
      yesterday: "Dün",
      last7Days: "Son 7 Gün",
      last30Days: "Son 30 Gün",
      thisMonth: "Bu Ay",
      lastMonth: "Geçen Ay",
      custom: "Özel",
      fromDate: "Başlangıç ​​Tarihi",
      toDate: "Bitiş Tarihi",
      apply: "Uygula",
      clear: "Temizle",
      clearAll: "Tümünü Temizle",
      to: "Bitiş Tarihi",
      from: "Başlangıç ​​Tarihi",
      active: "Aktif"
} ,
    "status": "Durum",
    "open": "Açık",
    "closed": "Kapalı",
    "todaySales": "Bugünkü Satışlar",
    "todayCash": "Bugünkü Nakit",
    "todayCard": "Bugünkü Kart",
    "currentBalance": "Güncel Bakiye",
    "transactionCount": "İşlem Sayısı",
    "transactions": "İşlem",
    
    "openCase": "Kasa Aç",
    "closeCase": "Kasa Kapat",
    "viewZReport": "Z Raporu Görüntüle",
    "history": "Kasa Geçmişi",
    "records": "Kayıt",
    "noHistory": "Geçmiş bulunamadı",
    "noHistoryDescription": "Kasa işlemleri burada görünecek",
    
    "openingBalance": "Açılış Bakiyesi",
    "openingBalanceDescription": "Kasadaki başlangıç nakit tutarını girin",
    "closingBalance": "Kapanış Bakiyesi",
    "actualCash": "Gerçek Nakit",
    "expectedCash": "Beklenen Nakit",
    "difference": "Fark",
    "surplus": "Fazlalık",
    "shortage": "Eksiklik",
    "notes": "Notlar",
    "notesPlaceholder": "Bu kasa seansı hakkında not veya yorum ekleyin...",
    
    "date": "Tarih & Saat",
    "openedAt": "Açılış Zamanı",
    "closedAt": "Kapanış Zamanı",
    "lastUpdated": "Son Güncelleme",
    "caseId": "Kasa No",
    
    "confirm": "Onayla",
    "confirmClose": "Kapanışı Onayla",
    "cancel": "İptal",
    "close": "Kapat",
    "print": "Yazdır",
    "download": "İndir",
    
    "zReport": "Z Raporu",
    "reportDate": "Rapor Tarihi",
    "openingInformation": "Açılış Bilgileri",
    "salesSummary": "Satış Özeti",
    "closingInformation": "Kapanış Bilgileri",
    "totalSales": "Toplam Satış",
    "cashSales": "Nakit Satış",
    "cardSales": "Kart Satış",
    "refunds": "İadeler",
    "expenses": "Giderler",
     "avgOrderValue": "Ortalama Sipariş Değeri",
    "totalDiscrepancy": "Toplam Fark",
    "totalShifts": "Toplam Vardiya",
    "avgShiftDuration": "Ortalama Vardiya Süresi",
    "shiftsWithIssues": "Problemi Olan Vardiyalar",
    "period": "Rapor Dönemi",
      "todayTotalSales": "Bugünün Toplam Satışları",
    "currentShiftRevenue": "Mevcut Vardiya Geliri",
    "closedShifts": "Kapalı Vardiyalar",
    "ordersToday": "Bugünkü Siparişler",
    "weekToDate": "Hafta Başından Bugüne",
    "monthToDate": "Ay Başından Bugüne",
    "shifts": "Vardiyalar",
    "orders": "Siparişler",
    "noReportData": "Rapor verisi bulunamadı",
    serviceFee: "Servis Ücreti",
    "success": {
      "opened": "Kasa başarıyla açıldı!",
      "closed": "Kasa başarıyla kapatıldı!",
      "closedWithDifference": "Kasa başarıyla kapatıldı! Fark: {{difference}}"
    },
    
    "error": {
      "fetchBranches": "Şubeler getirilemedi",
      "fetchActiveCase": "Aktif kasa bilgisi getirilemedi",
      "fetchHistory": "Kasa geçmişi getirilemedi",
      "fetchZReport": "Z raporu getirilemedi",
      "openCase": "Kasa açılamadı",
      "closeCase": "Kasa kapatılamadı",
      "noBranchSelected": "Lütfen önce bir şube seçin"
    },
    
    "validation": {
      "openingBalanceRequired": "Açılış bakiyesi gereklidir",
      "openingBalanceMin": "Açılış bakiyesi 0 veya daha büyük olmalıdır",
      "actualCashRequired": "Gerçek nakit tutarı gereklidir",
      "actualCashMin": "Gerçek nakit 0 veya daha büyük olmalıdır",
      "notesMaxLength": "Notlar 500 karakteri geçemez"
    },
    
    "modal": {
      "openTitle": "Kasa Aç",
      "openDescription": "Yeni bir kasa seansı başlat",
      "closeTitle": "Kasa Kapat",
      "closeDescription": "Mevcut kasa seansını sonlandır ve nakit sayımı yap",
      "zReportTitle": "Z Raporu - Detaylı Özet",
      "confirmOpenMessage": "Yeni bir kasa açmak istediğinizden emin misiniz?",
      "confirmCloseMessage": "Mevcut kasayı kapatmak istediğinizden emin misiniz? Bu işlem geri alınamaz."
    }
  },
  "onboardingRestaurant": {
    "backLink": "Kayıt Sayfasına Dön",
    "progress": {
      "step1": "Temel Bilgiler",
      "step2": "Şirket Bilgileri",
      "step3": "Yasal Belgeler"
    },
    "messages": {
      "welcome": "Restaurant bilgileriniz başarıyla kaydedildi. Şimdi şube bilgilerinizi girebilirsiniz.",
      "success": "Restaurant bilgileriniz başarıyla kaydedildi! Şube bilgilerinizi girmeniz için yönlendiriliyorsunuz...",
      "errors": {
        "sessionNotFound": "Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.",
        "serverConnection": "Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.",
        "nameInUse": "Bu restaurant adı zaten kullanımda. Lütfen farklı bir ad deneyin.",
        "genericCreate": "Restaurant kaydı sırasında bir hata oluştu. Lütfen tekrar deneyin.",
        "idNotFound": "Restaurant ID alınamadı. Lütfen tekrar deneyin.",
        "fileUploadGeneric": "Dosya yüklenirken hata oluştu",
        "filePathError": "Dosya yükleme başarısız: Dosya yolu alınamadı"
      }
    },
    "step1": {
      "title": "Restaurant Bilgileri",
      "subtitle": "Restaurant'ınızın temel bilgilerini girin",
      "nameLabel": "Restaurant Adı *",
      "namePlaceholder": "Restaurant adınızı girin",
      "logoLabel": "Restaurant Logosu *",
      "logoUploading": "Logo yükleniyor...",
      "logoSuccess": "✓ Logo başarıyla yüklendi",
      "logoSuccessSub": "Cloudinary URL alındı",
      "cuisineLabel": "Mutfak Türü *",
      "errors": {
        "nameRequired": "Restaurant adı gereklidir",
        "logoRequired": "Restaurant logosu gereklidir",
        "cuisineRequired": "Mutfak türü seçiniz"
      }
    },
    "step2": {
      "title": "Şirket Bilgileri",
      "subtitle": "Şirket bilgilerinizi girin",
      "companyTitleLabel": "Şirket Unvanı *",
      "companyTitlePlaceholder": "Şirket unvanınızı girin",
      "legalTypeLabel": "Hukuki Yapı *",
      "legalTypePlaceholder": "Hukuki yapı seçiniz",
      "mersisLabel": "MERSİS Numarası",
      "mersisPlaceholder": "MERSİS numaranızı girin",
      "tradeRegistryLabel": "Ticaret Sicil Numarası",
      "tradeRegistryPlaceholder": "Ticaret sicil numaranızı girin",
      "errors": {
        taxNumberRequired: "Vergi numarası gereklidir",
        "companyTitleRequired": "Şirket unvanı gereklidir",
        mersisRequired: "MERSIS numarası gereklidir",
        "legalTypeRequired": "Hukuki yapı seçiniz"
      }
    },
    "step3": {
      "title": "Yasal Belgeler",
      "subtitle": "Vergi ve belge bilgilerinizi girin",
      "taxNumberLabel": "Vergi Numarası *",
      "taxNumberPlaceholder": "Vergi numaranızı girin",
      "taxOfficeLabel": "Vergi Dairesi *",
      "taxOfficePlaceholder": "Vergi dairenizi girin",
      "workPermitLabel": "Çalışma İzni Belgesi",
      "workPermitUploading": "Çalışma izni belgesi yükleniyor...",
      "workPermitSuccess": "✓ Çalışma izni belgesi başarıyla yüklendi",
      "foodCertificateLabel": "Gıda Belgesi",
      "foodCertificateUploading": "Gıda belgesi yükleniyor...",
      "foodCertificateSuccess": "✓ Gıda belgesi başarıyla yüklendi",
      "errors": {
        taxNumberInvalid:"Geçerli bir sayı girin",
        "taxNumberRequired": "Vergi numarası gereklidir",
        "taxOfficeRequired": "Vergi dairesi gereklidir"
      }
    },
    "navigation": {
      "previous": "Önceki Adım",
      "next": "Sonraki Adım",
      "submit": "Restaurant'ı Kaydet",
      "submitting": "Kaydediliyor...",
      "uploading": "Dosyalar Yükleniyor..."
    },
    "cuisineTypes": {
      "0": "Türk Mutfağı",
      "1": "İtalyan Mutfağı",
      "2": "Çin Mutfağı",
      "3": "Japon Mutfağı",
      "4": "Meksika Mutfağı",
      "5": "Hint Mutfağı",
      "6": "Fransız Mutfağı",
      "7": "Amerikan Mutfağı",
      "8": "Akdeniz Mutfağı",
      "9": "Tayland Mutfağı",
      "10": "Kore Mutfağı",
      "11": "Vietnam Mutfağı",
      "12": "Yunan Mutfağı",
      "13": "İspanyol Mutfağı",
      "14": "Lübnan Mutfağı",
      "15": "Brezilya Mutfağı",
      "16": "Alman Mutfağı",
      "17": "Rus Mutfağı",
      "18": "İngiliz Mutfağı",
      "19": "Etiyopya Mutfağı",
      "20": "Fas Mutfağı",
      "21": "Arjantin Mutfağı",
      "22": "Peru Mutfağı",
      "23": "Karayip Mutfağı",
      "24": "Fusion Mutfağı",
      "25": "Vegan Mutfağı",
      "26": "Deniz Ürünleri",
      "27": "Et Restoranı",
      "28": "Fast Food"
    },
    "legalTypes": {
      "as": "Anonim Şirket (A.Ş.)",
      "ltd": "Limited Şirket (Ltd. Şti.)",
      "collective": "Kollektif Şirket",
      "partnership": "Komandit Şirket",
      "sole": "Şahıs İşletmesi",
      "other": "Diğer"
    }
  },

  "resetPassword": {
    "submitted": {
      "title": "E-postanızı Kontrol Edin",
      "line1": "Şu adrese bir şifre sıfırlama bağlantısı gönderdik:",
      "line2": "Lütfen gelen kutunuzu (ve spam klasörünü!) kontrol edin."
    },
    "form": {
      "title": "Şifreyi Sıfırla",
      "subtitle": "Sıfırlama bağlantısı almak için e-postanızı girin.",
      "button": "Sıfırlama Bağlantısı Gönder",
      "emailAddress": "E-posta Adresi",
      "emailPlaceholder": "you@example.com"
    }
  },

  "setNewPassword": {
    "form": {
      "title": "Yeni Şifre Belirle",
      "subtitle": "Aşağıya yeni şifrenizi girin.",
      "newPassword": "Yeni Şifre",
      "confirmPassword": "Yeni Şifreyi Onayla",
      "button": "Yeni Şifreyi Kaydet",
      "errorMatch": "Şifreler eşleşmiyor.",
      "errorLength": "Şifre en az 8 karakter olmalıdır."
    },
    "submitted": {
      "title": "Şifre Güncellendi!",
      "message": "Şifreniz başarıyla güncellendi. Şimdi giriş yapabilirsiniz."
    }
  },
  
  "confirmMail": {
    "submitted": {
      "title": "E-postanızı Kontrol Edin",
      "line1": "Şu adrese yeni bir onay bağlantısı gönderdik:",
      "line2": "Lütfen gelen kutunuzu (ve spam klasörünü!) kontrol edin."
    },
    "form": {
      "title": "E-postanızı Onaylayın",
      "subtitle": "Onay bağlantısını yeniden göndermek için e-postanızı girin.",
      "button": "Onay E-postasını Yeniden Gönder"
    }
  },

  "onboardingBranch": {
  "header": {
    "backLink": "Restoran Bilgilerine Geri Dön",
    "title": "Şube Bilgileri",
    "subtitle": "Restoranınızın şube bilgilerini adım adım girebilirsiniz"
  },
  "steps": {
    "basic": "Temel Bilgiler",
    "address": "Adres Bilgileri",
    "contact": "İletişim Bilgileri"
  },
  "form": {
    "step1": {
      "title": "Şube Bilgileri",
      "description": "Şubenizin temel bilgilerini girin",
      "branchName": {
        "label": "Şube Adı ",
        "placeholder": "Şube adını girin",
        "error": "Şube adı gereklidir"
      },
      "whatsappNumber": {
        "label": "WhatsApp Sipariş Numarası ",
        "placeholder": "555 123 4567",
        "ariaLabel": "Ülke Kodu",
        "errorRequired": "WhatsApp sipariş numarası gereklidir",
        "errorInvalid": "Geçersiz telefon numarası formatı (7-15 hane)."
      },
      "branchLogo": {
        "label": "Şube Logosu (Opsiyonel)",
        "success": "✓ Logo başarıyla yüklendi",
        "button": "Logo Seç",
        "buttonUploading": "Yükleniyor...",
        "helper": "Desteklenen formatlar: PNG, JPG, GIF. Maksimum dosya boyutu: 5MB",
        "infoTitle": "Otomatik Logo Kullanımı",
        "infoDescription": "Şube logosu yüklemezseniz, restaurant logosu otomatik olarak şube logosu olarak kullanılacaktır."
      }
    },
    "step2": {
      "title": "Adres Bilgileri",
      "description": "Şubenizin adres bilgilerini girin",
      "country": {
        "label": "Ülke *",
        "placeholder": "Ülke adını girin",
        "error": "Ülke gereklidir"
      },
      "city": {
        "label": "Şehir *",
        "placeholder": "Şehir adını girin",
        "error": "Şehir gereklidir"
      },
      "street": {
        "label": "Sokak ",
        "placeholder": "Sokak adını girin",
        "error": "Sokak gereklidir"
      },
      "zipCode": {
        "label": "Posta Kodu ",
        "placeholder": "Posta kodunu girin",
        "error": "Posta kodu gereklidir"
      },
      "addressLine1": {
        "label": "Adres Satırı 1 ",
        "placeholder": "Detaylı adres bilgisi girin",
        "error": "Adres satırı 1 gereklidir"
      },
      "addressLine2": {
        "label": "Adres Satırı 2 ",
        "placeholder": "Ek adres bilgisi girin",
        "error": "Adres satırı 2 gereklidir"
      }
    },
    "step3": {
      "title": "İletişim Bilgileri",
      "description": "Şubenizin iletişim bilgilerini girin",
      "phone": {
        "label": "Telefon Numarası *",
        "placeholder": "212 123 4567",
        "ariaLabel": "Ülke Kodu",
        "errorRequired": "Telefon numarası gereklidir",
        "errorInvalid": "Geçersiz telefon numarası formatı (7-15 hane)."
      },
      "email": {
        "label": "E-posta Adresi *",
        "placeholder": "E-posta adresini girin",
        "error": "E-posta adresi gereklidir"
      },
      "location": {
        "label": "Konum Bilgisi",
        "placeholder": "Konum bilgisini girin (Örn: 40.9795, 28.7225)",
        "error": "Konum bilgisi gereklidir",
        "selectOnMap": "Haritadan Seç",
        "mapTitle": "Harita Üzerinden Konum Seçin",
        "useCurrentLocation": "Mevcut Konumumu Kullan",
        "latitude": "Enlem",
        "longitude": "Boylam",
        "googleMapsLink": "Google Haritalar Linki (Opsiyonel)",
        "googleMapsLinkPlaceholder": "Google Haritalar linkini buraya yapıştırın...",
        "googleMapsLinkHelper": "Google Haritalar linki yapıştırın, koordinatlar otomatik olarak çıkarılacak",
        "invalidLink": "Bu linkten koordinatlar çıkarılamadı. Farklı bir format deneyin.",
        "interactiveMap": "Etkileşimli Harita",
        "clickToPin": "Konum seçmek için haritaya tıklayın",
        "markerPosition": "İşaretleyici Konumu",
        "openFullMap": "Tam haritada aç",
        "manualCoordinates": "Manuel Koordinatlar",
        "selectedCoordinates": "Seçilen Koordinatlar:",
        "mapHelp": "Harita nasıl kullanılır:",
        "mapHelp1": "Yukarıdaki alana Google Haritalar linkini yapıştırın",
        "mapHelp2": "Veya \"Mevcut Konumumu Kullan\" butonuna tıklayın",
        "mapHelp3": "Veya koordinatları manuel olarak girin",
        "mapHelp4": "Konumu hassas bir şekilde belirlemek için tam haritayı açın",
        "geolocationError": "Konumunuz alınamadı. Lütfen manuel olarak seçin.",
        "geolocationNotSupported": "Konum belirleme özelliği tarayıcınız tarafından desteklenmiyor."
      },
      "contactHeader": {
        "label": "İletişim Başlığı (Opsiyonel)",
        "placeholder": "İletişim başlığını girin (opsiyonel)"
      },
      "footerTitle": {
        "label": "Footer Başlığı (Opsiyonel)",
        "placeholder": "Footer başlığını girin (opsiyonel)"
      },
      "footerDescription": {
        "label": "Footer Açıklaması (Opsiyonel)",
        "placeholder": "Footer açıklamasını girin (opsiyonel)"
      },
      "openTitle": {
        "label": "Çalışma Saatleri Başlığı (Opsiyonel)",
        "placeholder": "Çalışma saatleri başlığını girin (opsiyonel)"
      },
      "openDays": {
        "label": "Açık Günler (Opsiyonel)",
        "placeholder": "Açık günleri girin (opsiyonel)"
      },
      "openHours": {
        "label": "Açık Saatler (Opsiyonel)",
        "placeholder": "Açık saatleri girin (opsiyonel)"
      },
      "workingHours": {
        "title": "Çalışma Saatleri",
        "description": "İşletmenizin çalışma saatlerini belirleyin. Gece boyunca açık kalabilirsiniz (örn: 23:00 - 02:00).",
        "openLabel": "Açılış Saati",
        "closeLabel": "Kapanış Saati",
        "dayNames": [
          "Pazartesi",
          "Salı",
          "Çarşamba",
          "Perşembe",
          "Cuma",
          "Cumartesi",
          "Pazar"
        ],
        "toggleOpen": "Açık",
        "toggleClosed": "Kapalı",
        "workingDayNote": "✓ Bu gün müşteriler sipariş verebilecek",
        "overnightNote": "(Gece boyunca açık)",
        "error": {
          "minOneDay": "En az bir gün için çalışma saati belirtmelisiniz",
          "allTimesRequired": "Tüm çalışma günleri için açılış ve kapanış saati belirtmelisiniz",
          "invalidRange": "Geçersiz çalışma saati aralığı: {openTime} - {closeTime}. Gece boyunca açık kalma süresi 12 saati geçemez.",
          "openBeforeClose": "Açılış saati ({openTime}) kapanış saatinden ({closeTime}) önce olmalıdır"
        },
        "infoBox": {
          "title": "Çalışma Saatleri Hakkında",
          "item1": "• Burada belirlediğiniz saatler, müşterilerin QR menünüz üzerinden sipariş verebileceği zamanları belirler.",
          "item2": "• Kapalı günlerde sipariş alınmaz, ancak kapalı günler de veritabanında saklanır.",
          "item3": "• Gece boyunca açık kalabilirsiniz (örn: 23:00 - 02:00). Bu durumda kapanış saati ertesi güne geçer.",
          "item4": "• Gece boyunca açık kalma süresi maksimum 12 saat olabilir."
        }
      }
    }
  },
  "buttons": {
    "back": "Geri",
    "next": "İleri",
    "save": "Kaydet",
    "saving": "Kaydediliyor...",
    "cancel": "İptal",
    "confirm": "Onayla"
  },
  "messages": {
    "errorTitle": "Hata",
    "successTitle": "Başarılı",
    "successMessage": "Şube bilgileriniz başarıyla kaydedildi! Yönlendiriliyorsunuz...",
    "api": {
      "restaurantNotFound": "Restaurant bilgisi bulunamadı. Lütfen tekrar restaurant oluşturun.",
      "branchIdMissing": "Şube ID alınamadı. Lütfen tekrar deneyin.",
      "nameInUse": "Bu şube adı zaten kullanımda. Lütfen farklı bir ad deneyin.",
      "connectionError": "Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.",
      "serverError": "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin veya form verilerinizi kontrol edin.",
      "genericCreateError": "Şube kaydı sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      "logoUploadError": "Logo yüklenirken hata oluştu. Lütfen tekrar deneyin."
    }
  }
},
extrasManagement: {
  title: 'Ekstra Yönetimi',
  description: 'Ekstra kategorilerini ve öğelerini yönetin',
  searchPlaceholder: 'Kategori veya ekstra ara...',
  loading: 'Yükleniyor...',
  processing: 'İşleniyor...',
  
  buttons: {
    add: 'Ekle',
    edit: 'Düzenle',
    delete: 'Sil',
    save: 'Kaydet',
    cancel: 'İptal',
    close: 'Kapat',
    back: 'Geri',
    done: 'Tamam',
    addItem: 'Öğe Ekle',
    createFirst: 'İlk Öğeyi Oluştur'
  },

  deleteModal: {
    titleCategory: 'Kategori Silinsin mi?',
    titleItem: 'Öğe Silinsin mi?',
    confirmMessage: '"{name}" öğesini silmek istediğinizden emin misiniz?',
    warningMessage: 'Bu işlem geri alınamaz. Öğe geri dönüşüm kutusuna taşınacaktır.',
    confirmButton: 'Sil',
    processingButton: 'Siliniyor...',
    cancelButton: 'İptal'
  },
  
  categories: {
    title: 'Ekstra Kategorileri',
    addNew: 'Yeni Kategori Ekle',
    addCategory: 'Yeni Kategori Ekle',
    editCategory: 'Kategoriyi Düzenle',
    noCategories: 'Kategori bulunamadı',
    tryAdjusting: 'Aramanızı ayarlayın veya yeni kategori ekleyin.',
    select: 'Seç:',
    qtyLimit: 'Miktar Limiti:',
    active: 'Aktif',
    inactive: 'Pasif',
    required: 'Zorunlu',
    fields: {
      categoryName: 'Kategori Adı',
      categoryNamePlaceholder: 'örn: Pizza Malzemeleri',
      statusLabel: 'Aktif Durum',
      requiredLabel: 'Zorunlu mu?',
      selectionRules: 'Seçim Kuralları',
      minSelection: 'Minimum Seçim',
      maxSelection: 'Maksimum Seçim',
      removalCategoryLabel: 'Çıkarma Kategorisi',
      minQuantity: 'Minimum Miktar',
      maxQuantity: 'Maksimum Miktar',
      unlimited: 'Sınırsız'
    }
  },

  extras: {
    alreadyExists: 'Zaten Var',
    title: 'Ekstralar',
    duplicateWarning: 'Bu ekstra zaten mevcut.',
    duplicateMessage: 'Bu ekstra, seçilen kategoride zaten mevcut. Lütfen farklı bir ad seçin.',
    addExtra: 'Yeni Ekstra Ekle',
    editExtra: 'Ekstra Düzenle',
    noItems: 'Bu kategoride henüz öğe yok.',
    noDescription: 'Açıklama yok',
    fields: {
      parentCategory: 'Üst Kategori',
      selectCategory: 'Kategori Seçin...',
      itemName: 'Öğe Adı',
      itemNamePlaceholder: 'Öğe adı',
      price: 'Fiyat',
      description: 'Açıklama',
      descriptionPlaceholder: 'İsteğe bağlı detaylar...',
      imageLabel: 'Öğe Resmi',
      uploadText: 'Resim yüklemek için tıklayın',
      activeLabel: 'Aktif',
      removalLabel: 'Çıkarma Öğesi (Eksi)'
    }
  },

  productExtras: {
    manageCategories: 'Ürün Ekstraları Kategorilerini Yönetin',
    manageExtras: 'Ekstraları Yönet',
    addCategory: 'Kategori Ekle',
    addExtra: 'Ekstra Ekle',
    selectCategory: 'Kategori Seç',
    chooseCategory: 'Kategori Seçin...',
    selectExtra: 'Ekstra Seç',
    chooseExtra: 'Ekstra Seçin...',
    noCategoriesYet: 'Henüz kategori eklenmedi',
    noExtrasYet: 'Henüz ekstra eklenmedi',
    noDescription: 'Açıklama mevcut değil',
    addExtrasHint: 'Yukarıdaki düğmeyi kullanarak bu kategoriye ekstra ekleyin.',
    confirmDelete: 'Bu kategoriyi silmek istediğinizden emin misiniz?',
    confirmDeleteExtra: 'Bu ekstrayi silmek istediğinizden emin misiniz?',
    unknownCategory: 'Bilinmeyen Kategori',
    unknownExtra: 'Bilinmeyen Ekstra',
    confirm: 'Onayla',
    selection: 'Seçim',
    quantity: 'Miktar',
    required: 'Zorunlu',
    optional: 'İsteğe Bağlı',
    requiredShort: 'Zor',
    basePrice: 'Temel Fiyat',
    unitPrice: 'Birim Fiyat',
    selectionMode: 'Seçim Modu',
    single: 'Tekli',
    multiple: 'Çoklu',
    singleSelect: 'Tekli Seçim',
    multiSelect: 'Çoklu Seçim',
    requiredExtra: 'Zorunlu Ekstra',
    defaultQty: 'Varsayılan Miktar',
    default: 'Varsayılan',
    defaultShort: 'Var.',
    minQty: 'Min Miktar',
    min: 'Min',
    maxQty: 'Maks Miktar',
    max: 'Maks',
    qty: 'Miktar',
    quantities: 'Miktarlar',
    quantityConfiguration: 'Miktar Yapılandırması',
    priceAndSelection: 'Fiyat ve Seçim',
    minSelection: 'Min Seçim',
    maxSelection: 'Maks Seçim',
    minQuantity: 'Min Miktar',
    maxQuantity: 'Maks Miktar',
    selectionLimits: 'Seçim Limitleri',
    quantityLimits: 'Miktar Limitleri',
    minSelectLabel: 'Min Seçim',
    maxSelectLabel: 'Maks Seçim',
    minTotalLabel: 'Min Toplam',
    maxTotalLabel: 'Maks Toplam'
  },
  
  recycleBin: {
    title: 'Geri Dönüşüm Kutusu',
    empty: 'Geri dönüşüm kutusu boş',
    restore: 'Geri Yükle',
    permanentDelete: 'Kalıcı Olarak Sil',
    confirmRestore: '"{name}" geri yüklensin mi?',
    confirmPermanentDelete: '"{name}" kalıcı olarak silinsin mi? Bu işlem geri alınamaz.'
  },

  errors: {
    loadCategories: 'Kategoriler yüklenirken hata',
    loadExtras: 'Ekstralar yüklenirken hata',
    uploadImage: 'Resim yüklenirken hata',
    deleteFailed: 'Öğe silinemedi',
    loadFailed: 'Veri yüklenemedi',
    saveFailed: 'Veri kaydedilemedi',
    updateFailed: 'Veri güncellenemedi',
    restoreFailed: 'Öğe geri yüklenemedi'
  },

  success: {
    categoryAdded: 'Kategori başarıyla eklendi',
    categoryUpdated: 'Kategori başarıyla güncellendi',
    categoryDeleted: 'Kategori başarıyla silindi',
    extraAdded: 'Ekstra başarıyla eklendi',
    extraUpdated: 'Ekstra başarıyla güncellendi',
    extraDeleted: 'Ekstra başarıyla silindi',
    restored: 'Başarıyla geri yüklendi'
  },
categoryConfigModal: {
  title: 'Şube Ekstralarını Yapılandır',
  productLabel: 'Ekstralar yapılandırılıyor:',
  searchPlaceholder: 'Kategorilerde ara...',
  errors: {
    loadFailed: 'Yapılandırma verileri yüklenemedi',
    saveFailed: 'Yapılandırma kaydedilemedi',
    generic: 'Bir hata oluştu'
  },
  stats: {
    selectedCategories: 'Kategoriler',
    selectedExtras: 'Ekstralar',
    available: 'Toplam Mevcut'
  },
  loading: {
    categories: 'Kategoriler ve ekstralar yükleniyor...'
  },
  empty: {
    noResults: 'Aramanızla eşleşen kategori yok',
    noCategories: 'Mevcut ekstra kategorisi yok'
  },
  badges: {
    required: 'Zorunlu',
    optional: 'İsteğe Bağlı',
    removal: 'Çıkarma'
  },
  category: {
    availableExtras: 'ekstra mevcut',
    configurationTitle: 'Kategori Kuralları',
    selectExtrasTitle: 'Ekstraları Seç',
    selectCategoryWarning: 'Ekstra seçimini etkinleştirmek için bu kategoriyi seçin'
  },
  fields: {
    minSelection: 'Min Seçim',
    maxSelection: 'Maks Seçim',
    minQuantity: 'Min Toplam Adet',
    maxQuantity: 'Maks Toplam Adet',
    overrideRequired: 'Zorunlu',
    specialPrice: 'Özel Fiyat',
    minQty: 'Min Adet',
    maxQty: 'Maks Adet',
    required: 'Zorunlu'
  },
  labels: {
    originalPrice: 'Orijinal',
    removesIngredient: 'Malzemeyi çıkarır',
    extraConfiguration: 'Ekstra Yapılandırması'
  },
  placeholders: {
    defaultPrice: 'Varsayılan'
  },
  messages: {
    removalPriceWarning: 'Çıkarma ekstraları için fiyat belirlenemez'
  },
  footer: {
    categoriesSelected: 'kategori seçildi',
    cancel: 'İptal',
    save: 'Değişiklikleri Kaydet',
    saving: 'Kaydediliyor...'
  }
}

},
      onboardingComplete: {
      "title": "Kayıt İşlemi Tamamlandı!",
      "message": "Restaurant ve şube bilgileriniz başarıyla kaydedildi. Giriş sayfasına yönlendiriliyorsunuz...",
      "redirectingIn": "saniye içinde yönlendirileceksiniz"
    },
  "countries": {
    "afghanistan": "Afganistan",
    "albania": "Arnavutluk",
    "algeria": "Cezayir",
    "andorra": "Andorra",
    "angola": "Angola",
    "argentina": "Arjantin",
    "armenia": "Ermenistan",
    "australia": "Avustralya",
    "austria": "Avusturya",
    "azerbaijan": "Azerbaycan",
    "bahamas": "Bahamalar",
    "bahrain": "Bahreyn",
    "bangladesh": "Bangladeş",
    "barbados": "Barbados",
    "belarus": "Belarus",
    "belgium": "Belçika",
    "belize": "Belize",
    "benin": "Benin",
    "bhutan": "Butan",
    "bolivia": "Bolivya",
    "bosnia": "Bosna Hersek",
    "botswana": "Botsvana",
    "brazil": "Brezilya",
    "brunei": "Bruney",
    "bulgaria": "Bulgaristan",
    "burkina_faso": "Burkina Faso",
    "burundi": "Burundi",
    "cambodia": "Kamboçya",
    "cameroon": "Kamerun",
    "canada": "Kanada",
    "cape_verde": "Yeşil Burun Adaları",
    "central_african_republic": "Orta Afrika Cumhuriyeti",
    "chad": "Çad",
    "chile": "Şili",
    "china": "Çin",
    "colombia": "Kolombiya",
    "comoros": "Komorlar",
    "congo": "Kongo",
    "costa_rica": "Kosta Rika",
    "croatia": "Hırvatistan",
    "cuba": "Küba",
    "cyprus": "Kıbrıs",
    "czech_republic": "Çek Cumhuriyeti",
    "denmark": "Danimarka",
    "djibouti": "Cibuti",
    "dominica": "Dominika",
    "dominican_republic": "Dominik Cumhuriyeti",
    "ecuador": "Ekvador",
    "egypt": "Mısır",
    "el_salvador": "El Salvador",
    "equatorial_guinea": "Ekvator Ginesi",
    "eritrea": "Eritre",
    "estonia": "Estonya",
    "ethiopia": "Etiyopya",
    "fiji": "Fiji",
    "finland": "Finlandiya",
    "france": "Fransa",
    "gabon": "Gabon",
    "gambia": "Gambiya",
    "georgia": "Gürcistan",
    "germany": "Almanya",
    "ghana": "Gana",
    "greece": "Yunanistan",
    "grenada": "Grenada",
    "guatemala": "Guatemala",
    "guinea": "Gine",
    "guinea_bissau": "Gine-Bissau",
    "guyana": "Guyana",
    "haiti": "Haiti",
    "honduras": "Honduras",
    "hungary": "Macaristan",
    "iceland": "İzlanda",
    "india": "Hindistan",
    "indonesia": "Endonezya",
    "iran": "İran",
    "iraq": "Irak",
    "ireland": "İrlanda",
    "italy": "İtalya",
    "jamaica": "Jamaika",
    "japan": "Japonya",
    "jordan": "Ürdün",
    "kazakhstan": "Kazakistan",
    "kenya": "Kenya",
    "kiribati": "Kiribati",
    "kuwait": "Kuveyt",
    "kyrgyzstan": "Kırgızistan",
    "laos": "Laos",
    "latvia": "Letonya",
    "lebanon": "Lübnan",
    "lesotho": "Lesotho",
    "liberia": "Liberya",
    "libya": "Libya",
    "liechtenstein": "Lihtenştayn",
    "lithuania": "Litvanya",
    "luxembourg": "Lüksemburg",
    "madagascar": "Madagaskar",
    "malawi": "Malavi",
    "malaysia": "Malezya",
    "maldives": "Maldivler",
    "mali": "Mali",
    "malta": "Malta",
    "marshall_islands": "Marshall Adaları",
    "mauritania": "Moritanya",
    "mauritius": "Mauritius",
    "mexico": "Meksika",
    "micronesia": "Mikronezya",
    "moldova": "Moldova",
    "monaco": "Monako",
    "mongolia": "Moğolistan",
    "montenegro": "Karadağ",
    "morocco": "Fas",
    "mozambique": "Mozambik",
    "myanmar": "Myanmar",
    "namibia": "Namibya",
    "nauru": "Nauru",
    "nepal": "Nepal",
    "netherlands": "Hollanda",
    "new_zealand": "Yeni Zelanda",
    "nicaragua": "Nikaragua",
    "niger": "Nijer",
    "nigeria": "Nijerya",
    "north_korea": "Kuzey Kore",
    "north_macedonia": "Kuzey Makedonya",
    "norway": "Norveç",
    "oman": "Umman",
    "pakistan": "Pakistan",
    "palau": "Palau",
    "palestine": "Filistin",
    "panama": "Panama",
    "papua_new_guinea": "Papua Yeni Gine",
    "paraguay": "Paraguay",
    "peru": "Peru",
    "philippines": "Filipinler",
    "poland": "Polonya",
    "portugal": "Portekiz",
    "qatar": "Katar",
    "romania": "Romanya",
    "russia": "Rusya",
    "rwanda": "Ruanda",
    "saint_kitts": "Saint Kitts ve Nevis",
    "saint_lucia": "Saint Lucia",
    "saint_vincent": "Saint Vincent ve Grenadinler",
    "samoa": "Samoa",
    "san_marino": "San Marino",
    "sao_tome": "São Tomé ve Príncipe",
    "saudi_arabia": "Suudi Arabistan",
    "senegal": "Senegal",
    "serbia": "Sırbistan",
    "seychelles": "Seyşeller",
    "sierra_leone": "Sierra Leone",
    "singapore": "Singapur",
    "slovakia": "Slovakya",
    "slovenia": "Slovenya",
    "solomon_islands": "Solomon Adaları",
    "somalia": "Somali",
    "south_africa": "Güney Afrika",
    "south_korea": "Güney Kore",
    "south_sudan": "Güney Sudan",
    "spain": "İspanya",
    "sri_lanka": "Sri Lanka",
    "sudan": "Sudan",
    "suriname": "Surinam",
    "sweden": "İsveç",
    "switzerland": "İsviçre",
    "syria": "Suriye",
    "taiwan": "Tayvan",
    "tajikistan": "Tacikistan",
    "tanzania": "Tanzanya",
    "thailand": "Tayland",
    "timor_leste": "Doğu Timor",
    "togo": "Togo",
    "tonga": "Tonga",
    "trinidad": "Trinidad ve Tobago",
    "tunisia": "Tunus",
    "turkey": "Türkiye",
    "turkmenistan": "Türkmenistan",
    "tuvalu": "Tuvalu",
    "uganda": "Uganda",
    "ukraine": "Ukrayna",
    "uae": "Birleşik Arap Emirlikleri",
    "united_kingdom": "Birleşik Krallık",
    "united_states": "Amerika Birleşik Devletleri",
    "uruguay": "Uruguay",
    "uzbekistan": "Özbekistan",
    "vanuatu": "Vanuatu",
    "vatican": "Vatikan",
    "venezuela": "Venezuela",
    "vietnam": "Vietnam",
    "yemen": "Yemen",
    "zambia": "Zambiya",
    "zimbabwe": "Zimbabve"
  },

  // Legal Pages
  legal: {
    terms: {
      title: 'Hizmet Şartları',
      lastUpdated: 'Son Güncelleme: Aralık 2025',
      sections: {
        introduction: {
          title: '1. Giriş',
          content: 'QR Menu\'ya ("biz", "bize" veya "bizim") hoş geldiniz. Bu Hizmet Şartları ("Şartlar"), dijital menü platformumuz ve hizmetlerimize erişiminizi ve kullanımınızı düzenler. Hizmetlerimize erişerek veya kullanarak, bu Şartlara bağlı kalmayı kabul edersiniz. Bu Şartların herhangi bir bölümünü kabul etmiyorsanız, hizmetlerimizi kullanamazsınız.'
        },
        acceptance: {
          title: '2. Şartların Kabulü',
          content: 'Bir hesap oluşturarak, platformumuza erişerek veya hizmetlerimizden herhangi birini kullanarak, bu Şartları ve Gizlilik Politikamızı okuduğunuzu, anladığınızı ve bunlara bağlı kalmayı kabul ettiğinizi onaylarsınız. Bu Şartlar, restoranlar, restoran sahipleri, personel üyeleri ve son müşteriler dahil olmak üzere hizmetin tüm kullanıcıları için geçerlidir.'
        },
        services: {
          title: '3. Hizmetlerin Açıklaması',
          content: 'QR Menu, restoranlar ve yemek hizmetleri işletmeleri için kapsamlı bir dijital menü çözümü sağlar. Hizmetlerimiz bunlarla sınırlı olmamak üzere şunları içerir:',
          features: {
            0: 'Dijital menü oluşturma ve yönetimi',
            1: 'Masa ve paket servis siparişleri için QR kod oluşturma',
            2: 'Sipariş yönetimi ve takip sistemi',
            3: 'Analiz ve raporlama araçları'
          }
        },
        userResponsibilities: {
          title: '4. Kullanıcı Sorumlulukları',
          content: 'QR Menu kullanıcısı olarak şunları kabul edersiniz:',
          items: {
            0: 'Hesap oluştururken doğru ve eksiksiz bilgi sağlamak',
            1: 'Hesap kimlik bilgilerinizin güvenliğini ve gizliliğini korumak',
            2: 'Hizmeti tüm geçerli yasa ve düzenlemelere uygun olarak kullanmak',
            3: 'Hizmeti yasa dışı, zararlı veya dolandırıcılık amaçlı kullanmamak'
          }
        },
        payment: {
          title: '5. Ödeme Koşulları',
          content: 'Abonelik ücretleri, seçtiğiniz plana bağlı olarak aylık veya yıllık olarak peşin faturalandırılır. Tüm ücretler, yasaların gerektirdiği durumlar dışında iade edilemez. Mevcut müşterilere 30 gün önceden haber vererek fiyatlandırmamızı değiştirme hakkını saklı tutarız. Ücretlerin ödenmemesi, hesabınızın askıya alınmasına veya sonlandırılmasına neden olabilir.'
        },
        termination: {
          title: '6. Sonlandırma',
          content: 'Hesabınızı istediğiniz zaman hesap ayarlarınız aracılığıyla sonlandırabilirsiniz. Bu Şartları ihlal ederseniz veya hizmetimize veya diğer kullanıcılara zarar veren faaliyetlerde bulunursanız, hesabınızı askıya alma veya sonlandırma hakkını saklı tutarız. Sonlandırma üzerine, hizmeti kullanma hakkınız derhal sona erecektir, ancak bu Şartların belirli hükümleri sonlandırmadan sonra da geçerliliğini sürdürecektir.'
        },
        intellectualProperty: {
          title: '7. Fikri Mülkiyet',
          content: 'Metin, grafikler, logolar ve yazılım dahil ancak bunlarla sınırlı olmamak üzere QR Menu\'nun tüm içeriği, özellikleri ve işlevselliği bizim veya lisans verenlerimizin mülkiyetindedir ve uluslararası telif hakkı, ticari marka ve diğer fikri mülkiyet yasaları ile korunmaktadır. Açık yazılı iznimiz olmadan hizmetimizi kopyalayamaz, değiştiremez, dağıtamaz veya türev eserler oluşturamazsınız.'
        },
        liability: {
          title: '8. Sorumluluk Sınırlaması',
          content: 'Yasaların izin verdiği azami ölçüde, QR Menu ve bağlı kuruluşları, hizmeti kullanımınız veya kullanamamanızdan kaynaklanan dolaylı, arızi, özel, sonuçsal veya cezai zararlardan sorumlu olmayacaktır. Bu Şartlardan veya hizmetin kullanımından kaynaklanan herhangi bir talep için toplam sorumluluğumuz, talebi önceki on iki ayda bize ödediğiniz tutarı aşmayacaktır.'
        },
        changes: {
          title: '9. Şartlarda Değişiklikler',
          content: 'Bu Şartları istediğimiz zaman değiştirme hakkını saklı tutarız. Herhangi bir önemli değişikliği kullanıcılara e-posta veya platformumuz aracılığıyla bildireceğiz. Bu tür değişikliklerden sonra hizmeti kullanmaya devam etmeniz, güncellenmiş Şartları kabul ettiğiniz anlamına gelir. Bu Şartları düzenli olarak gözden geçirmenizi öneririz.'
        },
        contact: {
          title: 'Bize Ulaşın',
          content: 'Bu Hizmet Şartları hakkında herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin:'
        }
      }
    },
    privacy: {
      title: 'Gizlilik Politikası',
      lastUpdated: 'Son Güncelleme: Aralık 2025',
      sections: {
        introduction: {
          title: '1. Giriş',
          content: 'QR Menu olarak gizliliğinizi ciddiye alıyoruz. Bu Gizlilik Politikası, dijital menü platformumuzu kullandığınızda bilgilerinizi nasıl topladığımızı, kullandığımızı, ifşa ettiğimizi ve koruduğumuzu açıklar. Hizmetlerimizi kullanarak, bu politikada açıklanan veri uygulamalarına onay vermiş olursunuz.'
        },
        dataCollection: {
          title: '2. Topladığımız Bilgiler',
          content: 'Hizmetlerimizi sağlamak ve geliştirmek için çeşitli türde bilgiler topluyoruz:',
          items: {
            0: 'Kişisel Bilgiler: Kayıt sırasında sağlanan ad, e-posta adresi, telefon numarası ve işletme detayları',
            1: 'İşletme Bilgileri: Restoran detayları, menü öğeleri, fiyatlandırma ve operasyonel veriler',
            2: 'Kullanım Verileri: Erişim süreleri ve kullanılan özellikler dahil olmak üzere platformumuzla nasıl etkileşimde bulunduğunuza dair bilgiler',
            3: 'Cihaz Bilgileri: IP adresi, tarayıcı türü, işletim sistemi ve cihaz tanımlayıcıları',
            4: 'Ödeme Bilgileri: Fatura detayları ve işlem geçmişi (üçüncü taraf ödeme sağlayıcıları aracılığıyla güvenli bir şekilde işlenir)'
          }
        },
        dataUsage: {
          title: '3. Bilgilerinizi Nasıl Kullanıyoruz',
          content: 'Toplanan bilgileri çeşitli amaçlar için kullanıyoruz:',
          items: {
            0: 'Hizmetlerimizi sağlamak, sürdürmek ve geliştirmek',
            1: 'İşlemleri gerçekleştirmek ve ilgili bilgileri göndermek',
            2: 'Yönetimsel bilgiler, güncellemeler ve güvenlik uyarıları göndermek',
            3: 'Müşteri hizmetleri taleplerine ve destek ihtiyaçlarına yanıt vermek',
            4: 'Kullanım modellerini analiz etmek ve kullanıcı deneyimini optimize etmek'
          }
        },
        dataSecurity: {
          title: '4. Veri Güvenliği',
          content: 'Bilgilerinizi korumak için şifreleme, güvenli sunucular ve düzenli güvenlik denetimleri dahil olmak üzere endüstri standardı güvenlik önlemleri uyguluyoruz. Ancak, internet üzerinden hiçbir aktarım yöntemi %100 güvenli değildir ve verilerinizin mutlak güvenliğini garanti edemeyiz. Güçlü parolalar kullanmanızı ve hesap kimlik bilgilerinizi gizli tutmanızı öneririz.'
        },
        dataSharing: {
          title: '5. Veri Paylaşımı ve İfşa',
          content: 'Kişisel bilgilerinizi satmıyoruz. Bilgilerinizi yalnızca aşağıdaki durumlarda paylaşabiliriz:',
          items: {
            0: 'Platformumuzu işletmemize yardımcı olan hizmet sağlayıcılarla (sıkı gizlilik anlaşmaları altında)',
            1: 'Yasa tarafından gerekli olduğunda veya yasal haklarımızı korumak için',
            2: 'Bir iş transferi, birleşme veya satın alma ile bağlantılı olarak (kullanıcılara önceden bildirimle)'
          }
        },
        cookies: {
          title: '6. Çerezler ve İzleme Teknolojileri',
          content: 'Deneyiminizi geliştirmek, kullanım modellerini analiz etmek ve kişiselleştirilmiş içerik sunmak için çerezler ve benzer izleme teknolojileri kullanıyoruz. Tarayıcı ayarlarınız aracılığıyla çerez tercihlerini kontrol edebilirsiniz, ancak çerezleri devre dışı bırakmak hizmetimizin belirli özelliklerini sınırlayabilir.'
        },
        userRights: {
          title: '7. Haklarınız',
          content: 'Kişisel bilgilerinizle ilgili belirli haklarınız vardır:',
          items: {
            0: 'Erişim: Hakkınızda tuttuğumuz kişisel bilgilerin bir kopyasını talep edin',
            1: 'Düzeltme: Yanlış veya eksik bilgilerin düzeltilmesini talep edin',
            2: 'Silme: Kişisel bilgilerinizin silinmesini talep edin (yasal yükümlülüklere tabi)',
            3: 'Veri Taşınabilirliği: Verilerinizin başka bir hizmete aktarılmasını talep edin',
            4: 'Vazgeçme: Pazarlama iletişimlerinden istediğiniz zaman abonelikten çıkın'
          }
        },
        childrenPrivacy: {
          title: '8. Çocukların Gizliliği',
          content: 'Hizmetlerimiz 18 yaşın altındaki bireyler için tasarlanmamıştır. Ebeveyn izni olmadan çocuklardan bilerek kişisel bilgi toplamıyoruz. Ebeveyn izni olmadan bir çocuktan bilgi topladığımızı fark edersek, bu bilgiyi silmek için adımlar atacağız.'
        },
        changes: {
          title: '9. Bu Gizlilik Politikasındaki Değişiklikler',
          content: 'Bu Gizlilik Politikasını zaman zaman uygulamalarımızdaki veya yasal gerekliliklerdeki değişiklikleri yansıtmak için güncelleyebiliriz. Güncellenen politikayı platformumuzda yayınlayarak ve "Son Güncelleme" tarihini güncelleyerek herhangi bir önemli değişikliği size bildireceğiz. Bu politikayı düzenli olarak gözden geçirmenizi öneririz.'
        },
        contact: {
          title: 'Bize Ulaşın',
          content: 'Bu Gizlilik Politikası veya veri uygulamalarımız hakkında herhangi bir sorunuz veya endişeniz varsa, lütfen bizimle iletişime geçin:'
        }
      }
    }
  },
};
