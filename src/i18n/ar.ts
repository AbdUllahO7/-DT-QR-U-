

export const ar = {
  // Common
  common: {
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    search: 'بحث',
    filter: 'تصفية',
    close: 'إغلاق',
    open: 'فتح',
    yes: 'نعم',
    no: 'لا',
    next: 'التالي',
    previous: 'السابق',
    continue: 'متابعة',
    refresh: 'تحديث الصفحة',
    clear: 'مسح',
    filters: 'المرشحات',
    allStatuses: 'جميع الحالات',
    pending: 'في الانتظار',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
    dateRange: 'نطاق التاريخ',
    today: 'اليوم',
    yesterday: 'أمس',
    last7Days: 'آخر 7 أيام',
    last30Days: 'آخر 30 يوم',
    thisMonth: 'هذا الشهر',
    lastMonth: 'الشهر الماضي'
  },
  filter: {
      "status": "الحالة",
      "all": "الكل",
      "active": "نشط",
      "inactive": "غير نشط",
      "categories": "الفئات",
      allergenic:"مسببات الحساسية",
      nonallergenic:"غير مسبب للحساسية",
      specific:{
        allergens : "مسببات الحساسية"
      },
      "price": {
        "range": "نطاق السعر",
        "min": "أقل سعر",
        "max": "أعلى سعر"
      }
  },
  sort: {
    "title": "ترتيب حسب",
    "name": {
      "asc": "الاسم (أ-ي)",
      "desc": "الاسم (ي-أ)"
    },
    "price": {
      "asc": "السعر (من الأقل إلى الأعلى)",
      "desc": "السعر (من الأعلى إلى الأقل)"
    },
    "order": {
      "asc": "ترتيب العرض (الأول إلى الأخير)",
      "desc": "ترتيب العرض (الأخير إلى الأول)"
    },
    "created": {
      "asc": "تاريخ الإنشاء (الأقدم أولاً)",
      "desc": "تاريخ الإنشاء (الأحدث أولاً)"
    }
  },
  clear: {
    "filters": "مسح المرشحات",
    "all": "مسح الكل"
  },
  restaurantManagement : {
    tabs : {
      general : "عام",
      legal : "قانوني",
        about : "حول",
    },
        GeneralInformation: "معلومات عامة"

  },

  // Navigation
  nav: {
    home: 'الرئيسية',
    features: 'المميزات',
    pricing: 'الأسعار',
    testimonials: 'الشهادات',
    faq: 'الأسئلة الشائعة',
    contact: 'اتصل بنا',
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    logout: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    dashboard: 'لوحة التحكم',
    goToPanel: 'انتقل إلى اللوحة'
  },

  // Auth
  auth: {
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور',
    rememberMe: 'تذكرني',
    alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب'
  },

  // Hero Section
  hero: {
    title: {
      line1: 'رقمن مطعمك',
      line2: 'باستخدام',
      line3: 'قائمة QR'
    },
    subtitle: 'يمكن لعملائك الوصول إلى قائمتك فوراً عن طريق مسح رمز QR. قدم تجربة بدون لمس وسريعة وحديثة.',
    features: {
      qrAccess: 'وصول سريع برمز QR',
      mobileOptimized: 'محسن للجوال',
      instantUpdate: 'تحديث فوري'
    },
    cta: {
      getStarted: 'ابدأ الآن',
      features: 'المميزات'
    },
    socialProof: {
      restaurants: '+500 مطعم سعيد',
      satisfaction: '99% رضا العملاء'
    }
  },

  // Dashboard Navigation
  dashboard: {
    overview: {
      title: 'نظرة عامة',
      description: 'اعرض الحالة العامة لمطعمك.',
      kpis: {
        totalViews: 'إجمالي المشاهدات',
        qrScans: 'مسح رموز QR',
        totalOrders: 'إجمالي الطلبات',
        customerRating: 'تقييم العملاء',
        changeTexts: {
          lastWeek: 'مقارنة بالأسبوع الماضي',
          lastMonth: 'مقارنة بالشهر الماضي',
          thisWeek: 'هذا الأسبوع'
        }
      },
      quickStats: {
        thisMonth: 'هذا الشهر',
        totalOrders: 'إجمالي الطلبات',
        average: 'متوسط',
        dailyOrders: 'الطلبات اليومية',
        new: 'جديد',
        customers: 'العملاء',
        rating: 'التقييم',
        totalCount: 'العدد الإجمالي'
      },
      charts: {
        weeklyActivity: 'النشاط الأسبوعي',
        popularProducts: 'المنتجات الشائعة',
        monthlyRevenue: 'الإيرادات الشهرية'
      }
    },
    branches: {
      title: 'إدارة الفروع',
      description: 'إدارة فروعك وإضافة فروع جديدة.',
      error: {
        loadFailed: 'فشل في تحميل الفروع',
        createFailed: 'فشل في إنشاء الفرع',
        updateFailed: 'فشل في تحديث الفرع',
        deleteFailed: 'فشل في حذف الفرع',
        statusUpdateFailed: 'فشل في تحديث حالة الفرع',
        detailsLoadFailed: 'فشل في تحميل تفاصيل الفرع',
        restaurantIdNotFound: 'معرف المطعم غير موجود'
      },
      delete: {
        title: 'حذف الفرع',
        confirmMessage: 'هل أنت متأكد من أنك تريد حذف الفرع "{branchName}"؟ لا يمكن التراجع عن هذا الإجراء.'
      }
    },
    orders: {
      title: 'الطلبات',
      description: 'عرض وإدارة الطلبات.',
      loading: 'جاري تحميل الطلبات...',
      refresh: 'تحديث',
      newOrder: 'طلب جديد',
      tabs: {
        all: 'الكل',
        pending: 'في الانتظار',
        preparing: 'قيد التحضير',
        ready: 'جاهز',
        delivered: 'تم التسليم',
        cancelled: 'ملغي'
      },
      status: {
        pending: 'في الانتظار',
        preparing: 'قيد التحضير',
        ready: 'جاهز',
        delivered: 'تم التسليم',
        cancelled: 'ملغي'
      },
      stats: {
        totalOrders: 'إجمالي الطلبات',
        totalRevenue: 'إجمالي الإيرادات',
        pendingOrders: 'الطلبات المعلقة',
        avgOrderValue: 'متوسط قيمة الطلب'
      }
    },
    ingredients : {
      title : "المكونات"
    },
    orderType: {
        title: "إعدادات أنواع الطلبات",
        subtitle: "إدارة حالة التفعيل والحد الأدنى لقيمة الطلب ورسوم الخدمة لأنواع الطلبات",
        loading: "جاري تحميل أنواع الطلبات...",
        pleaseWait: "يرجى الانتظار",
        settingsUpdated: "تم تحديث الإعدادات بنجاح",
        updateError: "حدث خطأ أثناء تحديث الإعدادات",
        loadingError: "حدث خطأ أثناء تحميل أنواع الطلبات",
        active: "نشط",
        minutes: "دقيقة",
        requirements: "المتطلبات",
        table: "طاولة",
        address: "عنوان",
        phone: "هاتف",
        activeStatus: "الحالة النشطة",
        activeStatusDescription: "تفعيل/إلغاء تفعيل نوع الطلب هذا",
        minOrderAmount: "الحد الأدنى لقيمة الطلب",
        serviceCharge: "رسوم الخدمة",
        saveSettings: "حفظ الإعدادات",
        updating: "جاري التحديث...",
        totalOrderTypes: "إجمالي أنواع الطلبات",
        activeTypes: "الأنواع النشطة",
        totalActiveOrders: "إجمالي الطلبات النشطة",
        estimatedTime: "الوقت المقدر"
      },
    products : {
      title : "المنتجات",
      description: 'عرض وإدارة المنتجات.',
    },
    tables: {
      title: 'إدارة الطاولات',
      description: 'عمليات إدارة الطاولات.',
      loading: 'جاري تحميل الطاولات...',
      selectBranch: 'يرجى اختيار فرع لإدارة الطاولات',
      noCategories: 'لا توجد فئات طاولات في هذا الفرع بعد',
      tableCount: 'طاولات',
      newTable: 'إضافة طاولة جديدة'
    },
    users: {
      title: 'إدارة المستخدمين',
      description: 'إدارة المستخدمين والأدوار والصلاحيات.',
      loading: 'جاري تحميل المستخدمين...',
      tabs: {
        users: 'المستخدمين',
        roles: 'الأدوار'
      },
      stats: {
        total: 'إجمالي',
        active: 'نشط',
        users: 'مستخدم',
        roles: 'دور',
        system: 'النظام',
        custom: 'مخصص',
        totalUsers: 'إجمالي المستخدمين'
      },
      error: {
        loadFailed: 'فشل في تحميل المستخدمين',
        rolesLoadFailed: 'فشل في تحميل الأدوار',
        createRoleFailed: 'فشل في إنشاء الدور',
        createUserFailed: 'فشل في إنشاء المستخدم'
      }
    },
    settings: {
      title: 'الإعدادات',
      description: 'إدارة إعدادات حسابك.'
    },
    profile: {
      title: 'الملف الشخصي',
      description: 'عرض معلوماتك الشخصية.',
      error: {
        loadFailed: 'فشل في تحميل معلومات الملف الشخصي'
      },
      restaurantInfo: 'معلومات المطعم'
    },
    restaurant: {
      title: 'إدارة المطعم',
      description: 'إدارة معلومات وإعدادات مطعمك.',
      loading: 'جاري تحميل معلومات المطعم...',
      restaurantName: 'اسم المطعم',
      restaurantStatus: 'حالة المطعم',
      restaurantLogo: 'شعار المطعم',
      companyInfo: 'معلومات الشركة',
      addAboutInfo: 'إضافة معلومات حول المطعم',
      placeholders: {
        restaurantName: 'أدخل اسم المطعم',
        aboutStory: 'قصة مطعمنا',
        aboutDetails: 'قدم معلومات مفصلة حول مطعمك...'
      }
    },
    sidebar: {
      title : "قائمة QR",
      logout: 'تسجيل الخروج',
      branch: 'فرع'
    },
    RestaurantManagement : {
      title : "إدارة المطعم"
    },
    branchManagementTitle: "إدارة الفروع" 
  },

  // Theme
  theme: {
    toggleToDark: 'التبديل إلى الوضع المظلم',
    toggleToLight: 'التبديل إلى الوضع المضيء',
    dark: 'مظلم',
    light: 'مضيء'
  },

  // Language
  language: {
    turkish: 'Türkçe',
    english: 'English',
    arabic: 'العربية',
    selectLanguage: 'اختر اللغة'
  },

  // Settings
  settings: {
    title: 'الإعدادات',
    description: 'إدارة إعدادات حسابك وتفضيلاتك',
    save: 'حفظ',
    saveSuccess: 'تم حفظ الإعدادات بنجاح.',
    tabs: {
      general: 'عام',
      notifications: 'الإشعارات',
      privacy: 'الخصوصية',
      appearance: 'المظهر',
      data: 'البيانات'
    },
    general: {
      title: 'الإعدادات العامة',
      description: 'تكوين إعدادات حسابك الأساسية',
      language: 'اللغة',
      timezone: 'المنطقة الزمنية',
      dateFormat: 'تنسيق التاريخ',
      currency: 'العملة',
      autoSave: {
        title: 'الحفظ التلقائي',
        description: 'إدارة إعدادات الحفظ التلقائي',
        enabled: 'الحفظ التلقائي',
        enabledDesc: 'يحفظ تغييراتك تلقائياً',
        dataSync: 'مزامنة البيانات',
        dataSyncDesc: 'مزامنة بياناتك بين الأجهزة'
      }
    },
    notifications: {
      title: 'إعدادات الإشعارات',
      description: 'إدارة تفضيلات الإشعارات',
      enabled: 'تفعيل الإشعارات',
      enabledDesc: 'تفعيل جميع الإشعارات',
      email: 'إشعارات البريد الإلكتروني',
      emailDesc: 'استلام بريد إلكتروني للتحديثات المهمة',
      push: 'الإشعارات الفورية',
      pushDesc: 'استلام إشعارات فورية',
      sound: 'إشعارات الصوت',
      soundDesc: 'تفعيل أصوات الإشعارات'
    },
    privacy: {
      title: 'الخصوصية والأمان',
      description: 'إدارة أمان حسابك وإعدادات الخصوصية',
      twoFactor: 'المصادقة الثنائية',
      twoFactorDesc: 'حماية حسابك بأمان إضافي',
      autoLogout: 'تسجيل الخروج التلقائي',
      autoLogoutDesc: 'تسجيل الخروج بعد 30 دقيقة من عدم النشاط',
      analytics: 'مشاركة البيانات التحليلية',
      analyticsDesc: 'مشاركة بيانات مجهولة للتطوير'
    },
    appearance: {
      title: 'إعدادات المظهر',
      description: 'تخصيص تفضيلات الواجهة',
      darkMode: 'تفعيل الوضع المظلم',
      lightMode: 'تفعيل الوضع المضيء',
      darkModeDesc: 'استخدام السمة المظلمة',
      lightModeDesc: 'استخدام السمة المضيئة',
      compact: 'العرض المضغوط',
      compactDesc: 'تصميم مضغوط يستخدم مساحة أقل',
      animations: 'الرسوم المتحركة',
      animationsDesc: 'تفعيل رسوم الواجهة المتحركة'
    },
    data: {
      title: 'إدارة البيانات',
      description: 'النسخ الاحتياطي أو حذف بياناتك',
      download: 'تحميل البيانات',
      downloadDesc: 'تحميل جميع بياناتك',
      upload: 'رفع البيانات',
      uploadDesc: 'رفع البيانات من النسخة الاحتياطية',
      delete: 'حذف البيانات',
      deleteDesc: 'حذف جميع البيانات',
      storage: 'التخزين',
      storageDesc: 'إدارة مساحة التخزين'
    }
  },

  // Notifications
  notifications: {
    title: 'الإشعارات',
    empty: 'لا توجد إشعارات',
    markAllAsRead: 'تعيين الكل كمقروء'
  },

  // Brand
  brand: {
    name: 'QR Menu',
    slogan: 'حل المطاعم الرقمي'
  },

  // Features
  features: {
    title: 'لماذا',
    titleHighlight: 'QR Menu؟',
    subtitle: 'حسن تجربة العملاء وانقل عملك إلى العصر الرقمي بميزات قوية مصممة للمطاعم الحديثة.',
    list: {
      qrAccess: {
        title: 'وصول فوري برمز QR',
        description: 'يمكن لعملائك الوصول إلى قائمتك فوراً عن طريق مسح رمز QR على الطاولة. لا يتطلب تحميل تطبيق.'
      },
      mobileOptimized: {
        title: 'محسن للجوال',
        description: 'عرض مثالي على جميع الأجهزة. تجربة مثلى على الهاتف والجهاز اللوحي وسطح المكتب بتصميم متجاوب.'
      },
      instantUpdate: {
        title: 'تحديث فوري',
        description: 'يتم نشر تغييرات قائمتك فوراً. تحديثات الأسعار والمنتجات الجديدة تظهر فوراً.'
      },
      analytics: {
        title: 'تحليلات مفصلة',
        description: 'احصل على تقارير حول المنتجات الأكثر مشاهدة وسلوك العملاء واتجاهات المبيعات.'
      },
      alwaysOpen: {
        title: 'وصول على مدار الساعة',
        description: 'يمكن لعملائك مشاهدة قائمتك في أي وقت. متاح حتى خارج ساعات المطعم.'
      },
      secure: {
        title: 'آمن وسريع',
        description: 'آمن بشهادة SSL، صفحات سريعة التحميل. معلومات العملاء محمية.'
      },
      customizable: {
        title: 'تصميم قابل للتخصيص',
        description: 'خيارات ألوان وخطوط وتصميم مناسبة لأسلوب مطعمك. اعكس هوية علامتك التجارية.'
      },
      multiLanguage: {
        title: 'دعم متعدد اللغات',
        description: 'يمكنك تقديم قائمتك بلغات متعددة. اجذب عملائك الدوليين.'
      }
    },
    cta: {
      title: 'هل أنت مستعد لرقمنة مطعمك؟',
      subtitle: 'ابدأ اليوم وقدم لعملائك تجربة حديثة. الإعداد يستغرق 5 دقائق فقط!',
      button: 'جرب مجاناً'
    }
  },

  // Footer
  footer: {
    description: 'حل قائمة رقمية حديث وسريع وآمن للمطاعم. حسن تجربة العملاء ورقمن عملك.',
    contact: {
      phone: '+90 212 345 67 89',
      email: 'info@qrmenu.com',
      address: 'ماسلاك، إسطنبول'
    },
    sections: {
      product: {
        title: 'المنتج',
        links: {
          features: 'المميزات',
          pricing: 'الأسعار', 
          demo: 'عرض توضيحي',
          api: 'وثائق API'
        }
      },
      company: {
        title: 'الشركة',
        links: {
          about: 'معلومات عنا',
          blog: 'المدونة',
          careers: 'الوظائف',
          contact: 'اتصل بنا'
        }
      },
      support: {
        title: 'الدعم',
        links: {
          helpCenter: 'مركز المساعدة',
          faq: 'الأسئلة الشائعة',
          liveSupport: 'الدعم المباشر',
          tutorials: 'فيديوهات تعليمية'
        }
      },
      legal: {
        title: 'قانوني',
        links: {
          privacy: 'سياسة الخصوصية',
          terms: 'شروط الخدمة',
          cookies: 'سياسة ملفات تعريف الارتباط',
          gdpr: 'GDPR'
        }
      }
    },
    newsletter: {
      title: 'ابق محدثاً',
      subtitle: 'احصل على معلومات حول الميزات الجديدة والتحديثات.',
      placeholder: 'عنوان بريدك الإلكتروني',
      button: 'اشترك'
    },
    bottom: {
      copyright: 'جميع الحقوق محفوظة.',
      madeWith: 'مصمم ومطور في تركيا ❤️'
    }
  },

  // Auth Pages
  pages: {
    login: {
      title: 'تسجيل الدخول',
      subtitle: 'سجل دخولك إلى حساب QR Menu الخاص بك',
      backToHome: 'العودة إلى الرئيسية',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور',
      signIn: 'تسجيل الدخول',
      signingIn: 'جاري تسجيل الدخول...',
      noAccount: 'ليس لديك حساب؟',
      registerNow: 'سجل الآن',
      errors: {
        emailRequired: 'البريد الإلكتروني مطلوب',
        emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
        passwordRequired: 'كلمة المرور مطلوبة',
        invalidCredentials: 'بريد إلكتروني أو كلمة مرور خاطئة',
        generalError: 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.'
      }
    },
    register: {
      title: 'إنشاء حساب',
      subtitle: 'انضم إلى عائلة QR Menu ورقمن مطعمك',
      backToHome: 'العودة إلى الرئيسية',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      createAccount: 'إنشاء حساب',
      creating: 'جاري إنشاء الحساب...',
      haveAccount: 'هل لديك حساب بالفعل؟',
      signInNow: 'تسجيل الدخول',
      formProgress: 'إتمام النموذج',
      placeholders: {
        firstName: 'اسمك الأول',
        lastName: 'اسم العائلة',
        email: 'إكزامبل@إيميل.كوم',
        phone: '05XX XXX XX XX',
        password: '••••••••',
        confirmPassword: 'أعد إدخال كلمة المرور'
      },
      validation: {
        nameRequired: 'الاسم الأول مطلوب',
        nameMin: 'يجب أن يكون الاسم الأول 2 أحرف على الأقل',
        surnameRequired: 'اسم العائلة مطلوب',
        surnameMin: 'يجب أن يكون اسم العائلة 2 أحرف على الأقل',
        emailRequired: 'البريد الإلكتروني مطلوب',
        emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
        phoneRequired: 'رقم الهاتف مطلوب',
        phoneInvalid: 'يرجى إدخال رقم هاتف صحيح (مثل: 05XX XXX XX XX)',
        passwordRequired: 'كلمة المرور مطلوبة',
        passwordMin: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
        passwordPattern: 'يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم واحد على الأقل',
        passwordConfirmRequired: 'تأكيد كلمة المرور مطلوب',
        passwordMismatch: 'كلمات المرور غير متطابقة',
        termsRequired: 'يجب قبول شروط الخدمة',
        emailExists: 'عنوان البريد الإلكتروني هذا مستخدم بالفعل'
      },
      passwordStrength: {
        veryWeak: 'ضعيف جداً',
        weak: 'ضعيف',
        medium: 'متوسط',
        good: 'جيد',
        strong: 'قوي'
      },
      terms: {
        service: 'شروط الخدمة',
        and: 'و',
        privacy: 'سياسة الخصوصية',
        accept: 'أوافق على'
      },
      errors: {
        validation: 'يرجى التحقق من معلومات التسجيل',
        invalidData: 'معلومات غير صحيحة. يرجى المراجعة.',
        general: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.'
      },
      success: {
        message: 'تم التسجيل بنجاح! يمكنك الآن إدخال معلومات مطعمك.'
      }
    },
    forgotPassword: {
      title: 'نسيت كلمة المرور',
      subtitle: 'أدخل عنوان بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور',
      backToLogin: 'العودة إلى تسجيل الدخول',
      email: 'البريد الإلكتروني',
      sendResetLink: 'إرسال رابط الإعادة تعيين',
      sending: 'جاري الإرسال...',
      resendCode: 'إعادة إرسال الرمز',
      countdown: 'ثانية حتى يمكنك إعادة الإرسال',
      placeholders: {
        email: 'إكزامبل@إيميل.كوم'
      },
      success: {
        title: 'تم إرسال البريد الإلكتروني!',
        message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى عنوان بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني.'
      },
      errors: {
        emailRequired: 'البريد الإلكتروني مطلوب',
        emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
        emailNotFound: 'لم يتم العثور على حساب بهذا العنوان الإلكتروني',
        general: 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.'
      }
    }
  },

  // Pricing
  pricing: {
    title: 'اختر الخطة',
    titleHighlight: 'المثالية',
    titleEnd: 'لك',
    subtitle: 'خيارات تسعير مرنة مصممة لاحتياجاتك. يمكنك تغيير أو إلغاء خطتك في أي وقت.',
    monthly: 'شهرياً',
    yearly: 'سنوياً',
    freeMonths: 'شهرين مجاناً',
    mostPopular: 'الأكثر شعبية',
    plans: {
      basic: {
        name: 'المبتدئ',
        features: {
          '0': 'مطعم واحد',
          '1': '50 منتج',
          '2': 'تحليلات أساسية',
          '3': 'دعم بريد إلكتروني',
          '4': 'مولد رمز QR',
          '5': 'تحسين للجوال'
        },
        button: 'ابدأ'
      },
      pro: {
        name: 'المحترف',
        features: {
          '0': '3 مطاعم',
          '1': 'منتجات غير محدودة',
          '2': 'تحليلات متقدمة',
          '3': 'دعم أولوية',
          '4': 'تصميم مخصص',
          '5': 'دعم متعدد اللغات',
          '6': 'وصول API',
          '7': 'علامة بيضاء'
        },
        button: 'الأكثر شعبية'
      },
      enterprise: {
        name: 'المؤسسي',
        features: {
          '0': 'مطاعم غير محدودة',
          '1': 'منتجات غير محدودة',
          '2': 'تحليلات مؤسسية',
          '3': 'دعم هاتفي 24/7',
          '4': 'تكامل مخصص',
          '5': 'مدير حساب مخصص',
          '6': 'ضمان SLA',
          '7': 'تدريب واستشارة'
        },
        button: 'اتصل بنا'
      }
    },
    additionalInfo: 'جميع الخطط تتضمن تجربة مجانية لمدة 14 يوماً • لا حاجة لبطاقة ائتمان • إلغاء في أي وقت',
    vatInfo: 'الأسعار تشمل ضريبة القيمة المضافة. تسعير مخصص متاح للخطط المؤسسية.',
    perMonth: 'شهر',
    perYear: 'سنة',
    monthlyEquivalent: 'شهرياً ₺{amount} (شهرين مجاناً)'
  },

  // Testimonials
  testimonials: {
    title: 'ما يقوله',
    titleHighlight: 'عملاؤنا',
    subtitle: 'تجارب المستخدمين الحقيقية حول نظام QR Menu الذي يثق به أكثر من 500 مطعم في تركيا.',
    customers: [
      {
        name: 'محمد أوزكان',
        role: 'صاحب مطعم',
        company: 'لذة الطريق',
        content: 'بفضل QR Menu، زادت رضا عملائنا بنسبة 40%. خاصة خلال الجائحة، وفرت القائمة بدون لمس ميزة كبيرة. النظام سهل الاستخدام جداً.'
      },
      {
        name: 'عائشة دمير',
        role: 'المدير العام',
        company: 'مطعم بيلا فيستا',
        content: 'يمكن لعملائنا الآن مشاهدة القائمة دون انتظار النادل. انخفض وقت أخذ الطلبات إلى النصف. حل مثالي حقاً!'
      },
      {
        name: 'جان يلماز',
        role: 'شريك تجاري',
        company: 'مقهى كيف',
        content: 'بفضل التقارير التحليلية، نرى أي المنتجات أكثر شعبية. حسنا قائمتنا وزادت مبيعاتنا بنسبة 25%.'
      },
      {
        name: 'فاطمة كايا',
        role: 'مدير مطعم',
        company: 'سفرة الأناضول',
        content: 'تحديثات الأسعار تنعكس فوراً. لم نعد نتعامل مع طباعة القوائم. توفير في التكلفة وصديق للبيئة.'
      },
      {
        name: 'إمره شاهين',
        role: 'صاحب سلسلة مطاعم',
        company: 'بيت البرجر',
        content: 'ندير جميع فروعنا من مكان واحد. يمكننا إنشاء قوائم وتسعير منفصل لكل فرع. نظام رائع!'
      },
      {
        name: 'زينب أرسلان',
        role: 'صاحبة مقهى',
        company: 'زاوية القهوة',
        content: 'دعم العملاء رائع. حصلنا على المساعدة في كل خطوة أثناء التثبيت. أصبحنا الآن مقهى تقني وعملاؤنا راضون جداً.'
      }
    ],
    stats: {
      restaurants: 'مطعم سعيد',
      satisfaction: 'معدل الرضا',
      support: 'دعم العملاء',
      setup: 'وقت الإعداد'
    }
  },

  // FAQ
  faq: {
    title: 'الأسئلة',
    titleHighlight: 'الشائعة',
    subtitle: 'كل ما تريد معرفته عن QR Menu موجود هنا. إذا لم تجد سؤالك، يمكنك التواصل معنا.',
    questions: {
      '1': {
        question: 'كيف يعمل QR Menu؟',
        answer: 'نظام QR Menu بسيط جداً. ننشئ رمز QR لمطعمك. يمكن لعملائك الوصول إلى قائمتك فوراً عن طريق مسح هذا الرمز بهواتفهم. لا يتطلب تحميل تطبيق.'
      },
      '2': {
        question: 'كم يستغرق الإعداد؟',
        answer: 'الإعداد يستغرق 5 دقائق فقط! بعد إنشاء حسابك، تقوم برفع وتخصيص قائمتك. رمز QR الخاص بك يصبح جاهزاً للاستخدام فوراً.'
      },
      '3': {
        question: 'هل يمكنني رؤية بيانات العملاء؟',
        answer: 'نعم! نقدم تحليلات مفصلة مثل المنتجات الأكثر مشاهدة، ساعات الذروة، سلوك العملاء. يمكنك تحسين قائمتك بهذه البيانات.'
      },
      '4': {
        question: 'هل يمكنني تغيير الأسعار بسهولة؟',
        answer: 'بالطبع! يمكنك تحديث الأسعار وإضافة منتجات جديدة أو تعديل المنتجات الموجودة في أي وقت من لوحة الإدارة. التغييرات تُنشر فوراً.'
      },
      '5': {
        question: 'كيف تبدو على الأجهزة المحمولة؟',
        answer: 'قائمتك تبدو مثالية على جميع الأجهزة. بالتصميم المتجاوب، تقدم تجربة مثلى على الهواتف والأجهزة اللوحية والكمبيوتر.'
      },
      '6': {
        question: 'هل يوجد دعم للعملاء؟',
        answer: 'بالتأكيد! نقدم دعماً على مدار الساعة عبر البريد الإلكتروني والهاتف والدردشة المباشرة. نحن معك في كل خطوة من التثبيت إلى الاستخدام.'
      },
      '7': {
        question: 'ماذا يحدث عندما أريد الإلغاء؟',
        answer: 'يمكنك الإلغاء في أي وقت. لا يوجد عقد أو غرامة. بعد الإلغاء، نسلم بياناتك إليك بأمان.'
      },
      '8': {
        question: 'هل يمكنني إدارة مطاعم متعددة؟',
        answer: 'مع خططنا المحترفة والمؤسسية، يمكنك إدارة مطاعم متعددة من حساب واحد. قائمة وتحليلات منفصلة لكل مطعم.'
      }
    },
    cta: {
      title: 'هل لديك أسئلة أخرى؟',
      subtitle: 'تواصل معنا للأسئلة التي لا تجد إجابات لها. نجيب خلال 24 ساعة.',
      button: 'اتصل بنا'
    }
  },

  // Contact
  contact: {
    title: 'تواصل',
    titleHighlight: 'معنا',
    titleEnd: '',
    subtitle: 'هل لديك أسئلة حول نظام QR Menu؟ تواصل معنا.',
    info: {
      title: 'معلومات الاتصال',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      address: 'العنوان'
    },
    form: {
      title: 'اكتب لنا',
      name: 'الاسم الكامل',
      nameRequired: 'الاسم الكامل *',
      namePlaceholder: 'أدخل اسمك',
      email: 'البريد الإلكتروني',
      emailRequired: 'البريد الإلكتروني *',
      emailPlaceholder: 'عنوان بريدك الإلكتروني',
      company: 'اسم المطعم/الشركة',
      companyPlaceholder: 'اسم نشاطك التجاري',
      message: 'رسالتك',
      messageRequired: 'رسالتك *',
      messagePlaceholder: 'اكتب رسالتك...',
      sending: 'جاري الإرسال...',
      send: 'إرسال الرسالة',
      success: {
        title: 'تم إرسال رسالتك!',
        subtitle: 'سنعود إليك في أقرب وقت ممكن.'
      }
    }
  },

  // Accessibility
  accessibility: {
    menu: 'فتح/إغلاق القائمة',
    theme: 'تغيير المظهر',
    language: 'تغيير اللغة',
    profile: 'قائمة الملف الشخصي',
    notifications: 'الإشعارات'
  },

  // Orders
  orders: {
    loading: 'جاري تحميل الطلبات...',
    title: 'الطلبات',
    description: 'إدارة وتتبع جميع طلباتك',
    orderNumber: 'طلب',
    table: 'طاولة',
    items: 'عناصر',
    tabs: {
      all: 'جميع الطلبات',
      pending: 'في الانتظار',
      preparing: 'قيد التحضير',
      ready: 'جاهز',
      delivered: 'تم التسليم',
      cancelled: 'ملغي'
    },
    status: {
      pending: 'في الانتظار',
      preparing: 'قيد التحضير',
      ready: 'جاهز',
      delivered: 'تم التسليم',
      cancelled: 'ملغي'
    },
    filters: {
      status: 'الحالة',
      dateRange: 'نطاق التاريخ',
      paymentType: 'نوع الدفع',
      today: 'اليوم',
      yesterday: 'أمس',
      lastWeek: 'الأسبوع الماضي',
      lastMonth: 'الشهر الماضي',
      custom: 'مخصص'
    },
    actions: {
      refresh: 'تحديث',
      export: 'تصدير',
      filter: 'تصفية',
      search: 'البحث في الطلبات...',
      viewDetails: 'عرض التفاصيل',
      changeStatus: 'تغيير الحالة'
    },
    stats: {
      totalOrders: 'إجمالي الطلبات',
      totalRevenue: 'إجمالي الإيرادات',
      pendingOrders: 'الطلبات المعلقة',
      avgOrderValue: 'متوسط قيمة الطلب'
    }
  },

  // Table Management
  tableManagement: {
    loading: 'جاري تحميل الطاولات...',
    title: 'إدارة الطاولات',
    description: 'إدارة رموز QR والطاولات الخاصة بك',
    noCategories :"لايوجد فئات",
    createFirstCategory: "أنشئ اول فئة",
    error: {
      loadFailed: 'فشل في تحميل قائمة الفروع',
      dataLoadFailed: 'حدث خطأ أثناء تحميل البيانات'
    },
    actions: {
      addTable: 'إضافة طاولة',
      addQRCode: 'إضافة رمز QR',
      generateQR: 'إنشاء رمز QR',
      downloadQR: 'تحميل رمز QR',
      editTable: 'تعديل الطاولة',
      deleteTable: 'حذف الطاولة'
    },
    deleteModal :{
      title : "تأكيد الحذف"
    },
    categories: {
      title: 'إدارة الفئات',
      addCategory: 'إضافة فئة',
      editCategory: 'تعديل الفئة',
      deleteCategory: 'حذف الفئة',
      categoryName: 'اسم الفئة',
      tableCount: 'عدد الطاولات'
    },
    qrCodes: {
      title: 'رموز QR',
      tableNumber: 'رقم الطاولة',
      category: 'الفئة',
      status: 'الحالة',
      actions: 'الإجراءات',
      active: 'نشط',
      inactive: 'غير نشط'
    }
  },

  // User Management
  userManagement: {
    loading: 'جاري تحميل المستخدمين...',
    title: 'إدارة المستخدمين',
    description: 'إدارة المستخدمين والأدوار والأذونات',
    error: {
      loadFailed: 'حدث خطأ أثناء تحميل المستخدمين',
      rolesLoadFailed: 'حدث خطأ أثناء تحميل الأدوار',
      createFailed: 'حدث خطأ أثناء إنشاء المستخدم',
      updateFailed: 'حدث خطأ أثناء تحديث المستخدم',
      deleteFailed: 'حدث خطأ أثناء حذف المستخدم'
    },
    actions: {
      addUser: 'إضافة مستخدم',
      editUser: 'تعديل المستخدم',
      deleteUser: 'حذف المستخدم',
      resetPassword: 'إعادة تعيين كلمة المرور',
      changeRole: 'تغيير الدور'
    },
    roles: {
      admin: 'مدير',
      manager: 'مشرف',
      staff: 'موظف',
      viewer: 'مشاهد'
    },
    status: {
      active: 'نشط',
      inactive: 'غير نشط',
      suspended: 'معلق'
    }
  },

 

  // Subscription
  subscription: {
    title: 'الاشتراك',
    description: 'إدارة خطة اشتراكك وعرض فواتيرك',
    currentPlan: 'الخطة الحالية',
    planDetails: 'تفاصيل الخطة',
    billing: 'الفواتير',
    usage: 'الاستخدام',
    plan: 'الخطة',
    renewal: 'التجديد',
    changePlan: 'تغيير الخطة',
    availablePlans: 'الخطط المتاحة',
    selectPlan: 'اختر خطة تناسب احتياجاتك',
    tabs: {
      overview: 'نظرة عامة',
      billing: 'الفواتير',
      usage: 'الاستخدام'
    },
    actions: {
      upgrade: 'ترقية',
      downgrade: 'تخفيض',
      cancel: 'إلغاء',
      renew: 'تجديد',
      settings: 'الإعدادات'
    }
  },

  // Products
  products: {
    status: {
      outOfStock: 'غير متوفر',
      inStock: 'متوفر',
      available: 'متاح',
      unavailable: 'غير متاح'
    },
    count: 'منتج',
    empty: 'لا توجد منتجات في هذه الفئة بعد',
    actions: {
      addFirst: 'أضف أول منتج',
      addProduct: 'إضافة منتج',
      editProduct: 'تعديل المنتج',
      deleteProduct: 'حذف المنتج'
    }
  },
  branchSelector: {
  status: {
    loading: 'جاري التحميل...',
    error: 'تعذر جلب قائمة الفروع'
  },
  empty: 'لم يتم العثور على خيارات',
  actions: {
    changeBranchRestaurant: 'تغيير الفرع/المطعم'
  },
  labels: {
    mainRestaurant: 'المطعم الرئيسي',
    branches: 'الفروع'
  }
  },
  popularProducts: {
    title: 'المنتجات الأكثر شيوعاً',
    empty: 'ستظهر مبيعات المنتجات هنا',
    labels: {
      orders: 'طلبات',
      percentage: '%'
    },
    tooltip: {
      ordersFormat: (value: any, percentage: any) => `${value} طلبات (${percentage}%)`,
      noData: 'لا توجد بيانات متاحة'
    }
  },
  weeklyActivity: {
    title: 'النشاط الأسبوعي',
    empty: {
      primary: 'لا توجد بيانات نشاط متاحة بعد',
      secondary: 'ستظهر البيانات هنا قريباً'
    },
    labels: {
      views: 'المشاهدات',
      qrScans: 'مسح رمز QR'
    },
    legend: {
      views: 'المشاهدات',
      qrScans: 'مسح رمز QR'
    }
  },
  monthlyRevenue: {
      QuickStats : "إحصائيات سريعة",
    title: 'اتجاه الإيرادات الشهرية',
    empty: {
      primary: 'لا توجد بيانات إيرادات متاحة بعد',
      secondary: 'ستظهر بيانات الإيرادات هنا'
    },
    labels: {
      total: 'المجموع:',
      revenue: 'الإيرادات'
      
    },
    currency: {
      symbol: '₺',
      format: (value: { toLocaleString: (arg0: string) => any; }) => `${value.toLocaleString('ar-SA')} ₺`
    }
  },
  branchCard: {
    status: {
      temporaryClosed: 'مغلق مؤقتاً',
      open: 'مفتوح',
      closed: 'مغلق',
      active: 'نشط',
      inactive: 'غير نشط',
      hidden: 'مخفي'
    },
    actions: {
      edit: 'تعديل',
      delete: 'حذف'
    },
    labels: {
      customerVisibility: 'الظهور للعملاء',
      apiBranchOpen: 'API BranchIsOpen:'
    },
    alt: {
      logo: 'الشعار'
    }
  },
  addBranchCard: {
    title: 'إضافة فرع جديد',
    description: 'انقر لإضافة فرع جديد'
  },
  branchModal: {
    title: {
      add: 'إضافة فرع جديد',
      edit: 'تعديل الفرع'
    },
    subtitle: 'يمكنك إدخال معلومات الفرع خطوة بخطوة',
    steps: {
      basic: 'المعلومات الأساسية',
      address: 'معلومات العنوان', 
      contact: 'الاتصال وساعات العمل'
    },
    sections: {
      basicInfo: 'المعلومات الأساسية',
      addressInfo: 'معلومات العنوان',
      contactInfo: 'معلومات الاتصال',
      workingHours: 'ساعات العمل'
    },
    fields: {
      branchName: {
        label: 'اسم الفرع *',
        placeholder: 'أدخل اسم الفرع'
      },
      whatsappNumber: {
        label: 'رقم الطلبات واتساب *',
        placeholder: 'أدخل رقم الطلبات واتساب'
      },
      branchLogo: {
        label: 'شعار الفرع (اختياري)',
        select: 'اختر الشعار',
        uploading: 'جاري الرفع...',
        success: '✓ تم رفع الشعار بنجاح',
        preview: 'معاينة شعار الفرع',
        supportText: 'تدعم صيغ PNG، JPG، GIF. الحد الأقصى لحجم الملف: 5 ميجابايت'
      },
      country: {
        label: 'البلد *',
        placeholder: 'أدخل اسم البلد'
      },
      city: {
        label: 'المدينة *',
        placeholder: 'أدخل اسم المدينة'
      },
      street: {
        label: 'الشارع *',
        placeholder: 'أدخل اسم الشارع'
      },
      zipCode: {
        label: 'الرمز البريدي *',
        placeholder: 'أدخل الرمز البريدي'
      },
      addressLine1: {
        label: 'سطر العنوان 1 *',
        placeholder: 'أدخل معلومات العنوان التفصيلية'
      },
      addressLine2: {
        label: 'سطر العنوان 2 (اختياري)',
        placeholder: 'أدخل معلومات العنوان الإضافية (اختياري)'
      },
      phone: {
        label: 'رقم الهاتف *',
        placeholder: 'أدخل رقم الهاتف'
      },
      email: {
        label: 'عنوان البريد الإلكتروني *',
        placeholder: 'أدخل عنوان البريد الإلكتروني'
      },
      location: {
        label: 'معلومات الموقع *',
        placeholder: 'أدخل معلومات الموقع (مثال: 40.9795,28.7225)'
      },
      contactHeader: {
        label: 'عنوان الاتصال (اختياري)',
        placeholder: 'أدخل عنوان الاتصال (اختياري)'
      },
      footerTitle: {
        label: 'عنوان التذييل (اختياري)',
        placeholder: 'أدخل عنوان التذييل (اختياري)'
      },
      footerDescription: {
        label: 'وصف التذييل (اختياري)',
        placeholder: 'أدخل وصف التذييل (اختياري)'
      },
      openTitle: {
        label: 'عنوان ساعات العمل (اختياري)',
        placeholder: 'أدخل عنوان ساعات العمل (اختياري)'
      },
      openDays: {
        label: 'أيام العمل (اختياري)',
        placeholder: 'أدخل أيام العمل (اختياري)'
      },
      openHours: {
        label: 'ساعات العمل (اختياري)',
        placeholder: 'أدخل ساعات العمل (اختياري)'
      }
    },
    workingHours: {
      description: 'حدد ساعات عمل مؤسستك',
      days: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
      open: 'مفتوح',
      closed: 'مغلق',
      openTime: 'الفتح',
      closeTime: 'الإغلاق',
      canOrder: '✓ يمكن للعملاء تقديم الطلبات في هذا اليوم',
      infoTitle: 'حول ساعات العمل',
      infoText: 'الساعات التي تحددها هنا تحدد متى يمكن للعملاء تقديم الطلبات من خلال قائمة QR الخاصة بك. لا يتم أخذ الطلبات في الأيام المغلقة.'
    },
    errors: {
      branchName: 'اسم الفرع مطلوب',
      whatsappNumber: 'رقم الطلبات واتساب مطلوب',
      country: 'البلد مطلوب',
      city: 'المدينة مطلوبة',
      street: 'الشارع مطلوب',
      zipCode: 'الرمز البريدي مطلوب',
      addressLine1: 'سطر العنوان 1 مطلوب',
      phone: 'رقم الهاتف مطلوب',
      email: 'عنوان البريد الإلكتروني مطلوب',
      location: 'معلومات الموقع مطلوبة'
    },
    buttons: {
      cancel: 'إلغاء',
      back: 'رجوع',
      next: 'التالي',
      save: 'حفظ',
      saving: 'جاري الحفظ...'
    }
  },

  branchManagement: {
    title: 'إدارة الفروع',
    description: 'إدارة فروع المطعم وتحديث معلوماتها',
    loading: 'جاري تحميل الفروع...',
    addBranch: 'إضافة فرع جديد',
    
    // Error messages
    error: {
      loadFailed: 'فشل في تحميل الفروع',
      createFailed: 'فشل في إنشاء الفرع',
      updateFailed: 'فشل في تحديث الفرع',
      deleteFailed: 'فشل في حذف الفرع',
      restaurantIdNotFound: 'معرف المطعم غير موجود',
      detailsLoadFailed: 'فشل في تحميل تفاصيل الفرع',
      statusUpdateFailed: 'فشل في تحديث حالة الفرع',
      sessionExpired: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.',
      noPermission: 'ليس لديك صلاحية لهذه العملية.',
      branchNotFound: 'الفرع غير موجود.',
      connectionError: 'تحقق من اتصال الإنترنت.',
      unknownError: 'حدث خطأ غير متوقع'
    },

    // No branches state
    noBranches: {
      title: 'لا توجد فروع بعد',
      description: 'ابدأ بإضافة الفرع الأول لمطعمك'
    },

    // Delete confirmation
    deleteConfirm: {
      title: 'تأكيد حذف الفرع',
      description: 'هل أنت متأكد من حذف فرع "{{branchName}}"؟ لا يمكن التراجع عن هذا الإجراء.'
    },

    // Form labels and fields
    form: {
      branchName: 'اسم الفرع',
      branchNamePlaceholder: 'أدخل اسم الفرع',
      branchNameRequired: 'اسم الفرع مطلوب',
      whatsappNumber: 'رقم واتساب للطلبات',
      whatsappPlaceholder: 'أدخل رقم الواتساب',
      branchLogo: 'شعار الفرع',
      logoUpload: 'رفع الشعار',
      logoChange: 'تغيير الشعار',
      logoRemove: 'إزالة الشعار',
      logoNotSelected: 'لم يتم اختيار شعار',
      logoInstructions: 'يمكنك رفع ملف بصيغة JPG، PNG أو GIF، بحد أقصى 5 ميجابايت.',

      // Address fields
      country: 'البلد',
      countryPlaceholder: 'أدخل اسم البلد',
      city: 'المدينة',
      cityPlaceholder: 'أدخل اسم المدينة',
      street: 'الشارع',
      streetPlaceholder: 'أدخل اسم الشارع',
      zipCode: 'الرمز البريدي',
      zipCodePlaceholder: 'أدخل الرمز البريدي',
      addressLine1: 'العنوان الأول',
      addressLine1Placeholder: 'أدخل تفاصيل العنوان',
      addressLine2: 'العنوان الثاني',
      addressLine2Placeholder: 'معلومات عنوان إضافية (اختياري)',

      // Contact fields
      phone: 'الهاتف',
      phonePlaceholder: 'أدخل رقم الهاتف',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'أدخل عنوان البريد الإلكتروني',
      location: 'الموقع',
      locationPlaceholder: 'أدخل معلومات الموقع',
      contactHeader: 'عنوان الاتصال',
      contactHeaderPlaceholder: 'أدخل عنوان الاتصال',
      footerTitle: 'عنوان التذييل',
      footerTitlePlaceholder: 'أدخل عنوان التذييل',
      footerDescription: 'وصف التذييل',
      footerDescriptionPlaceholder: 'أدخل وصف التذييل',
      openTitle: 'عنوان أوقات العمل',
      openTitlePlaceholder: 'أدخل عنوان أوقات العمل',
      openDays: 'أيام العمل',
      openDaysPlaceholder: 'أدخل أيام العمل',
      openHours: 'ساعات العمل',
      openHoursPlaceholder: 'أدخل ساعات العمل',

      // Working hours
      workingHours: 'ساعات العمل',
      workingHoursRequired: 'يجب اختيار يوم عمل واحد على الأقل',
      isOpen: 'مفتوح',
      dayNames: {
        0: 'الأحد',
        1: 'الإثنين',
        2: 'الثلاثاء',
        3: 'الأربعاء',
        4: 'الخميس',
        5: 'الجمعة',
        6: 'السبت'
      }
    },

    // Modal titles and tabs
    modal: {
      createTitle: 'إضافة فرع جديد',
      createDescription: 'أدخل معلومات الفرع الجديد',
      editTitle: 'تعديل الفرع - {branchName}',
      editDescription: 'تعديل معلومات الفرع',
      
      tabs: {
        general: 'المعلومات العامة',
        address: 'العنوان',
        contact: 'الاتصال',
        workingHours: 'ساعات العمل'
      },

      buttons: {
        creating: 'جاري الإنشاء...',
        updating: 'جاري التحديث...',
        create: 'إنشاء الفرع',
        update: 'تحديث الفرع'
      },

      errors: {
        updateError: 'خطأ في التحديث',
        validationFailed: 'يرجى تصحيح الأخطاء في النموذج والمحاولة مرة أخرى.',
        dataValidationError: 'حدث خطأ أثناء التحديث. يرجى التحقق من البيانات المدخلة.',
        imageUploadError: 'فشل في رفع الصورة. يرجى المحاولة مرة أخرى.',
        imageRemoveError: 'فشل في حذف الصورة.',
        uploadingImage: 'جاري رفع الصورة...',
        invalidFileType: 'يرجى اختيار ملف صورة صحيح',
        fileSizeError: 'يجب أن يكون حجم الملف أقل من 5 ميجابايت'
      }
    },

    // Branch card actions
    card: {
      edit: 'تعديل',
      delete: 'حذف',
      temporaryClose: 'إغلاق مؤقت',
      temporaryOpen: 'فتح مؤقت',
      status: {
        open: 'مفتوح',
        closed: 'مغلق',
        temporarilyClosed: 'مغلق مؤقتاً'
      }
    }
  },
  commonBranch: {
    cancel: 'إلغاء',
    delete: 'حذف',
    save: 'حفظ',
    edit: 'تعديل',
    create: 'إنشاء',
    update: 'تحديث',
    close: 'إغلاق',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    warning: 'تحذير',
    info: 'معلومات',
    required: 'مطلوب',
    optional: 'اختياري'
  },
  productsContent: {
    branch : {
    selectAll:"الكل",

    },
  title: 'إدارة المنتجات',
  description: 'إدارة فئات ومنتجات القائمة',
  
  // Search and filters
  search: {
    placeholder: 'البحث في عناصر القائمة...',
    filter: 'تصفية',
    sort: 'ترتيب',
    noResults: 'لم يتم العثور على منتجات'
  },

  // View modes
  viewMode: {
    list: 'عرض قائمة',
    grid: 'عرض شبكة'
  },

  // Buttons and actions
  actions: {
    addFirstCategory: 'إضافة أول فئة',
    addCategory: 'فئة جديدة',
    newCategory: 'فئة جديدة',
    addProduct: 'منتج جديد',
    newProduct: 'منتج جديد',
    editCategory: 'تعديل الفئة',
    deleteCategory: 'حذف الفئة',
    editProduct: 'تعديل المنتج',
    deleteProduct: 'حذف المنتج',
    manageIngredients: 'إدارة المكونات',
    updateIngredients: 'تحديث المكونات',
    manageAddons: 'إدارة الإضافات',
    importSampleMenu: 'استيراد قائمة نموذجية',
    addFirstCategoryTitle: 'إضافة الفئة الأولى',
    RecycleBin:"سلة المحذوفات"
  },

  // Empty states
  emptyState: {
    noCategories: {
      title: 'لا توجد فئات قائمة بعد',
      description: 'ابدأ في إنشاء قائمة مطعمك عن طريق إضافة الفئة الأولى. على سبيل المثال "الأطباق الرئيسية"، "المشروبات" أو "الحلويات".',
      addFirstCategory: 'إضافة الفئة الأولى'
    }
  },

  // Loading states
  loading: {
    categories: 'جاري تحميل الفئات...',
    products: 'جاري تحميل المنتجات...',
    savingOrder: 'جاري حفظ الترتيب...',
    savingCategoryOrder: 'جاري حفظ ترتيب الفئات...',
    savingProductOrder: 'جاري حفظ ترتيب المنتجات...',
    movingProduct: 'جاري نقل المنتج...',
    deleting: 'جاري الحذف...'
  },

  // Drag and drop
  dragDrop: {
    categoryReordering: 'جاري حفظ ترتيب الفئات...',
    productReordering: 'جاري حفظ ترتيب المنتجات...',
    productMoving: 'جاري نقل المنتج...',
    categoryOrderSaveError: 'حدث خطأ أثناء حفظ ترتيب الفئات.',
    productOrderSaveError: 'حدث خطأ أثناء حفظ ترتيب المنتجات.',
    productMoveError: 'حدث خطأ أثناء نقل المنتج.'
  },

  // Delete confirmations
  delete: {
    product: {
      title: 'حذف المنتج',
      message: 'هل أنت متأكد من رغبتك في حذف "{{productName}}"؟ لا يمكن التراجع عن هذا الإجراء.',
      success: 'تم حذف المنتج بنجاح'
    },
    category: {
      title: 'حذف الفئة',
      messageWithProducts: 'تحتوي فئة "{{categoryName}}" على {{productCount}} منتج. حذف هذه الفئة سيحذف جميع المنتجات أيضاً. هل أنت متأكد من رغبتك في المتابعة؟',
      messageEmpty: 'هل أنت متأكد من رغبتك في حذف فئة "{{categoryName}}"؟',
      success: 'تم حذف الفئة بنجاح'
    }
  },

  // Error messages
  error: {
    loadFailed: 'فشل في تحميل البيانات',
    categoryNotFound: 'الفئة غير موجودة',
    productNotFound: 'المنتج غير موجود',
    deleteFailed: 'فشل في الحذف',
    updateFailed: 'فشل في التحديث',
    createFailed: 'فشل في الإنشاء',
    reorderFailed: 'فشل في إعادة الترتيب',
    invalidData: 'بيانات غير صالحة',
    networkError: 'خطأ في الاتصال بالشبكة',
    refreshPage: 'يرجى تحديث الصفحة والمحاولة مرة أخرى.'
  },

  // Success messages
  success: {
    categoryCreated: 'تم إنشاء الفئة بنجاح',
    categoryUpdated: 'تم تحديث الفئة بنجاح',
    categoryDeleted: 'تم حذف الفئة بنجاح',
    productCreated: 'تم إنشاء المنتج بنجاح',
    productUpdated: 'تم تحديث المنتج بنجاح',
    productDeleted: 'تم حذف المنتج بنجاح',
    orderSaved: 'تم حفظ الترتيب بنجاح',
    ingredientsUpdated: 'تم تحديث المكونات بنجاح',
    addonsUpdated: 'تم تحديث الإضافات بنجاح'
  },

  // Categories
  category: {
    products: 'منتجات',
    productCount: 'منتج',
    noProducts: 'لا توجد منتجات في هذه الفئة',
    expand: 'توسيع',
    collapse: 'طي'
  },

  // Products
  product: {
    price: 'السعر',
    description: 'الوصف',
    ingredients: 'المكونات',
    addons: 'الإضافات',
    category: 'الفئة',
    image: 'الصورة',
    status: 'الحالة',
    available: 'متاح',
    unavailable: 'غير متاح'
  },

  // Currency
  currency: {
    symbol: '₺',
    format: '{{amount}} ₺'
  },

  // Status indicators
  status: {
    active: 'نشط',
    inactive: 'غير نشط',
    available: 'متاح',
    unavailable: 'غير متاح'
  },

  // Tooltips
  tooltips: {
    dragToReorder: 'اسحب لإعادة الترتيب',
    dragToMoveCategory: 'اسحب لنقل المنتج إلى فئة أخرى',
    expandCategory: 'توسيع الفئة',
    collapseCategory: 'طي الفئة',
    editCategory: 'تعديل الفئة',
    deleteCategory: 'حذف الفئة',
    editProduct: 'تعديل المنتج',
    deleteProduct: 'حذف المنتج',
    manageIngredients: 'إدارة مكونات المنتج',
    manageAddons: 'إدارة إضافات المنتج'
  }
  },
  createCategoryModal: {
    // Header
    title: 'إضافة فئة جديدة',
    subtitle: 'إنشاء فئة قائمة',
    close: 'إغلاق',

    // Form fields
    form: {
      categoryName: {
        label: 'اسم الفئة *',
        placeholder: 'مثال: الأطباق الرئيسية، المشروبات، الحلويات',
        required: 'اسم الفئة مطلوب'
      },
      status: {
        label: 'تفعيل الفئة',
        description: 'الفئات النشطة تظهر في القائمة'
      }
    },

    // Buttons
    buttons: {
      cancel: 'إلغاء',
      create: 'إضافة فئة',
      creating: 'جاري الإضافة...'
    },

    // Error messages
    errors: {
      general: 'حدث خطأ أثناء إضافة الفئة. يرجى المحاولة مرة أخرى.',
      categoryExists: 'توجد فئة بهذا الاسم بالفعل. يرجى اختيار اسم مختلف.',
      invalidData: 'البيانات المدخلة غير صالحة. يرجى التحقق والمحاولة مرة أخرى.',
      serverError: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
      networkError: 'خطأ في الاتصال بالشبكة. تحقق من الاتصال وحاول مرة أخرى.',
      unknownError: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      errorLabel: 'خطأ:'
    },

    // Success messages
    success: {
      categoryCreated: 'تم إنشاء الفئة بنجاح',
      categoryAdded: 'تمت إضافة الفئة بنجاح إلى القائمة'
    },

    // Validation messages
    validation: {
      nameRequired: 'اسم الفئة مطلوب',
      nameMinLength: 'يجب أن يكون اسم الفئة أكثر من حرفين',
      nameMaxLength: 'يجب أن يكون اسم الفئة أقل من 50 حرف',
      invalidCharacters: 'اسم الفئة يحتوي على حروف غير صالحة'
    },

    // Accessibility
    accessibility: {
      closeModal: 'إغلاق نافذة إضافة الفئة',
      formTitle: 'نموذج إضافة فئة جديدة',
      requiredField: 'حقل مطلوب',
      optionalField: 'حقل اختياري'
    }
  },
  createProductModal: {
  // Header
  title: 'إضافة منتج جديد',
  subtitle: 'أضف منتجاً إلى قائمتك',
  close: 'إغلاق',

  // Form fields
  form: {
    productImage: {
      label: 'صورة المنتج',
      dragActive: 'اسقط الملف هنا',
      uploadText: 'رفع صورة',
      supportedFormats: 'PNG، JPG، GIF (حد أقصى 5 ميجابايت)',
      removeImage: 'إزالة الصورة'
    },
    productName: {
      label: 'اسم المنتج',
      placeholder: 'مثال: بيتزا مارجريتا',
      required: 'اسم المنتج مطلوب'
    },
    price: {
      label: 'السعر (₺)',
      placeholder: '0',
      required: 'السعر مطلوب',
      mustBePositive: 'السعر يجب أن يكون أكبر من 0',
      currency: '₺'
    },
    category: {
      label: 'الفئة',
      placeholder: 'اختر فئة',
      required: 'اختيار الفئة مطلوب',
      invalidCategory: 'الفئة المختارة غير صالحة. الفئات المتاحة: {{categories}}'
    },
    description: {
      label: 'الوصف',
      placeholder: 'وصف المنتج...',
      required: 'وصف المنتج مطلوب'
    },
    status: {
      label: 'تفعيل المنتج',
      description: 'يظهر في القائمة',
      active: 'نشط',
      inactive: 'غير نشط'
    }
  },

  // Buttons
  buttons: {
    cancel: 'إلغاء',
    create: 'إضافة منتج',
    creating: 'جاري الإضافة...',
    uploading: 'جاري الرفع...'
  },

  // Image upload
  imageUpload: {
    dragToUpload: 'اسحب الصورة هنا أو انقر للرفع',
    clickToUpload: 'انقر لرفع صورة',
    dragActive: 'اسقط الملف هنا',
    supportedFormats: 'PNG، JPG، GIF',
    maxSize: 'حد أقصى 5 ميجابايت',
    preview: 'معاينة الصورة',
    remove: 'إزالة'
  },

  // Error messages
  errors: {
    general: 'حدث خطأ أثناء إضافة المنتج. يرجى المحاولة مرة أخرى.',
    nameRequired: 'اسم المنتج مطلوب',
    descriptionRequired: 'وصف المنتج مطلوب',
    priceRequired: 'السعر مطلوب',
    priceMustBePositive: 'السعر يجب أن يكون أكبر من 0',
    categoryRequired: 'اختيار الفئة مطلوب',
    categoryInvalid: 'الفئة المختارة غير صالحة',
    imageInvalid: 'يرجى اختيار ملف صورة صالح',
    imageTooLarge: 'حجم ملف الصورة يجب أن يكون أقل من 5 ميجابايت',
    imageUploadFailed: 'فشل في رفع الصورة',
    networkError: 'خطأ في الاتصال بالشبكة. تحقق من الاتصال وحاول مرة أخرى.',
    serverError: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
    unknownError: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    errorLabel: 'خطأ:'
  },

  // Success messages
  success: {
    productCreated: 'تم إنشاء المنتج بنجاح',
    productAdded: 'تمت إضافة المنتج بنجاح إلى القائمة'
  },

  // Validation messages
  validation: {
    nameMinLength: 'يجب أن يكون اسم المنتج أكثر من حرفين',
    nameMaxLength: 'يجب أن يكون اسم المنتج أقل من 100 حرف',
    descriptionMinLength: 'يجب أن يكون الوصف أكثر من 5 أحرف',
    descriptionMaxLength: 'يجب أن يكون الوصف أقل من 500 حرف',
    priceMin: 'السعر يجب أن يكون أكبر من 0',
    priceMax: 'السعر يجب أن يكون أقل من 10000'
  },

  // Accessibility
  accessibility: {
    closeModal: 'إغلاق نافذة إضافة المنتج',
    formTitle: 'نموذج إضافة منتج جديد',
    requiredField: 'حقل مطلوب',
    optionalField: 'حقل اختياري',
    imageUpload: 'رفع صورة المنتج',
    removeImage: 'إزالة صورة المنتج',
    priceInput: 'إدخال سعر المنتج',
    categorySelect: 'اختيار فئة المنتج',
    statusToggle: 'تبديل حالة المنتج'
  }
  },
  productAddonsModal: {
    // Header
    title: 'إضافات المنتج',
    subtitle: 'إدارة منتجات الإضافات لـ',
    close: 'إغلاق',

    // Panel titles
    panels: {
      currentAddons: {
        title: 'الإضافات الحالية',
        count: '({{count}})',
        dragInstruction: 'يمكنك إعادة الترتيب بالسحب',
        emptyState: {
          title: 'لم يتم إضافة أي إضافات بعد.',
          subtitle: 'اختر المنتجات من اللوحة اليمنى.'
        }
      },
      availableProducts: {
        title: 'المنتجات المتاحة كإضافات',
        searchPlaceholder: 'البحث عن المنتجات...',
        emptyState: {
          noResults: 'لم يتم العثور على منتجات تطابق معايير البحث.',
          noProducts: 'لم يتم العثور على منتجات قابلة للإضافة.'
        }
      }
    },

    // Addon item actions
    actions: {
      edit: 'تحرير',
      save: 'حفظ',
      cancel: 'إلغاء',
      remove: 'إزالة',
      recommended: 'مُوصى به'
    },

    // Form fields
    form: {
      marketingText: {
        placeholder: 'نص تسويقي...',
        label: 'النص التسويقي'
      },
      isRecommended: {
        label: 'وضع علامة كإضافة موصى بها',
        badge: 'مُوصى به'
      }
    },

    // Product status
    status: {
      outOfStock: 'نفد من المخزون',
      available: 'متوفر',
      unavailable: 'غير متوفر'
    },

    // Loading states
    loading: {
      addons: 'جاري تحميل الإضافات...',
      products: 'جاري تحميل المنتجات...',
      saving: 'جاري الحفظ...'
    },

    // Buttons
    buttons: {
      cancel: 'إلغاء',
      saveAddons: 'حفظ الإضافات',
      saving: 'جاري الحفظ...'
    },

    // Counter texts
    counters: {
      selectedProducts: '{{count}} منتج محدد',
      availableProducts: '{{count}} منتج متوفر'
    },

    // Error messages
    errors: {
      loadingData: 'حدث خطأ أثناء تحميل بيانات الإضافات.',
      updatingAddon: 'حدث خطأ أثناء تحديث الإضافة.',
      deletingAddon: 'حدث خطأ أثناء حذف الإضافة.',
      savingOrder: 'حدث خطأ أثناء حفظ ترتيب الإضافات.',
      savingAddons: 'حدث خطأ أثناء حفظ الإضافات. يرجى المحاولة مرة أخرى.',
      general: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      networkError: 'خطأ في الاتصال بالشبكة. تحقق من اتصالك وحاول مرة أخرى.'
    },

    // Success messages
    success: {
      addonsSaved: 'تم حفظ إضافات المنتج بنجاح',
      orderUpdated: 'تم تحديث ترتيب الإضافات بنجاح',
      addonUpdated: 'تم تحديث الإضافة بنجاح',
      addonRemoved: 'تم إزالة الإضافة بنجاح'
    },

    // Accessibility
    accessibility: {
      closeModal: 'إغلاق نافذة إضافات المنتج',
      dragHandle: 'اسحب لإعادة ترتيب الإضافة',
      editAddon: 'تحرير تفاصيل الإضافة',
      removeAddon: 'إزالة الإضافة من المنتج',
      selectProduct: 'اختيار المنتج كإضافة',
      productImage: 'صورة المنتج',
      toggleRecommended: 'تبديل حالة التوصية'
    }
  },
  editCategoryModal: {
    // Header
    title: 'تحرير الفئة',
    subtitle: 'تحديث معلومات الفئة',
    close: 'إغلاق',

    // Form fields
    form: {
      categoryName: {
        label: 'اسم الفئة',
        placeholder: 'أدخل اسم الفئة...',
        required: 'اسم الفئة مطلوب',
        minLength: 'يجب أن يكون اسم الفئة على الأقل 2 أحرف',
        maxLength: 'يجب أن يكون اسم الفئة أقل من 100 حرف'
      },
      description: {
        label: 'الوصف',
        placeholder: 'أدخل وصف الفئة...',
        optional: 'اختياري',
        maxLength: 'يجب أن يكون الوصف أقل من 500 حرف'
      },
      status: {
        label: 'نشط',
        description: 'ستكون الفئة مرئية في القائمة عندما تكون نشطة',
        active: 'نشط',
        inactive: 'غير نشط'
      }
    },

    // Buttons
    buttons: {
      cancel: 'إلغاء',
      save: 'حفظ',
      saving: 'جاري الحفظ...',
      update: 'تحديث الفئة',
      updating: 'جاري التحديث...'
    },

    // Error messages
    errors: {
      updateFailed: 'حدث خطأ أثناء تحديث الفئة. يرجى المحاولة مرة أخرى.',
      nameRequired: 'اسم الفئة مطلوب',
      nameMinLength: 'يجب أن يكون اسم الفئة على الأقل 2 أحرف',
      nameMaxLength: 'يجب أن يكون اسم الفئة أقل من 100 حرف',
      descriptionMaxLength: 'يجب أن يكون الوصف أقل من 500 حرف',
      general: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      networkError: 'خطأ في الاتصال بالشبكة. تحقق من اتصالك وحاول مرة أخرى.',
      serverError: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.'
    },

    // Success messages
    success: {
      categoryUpdated: 'تم تحديث الفئة بنجاح',
      changesSaved: 'تم حفظ التغييرات بنجاح'
    },

    // Validation messages
    validation: {
      nameRequired: 'يرجى إدخال اسم الفئة',
      nameMinLength: 'اسم الفئة قصير جداً',
      nameMaxLength: 'اسم الفئة طويل جداً',
      descriptionMaxLength: 'الوصف طويل جداً'
    },

    // Accessibility
    accessibility: {
      closeModal: 'إغلاق نافذة تحرير الفئة',
      formTitle: 'نموذج تحرير الفئة',
      requiredField: 'حقل مطلوب',
      optionalField: 'حقل اختياري',
      statusToggle: 'تبديل حالة الفئة',
      nameInput: 'إدخال اسم الفئة',
      descriptionInput: 'إدخال وصف الفئة'
    }
  },
  confirmDeleteModal: {
    // Common titles (can be overridden by props)
    defaultTitle: 'تأكيد الحذف',
    deleteTitle: 'حذف العنصر',
    
    // Warning message
    warning: 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف العنصر نهائياً.',
    
    // Item types
    itemTypes: {
      category: 'الفئة',
      product: 'المنتج',
      addon: 'الإضافة',
      user: 'المستخدم',
      order: 'الطلب',
      coupon: 'القسيمة',
      discount: 'الخصم',
      promotion: 'الترويج',
      review: 'التقييم',
      comment: 'التعليق',
      image: 'الصورة',
      file: 'الملف',
      item: 'العنصر'
    },

    // Buttons
    buttons: {
      cancel: 'إلغاء',
      delete: 'حذف',
      deleting: 'جاري الحذف...',
      confirm: 'تأكيد',
      confirming: 'جاري التأكيد...'
    },

    // Pre-built messages for common scenarios
    messages: {
      category: 'هل أنت متأكد من حذف هذه الفئة؟ ستتأثر جميع المنتجات في هذه الفئة أيضاً.',
      product: 'هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.',
      addon: 'هل أنت متأكد من حذف هذه الإضافة؟ ستتم إزالتها من جميع المنتجات المرتبطة.',
      user: 'هل أنت متأكد من حذف هذا المستخدم؟ ستتم إزالة جميع بياناته نهائياً.',
      general: 'هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.'
    },

    // Error messages
    errors: {
      deleteFailed: 'حدث خطأ أثناء الحذف. يرجى المحاولة مرة أخرى.',
      networkError: 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
      serverError: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
      permissionError: 'ليس لديك صلاحية حذف هذا العنصر.',
      notFound: 'لم يتم العثور على العنصر المراد حذفه.',
      hasRelations: 'لا يمكن حذف هذا العنصر لأنه يحتوي على بيانات مرتبطة.',
      general: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
    },

    // Success messages
    success: {
      deleted: 'تم حذف العنصر بنجاح',
      categoryDeleted: 'تم حذف الفئة بنجاح',
      productDeleted: 'تم حذف المنتج بنجاح',
      addonDeleted: 'تم حذف الإضافة بنجاح'
    },

    // Confirmation prompts
    confirmations: {
      typeToConfirm: 'اكتب "حذف" للتأكيد',
      enterName: 'أدخل الاسم لتأكيد الحذف',
      areYouSure: 'هل أنت متأكد تماماً؟',
      lastChance: 'هذه فرصتك الأخيرة للإلغاء.'
    },

    // Accessibility
    accessibility: {
      closeModal: 'إغلاق نافذة تأكيد الحذف',
      deleteDialog: 'حوار تأكيد الحذف',
      warningIcon: 'أيقونة التحذير',
      deleteButton: 'تأكيد الحذف',
      cancelButton: 'إلغاء الحذف',
      errorAlert: 'رسالة خطأ'
    }
  },
  editProductModal: {
      // Header
      title: 'تحرير المنتج',
      subtitle: 'تحديث معلومات المنتج',
      close: 'إغلاق',

      // Form fields
      form: {
        productImage: {
          label: 'صورة المنتج',
          optional: 'اختياري'
        },
        productName: {
          label: 'اسم المنتج',
          placeholder: 'مثال: بيتزا مارغريتا',
          required: 'اسم المنتج مطلوب'
        },
        description: {
          label: 'الوصف',
          placeholder: 'وصف المنتج...',
          optional: 'اختياري'
        },
        price: {
          label: 'السعر (₺)',
          placeholder: '0',
          required: 'السعر مطلوب',
          currency: '₺'
        },
        category: {
          label: 'الفئة',
          placeholder: 'اختر الفئة',
          required: 'اختيار الفئة مطلوب'
        },
        status: {
          label: 'متوفر في المخزون',
          description: 'سيكون المنتج مرئياً في القائمة عندما يكون متوفراً',
          available: 'متوفر',
          unavailable: 'غير متوفر'
        }
      },

      // Buttons
      buttons: {
        cancel: 'إلغاء',
        update: 'تحديث المنتج',
        updating: 'جاري التحديث...',
        save: 'حفظ التغييرات',
        saving: 'جاري الحفظ...',
        uploading: 'جاري تحميل الصورة...'
      },

      // Image upload
      imageUpload: {
        clickToUpload: 'انقر لتحميل الصورة',
        dragToUpload: 'اسحب الصورة هنا أو انقر للتحميل',
        dragActive: 'أسقط الملف هنا',
        supportedFormats: 'PNG, JPG, GIF',
        maxSize: 'حد أقصى 5 ميجابايت',
        preview: 'معاينة الصورة',
        remove: 'إزالة الصورة',
        changeImage: 'تغيير الصورة'
      },

      // Error messages
      errors: {
        errorLabel: 'خطأ:',
        updateFailed: 'حدث خطأ أثناء تحديث المنتج. يرجى المحاولة مرة أخرى.',
        nameRequired: 'اسم المنتج مطلوب',
        nameAlreadyExists: 'يوجد منتج بهذا الاسم بالفعل. يرجى اختيار اسم مختلف.',
        descriptionRequired: 'وصف المنتج مطلوب',
        priceRequired: 'السعر مطلوب',
        priceMustBePositive: 'يجب أن يكون السعر أكبر من 0',
        categoryRequired: 'اختيار الفئة مطلوب',
        imageInvalid: 'يرجى اختيار ملف صورة صحيح',
        imageTooLarge: 'يجب أن يكون حجم ملف الصورة أقل من 5 ميجابايت',
        imageUploadFailed: 'فشل في تحميل الصورة',
        productNotFound: 'لم يتم العثور على المنتج',
        permissionDenied: 'ليس لديك صلاحية لتحديث هذا المنتج',
        networkError: 'خطأ في الاتصال بالشبكة. تحقق من اتصالك وحاول مرة أخرى.',
        serverError: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
        unknownError: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
      },

      // Success messages
      success: {
        productUpdated: 'تم تحديث المنتج بنجاح',
        changesSaved: 'تم حفظ التغييرات بنجاح',
        imageUploaded: 'تم تحميل الصورة بنجاح'
      },

      // Validation messages
      validation: {
        nameMinLength: 'يجب أن يكون اسم المنتج أكثر من حرفين',
        nameMaxLength: 'يجب أن يكون اسم المنتج أقل من 100 حرف',
        descriptionMaxLength: 'يجب أن يكون الوصف أقل من 500 حرف',
        priceMin: 'يجب أن يكون السعر أكبر من 0',
        priceMax: 'يجب أن يكون السعر أقل من 10000',
        imageSize: 'يجب أن تكون الصورة أقل من 5 ميجابايت',
        imageType: 'مسموح بملفات الصور فقط'
      },

      // Accessibility
      accessibility: {
        closeModal: 'إغلاق نافذة تحرير المنتج',
        formTitle: 'نموذج تحرير المنتج',
        requiredField: 'حقل مطلوب',
        optionalField: 'حقل اختياري',
        imageUpload: 'تحميل صورة المنتج',
        removeImage: 'إزالة صورة المنتج',
        priceInput: 'إدخال سعر المنتج',
        categorySelect: 'اختيار فئة المنتج',
        statusToggle: 'تبديل حالة توفر المنتج',
        imagePreview: 'معاينة صورة المنتج'
      }
  },
  productIngredientModal: {
      // Header
      title: 'مكونات المنتج',
      subtitle: 'اختر المكونات لـ',
      close: 'إغلاق',

      // Search
      search: {
        placeholder: 'البحث عن المكونات...',
        label: 'البحث عن المكونات',
        noResults: 'لم يتم العثور على مكونات'
      },

      // Summary section
      summary: {
        selectedCount: 'المكونات المحددة',
        hasChanges: 'يوجد تغييرات',
        noChanges: 'لا توجد تغييرات'
      },

      // Form fields
      form: {
        quantity: {
          label: 'الكمية',
          placeholder: 'الكمية',
          required: 'الكمية مطلوبة'
        },
        unit: {
          label: 'الوحدة',
          placeholder: 'اختر الوحدة',
          required: 'الوحدة مطلوبة'
        }
      },

      // Measurement units
      units: {
        grams: 'جرام',
        milliliters: 'مل',
        pieces: 'قطعة',
        tablespoons: 'ملعقة كبيرة',
        teaspoons: 'ملعقة صغيرة',
        cups: 'كوب',
        kilograms: 'كيلوجرام',
        liters: 'لتر'
      },

      // Status indicators
      status: {
        available: 'متوفر',
        unavailable: 'غير متوفر',
        containsAllergens: 'يحتوي على مسببات الحساسية',
        toBeAdded: 'ستتم الإضافة',
        toBeRemoved: 'ستتم الإزالة',
        selected: 'محدد',
        unselected: 'غير محدد'
      },

      // Allergen information
      allergenInfo: {
        count: '{{count}} مسبب حساسية',
        count_plural: '{{count}} مسببات حساسية',
        details: 'تفاصيل مسببات الحساسية',
        warning: 'هذا المكون يحتوي على مسببات الحساسية'
      },

      // Loading states
      loading: {
        ingredients: 'جاري تحميل المكونات...',
        saving: 'جاري حفظ المكونات...',
        data: 'جاري تحميل البيانات...'
      },

      // Empty states
      emptyState: {
        noIngredients: 'لم يتم إضافة أي مكونات بعد.',
        noSearchResults: 'لم يتم العثور على مكونات تطابق معايير البحث.',
        noAvailableIngredients: 'لم يتم العثور على مكونات متاحة.'
      },

      // Buttons
      buttons: {
        cancel: 'إلغاء',
        skip: 'تخطي',
        save: 'حفظ',
        saveIngredients: 'حفظ المكونات',
        saving: 'جاري الحفظ...',
        add: 'إضافة مكونات',
        update: 'تحديث المكونات'
      },

      // Footer
      footer: {
        totalCount: 'المجموع: {{count}} مكون',
        selectedInfo: 'تم تحديد {{selected}} من {{total}}'
      },

      // Error messages
      errors: {
        loadingData: 'حدث خطأ أثناء تحميل بيانات المكونات.',
        savingIngredients: 'حدث خطأ أثناء حفظ المكونات. يرجى المحاولة مرة أخرى.',
        quantityRequired: 'يجب أن تكون جميع المكونات لها كمية أكبر من 0.',
        unitRequired: 'يجب تحديد وحدة لجميع المكونات.',
        networkError: 'خطأ في الاتصال بالشبكة. تحقق من اتصالك وحاول مرة أخرى.',
        serverError: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
        general: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
        invalidQuantity: 'يرجى إدخال كمية صحيحة',
        ingredientNotFound: 'لم يتم العثور على المكون',
        permissionDenied: 'ليس لديك صلاحية لتعديل المكونات'
      },

      // Success messages
      success: {
        ingredientsSaved: 'تم حفظ المكونات بنجاح',
        ingredientsUpdated: 'تم تحديث المكونات بنجاح',
        ingredientAdded: 'تم إضافة المكون بنجاح',
        ingredientRemoved: 'تم إزالة المكون بنجاح'
      },

      // Validation messages
      validation: {
        quantityMin: 'يجب أن تكون الكمية أكبر من 0',
        quantityMax: 'يجب أن تكون الكمية أقل من 1000',
        unitRequired: 'يرجى اختيار وحدة',
        ingredientRequired: 'يرجى اختيار مكون واحد على الأقل'
      },

      // Accessibility
      accessibility: {
        closeModal: 'إغلاق نافذة اختيار المكونات',
        searchInput: 'البحث عن المكونات',
        quantityInput: 'أدخل كمية المكون',
        unitSelect: 'اختر وحدة القياس',
        ingredientCheckbox: 'اختر المكون',
        selectedIndicator: 'تم تحديد المكون',
        allergenWarning: 'يحتوي على مسببات الحساسية',
        availabilityStatus: 'حالة التوفر'
      }
  },
  ProductIngredientUpdateModal: {
  title: 'تحديث المكونات',
  searchPlaceholder: 'البحث عن المكونات...',
  selectedCount: 'مكونات محددة',
  loadingIngredients: 'جاري تحميل المكونات...',
  noIngredientsFound: 'لم يتم العثور على مكونات',
  noIngredientsFoundSearch: 'لم يتم العثور على مكونات تطابق معايير البحث',
  unit: 'الوحدة:',
  price: 'السعر:',
  quantity: 'الكمية',
  cancel: 'إلغاء',
  save: 'حفظ',
  saving: 'جاري الحفظ...',
  errors: {
    loadingIngredients: 'حدث خطأ أثناء تحميل المكونات',
    savingIngredients: 'حدث خطأ أثناء حفظ المكونات'
  },
  accessibility: {
    closeModal: 'إغلاق نافذة تحديث المكونات',
    formTitle: 'نموذج تحديث مكونات المنتج',
    searchInput: 'البحث عن المكونات',
    ingredientToggle: 'تبديل تحديد المكون',
    quantityInput: 'أدخل كمية المكون',
    selectedIndicator: 'المكون محدد',
    unselectedIndicator: 'المكون غير محدد',
    ingredientCard: 'بطاقة تحديد المكون',
    saveButton: 'حفظ تغييرات المكونات',
    cancelButton: 'إلغاء تحديث المكونات'
  }
  },
  SortableCategory: {
    product: 'منتج',
    products: 'منتجات',
    editCategory: 'تعديل التصنيف',
    deleteCategory: 'حذف التصنيف',
    reorderingProducts: 'جاري حفظ ترتيب المنتجات...',
    noCategoryProducts: 'لا توجد منتجات في هذا التصنيف بعد.',
    expandCategory: 'توسيع التصنيف',
    collapseCategory: 'طي التصنيف',
    dragCategory: 'اسحب لإعادة ترتيب التصنيف',
    accessibility: {
      categoryActions: 'إجراءات التصنيف',
      productCount: 'عدد المنتجات',
      expandToggle: 'تبديل توسيع التصنيف',
      editCategoryButton: 'تعديل التصنيف',
      deleteCategoryButton: 'حذف التصنيف',
      dragHandle: 'مقبض السحب لإعادة ترتيب التصنيف',
      categoryCard: 'بطاقة التصنيف',
      emptyCategory: 'تصنيف فارغ',
      reorderingStatus: 'جاري إعادة ترتيب التصنيف'
    }
  },
  SortableProduct: {
    outOfStock: 'نفد المخزون',
    loadingIngredients: 'جاري تحميل المكونات...',
    ingredients: 'المكونات',
    noIngredients: 'لم تتم إضافة مكونات',
    loadingAddons: 'جاري تحميل الإضافات...',
    addons: 'الإضافات',
    noAddons: 'لم تتم إضافة إضافات',
    manageAddons: 'إدارة الإضافات',
    editProduct: 'تعديل المنتج',
    deleteProduct: 'حذف المنتج',
    dragProduct: 'اسحب لإعادة ترتيب المنتج',
    allergenic: 'يحتوي على مسببات الحساسية',
    recommended: 'موصى به',
    price: 'السعر',
    errors: {
      loadingIngredients: 'حدث خطأ أثناء تحميل المكونات.',
      loadingAddons: 'حدث خطأ أثناء تحميل الإضافات.'
    },
    accessibility: {
      productImage: 'صورة المنتج',
      productCard: 'بطاقة المنتج',
      productActions: 'إجراءات المنتج',
      dragHandle: 'مقبض السحب لإعادة ترتيب المنتج',
      outOfStockBadge: 'المنتج نفد من المخزون',
      ingredientsList: 'قائمة مكونات المنتج',
      addonsList: 'قائمة إضافات المنتج',
      allergenWarning: 'يحتوي على مسببات الحساسية',
      recommendedAddon: 'إضافة موصى بها',
      editButton: 'تعديل المنتج',
      deleteButton: 'حذف المنتج',
      addonsButton: 'إدارة إضافات المنتج'
    }
  },
  IngredientsContent: {
    // Search and filters
    searchPlaceholder: 'البحث عن المكونات...',
    filter: 'تصفية',
    sort: 'ترتيب',
    newIngredient: 'مكون جديد',
    
    // Table headers
    ingredientName: 'اسم المكون',
    status: 'الحالة',
    allergenInfo: 'معلومات مسببات الحساسية',
    actions: 'الإجراءات',
    
    // Status labels
    available: 'متاح',
    unavailable: 'غير متاح',
    containsAllergens: 'يحتوي على مسببات الحساسية',
    noAllergens: 'لا يحتوي على مسببات الحساسية',
    
    // Actions
    edit: 'تعديل',
    delete: 'حذف',
    
    // Empty states
    noIngredientsFound: 'لم يتم العثور على مكونات تطابق معايير البحث.',
    noIngredientsYet: 'لم تتم إضافة مكونات بعد.',
    
    // Delete modal
    deleteIngredient: 'حذف المكون',
    deleteConfirmMessage: 'هل أنت متأكد من أنك تريد حذف المكون "{name}"؟',
    deleteError: 'حدث خطأ أثناء الحذف. يرجى المحاولة مرة أخرى.',
    cancel: 'إلغاء',
    deleting: 'جاري الحذف...',
    
    // Form modal
    editIngredient: 'تعديل المكون',
    addNewIngredient: 'إضافة مكون جديد',
    basicInfo: 'المعلومات الأساسية',
    ingredientNameRequired: 'اسم المكون مطلوب',
    enterIngredientName: 'أدخل اسم المكون',
    containsAllergensCheckbox: 'يحتوي على مسببات الحساسية',
    availableForUse: 'متاح للاستخدام',
    allergenInfoContent: 'معلومات مسببات الحساسية',
    selectAllergensMessage: 'حدد مسببات الحساسية الموجودة في هذا المكون:',
    enableAllergenMessage: 'قم بتفعيل "يحتوي على مسببات الحساسية" أولاً لتحديد المسببات.',
    allergenDetails: 'تفاصيل مسببات الحساسية',
    containsThisAllergen: 'يحتوي على هذا المسبب للحساسية',
    additionalNotes: 'ملاحظات إضافية (اختيارية)',
    updateError: 'حدث خطأ أثناء تحديث المكون.',
    createError: 'حدث خطأ أثناء إضافة المكون.',
    updating: 'جاري التحديث...',
    adding: 'جاري الإضافة...',
    update: 'تحديث',
    add: 'إضافة',
    
    accessibility: {
      ingredientsTable: 'جدول إدارة المكونات',
      searchInput: 'البحث عن المكونات',
      filterButton: 'تصفية المكونات',
      sortButton: 'ترتيب المكونات',
      addButton: 'إضافة مكون جديد',
      editButton: 'تعديل المكون',
      deleteButton: 'حذف المكون',
      ingredientCard: 'بطاقة معلومات المكون',
      allergenSelection: 'تحديد مسببات الحساسية',
      formModal: 'نافذة نموذج المكون',
      deleteModal: 'نافذة تأكيد الحذف',
      statusBadge: 'حالة المكون',
      allergenBadge: 'معلومات مسببات الحساسية',
      closeModal: 'إغلاق النافذة',
      dragToReorder: 'اسحب لإعادة الترتيب'
    }
  },
  TableCard: {
    active: 'نشط',
    inactive: 'غير نشط',
    occupied: 'مشغول',
    empty: 'فارغ',
    capacity: 'شخص',
    capacityPlural: 'أشخاص',
    edit: 'تعديل',
    downloadQR: 'تحميل رمز QR',
    disable: 'إلغاء التفعيل',
    enable: 'تفعيل',
    delete: 'حذف',
    viewQRCode: 'عرض رمز QR',
    moreOptions: 'المزيد من الخيارات',
    accessibility: {
      tableCard: 'بطاقة معلومات الطاولة',
      statusBadge: 'حالة الطاولة',
      occupancyBadge: 'حالة إشغال الطاولة',
      actionsMenu: 'قائمة إجراءات الطاولة',
      qrCodePreview: 'معاينة رمز QR',
      editButton: 'تعديل الطاولة',
      downloadButton: 'تحميل رمز QR',
      toggleButton: 'تبديل حالة الطاولة',
      deleteButton: 'حذف الطاولة'
    }
  },
  QRCodeModal: {
    // Step selection
    tableAddOption: 'خيار إضافة الطاولة',
    howToAddTables: 'كيف تريد إضافة الطاولات؟',
    singleTable: 'إضافة طاولة واحدة',
    bulkTable: 'إضافة طاولات متعددة',
    createSingleTable: 'إنشاء طاولة واحدة',
    createMultipleTables: 'إنشاء طاولات متعددة',
    
    // Branch selection
    branchSelection: 'اختيار الفرع',
    selectBranch: 'اختر الفرع',
    branchRequired: 'مطلوب',
    loadingBranches: 'جاري تحميل الفروع...',
    
    // Single table form
    editTable: 'تعديل الطاولة',
    addSingleTable: 'إضافة طاولة واحدة',
    tableName: 'اسم الطاولة',
    tableNamePlaceholder: 'مثال: طاولة 1',
    autoNameNote: 'سيتم إعطاء اسم تلقائي إذا تُرك فارغاً',
    tableCategory: 'فئة الطاولة',
    selectCategory: 'اختر الفئة',
    loadingCategories: 'جاري تحميل الفئات...',
    noCategories: 'لم يتم العثور على فئات',
    capacity: 'السعة',
    capacityPlaceholder: 'عدد الأشخاص',
    displayOrder: 'ترتيب العرض',
    displayOrderPlaceholder: 'رقم للترتيب',
    autoOrderNote: 'سيتم تطبيق ترتيب تلقائي إذا تُرك فارغاً',
    tableActive: 'يجب أن تكون الطاولة نشطة',
    
    // Bulk table form
    addBulkTables: 'إضافة طاولات متعددة',
    categoryQuantities: 'كميات الطاولات حسب الفئة',
    addCategory: 'إضافة فئة',
    category: 'الفئة',
    tableCount: 'عدد الطاولات',
    allTablesActive: 'جميع الطاولات يجب أن تكون نشطة',
    tableSummary: 'ملخص الطاولات المراد إنشاؤها:',
    total: 'الإجمالي',
    tables: 'طاولات',
    
    // Actions
    cancel: 'إلغاء',
    adding: 'جاري الإضافة...',
    addTable: 'إضافة طاولة',
    update: 'تحديث',
    updating: 'جاري التحديث...',
    creating: 'جاري الإنشاء... ({count} طاولة)',
    createTables: 'إنشاء {count} طاولة',
    
    // Validation
    branchRequiredValidation: 'اختيار الفرع مطلوب',
    categoryRequired: 'مطلوب فئة واحدة على الأقل',
    
    accessibility: {
      modal: 'نافذة إنشاء الطاولة',
      stepSelection: 'اختيار طريقة إنشاء الطاولة',
      branchSelector: 'قائمة اختيار الفرع',
      categorySelector: 'اختيار فئة الطاولة',
      tableForm: 'نموذج إنشاء الطاولة',
      bulkForm: 'نموذج إنشاء طاولات متعددة',
      backButton: 'العودة للخطوة السابقة',
      closeButton: 'إغلاق النافذة'
    }
  },
  TableCategoryModal: {
    title: 'إضافة فئة طاولة',
    subtitle: 'إنشاء فئة طاولة جديدة',
    categoryName: 'اسم الفئة',
    categoryNamePlaceholder: 'مثال: طاولات VIP، طاولات الحديقة',
    description: 'الوصف (اختياري)',
    descriptionPlaceholder: 'وصف قصير عن الفئة...',
    colorSelection: 'اختيار اللون',
    customColor: 'لون مخصص',
    iconSelection: 'اختيار الأيقونة',
    branchSelection: 'اختيار الفرع',
    cancel: 'إلغاء',
    addCategory: 'إضافة فئة',
    saving: 'جاري الحفظ...',
    
    // Icons
    table: 'طاولة',
    chair: 'كرسي',
    service: 'خدمة',
    label: 'تسمية',
    layer: 'طبقة',
    
    // Validation errors
    categoryNameRequired: 'اسم الفئة مطلوب',
    iconRequired: 'يجب اختيار أيقونة',
    branchRequired: 'اختيار الفرع مطلوب',
    invalidData: 'تم إرسال بيانات غير صحيحة',
    unauthorized: 'غير مخول. يرجى تسجيل الدخول مرة أخرى.',
    forbidden: 'ليس لديك صلاحية لهذه العملية.',
    branchNotFound: 'الفرع المحدد غير موجود.',
    serverError: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
    unexpectedError: 'حدث خطأ غير متوقع أثناء إضافة الفئة',
    
    accessibility: {
      modal: 'نافذة إنشاء فئة الطاولة',
      colorPalette: 'لوحة اختيار الألوان',
      colorPreset: 'خيار لون جاهز',
      customColorPicker: 'منتقي الألوان المخصص',
      iconGrid: 'شبكة اختيار الأيقونات',
      iconOption: 'خيار الأيقونة',
      branchDropdown: 'قائمة اختيار الفرع',
      form: 'نموذج إنشاء الفئة'
    }
  },
  AddQRCodeCard: {
    title: 'إضافة طاولة جديدة',
    subtitle: 'انقر لإضافة طاولة جديدة',
    accessibility: {
      addButton: 'زر إضافة طاولة جديدة',
      addCard: 'بطاقة إضافة طاولة جديدة'
    }
  },
  userManagementPage: {
    // Page header and navigation
    title: 'إدارة المستخدمين',
    loading: 'جاري التحميل...',
    error: {
      title: 'خطأ',
      loadFailed: 'فشل في تحميل المستخدمين',
      rolesLoadFailed: 'فشل في تحميل الأدوار',
      retry: 'حاول مرة أخرى',
      createUserFailed: 'فشل في إنشاء المستخدم',
      createRoleFailed: 'فشل في إنشاء الدور'
    },

    // Statistics
    stats: {
      total: 'الإجمالي',
      active: 'نشط',
      users: 'مستخدمين',
      roles: 'أدوار',
      system: 'النظام',
      custom: 'مخصص',
      totalUsers: 'إجمالي المستخدمين',
      owner: 'مالك',
      manager: 'مدير',
      staff: 'موظف'
    },

    // Tabs
    tabs: {
      users: 'المستخدمون',
      roles: 'الأدوار'
    },

    // Controls and filters
    controls: {
      search: 'البحث عن مستخدم أو بريد إلكتروني أو هاتف...',
      searchRoles: 'البحث عن دور أو وصف أو فئة...',
      filterAll: 'جميع الفئات',
      filterOwner: 'مالك المطعم',
      filterManager: 'مدير الفرع',
      filterStaff: 'موظف',
      filterActive: 'المستخدمون النشطون',
      filterInactive: 'المستخدمون غير النشطين',
      addUser: 'إضافة مستخدم',
      addRole: 'إضافة دور'
    },

    // Table headers
    table: {
      user: 'المستخدم',
      contact: 'التواصل',
      roles: 'الأدوار',
      location: 'المطعم/الفرع',
      status: 'الحالة',
      registrationDate: 'تاريخ التسجيل',
      actions: 'الإجراءات',
      role: 'الدور',
      description: 'الوصف',
      statistics: 'الإحصائيات',
      position: 'الموقع'
    },

    // Status indicators
    status: {
      active: 'نشط',
      inactive: 'غير نشط',
      enabled: 'مُفعل',
      disabled: 'معطل',
      systemRole: 'دور النظام'
    },

    // Role types
    roleTypes: {
      RestaurantOwner: 'مالك',
      BranchManager: 'مدير',
      Staff: 'موظف'
    },

    // Actions menu
    actions: {
      viewDetails: 'عرض التفاصيل',
      edit: 'تعديل',
      activate: 'تفعيل',
      deactivate: 'إلغاء التفعيل'
    },

    // No results messages
    noResults: {
      usersNotFound: 'لم يتم العثور على مستخدمين',
      rolesNotFound: 'لم يتم العثور على أدوار',
      usersEmpty: 'لم يتم إضافة أي مستخدمين بعد.',
      rolesEmpty: 'لم يتم إضافة أي أدوار بعد.',
      searchEmpty: 'لم يتم العثور على مستخدمين يطابقون معايير البحث.',
      searchEmptyRoles: 'لم يتم العثور على أدوار تطابق معايير البحث.'
    },

    // Create Role Modal
    createRole: {
      title: 'إنشاء دور جديد',
      basicInfo: 'المعلومات الأساسية',
      roleName: 'اسم الدور',
      roleNamePlaceholder: 'مثال: مدير الفرع',
      category: 'الفئة',
      categoryPlaceholder: 'مثال: الإدارة',
      description: 'الوصف',
      descriptionPlaceholder: 'وصف مهام ومسؤوليات الدور...',
      restaurantId: 'رقم المطعم',
      restaurantIdPlaceholder: 'الافتراضي: المطعم الحالي',
      branchId: 'رقم الفرع',
      branchIdPlaceholder: 'فارغ: جميع الفروع',
      isActive: 'الدور يجب أن يكون نشطاً',
      permissions: 'الصلاحيات',
      permissionsSelected: 'مُحدد',
      cancel: 'إلغاء',
      create: 'إنشاء الدور',
      creating: 'جاري الإنشاء...',
      validation: {
        nameRequired: 'اسم الدور يجب أن يكون على الأقل 3 أحرف',
        nameMaxLength: 'اسم الدور يمكن أن يكون 50 حرفاً كحد أقصى',
        descriptionMaxLength: 'الوصف يمكن أن يكون 200 حرف كحد أقصى',
        categoryMaxLength: 'الفئة يمكن أن تكون 50 حرفاً كحد أقصى'
      }
    },

    // Create User Modal
    createUser: {
      title: 'إنشاء مستخدم جديد',
      personalInfo: 'المعلومات الشخصية',
      contactInfo: 'معلومات التواصل',
      passwordInfo: 'معلومات كلمة المرور',
      locationInfo: 'معلومات الموقع',
      roleAssignment: 'تعيين السلطة والدور',
      
      // Form fields
      firstName: 'الاسم الأول',
      firstNamePlaceholder: 'مثال: أحمد',
      lastName: 'اسم العائلة',
      lastNamePlaceholder: 'مثال: محمد',
      userName: 'اسم المستخدم',
      userNamePlaceholder: 'سيتم إنشاؤه تلقائياً',
      userNameHint: 'إذا تُرك فارغاً، سيتم إنشاؤه تلقائياً بصيغة الاسم.العائلة',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'ahmed@example.com',
      phone: 'الهاتف',
      phonePlaceholder: '+966 55 123 4567',
      password: 'كلمة المرور',
      passwordPlaceholder: 'على الأقل 6 أحرف',
      passwordConfirm: 'تأكيد كلمة المرور',
      passwordConfirmPlaceholder: 'أعد إدخال كلمة المرور',
      
      // Location
      locationType: 'نوع الموقع',
      restaurant: 'مطعم',
      branch: 'فرع',
      restaurantId: 'رقم المطعم',
      restaurantIdPlaceholder: 'مثال: 123',
      branchId: 'رقم الفرع',
      branchIdPlaceholder: 'مثال: 456',
      profileImage: 'رابط صورة الملف الشخصي',
      profileImagePlaceholder: 'https://example.com/avatar.jpg',
      userCreatorId: 'رقم منشئ المستخدم',
      userCreatorIdPlaceholder: 'رقم المستخدم الحالي',
      
      // Role assignment
      assignmentType: 'نوع التعيين',
      rolesSelection: 'اختيار من الأدوار الموجودة (مُستحسن)',
      permissionsSelection: 'اختيار الصلاحيات المباشر (غير مدعوم حالياً)',
      apiWarning: '⚠️ واجهة البرمجة تدعم فقط إنشاء المستخدمين القائم على الأدوار. أنشئ الأدوار أولاً، ثم اربطها بالمستخدمين.',
      rolesLabel: 'الأدوار',
      rolesSelected: 'مُحدد',
      
      // No roles state
      noRoles: {
        title: 'لم يتم تعريف أي أدوار بعد',
        description: 'أنشئ الأدوار من تبويب الأدوار قبل إنشاء المستخدمين',
        tip: '💡 نصيحة: انتقل إلى تبويب "الأدوار" أولاً لإنشاء الأدوار المطلوبة',
        warning: 'دور مطلوب',
        warningDescription: 'يجب تعريف دور واحد على الأقل لإنشاء مستخدم. يمكنك إنشاء أدوار جديدة من تبويب "الأدوار".'
      },
      
      isActive: 'المستخدم يجب أن يكون نشطاً',
      cancel: 'إلغاء',
      create: 'إنشاء مستخدم',
      creating: 'جاري الإنشاء...',
      createRoleFirst: 'أنشئ دوراً أولاً',
      
      // Validation messages
      validation: {
        nameRequired: 'الاسم الأول مطلوب',
        nameMaxLength: 'الاسم الأول يمكن أن يكون 50 حرفاً كحد أقصى',
        surnameRequired: 'اسم العائلة مطلوب',
        surnameMaxLength: 'اسم العائلة يمكن أن يكون 50 حرفاً كحد أقصى',
        emailRequired: 'البريد الإلكتروني مطلوب',
        emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
        passwordRequired: 'كلمة المرور يجب أن تكون على الأقل 6 أحرف',
        passwordMaxLength: 'كلمة المرور يمكن أن تكون 100 حرف كحد أقصى',
        passwordConfirmRequired: 'تأكيد كلمة المرور مطلوب',
        passwordMismatch: 'كلمات المرور غير متطابقة',
        phoneRequired: 'رقم الهاتف مطلوب',
        restaurantIdRequired: 'يرجى إدخال رقم مطعم صحيح',
        branchIdRequired: 'يرجى إدخال رقم فرع صحيح',
        rolesRequired: 'يجب اختيار دور واحد على الأقل',
        permissionsNotSupported: 'واجهة البرمجة تدعم فقط إنشاء المستخدمين القائم على الأدوار. يرجى الاختيار من الأدوار الموجودة.'
      }
    },

    // Role details
    roleDetails: {
      userCount: 'عدد المستخدمين',
      permissionCount: 'عدد الصلاحيات',
      restaurant: 'المطعم',
      branch: 'الفرع',
      noDescription: 'لا يوجد وصف متاح',
      users: 'مستخدمين',
      permissions: 'صلاحيات'
    },

    // Permission categories
    permissionCategories: {
      'User Management': 'إدارة المستخدمين',
      'Restaurant Management': 'إدارة المطاعم', 
      'Branch Management': 'إدارة الفروع',
      'Order Management': 'إدارة الطلبات',
      'Product Management': 'إدارة المنتجات',
      'Analytics': 'التحليلات'
    },

    // Success messages
    success: {
      userCreated: 'تم إنشاء المستخدم بنجاح',
      roleCreated: 'تم إنشاء الدور بنجاح',
      userUpdated: 'تم تحديث المستخدم بنجاح',
      roleUpdated: 'تم تحديث الدور بنجاح'
    },
  },
  BranchtableManagement: {

  title: "إدارة الطاولات",
  subtitle: "إدارة طاولات المطعم والفئات",
  tabs: {
    tables: "الطاولات",
    categories: "الفئات",
    statistics: "الإحصائيات",
    batchCreate: "إنشاء متعدد"
  },
  buttons: {
    addTable: "إضافة طاولة",
    addCategory: "إضافة فئة",
    batchCreate: "إنشاء متعدد",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    refresh: "تحديث",
    selectAll: "تحديد الكل",
    clearSelection: "إلغاء التحديد",
    export: "تصدير",
    import: "استيراد"
  },
  labels: {
    tableName: "اسم الطاولة",
    category: "الفئة",
    capacity: "السعة",
    status: "الحالة",
    occupation: "الإشغال",
    displayOrder: "ترتيب العرض",
    search: "البحث في الطاولات...",
    filterByCategory: "تصفية حسب الفئة",
    viewMode: "وضع العرض",
    totalTables: "إجمالي الطاولات",
    activeTables: "الطاولات النشطة",
    occupiedTables: "الطاولات المشغولة",
    availableTables: "الطاولات المتاحة"
  },
  status: {
    active: "نشط",
    inactive: "غير نشط",
    occupied: "مشغول",
    available: "متاح",
    outOfService: "خارج الخدمة"
  },
  actions: {
    markOccupied: "تحديد كمشغول",
    markAvailable: "تحديد كمتاح",
    activate: "تفعيل",
    deactivate: "إلغاء التفعيل",
    viewDetails: "عرض التفاصيل"
  },
  messages: {
    tableCreated: "تم إنشاء الطاولة بنجاح",
    tableUpdated: "تم تحديث الطاولة بنجاح",
    tableDeleted: "تم حذف الطاولة بنجاح",
    statusUpdated: "تم تحديث الحالة بنجاح",
    error: "حدث خطأ",
    noTables: "لم يتم العثور على طاولات",
    confirmDelete: "هل أنت متأكد من حذف هذه الطاولة؟",
    loading: "جاري التحميل...",
    saving: "جاري الحفظ...",
    deleting: "جاري الحذف..."
  },
  statistics: {
    title: "إحصائيات الطاولات",
    occupancyRate: "معدل الإشغال",
    averageCapacity: "متوسط السعة",
    categoryBreakdown: "توزيع الفئات",
    dailyOccupancy: "الإشغال اليومي",
    peakHours: "ساعات الذروة"
  },
  forms: {
    createTable: "إنشاء طاولة جديدة",
    editTable: "تعديل الطاولة",
    batchCreateTables: "إنشاء عدة طاولات",
    quantity: "الكمية",
    namePrefix: "بادئة الاسم",
    startingNumber: "الرقم البادئ"
  }
  },

  BranchTableManagement: {
      "clearTable": " تنضيف الطاولة",
      "refreshTable": " تحديث الحالة",
      "clearing": "جارٍ المسح...",
          loading : "جارٍ التحميل...",
        multiCategory : "إنشاء جداول متعددة عبر فئات مختلفة في وقت واحد",
        category: "الفئة",
        SelectCategory: "اختر فئة",
        Quantity: "الكمية",
        Capacity: "السعة",
        createTables: "إنشاء الطاولات",
        creatingTables: "جارٍ إنشاء الطاولات...",
      batchCreateTables: "إنشاء جداول دفعة واحدة",
      header: "إدارة الفئات والطاولات",
      subheader: "إدارة فئات المطعم والطاولات مع عرض الأكورديون",
      totalCategories: "إجمالي الفئات",
      totalTables: "إجمالي الطاولات",
      occupiedTables: "الطاولات المشغولة",
      availableTables: "الطاولات المتاحة",
      searchPlaceholder: "ابحث عن الفئات...",
      refresh: "تحديث",
      addCategory: "إضافة فئة",
      addCategoryTitle: "إضافة فئة جديدة",
      categoryNameLabel: "اسم الفئة",
      categoryNamePlaceholder: "أدخل اسم الفئة",
      colorLabel: "اللون",
      iconLabel: "الأيقونة",
      save: "حفظ",
      cancel: "إلغاء",
      noCategories: "لم يتم العثور على فئات",
      addFirstCategory: "إضافة فئتك الأولى",
      tablesCount: "طاولات",
      status: "الحالة",
      active: "نشط",
      inactive: "غير نشط",
      occupation: "الإشغال",
      occupied: "مشغولة",
      available: "متاح",
      addTable: "إضافة طاولة",
      tableNamePlaceholder: "اسم الطاولة",
      capacityPlaceholder: "السعة",
      noTables: "لا توجد طاولات في هذه الفئة",
      qrCodeTitle: "رمز QR - {tableName}",
      qrCodeDescription: "امسح رمز QR هذا للوصول إلى قائمة الطاولة",
      downloadQR: "تنزيل رمز QR",
      downloading: "جاري التنزيل...",
      copyQRUrl: "نسخ رابط QR",
      copied: "تم النسخ!",
      success: {
        "tableCleared": "تم مسح الطاولة {{tableName}} وهو الآن متاح",
        "tableOccupied": "تم تحديث حالة الطاولة {{tableName}} إلى ",
        "tableClearedGeneric": "تم مسح الطاولة بنجاح",
        "tableStatusUpdated": "تم تحديث حالة الطاولة بنجاح",
        categoryAdded: "تم إضافة الفئة بنجاح",
        categoryUpdated: "تم تحديث الفئة بنجاح",
        categoryDeleted: "تم حذف الفئة بنجاح",
        tableAdded: "تم إضافة الطاولة بنجاح",
        tableUpdated: "تم تحديث الطاولة بنجاح",
        tableDeleted: "تم حذف الطاولة بنجاح",
        categoryActivated: "تم تفعيل الفئة بنجاح",
        categoryDeactivated: "تم إلغاء تفعيل الفئة بنجاح",
        tableActivated: "تم تفعيل الطاولة بنجاح",
        tableDeactivated: "تم إلغاء تفعيل الطاولة بنجاح",
        tableAvailable: "تم وضع علامة على الطاولة كمتاحة",
        dataRefreshed: "تم تحديث البيانات بنجاح"
      },
      error: {
      "clearTableFailed": "فشل مسح الطاولة. يُرجى المحاولة مرة أخرى",
        fetchCategoriesFailed: "فشل في جلب الفئات",
        fetchTablesFailed: "فشل في جلب الطاولات",
        categoryNameRequired: "اسم الفئة مطلوب",
        addCategoryFailed: "فشل في إضافة الفئة",
        updateCategoryFailed: "فشل في تحديث الفئة",
        deleteCategoryFailed: "فشل في حذف الفئة",
        categoryHasTables: "لا يمكن حذف الفئة التي تحتوي على طاولات",
        categoryNotFound: "الفئة غير موجودة",
        addTableFailed: "فشل في إضافة الطاولة",
        updateTableFailed: "فشل في تحديث الطاولة",
        deleteTableFailed: "فشل في حذف الطاولة",
        tableNameRequired: "اسم الطاولة مطلوب",
        tableNotFound: "الطاولة غير موجودة",
        updateCategoryStatusFailed: "فشل في تحديث حالة الفئة",
        updateTableStatusFailed: "فشل في تحديث حالة الطاولة",
        updateTableOccupationFailed: "فشل في تحديث حالة إشغال الطاولة",
        refreshFailed: "فشل في تحديث البيانات"
      }
  },
  branchManagementBranch: {
    title: 'إدارة الفروع',
    description: 'إدارة معلومات وإعدادات فرعك.',
    loading: 'جاري تحميل معلومات الفرع...',
    noBranchFound: 'لم يتم العثور على أي فرع',
    uploadLogo: 'تحميل الشعار',
    status: {
      open: 'مفتوح',
      closed: 'مغلق',
      temporarilyClosed: 'مغلق مؤقتاً',
      reopenBranch: 'إعادة فتح الفرع',
      temporaryClose: 'إغلاق مؤقت'
    },
    
    actions: {
      edit: 'تعديل',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      deleting: 'جاري الحذف...',
      confirmDelete: 'تأكيد الحذف',
      deleteWarning: 'هل أنت متأكد من أنك تريد حذف هذا الفرع؟ لا يمكن التراجع عن هذا الإجراء.',
    },
    
    basicInfo: {
      title: 'المعلومات الأساسية',
      branchName: 'اسم الفرع',
      whatsappNumber: 'رقم الواتساب',
      email: 'البريد الإلكتروني',
      notSpecified: 'غير محدد'
    },
    
    addressInfo: {
      title: 'معلومات العنوان',
      country: 'الدولة',
      city: 'المدينة',
      street: 'الشارع',
      postalCode: 'الرمز البريدي',
      region: 'المنطقة'
    },
    
    workingHours: {
      title: 'ساعات العمل',
      workingDay: 'يوم عمل',
      openTime: 'وقت الفتح',
      closeTime: 'وقت الإغلاق',
      noWorkingHours: 'لم يتم تحديد ساعات العمل',
      days: {
        0: 'الأحد',
        1: 'الاثنين',
        2: 'الثلاثاء',
        3: 'الأربعاء',
        4: 'الخميس',
        5: 'الجمعة',
        6: 'السبت'
      }
    },
    
    messages: {
      updateSuccess: 'تم تحديث معلومات الفرع بنجاح',
      deleteSuccess: 'تم حذف الفرع بنجاح',
      temporaryCloseSuccess: 'تم إغلاق الفرع مؤقتاً',
      reopenSuccess: 'تم إعادة فتح الفرع',
      updateError: 'حدث خطأ أثناء التحديث',
      deleteError: 'حدث خطأ أثناء الحذف',
      statusChangeError: 'حدث خطأ أثناء تغيير الحالة',
      loadError: 'حدث خطأ أثناء تحميل معلومات الفرع'
    },
    
    placeholders: {
      branchName: 'أدخل اسم الفرع',
      whatsappNumber: 'أدخل رقم الواتساب',
      email: 'أدخل عنوان البريد الإلكتروني',
      country: 'أدخل الدولة',
      city: 'أدخل المدينة',
      street: 'أدخل الشارع',
      postalCode: 'أدخل الرمز البريدي',
      region: 'أدخل المنطقة'
    }
  },
   branchCategories: {
    // Header and Stats
    header: 'إدارة فئات الفرع',
    subheader: 'إدارة الفئات والمنتجات للفرع {branchId}',
    lastUpdated: 'آخر تحديث',
    
    stats: {
      availableCategories: 'الفئات المتاحة',
      readyToAdd: 'جاهزة للإضافة',
      activeCategories: 'الفئات النشطة',
      currentlyInBranch: 'موجودة حالياً في الفرع',
      selectedCategories: 'الفئات المحددة',
      toBeAdded: 'ستتم إضافتها',
      selectedProducts: 'المنتجات المحددة',
      fromCategories: 'من الفئات',
      avalibleAddons: 'الإضافات المتاحة',

    },

    // Tab Navigation
    tabs: {
      addNew: 'إضافة جديد',
      manageExisting: 'إدارة الموجود'
    },

    // Step Progress
    steps: {
      chooseCategories: 'اختيار الفئات',
      selectProducts: 'اختيار المنتجات',
      reviewAdd: 'مراجعة وإضافة',
      finalStep: 'الخطوة الأخيرة',
      selected: 'محدد',
      back: 'رجوع'
    },

    // Add New Categories
    addCategories: {
      title: 'اختيار الفئات',
      subtitle: 'حدد الفئات التي تريد إضافتها إلى فرعك',
      noAvailable: 'لا توجد فئات متاحة',
      allAdded: 'تم إضافة جميع الفئات المتاحة إلى هذا الفرع',
      categoriesSelected: 'فئات محددة',
      clearSelection: 'مسح التحديد',
      nextSelectProducts: 'التالي: اختيار المنتجات'
    },

    // Select Products
    selectProducts: {
      title: 'اختيار المنتجات',
      subtitle: 'اختر المنتجات من الفئات المحددة',
      selectAll: 'اختيار الكل',
      clearAll: 'مسح الكل',
      noProducts: 'لم يتم العثور على منتجات',
      noProductsInCategories: 'الفئات المحددة لا تحتوي على أي منتجات',
      available: 'متاح',
      productsSelectedFrom: 'منتجات محددة من',
      categories: 'فئات',
      reviewSelection: 'مراجعة التحديد'
    },

    // Review and Add
    review: {
      title: 'مراجعة وإضافة',
      subtitle: 'راجع اختيارك قبل الإضافة إلى الفرع',
      of: 'من',
      productsSelected: 'منتجات محددة',
      all: 'جميع',
      productsWillBeAdded: 'المنتجات ستتم إضافتها',
      totalValue: 'القيمة الإجمالية',
      selectedProducts: 'المنتجات المحددة',
      readyToAdd: 'جاهز لإضافة',
      with: 'مع',
      availableInBranch: 'متاح في الفرع',
      startOver: 'البدء من جديد',
      adding: 'جاري الإضافة...',
      addToBranch: 'إضافة إلى الفرع'
    },

    // Manage Existing
    manage: {
      title: 'إدارة الفئات الموجودة',
      subtitle: 'إدارة الفئات والمنتجات في فرعك',
      saving: 'جاري الحفظ...',
      saveOrder: 'حفظ الترتيب',
      exitReorder: 'إنهاء إعادة الترتيب',
      reorder: 'إعادة ترتيب',
      noCategoriesAdded: 'لم يتم إضافة فئات',
      noCategoriesAddedDesc: 'لم يتم إضافة أي فئات إلى هذا الفرع بعد',
      addCategories: 'إضافة فئات',
      original: 'الأصلي:',
      added: 'مضاف',
      available: 'متاح',
      total: 'الإجمالي',
      active: 'نشط',
      inactive: 'غير نشط',
      protected: 'محمي'
    },

    // Products Section
    products: {
      inCategory: 'المنتجات في الفئة',
      added: 'مضاف',
      available: 'متاح',
      ingredients: 'مكونات',
      allergens: 'مسببات الحساسية',
      viewDetails: 'عرض التفاصيل',
      removeFromBranch: 'إزالة من الفرع',
      addToBranch: 'إضافة إلى الفرع',
      addedToBranch: 'منتجات مضافة إلى الفرع',
      moreAvailableToAdd: 'المزيد متاح للإضافة',
      withDetailedInfo: 'بمعلومات مفصلة',
      products: 'منتجات'
    },

    // Product Details Modal
    productDetails: {
      addedToBranch: 'مضاف إلى الفرع',
      allergens: 'مسببات الحساسية',
      contains: 'يحتوي على',
      mayContain: 'قد يحتوي على',
      ingredients: 'المكونات',
      allergenic: 'مسبب للحساسية',
      available: 'متاح',
      unavailable: 'غير متاح',
      quantity: 'الكمية:',
      ingredientId: 'معرف المكون:',
      allergenInformation: 'معلومات مسببات الحساسية:',
      additionalInformation: 'معلومات إضافية',
      originalProduct: 'المنتج الأصلي',
      originalPrice: 'السعر الأصلي:',
      originalStatus: 'الحالة الأصلية:',
      originalDisplayOrder: 'ترتيب العرض الأصلي:',
      orderDetails: 'تفاصيل الطلب',
      lastUpdated: 'آخر تحديث:',
      close: 'إغلاق'
    },

    // Common Actions
    actions: {
      refresh: 'تحديث',
      delete: 'حذف',
      edit: 'تعديل',
      save: 'حفظ',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      loading: 'جاري التحميل...'
    },

    // Search and Filters
    search: {
      categories: 'البحث في الفئات...',
      products: 'البحث في المنتجات...'
    },

    // Status
    status: {
      active: 'نشط',
      inactive: 'غير نشط',
      available: 'متاح',
      unavailable: 'غير متاح'
    },

    // Messages
    messages: {
      success: {
        categoryAdded: 'تم إضافة الفئة بنجاح',
        categoryDeleted: 'تم حذف الفئة بنجاح',
        productAdded: 'تم إضافة المنتج {name} بنجاح',
        productRemoved: 'تم إزالة المنتج {name} بنجاح',
        orderSaved: 'تم حفظ ترتيب الفئات بنجاح'
      },
      error: {
        cannotDelete: 'لا يمكن حذف الفئة "{name}" لأنها تحتوي على {count} منتجات. يرجى إزالة جميع المنتجات أولاً.',
        cannotDeleteTooltip: 'لا يمكن الحذف: الفئة تحتوي على {count} منتجات. أزل جميع المنتجات أولاً.',
        productNotFound: 'المنتج غير موجود',
        addingProduct: 'خطأ في إضافة المنتج',
        removingProduct: 'خطأ في إزالة المنتج',
        savingOrder: 'خطأ في حفظ الترتيب',
        loadingCategories: 'خطأ في تحميل الفئات',
        loadingProducts: 'خطأ في تحميل المنتجات'
      }
    },

    // Delete Modal
    deleteModal: {
      title: 'حذف الفئة',
      message: 'هل أنت متأكد من حذف الفئة "{name}"؟ لا يمكن التراجع عن هذا الإجراء.',
      confirm: 'حذف',
      cancel: 'إلغاء'
    },

    // Placeholders
    placeholders: {
      searchCategories: 'البحث في الفئات...',
      searchProducts: 'البحث في المنتجات...'
    }
  },
  profile: {
      title: 'الملف الشخصي',
      personalInfo: 'المعلومات الشخصية',
      editProfile: 'تعديل الملف الشخصي',
      accountStatus: {
        active: 'حساب نشط',
        inactive: 'حساب غير نشط',
        status: 'حالة الحساب'
      },
      fields: {
        firstName: 'الاسم الأول',
        lastName: 'اسم العائلة',
        username: 'اسم المستخدم',
        email: 'البريد الإلكتروني',
        registrationDate: 'تاريخ التسجيل',
        restaurantName: 'اسم المطعم',
        status: 'الحالة'
      },
      restaurant: {
        info: 'معلومات المطعم',
        name: 'اسم المطعم',
        status: {
          active: 'نشط',
          inactive: 'غير نشط'
        }
      },
      permissions: {
        summary: 'ملخص الصلاحيات',
        totalCategories: 'إجمالي الفئات',
        totalPermissions: 'إجمالي الصلاحيات',
        rolesAndPermissions: 'الفئات والصلاحيات',
        systemRole: 'دور النظام'
      },
      categories: {
        'Category': 'إدارة الفئات',
        'BranchCategory': 'إدارة فئات الفروع',
        'Product': 'إدارة المنتجات',
        'BranchProduct': 'إدارة منتجات الفروع',
        'BranchQRCode': 'إدارة رموز QR',
        'Order': 'إدارة الطلبات',
        'Restaurant': 'إدارة المطاعم',
        'Branch': 'إدارة الفروع',
        'Admin': 'عمليات الإدارة'
      },
      permissionNames: {
        'category.create': 'إنشاء فئة',
        'category.delete': 'حذف فئة',
        'category.update': 'تحديث فئة',
        'category.read': 'عرض فئة',
        'branch.category.create': 'إنشاء فئة فرع',
        'branch.category.delete': 'حذف فئة فرع',
        'branch.category.update': 'تحديث فئة فرع',
        'branch.category.read': 'عرض فئة فرع',
        'product.create': 'إنشاء منتج',
        'product.delete': 'حذف منتج',
        'product.update': 'تحديث منتج',
        'product.read': 'عرض منتج',
        'product.edit': 'تعديل منتج',
        'branch.product.create': 'إنشاء منتج فرع',
        'branch.product.delete': 'حذف منتج فرع',
        'branch.product.update': 'تحديث منتج فرع',
        'branch.product.read': 'عرض منتج فرع',
        'branch.qrcode.create': 'إنشاء رمز QR',
        'branch.qrcode.delete': 'حذف رمز QR',
        'branch.qrcode.update': 'تحديث رمز QR',
        'branch.qrcode.read': 'عرض رمز QR',
        'order.create': 'إنشاء طلب',
        'order.delete': 'حذف طلب',
        'order.update': 'تحديث طلب',
        'order.read': 'عرض طلب',
        'order.view': 'عرض تفاصيل الطلب',
        'order.cancel': 'إلغاء طلب',
        'restaurant.create': 'إنشاء مطعم',
        'restaurant.delete': 'حذف مطعم',
        'restaurant.update': 'تحديث مطعم',
        'restaurant.read': 'عرض مطعم',
        'restaurant.user.create': 'إنشاء مستخدم مطعم',
        'restaurant.user.delete': 'حذف مستخدم مطعم',
        'restaurant.user.update': 'تحديث مستخدم مطعم',
        'restaurant.user.read': 'عرض مستخدم مطعم',
        'branch.create': 'إنشاء فرع',
        'branch.delete': 'حذف فرع',
        'branch.update': 'تحديث فرع',
        'branch.read': 'عرض فرع',
        'branch.user.create': 'إنشاء مستخدم فرع',
        'branch.user.delete': 'حذف مستخدم فرع',
        'branch.user.update': 'تحديث مستخدم فرع',
        'branch.user.read': 'عرض مستخدم فرع',
        'admin.api.control': 'التحكم في API'
      },
      error: {
        loadFailed: 'فشل في تحميل بيانات الملف الشخصي'
      }
  },
  addonModal: {
    title: 'إعداد الإضافات',
    loading: 'جاري تحميل الإضافات...',
    refresh: 'تحديث',
    search: {
      placeholder: 'البحث في الإضافات بالاسم أو الوصف أو الفئة...'
    },
    stats: {
      available: 'متاحة',
      assigned: 'مُعيَّنة',
      recommended: 'مُوصى بها'
    },
    sections: {
      assignedAddons: 'الإضافات المُعيَّنة',
      availableAddons: 'الإضافات المتاحة'
    },
    emptyState: {
      title: 'لا توجد إضافات متاحة',
      description: 'اتصل بإدارة المطعم لتحديد مجموعات الإضافات لهذا المنتج',
      productId: 'معرف المنتج:'
    },
    actions: {
      add: 'إضافة',
      remove: 'إزالة',
      configure: 'إعداد',
      done: 'تم',
      saveChanges: 'حفظ التغييرات'
    },
    status: {
      assigned: 'مُعيَّنة',
      recommended: 'مُوصى بها'
    },
    configuration: {
      title: 'إعدادات التكوين',
      specialPrice: 'السعر الخاص',
      maxQuantity: 'الحد الأقصى للكمية',
        minQuantity: 'الحد الادنى للكمية',
      marketingText: 'النص التسويقي',
      markRecommended: 'وضع علامة كموصى بها',
      placeholders: {
        marketingText: 'مثل: خيار شائع، أفضل قيمة، مفضل العملاء...'
      }
    },
    messages: {
      success: {
        addonAdded: 'تم إضافة الإضافة بنجاح',
        addonRemoved: 'تم إزالة الإضافة بنجاح',
        addonUpdated: 'تم تحديث الإضافة بنجاح'
      },
      errors: {
        loadFailed: 'فشل في تحميل إضافات المنتج',
        updateFailed: 'فشل في تحديث تعيين الإضافة',
        propertiesFailed: 'فشل في تحديث خصائص الإضافة'
      }
    },
    footer: {
      summary: 'من',
      addon: 'إضافة',
      addons: 'إضافات',
      assigned: 'مُعيَّنة'
    }
  },
  menu: {
      title: "القائمة",
      loading: "تحميل القائمة",
      loadingSubtitle: "نحضر لك أشهى المأكولات...",
      error: {
        title: "القائمة غير متوفرة",
        tryAgain: "حاول مرة أخرى"
      },
      search: {
        placeholder: "ابحث عن الأطباق الشهية..."
      },
      categories: "الفئات",
      ingredients: "المكونات",
      open: "مفتوح",
      closed: "مغلق",
      chefsChoice: "اختيار الشيف",
      add: "إضافة",
      remove: "حذف",
      items: "عنصر",
      item: "عنصر",
      available: "متوفر",
      deliciousItems: "لذيذة",
      exploreMenu: "استكشف قائمتنا",
      noResults: "لم يتم العثور على نتائج",
      noResultsDesc: "جرب كلمات مختلفة أو تصفح فئات أخرى",
      noItemsCategory: "لا توجد عناصر في هذه الفئة",
      noItemsCategoryDesc: "تحقق من الفئات الأخرى للحصول على خيارات لذيذة",
      selectCategory: "اختر فئة لبدء استكشاف مأكولاتنا المتقنة بعناية",
      whyChooseUs: {
        title: "لماذا تختارنا؟",
        subtitle: "استمتع بالتميز الطهي مع التزامنا بالجودة والطازجة والخدمة الاستثنائية",
        freshIngredients: {
          title: "مكونات طازجة",
          description: "مكونات عالية الجودة من مصادر محلية تُحضر يومياً"
        },
        fastDelivery: {
          title: "توصيل سريع",
          description: "خدمة توصيل سريعة وموثوقة إلى باب منزلك"
        },
        qualityAssured: {
          title: "جودة مضمونة",
          description: "معايير صارمة لمراقبة الجودة والنظافة"
        },
        expertChefs: {
          title: "طهاة خبراء",
          description: "محترفون في الطهي ذوو خبرة يصنعون تجارب لا تُنسى"
        }
      },

      footer: {
        brand: "قائمة المطاعم",
        description: "اكتشف تجارب طعام استثنائية مع مجموعتنا المختارة من المطاعم والمأكولات اللذيذة.",
        quickLinks: "روابط سريعة",
        services: "الخدمات",
        getInTouch: "تواصل معنا",
        visitUs: "زرنا",
        callUs: "اتصل بنا",
        emailUs: "راسلنا",
        copyright: "جميع الحقوق محفوظة.",
        privacyPolicy: "سياسة الخصوصية",
        termsOfService: "شروط الخدمة",
        poweredBy: "بدعم من",
        links: {
          ourMenu: "قائمتنا",
          aboutUs: "من نحن",
          locations: "المواقع",
          reservations: "الحجوزات",
          specialOffers: "العروض الخاصة",
          giftCards: "بطاقات الهدايا"
        },
        services: {
          onlineOrdering: "الطلب عبر الإنترنت",
          tableBooking: "حجز الطاولات",
          privateEvents: "الفعاليات الخاصة",
          catering: "خدمات الضيافة",
          takeaway: "الطلبات الخارجية",
          corporateMeals: "وجبات الشركات"
        }
      },
      cart: {
      title: 'السلة',
      newOrder: 'طلب جديد',
      orders: 'الطلبات',
      notes: 'ملاحظات',
      refresh: 'تحديث',
      refreshing: 'جاري التحديث...',
      remove: 'إزالة',
      orderType: 'نوع الطلب',
      table: 'الطاولة',
      empty: 'السلة فارغة',
      emptyDesc: 'ابدأ بإضافة بعض العناصر إلى سلتك',
      total: 'المجموع',
      proceed: 'المتابعة للطلب',
      placeOrder: "إتمام الطلب",
      processing: 'جاري المعالجة...',
      clear: 'تفريغ السلة',
      item: 'عنصر',
      items: 'عناصر',
      variant: 'نوع',
      variants: 'أنواع',
      plain: 'عادي',
      customized: 'مخصص',
      addons: 'الإضافات',
      variantTotal: 'مجموع النوع',
      quantity: 'الكمية',
      each: 'للواحد',
      min: 'الحد الأدنى',
      max: 'الحد الأقصى',
      qty: 'كمية',
      minQuantityError: 'الحد الأدنى للكمية لـ {name} هو {min}',
      maxQuantityError: 'الحد الأقصى للكمية لـ {name} هو {max}',
      decreaseQuantity: 'تقليل الكمية',
      increaseQuantity: 'زيادة الكمية',
        "creating_order": "جاري إنشاء الطلب...",
  "order_created_success": "تم إنشاء الطلب بنجاح!",
  "order_creation_failed": "فشل في إنشاء الطلب. يرجى المحاولة مرة أخرى.",
  "sending_whatsapp": "جاري إرسال رسالة واتساب...",
  "whatsapp_sent_success": "تم إرسال رسالة واتساب بنجاح!",
  "whatsapp_send_failed": "فشل في إرسال رسالة واتساب",
  "clearing_basket": "جاري مسح السلة...",
  "basket_cleared": "تم مسح السلة بنجاح!",
  "clear_basket_failed": "فشل في مسح السلة",
  "load_order_types_failed": "فشل في تحميل أنواع الطلبات",
  "confirming_price_changes": "جاري تأكيد تغييرات الأسعار...",
  "price_changes_confirmed": "تم تأكيد تغييرات الأسعار بنجاح!",
  "price_changes_failed": "فشل في تأكيد تغييرات الأسعار",
  "session_required": "معرف الجلسة مطلوب"
    }
  },
  order: {
    form: {
      title: 'تفاصيل الطلب',
      orderType: 'نوع الطلب',
      orderTypeRequired: 'نوع الطلب مطلوب',
      selectOrderType: 'اختر نوع الطلب...',
      customerName: 'اسم العميل',
      customerNameRequired: 'اسم العميل مطلوب',
      customerNamePlaceholder: 'أدخل اسم العميل',
      deliveryAddress: 'عنوان التوصيل',
      deliveryAddressRequired: 'عنوان التوصيل مطلوب لهذا النوع من الطلبات',
      deliveryAddressPlaceholder: 'أدخل عنوان التوصيل',
      phoneNumber: 'رقم الهاتف',
      phoneNumberRequired: 'رقم الهاتف مطلوب لهذا النوع من الطلبات',
      phoneNumberPlaceholder: 'أدخل رقم الهاتف',
      specialInstructions: 'تعليمات خاصة',
      specialInstructionsPlaceholder: 'أي تعليمات خاصة لطلبك...',
      orderSummary: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      serviceCharge: 'رسوم الخدمة',
      minimumRequired: 'الحد الأدنى المطلوب',
      estimatedTime: 'الوقت المقدر',
      minutes: 'دقيقة',
      backToCart: 'العودة للسلة',
      createOrder: 'إنشاء الطلب',
      creating: 'جاري الإنشاء...',
      loadingOrderTypes: 'جاري تحميل أنواع الطلبات...',
      noOrderTypes: 'لا توجد أنواع طلبات متاحة. يرجى الاتصال بالدعم.',
      minimumOrder: 'الحد الأدنى للطلب',
      service: 'خدمة',
      minimumOrderError: 'الحد الأدنى لمبلغ الطلب لـ {type} هو ${amount}. المجموع الحالي: ${current}'
    },
    validation: {
      fixErrors: 'يرجى إصلاح الأخطاء التالية:',
      customerNameRequired: 'اسم العميل مطلوب',
      orderTypeRequired: 'يرجى اختيار نوع الطلب',
      addressRequired: 'عنوان التوصيل مطلوب لهذا النوع من الطلبات',
      phoneRequired: 'رقم الهاتف مطلوب لهذا النوع من الطلبات'
    }
  },
  priceChange: {
    title: 'تم اكتشاف تغييرات في الأسعار',
    description: 'بعض العناصر في سلتك تحتوي على تغييرات في الأسعار تحتاج إلى تأكيد قبل المتابعة مع الطلب.',
    changesRequired: 'التغييرات المطلوبة:',
    defaultMessage: 'تحديثات الأسعار تحتاج إلى تأكيد للمتابعة.',
    cancel: 'إلغاء',
    confirm: 'تأكيد والمتابعة',
    confirming: 'جاري التأكيد...'
  },
  "productModal": {
    "customizeOrder": "تخصيص طلبك",
    "allergenInformation": "معلومات الحساسية",
    "ingredients": "المكونات",
    "availableAddons": "الإضافات المتاحة",
    "add": "إضافة",
    "recommended": "موصى به",
    "min": "الحد الأدنى",
    "max": "الحد الأقصى",
    "orderSummary": "ملخص الطلب",
    "quantity": "الكمية",
    "total": "المجموع",
    "addToCart": "إضافة إلى السلة"
  },
  errors: {
    loadingBasket: 'فشل تحميل السلة',
    loadingOrderTypes: 'فشل تحميل أنواع الطلبات',
    removingItem: 'فشل إزالة العنصر من السلة',
    increasingQuantity: 'فشل زيادة كمية العنصر',
    decreasingQuantity: 'فشل تقليل كمية العنصر',
    increasingAddonQuantity: 'فشل زيادة كمية الإضافة',
    clearingBasket: 'فشل تفريغ السلة',
    creatingOrder: 'فشل إنشاء الطلب',
    orderAlreadyProcessing: 'هذا الطلب قيد المعالجة بالفعل',
    priceChangeDetails: 'فشل تحميل تفاصيل تغيير الأسعار',
    confirmingPriceChanges: 'فشل تأكيد تغييرات الأسعار',
    sessionIdRequired: 'معرف الجلسة مطلوب لتأكيد تغيير الأسعار',
    addonProductNotFound: 'لم يتم العثور على معرف منتج الإضافة',
    cartItemNotFound: 'لم يتم العثور على عنصر السلة'
  },
  "ordersManager": {
    total : 'المجموع',
    OrderType : 'نوع الطلب',
    subTotal: "المجموع الفرعي",
    serviceFeeApplied:"رسوم الخدمة",
    DeliveryAddress : 'عنوان التسليم',
    OrderNotesInformation : 'ملاحظات ومعلومات الطلب',
    OrderMetadata: 'بيانات تعريف الطلب',
    ItemCount : 'عدد العناصر',
    TotalItems: 'إجمالي العناصر',
    searchPlaceholder:"إاكتب هنا",
    OrderTimeline: 'الجدول الزمني للطلب',
    showAdvancedFilter: "إظهار الفلاتر المتقدمة",
    hideAdvancedFilter: "إخفاء الفلاتر المتقدمة",
    of:"من",
    orders:"الطلبات",
    title: "إدارة الطلبات",
    clearFilter:"مسح البحث",
    customerName: "اسم العميل",
    tableName: "اسم الجدول",
    orderType: "نوع الطلب",
    minPrice: "السعر الأدنى",
    maxPrice: "السعر الأقصى",
    showing:"عرض",
    to:"إلى",
    perpage : "لكل صفحة",
    cancelOrder:"إلغاء الطلب",
    cancelOrderConfirmation :"هل أنت متأكد من رغبتك في إلغاء الطلب?",
    deletedOrders:"الطلبات المحذوفة",
    "description": "إدارة وتتبع طلبات مطعمك بسهولة.",
    "pendingOrders": "الطلبات المعلقة",
    "branchOrders": "طلبات الفرع",
    "allStatuses": "جميع الحالات",
    "statusFilter": "تصفية الحالة",
    "noOrders": "لا توجد طلبات {viewMode} بعد.",
    "customer": "العميل",
    "orderNumber": "رقم الطلب",
    "status": "الحالة",
    "table": "الطاولة",
    "amount": "المبلغ",
    "date": "التاريخ",
    "actions": "الإجراءات",
    "viewDetails": "عرض التفاصيل",
    "confirm": "تأكيد",
    "reject": "رفض",
    "changeStatus": "تغيير الحالة",
    "orderItems": "عناصر الطلب",
    "createdAt": "تاريخ الإنشاء",
    "confirmedAt": "تاريخ التأكيد",
    "rowVersion": "إصدار السجل",
    "confirmOrderTitle": "تأكيد الطلب",
    "confirmOrderPrompt": "هل أنت متأكد من رغبتك في تأكيد هذا الطلب؟",
    "rejectOrderTitle": "رفض الطلب",
    "rejectOrderPrompt": "أدخل سبب الرفض:",
    "rejectReasonPlaceholder": "سبب الرفض...",
    "updateStatusTitle": "تحديث الحالة",
    "updateStatusPrompt": "هل أنت متأكد من رغبتك في تحديث حالة الطلب إلى ",
    "cancel": "إلغاء",
    "confirmAction": "تأكيد",
    "rejectAction": "رفض",
    "updateAction": "تحديث",
    "confirming": "جاري التأكيد...",
    "rejecting": "جاري الرفض...",
    "updating": "جاري التحديث...",
    "orderDetailsTitle": "تفاصيل الطلب",
    "successNotification": "العملية ناجحة",
    "orderConfirmedSuccess": "تم تأكيد الطلب بنجاح!",
    "orderRejectedSuccess": "تم رفض الطلب بنجاح!",
    "orderStatusUpdatedSuccess": "تم تحديث حالة الطلب بنجاح!",
    "errorInvalidStatusTransition": "انتقال الحالة غير صالح: يرجى تأكيد الطلب أولاً (الانتقال إلى حالة 'مؤكد').",
    "errorCannotConfirm": "لا يمكن تأكيد هذا الطلب. الحالة الحالية: {currentStatus}.",
    "quantity": "الكمية",
    "unitPrice": "سعر الوحدة",
    "addonPrice": "سعر الإضافة",
    "notes": "ملاحظات",
    "amountLabel": "المبلغ الإجمالي",
    DeliveryInformation: "معلومات التوصيل",
    TableInformation: "معلومات الطاولة",
    CustomerInformation: "معلومات العميل",
    CustomerName: "اسم العميل",
    PhoneNumber: "رقم الهاتف",
    OrderTag: "علامة الطلب",
    OrderNotes: "ملاحظات الطلب",
    MinOrderAmount: "الحد الأدنى لمبلغ الطلب",
    CompletedAt: "تاريخ الاكتمال",
    time: "الوقت",
  },
  orderService: {
    "statuses": {
      "pending": "معلق",
      "confirmed": "مؤكد",
      "preparing": "قيد التحضير",
      "ready": "جاهز",
      "completed": "مكتمل",
      "delivered": "تم التوصيل",
      "cancelled": "ملغى",
      "rejected": "مرفوض",
      "unknown": "غير معروف"
    },
    "errors": {
      "createSessionOrder": "حدث خطأ أثناء إنشاء طلب الجلسة",
      "getPendingOrders": "حدث خطأ أثناء جلب الطلبات المعلقة",
      "getTableOrders": "حدث خطأ أثناء جلب طلبات الطاولة",
      "getOrder": "حدث خطأ أثناء جلب الطلب",
      "getBranchOrders": "حدث خطأ أثناء جلب طلبات الفرع",
      "confirmOrder": "حدث خطأ أثناء تأكيد الطلب",
      "rejectOrder": "حدث خطأ أثناء رفض الطلب",
      "updateOrderStatus": "حدث خطأ أثناء تحديث حالة الطلب",
      "trackOrder": "حدث خطأ أثناء جلب تتبع الطلب",
      "getOrderTrackingQR": "حدث خطأ أثناء جلب رمز QR لتتبع الطلب",
      "smartCreateOrder": "حدث خطأ أثناء إنشاء الطلب الذكي",
      "getTableBasketSummary": "حدث خطأ أثناء جلب ملخص سلة الطاولة",
      "validationError": "خطأ التحقق: {errors}",
      "invalidRequest": "طلب غير صالح. يرجى التحقق من البيانات.",
      "sessionExpired": "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.",
      "unauthorized": "ليس لديك الصلاحية لهذا الإجراء.",
      "orderNotFound": "الطلب غير موجود.",
      "invalidStatus": "حالة الطلب غير مناسبة لهذا الإجراء.",
      "noInternet": "تحقق من اتصالك بالإنترنت.",
      "unknownError": "خطأ غير معروف",
      "getOrderTypeText": "حدث خطأ أثناء جلب نص نوع الطلب",
      "getOrderType": "حدث خطأ أثناء جلب نوع الطلب",
      "getActiveOrderTypes": "حدث خطأ أثناء جلب أنواع الطلبات النشطة",
      "getAllOrderTypes": "حدث خطأ أثناء جلب جميع أنواع الطلبات",
      "orderTotalCalculation": "حدث خطأ أثناء حساب إجمالي الطلب",
      "getEstimatedTime": "حدث خطأ أثناء جSydney: جلب وقت التسليم المقدر",
      "getOrderTypeByCode": "حدث خطأ أثناء جلب نوع الطلب بواسطة الرمز",
      "getOrderTypesForDisplay": "حدث خطأ أثناء جلب أنواع الطلبات للعرض",
      "unknownOrderType": "نوع طلب غير معروف"
    }
  },
   branchPreferences: {
    "title": "إعدادات الفرع",
    "description": "تكوين الإعدادات والتفضيلات الخاصة بالفرع",
    "loading": "جاري تحميل إعدادات الفرع...",
    "saving": "جاري الحفظ...",
    "refresh": "تحديث",
    "saveChanges": "حفظ التغييرات",
    "saveSuccess": "تم حفظ إعدادات الفرع بنجاح!",
    "cleanupModes": {
  "afterTimeout": "بعد انتهاء المهلة",
  "afterClosing": "بعد الإغلاق",
  "disabled": "معطل"
    },
    "sections": {
      "orderManagement": {
        "title": "إدارة الطلبات",
        "description": "تكوين كيفية التعامل مع الطلبات ومعالجتها",
        "autoConfirmOrders": "تأكيد الطلبات تلقائياً",
        "autoConfirmOrdersDesc": "تأكيد الطلبات الواردة تلقائياً بدون موافقة يدوية",
        "useWhatsappForOrders": "واتساب للطلبات",
        "useWhatsappForOrdersDesc": "تفعيل تكامل واتساب لإشعارات الطلبات"
      },

      "displaySettings": {
        "title": "إعدادات العرض",
        "description": "تكوين المعلومات التي يتم عرضها للعملاء",
        "showProductDescriptions": "عرض أوصاف المنتجات",
        "showProductDescriptionsDesc": "عرض أوصاف مفصلة للمنتجات للعملاء",
        "enableAllergenDisplay": "عرض معلومات مسببات الحساسية",
        "enableAllergenDisplayDesc": "إظهار تحذيرات ومعلومات مسببات الحساسية",
        "enableIngredientDisplay": "عرض المكونات",
        "enableIngredientDisplayDesc": "إظهار قوائم المكونات للمنتجات"
      },
      "paymentMethods": {
        "title": "طرق الدفع",
        "description": "تكوين طرق الدفع المقبولة",
        "acceptCash": "قبول الدفع النقدي",
        "acceptCashDesc": "السماح للعملاء بالدفع نقداً",
        "acceptCreditCard": "قبول البطاقات الائتمانية",
        "acceptCreditCardDesc": "السماح للعملاء بالدفع ببطاقات الائتمان/الخصم",
        "acceptOnlinePayment": "قبول الدفع الإلكتروني",
        "acceptOnlinePaymentDesc": "السماح للعملاء بالدفع عبر الإنترنت من خلال وسائل الدفع الرقمية"
      },
      "localization": {
        "title": "الإعدادات المحلية",
        "description": "تكوين إعدادات اللغة والمنطقة",
        "defaultLanguage": "اللغة الافتراضية",
        "defaultCurrency": "العملة الافتراضية",
        "timeZone": "المنطقة الزمنية",
        "supportedLanguages": "اللغات المدعومة"
      },
      "sessionManagement": {
        "title": "إدارة الجلسات",
        "description": "تكوين مهلة الجلسة وإعدادات التنظيف",
        "sessionTimeout": "مهلة الجلسة (بالدقائق)",
        "cleanupMode": "وضع التنظيف",
        "cleanupDelay": "تأخير التنظيف بعد الإغلاق (بالدقائق)",
        
         "cleanupModeDesc": "اختر متى يتم تنظيف الجلسات المنتهية الصلاحية",
    "sessionTimeoutDesc": "الدقائق قبل انتهاء صلاحية الجلسة بسبب عدم النشاط",
    "cleanupDelayDesc": "الدقائق للانتظار بعد الإغلاق قبل التنظيف",
    "cleanupDisabledMessage": "تنظيف الجلسات معطل. لن يتم تنظيف الجلسات تلقائياً."
      }
    },
    "currencies": {
      "TRY": "الليرة التركية (₺)",
      "USD": "الدولار الأمريكي ($)",
      "EUR": "اليورو (€)"
    },
    "languages": {
        "tr": "التركية",
        "en": "الإنجليزية",
        "ar": "العربية", 
        "de": "الألمانية",
        "fr": "الفرنسية",
        "ru": "الروسية",
        "es": "الإسبانية"
    },
    "timezones": {
      "Europe/Istanbul": "إسطنبول (UTC+3)",
      "Europe/London": "لندن (UTC+0)",
      "America/New_York": "نيويورك (UTC-5)"
    },
    "errors": {
      "loadFailed": "فشل في تحميل إعدادات الفرع",
      "saveFailed": "فشل في حفظ إعدادات الفرع",
      "validationError": "خطأ التحقق: {errors}",
      "invalidRequest": "طلب غير صالح. يرجى التحقق من البيانات.",
      "sessionExpired": "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.",
      "unauthorized": "ليس لديك الصلاحية لهذا الإجراء.",
      "notFound": "إعدادات الفرع غير موجودة.",
      "conflict": "البيانات غير محدثة. يرجى تحديث الصفحة والمحاولة مرة أخرى.",
      "noInternet": "تحقق من اتصالك بالإنترنت.",
      "unknownError": "حدث خطأ غير معروف",
      "invalidPaymentSettings": "إعدادات دفع غير صالحة. يجب تحديد طريقة دفع واحدة على الأقل.",
      "invalidSessionSettings": "إعدادات جلسة غير صالحة. يرجى التحقق من القيم."
    }
  },
  whatsapp: {
  confirmation: {
    title: 'إرسال إلى واتساب؟',
    subtitle: 'إشعار المطعم عبر واتساب',
    sendTo: 'سيتم إرسال تفاصيل طلبك إلى:',
    restaurant: 'المطعم',
    whatWillBeSent: 'ما سيتم إرساله:',
    orderDetails: '• تفاصيل طلبك والعناصر',
    customerInfo: '• اسم العميل ورقم الطاولة',
    totalPrice: '• إجمالي السعر وأي ملاحظات خاصة',
    timestamp: '• توقيت الطلب',
    note: 'ملاحظة:',
    noteDescription: 'سيؤدي هذا إلى فتح واتساب على جهازك. سيتم معالجة طلبك حتى لو اخترت عدم الإرسال إلى واتساب.',
    skipWhatsApp: 'تخطي واتساب',
    sendToWhatsApp: 'إرسال إلى واتساب',
    sending: 'جاري الإرسال...'
  }
},
  recycleBin: {
    title: 'سلة المحذوفات',
    titleProducts: 'المنتجات والفئات المحذوفة',
    titleBranches: 'الفروع المحذوفة',
    titleTables: 'الطاولات المحذوفة',
    titleBranchProducts: 'منتجات وفئات الفرع المحذوفة',
    titleBranchCategories: 'فئات الفرع المحذوفة',
    titleTableCategories: 'فئات الطاولات المحذوفة',
    description: 'إدارة الفروع والفئات والمنتجات والطاولات المحذوفة',
    descriptionProducts: 'إدارة المنتجات والفئات المحذوفة',
    descriptionBranches: 'إدارة الفروع المحذوفة',
    descriptionTables: 'إدارة الطاولات المحذوفة',
    descriptionBranchProducts: 'إدارة منتجات وفئات الفرع المحذوفة',
    descriptionBranchCategories: 'إدارة فئات الفرع المحذوفة',
    descriptionTableCategories: 'إدارة فئات الطاولات المحذوفة',
    search: 'بحث عن العناصر...',
    filter: {
      all: 'جميع العناصر',
      group1: 'جميع المجموعة 1',
      group2: 'جميع المجموعة 2',
      group1Label: '📋 مستوى المطعم (الفروع، المنتجات، الطاولات)',
      group2Label: '🏢 مستوى الفرع (منتجات وفئات الفرع)',
      branches: 'الفروع',
      categories: 'الفئات',
      products: 'المنتجات',
      tables: 'الطاولات',
      branchProducts: 'منتجات الفرع',
      branchCategories: 'فئات الفرع',
      tableCategories: 'فئات الطاولات'
    },
    refresh: 'تحديث',
    loading: 'جاري التحميل...',
    stats: {
      group1: 'مستوى المطعم',
      group1Desc: 'الفروع، المنتجات، الطاولات',
      group2: 'مستوى الفرع',
      group2Desc: 'منتجات وفئات الفرع',
      totalDeleted: 'إجمالي المحذوفات',
      totalDesc: 'جميع العناصر المحذوفة',
      filtered: 'معروض',
      filteredDesc: 'نتائج التصفية الحالية',
      deletedBranch: 'الفروع المحذوفة',
      deletedCategory: 'الفئات المحذوفة',
      deletedProduct: 'المنتجات المحذوفة',
      deletedTable: 'الطاولات المحذوفة',
      deletedBranchProduct: 'منتجات الفرع المحذوفة',
      deletedBranchCategory: 'فئات الفرع المحذوفة',
      deletedTableCategory: 'فئات الطاولات المحذوفة',
      showing: 'عرض',
      showingDesc: 'العناصر المعروضة'
    },
    entityTypes: {
      category: 'فئة',
      product: 'منتج',
      branch: 'فرع',
      table: 'طاولة',
      branchProduct: 'منتج الفرع',
      branchCategory: 'فئة الفرع',
      tableCategory: 'فئة الطاولة',
      other: 'أخرى'
    },
    contextInfo: {
      category: 'الفئة:',
      branch: 'الفرع:',
      restaurant: 'المطعم:'
    },
    deletedAt: 'تاريخ الحذف:',
    restore: {
      button: 'استعادة',
      restoring: 'جاري الاستعادة...',
      successCategory: 'تم استعادة الفئة "{name}" بنجاح',
      successProduct: 'تم استعادة المنتج "{name}" بنجاح',
      successBranch: 'تم استعادة الفرع "{name}" بنجاح',
      successTable: 'تم استعادة الطاولة "{name}" بنجاح',
      successBranchCategory: 'تم استعادة فئة الفرع "{name}" بنجاح',
      successTableCategory: 'تم استعادة فئة الطاولة "{name}" بنجاح',
      error: 'فشلت عملية الاستعادة'
    },
    empty: {
      title: 'سلة المحذوفات فارغة',
      titleFiltered: 'لم يتم العثور على نتائج',
      description: 'لا توجد عناصر محذوفة بعد',
      descriptionFiltered: 'لا توجد عناصر محذوفة تطابق معايير البحث'
    },
    errors: {
      loadingError: 'خطأ في تحميل العناصر المحذوفة'
    }
  },
   "management": {
    "title": "معلومات الإدارة",
    "subtitle": "تفاصيل الشركة والقانونية",
    "noDataTitle": "لا توجد معلومات إدارية",
    "noDataMessage": "لم يتم إعداد معلومات الإدارة بعد. يرجى إضافة تفاصيل المطعم للبدء.",
    
    "buttons": {
      "edit": "تعديل",
      "cancel": "إلغاء",
      "save": "حفظ التغييرات",
      "saving": "جاري الحفظ..."
    },

    "sections": {
      "restaurantDetails": "تفاصيل المطعم",
      "companyInfo": "معلومات الشركة",
      "taxInfo": "الضرائب والتسجيل",
      "certificates": "الشهادات والتصاريح",
      "additionalSettings": "إعدادات إضافية"
    },

    "fields": {
      "restaurantName": "اسم المطعم",
      "restaurantLogo": "شعار المطعم",
      "companyTitle": "عنوان الشركة",
      "legalType": "النوع القانوني",
      "taxNumber": "الرقم الضريبي",
      "taxOffice": "مكتب الضرائب",
      "mersisNumber": "رقم MERSIS",
      "tradeRegistry": "رقم السجل التجاري",
      "workPermit": "تصريح العمل",
      "foodCertificate": "شهادة الغذاء",
      "alcoholService": "يوجد خدمة كحول",
      "logo": "الشعار"
    },

    "placeholders": {
      "restaurantName": "أدخل اسم المطعم",
      "companyTitle": "أدخل عنوان الشركة",
      "taxNumber": "أدخل الرقم الضريبي",
      "taxOffice": "أدخل مكتب الضرائب",
      "mersisNumber": "أدخل رقم MERSIS",
      "tradeRegistry": "أدخل رقم السجل التجاري",
      "selectLegalType": "اختر النوع القانوني"
    },

    "legalTypes": {
      "llc": "شركة ذات مسؤولية محدودة",
      "corporation": "مؤسسة",
      "partnership": "شراكة"
    },

    "status": {
      "uploaded": "تم الرفع",
      "notUploaded": "لم يتم الرفع",
      "available": "متاح",
      "notAvailable": "غير متاح",
      "alcoholService": "خدمة الكحول:"
    },

    "common": {
      "na": "غير متوفر"
    }
  },
  "branches": {
  "status": {
    "active": "نشط",
    "inactive": "غير نشط"
  },
  "fields": {
    "branchType": "نوع الفرع",
    "branchTag": "علامة الفرع"
  }
},

"restaurantsTab": {
  "status": {
    "active": "نشط",
    "inactive": "غير نشط"
  },
  "actions": {
    "edit": "تعديل المطعم",
    "delete": "حذف المطعم"
  },
  "stats": {
    "totalBranches": "إجمالي الفروع",
    "active": "نشط",
    "inactive": "غير نشط",
    "alcohol": "كحول"
  },
  "common": {
    "yes": "نعم",
    "no": "لا"
  },
  "modal": {
    "editTitle": "تعديل المطعم",
    "placeholders": {
      "restaurantName": "اسم المطعم",
      "cuisineType": "نوع المطبخ"
    },
    "labels": {
      "hasAlcoholService": "يقدم خدمة الكحول"
    },
    "buttons": {
      "update": "تحديث المطعم",
      "updating": "جاري التحديث..."
    }
  }
},
"tabs": {
  "restaurants": "المطاعم",
  "branches": "الفروع",
  "management": "معلومات الإدارة",
  "deleted": "المحذوفة"
},
 "allergens": {
    "GLUTEN": {
      "name": "الغلوتين",
      "description": "القمح، الجاودار، الشعير، الشوفان"
    },
    "CRUSTACEANS": {
      "name": "القشريات",
      "description": "الجمبري، السلطعون، الكركند"
    },
    "EGGS": {
      "name": "البيض",
      "description": "البيض ومنتجات البيض"
    },
    "FISH": {
      "name": "السمك",
      "description": "جميع منتجات الأسماك"
    },
    "PEANUTS": {
      "name": "الفول السوداني",
      "description": "الفول السوداني ومنتجاته"
    },
    "SOYBEANS": {
      "name": "فول الصويا",
      "description": "الصويا ومنتجات الصويا"
    },
    "MILK": {
      "name": "الحليب",
      "description": "الحليب ومنتجات الألبان"
    },
    "NUTS": {
      "name": "المكسرات",
      "description": "اللوز، البندق، الجوز، الكاجو، إلخ"
    },
    "CELERY": {
      "name": "الكرفس",
      "description": "الكرفس وجذر الكرفس"
    },
    "MUSTARD": {
      "name": "الخردل",
      "description": "الخردل ومنتجات الخردل"
    },
    "SESAME": {
      "name": "السمسم",
      "description": "بذور السمسم ومنتجاته"
    },
    "SULPHITES": {
      "name": "الكبريتات",
      "description": "ثاني أكسيد الكبريت والكبريتات (>10مغ/كغ)"
    },
    "LUPIN": {
      "name": "الترمس",
      "description": "الترمس ومنتجات الترمس"
    },
    "MOLLUSCS": {
      "name": "الرخويات",
      "description": "المحار، بلح البحر، الحلزون، الحبار"
    }
  }
}; 