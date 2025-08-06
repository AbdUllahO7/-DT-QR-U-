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
    products: {
      title: 'Ürünler',
      description: 'Ürünlerinizi görüntüleyin ve yönetin.'
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

  // Branch Management
  branchManagement: {
    loading: 'Şubeler yükleniyor...',
    error: {
      loadFailed: 'Şube listesi yüklenirken bir hata oluştu.',
      updateFailed: 'Şube güncellenirken bir hata oluştu.',
      createFailed: 'Şube eklenirken bir hata oluştu.',
      deleteFailed: 'Şube silinirken bir hata oluştu.',
      restaurantIdNotFound: 'Restaurant ID bulunamadı. Lütfen tekrar giriş yapın.',
      noBranchesFound: 'Şube bulunamadı'
    },
    actions: {
      addBranch: 'Şube Ekle',
      editBranch: 'Şube Düzenle',
      deleteBranch: 'Şube Sil',
      selectBranch: 'Şube Seçin',
      save: 'Kaydet',
      cancel: 'İptal',
      close: 'Kapat'
    },
    confirmation: {
      deleteTitle: 'Şubeyi Sil',
      deleteMessage: 'Bu şubeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      deleteConfirm: 'Evet, Sil',
      deleteCancel: 'İptal'
    },
    form: {
      branchName: 'Şube Adı',
      whatsappNumber: 'WhatsApp Numarası',
      address: 'Adres',
      phone: 'Telefon',
      email: 'E-posta',
      workingHours: 'Çalışma Saatleri',
      logo: 'Logo'
    },
    title : "Şubeler",
    description : "Şubelerinizi Yönetin"
  },

  // Table Management
  tableManagement: {
    loading: 'Masalar yükleniyor...',
    title: 'Masa Yönetimi',
    description: 'QR kodlarınızı ve masalarınızı yönetin',
    error: {
      loadFailed: 'Şube listesi yüklenemedi',
      dataLoadFailed: 'Veriler yüklenirken bir hata oluştu'
    },
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

  // Profile
  profile: {
    title: 'Profil',
    description: 'Kişisel bilgilerinizi görüntüleyin ve düzenleyin',
    error: {
      loadFailed: 'Profil verisi alınamadı'
    },
    personalInfo: 'Kişisel Bilgiler',
    accountSettings: 'Hesap Ayarları',
    security: 'Güvenlik',
    preferences: 'Tercihler',
    actions: {
      save: 'Kaydet',
      cancel: 'İptal',
      changePassword: 'Şifre Değiştir',
      updateProfile: 'Profili Güncelle'
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
}; 