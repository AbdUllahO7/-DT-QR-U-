

export const en = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    close: 'Close',
    open: 'Open',
    yes: 'Yes',
    no: 'No',
    next: 'Next',
    previous: 'Previous',
    continue: 'Continue',
    refresh: 'Refresh',
    clear: 'Clear',
    filters: 'Filters',
    allStatuses: 'All Statuses',
    pending: 'Pending',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    dateRange: 'Date Range',
    today: 'Today',
    yesterday: 'Yesterday',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    retry: 'Retry'
  },
  filter: {
      "status": "Status",
      "all": "All",
      "active": "Active", 
      "inactive": "Inactive",
      "categories": "Categories",
      allergenic:"allergenic",
      nonallergenic:"non-allergenic",
      specific:{
        allergens : "allergens"
      },
      "price": {
        "range": "Price Range",
        "min": "Min Price",
        "max": "Max Price"
      }
  },
  sort: {
    "title": "Sort By",
    "name": {
      "asc": "Name (A-Z)",
      "desc": "Name (Z-A)"
    },
    "price": {
      "asc": "Price (Low to High)",
      "desc": "Price (High to Low)"
    },
    "order": {
      "asc": "Display Order (First to Last)",
      "desc": "Display Order (Last to First)"
    },
    "created": {
      "asc": "Date Created (Oldest First)",
      "desc": "Date Created (Newest First)"
    }
  },
  clear: {
    "filters": "Clear Filters",
    "all": "Clear All"
  },
  restaurantManagement : {
    tabs : {
      general : "General",
       legal : "Legal",
        about : "About",
    },
    GeneralInformation: "General Information",
    restaurantLogo : ""
  },
  // Navigation
  nav: {
    home: 'Home',
    features: 'Features',
    pricing: 'Pricing',
    testimonials: 'Testimonials',
    faq: 'FAQ',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    settings: 'Settings',
    dashboard: 'Dashboard',
    goToPanel: 'Go to Panel'
  },

  // Auth
  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password',
    rememberMe: 'Remember Me',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    signIn: 'Sign In',
    signUp: 'Sign Up'
  },

  // Hero Section
  hero: {
    title: {
      line1: 'Digitize Your',
      line2: 'Restaurant',
      line3: 'with QR Menu'
    },
    subtitle: 'Your customers can instantly access your menu by scanning the QR code. Offer a contactless, fast and modern experience.',
    features: {
      qrAccess: 'Quick Access with QR Code',
      mobileOptimized: 'Mobile Optimization',
      instantUpdate: 'Instant Update'
    },
    cta: {
      getStarted: 'Get Started',
      features: 'Features'
    },
    socialProof: {
      restaurants: '500+ Happy Restaurants',
      satisfaction: '99% Customer Satisfaction'
    }
  },

  // Dashboard Navigation
  dashboard: {
    overview: {
      title: 'Overview',
      description: 'View the general status of your restaurant.',
      kpis: {
        totalViews: 'Total Views',
        qrScans: 'QR Code Scans',
        totalOrders: 'Total Orders',
        customerRating: 'Customer Rating',
        changeTexts: {
          lastWeek: 'vs last week',
          lastMonth: 'vs last month',
          thisWeek: 'this week'
        }
      },
      quickStats: {
        thisMonth: 'This Month',
        totalOrders: 'Total orders',
        average: 'Average',
        dailyOrders: 'Daily orders',
        new: 'New',
        customers: 'Customers',
        rating: 'Rating',
        totalCount: 'Total count'
      },
      charts: {
        weeklyActivity: 'Weekly Activity',
        popularProducts: 'Popular Products',
        monthlyRevenue: 'Monthly Revenue'
      }
    },
    branches: {
      title: 'Branch Management',
      description: 'Manage your branches and add new branches.',
      error: {
        loadFailed: 'Failed to load branches',
        createFailed: 'Failed to create branch',
        updateFailed: 'Failed to update branch',
        deleteFailed: 'Failed to delete branch',
        statusUpdateFailed: 'Failed to update branch status',
        detailsLoadFailed: 'Failed to load branch details',
        restaurantIdNotFound: 'Restaurant ID not found'
      },
      delete: {
        title: 'Delete Branch',
        confirmMessage: 'Are you sure you want to delete branch "{branchName}"? This action cannot be undone.'
      }
    },
    orders: {
      title: 'Orders',
      description: 'View and manage orders.',
      loading: 'Loading orders...',
      refresh: 'Refresh',
      newOrder: 'New Order',
      tabs: {
        all: 'All',
        pending: 'Pending',
        preparing: 'Preparing',
        ready: 'Ready',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      },
      status: {
        pending: 'Pending',
        preparing: 'Preparing',
        ready: 'Ready',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      },
      stats: {
        totalOrders: 'Total Orders',
        totalRevenue: 'Total Revenue',
        pendingOrders: 'Pending Orders',
        avgOrderValue: 'Average Order Value'
      }
    },
   orderType: {
        title: "Order Type Settings",
        subtitle: "Manage activation status, minimum order amount and service charges for order types",
        loading: "Loading order types...",
        pleaseWait: "Please wait",
        settingsUpdated: "settings updated successfully",
        updateError: "Error occurred while updating settings",
        loadingError: "Error occurred while loading order types",
        active: "active",
        minutes: "minutes",
        requirements: "Requirements",
        table: "Table",
        address: "Address",
        phone: "Phone",
        activeStatus: "Active Status",
        activeStatusDescription: "Enable/disable this order type",
        minOrderAmount: "Minimum Order Amount",
        serviceCharge: "Service Charge",
        saveSettings: "Save Settings",
        updating: "Updating...",
        totalOrderTypes: "Total Order Types",
        activeTypes: "Active Types",
        totalActiveOrders: "Total Active Orders",
        estimatedTime: "Estimated Time"
      },
    products: {
      title: 'Products',
      description: 'View and manage your products.'
    },
    ingredients : {
      title : "Ingredients"
    },
    tables: {
      title: 'Table Management',
      description: 'Table management operations.',
      loading: 'Loading tables...',
      selectBranch: 'Please select a branch for table management',
      noCategories: 'No table categories found in this branch yet',
      tableCount: 'tables',
      newTable: 'Add New Table'
    },
    users: {
      title: 'User Management',
      description: 'Manage users, roles and permissions.',
      loading: 'Loading users...',
      tabs: {
        users: 'Users',
        roles: 'Roles'
      },
      stats: {
        total: 'Total',
        active: 'Active',
        users: 'users',
        roles: 'roles',
        system: 'System',
        custom: 'Custom',
        totalUsers: 'Total Users'
      },
      error: {
        loadFailed: 'Failed to load users',
        rolesLoadFailed: 'Failed to load roles',
        createRoleFailed: 'Failed to create role',
        createUserFailed: 'Failed to create user'
      }
    },
    settings: {
      title: 'Settings',
      description: 'Manage your account settings.'
    },
    profile: {
      title: 'Profile',
      description: 'View your personal information.',
      error: {
        loadFailed: 'Failed to load profile information'
      },
      restaurantInfo: 'Restaurant Information'
    },
    restaurant: {
      title: 'Restaurant Management',
      description: 'Manage your restaurant information and settings.',
      loading: 'Loading restaurant information...',
      restaurantName: 'Restaurant Name',
      restaurantStatus: 'Restaurant Status',
      restaurantLogo: 'Restaurant Logo',
      companyInfo: 'Company Information',
      addAboutInfo: 'Add Restaurant About Information',
      placeholders: {
        restaurantName: 'Enter restaurant name',
        aboutStory: 'Our restaurant story',
        aboutDetails: 'Provide detailed information about your restaurant...'
      },
  


    },
     RestaurantManagement : {
      title : "Restaurant Management"
    },
    branchManagementTitle: "Branch Management" ,
    sidebar: {
      title : "QR Menu",
      logout: 'Logout',
      branch: 'Branch'
    }
  },

  // Theme
  theme: {
    toggleToDark: 'Switch to dark mode',
    toggleToLight: 'Switch to light mode',
    dark: 'Dark',
    light: 'Light'
  },

  // Language
  language: {
    turkish: 'Türkçe',
    english: 'English',
    arabic: 'العربية',
    selectLanguage: 'Select Language'
  },

  // Settings
  settings: {
    title: 'Settings',
    description: 'Manage your account settings and preferences',
    save: 'Save',
    saveSuccess: 'Settings saved successfully.',
    tabs: {
      general: 'General',
      notifications: 'Notifications',
      privacy: 'Privacy',
      appearance: 'Appearance',
      data: 'Data'
    },
    general: {
      title: 'General Settings',
      description: 'Configure your basic account settings',
      language: 'Language',
      timezone: 'Timezone',
      dateFormat: 'Date Format',
      currency: 'Currency',
      autoSave: {
        title: 'Auto Save',
        description: 'Manage your auto save settings',
        enabled: 'Auto Save',
        enabledDesc: 'Automatically saves your changes',
        dataSync: 'Data Synchronization',
        dataSyncDesc: 'Synchronizes your data across devices'
      }
    },
    notifications: {
      title: 'Notification Settings',
      description: 'Manage your notification preferences',
      enabled: 'Enable Notifications',
      enabledDesc: 'Enables all notifications',
      email: 'Email Notifications',
      emailDesc: 'Receive email for important updates',
      push: 'Push Notifications',
      pushDesc: 'Receive instant notifications',
      sound: 'Sound Notifications',
      soundDesc: 'Enables notification sounds'
    },
    privacy: {
      title: 'Privacy and Security',
      description: 'Manage your account security and privacy settings',
      twoFactor: 'Two-Factor Authentication',
      twoFactorDesc: 'Protect your account with extra security',
      autoLogout: 'Auto Logout',
      autoLogoutDesc: 'Logs out after 30 minutes of inactivity',
      analytics: 'Analytics Data Sharing',
      analyticsDesc: 'Anonymous data sharing for development'
    },
    appearance: {
      title: 'Appearance Settings',
      description: 'Customize your interface preferences',
      darkMode: 'Enable Dark Mode',
      lightMode: 'Enable Light Mode',
      darkModeDesc: 'Use dark theme',
      lightModeDesc: 'Use light theme',
      compact: 'Compact View',
      compactDesc: 'Compact design that uses less space',
      animations: 'Animations',
      animationsDesc: 'Enables interface animations'
    },
    data: {
      title: 'Data Management',
      description: 'Backup or delete your data',
      download: 'Download Data',
      downloadDesc: 'Download all your data',
      upload: 'Upload Data',
      uploadDesc: 'Upload data from backup',
      delete: 'Delete Data',
      deleteDesc: 'Delete all data',
      storage: 'Storage',
      storageDesc: 'Manage storage space'
    }
  },

  // Notifications
  notifications: {
    title: 'Notifications',
    empty: 'No notifications',
    markAllAsRead: 'Mark all as read'
  },

  // Brand
  brand: {
    name: 'QR Menu',
    slogan: 'Digital Restaurant Solution'
  },

  // Features
  features: {
    title: 'Why',
    titleHighlight: 'QR Menu?',
    subtitle: 'Enhance customer experience and take your business to the digital age with powerful features designed for modern restaurants.',
    list: {
      qrAccess: {
        title: 'Instant Access with QR Code',
        description: 'Your customers can instantly access your menu by scanning the QR code on the table. No app download required.'
      },
      mobileOptimized: {
        title: 'Mobile Optimization',
        description: 'Perfect view on all devices. Optimal experience on phone, tablet and desktop with responsive design.'
      },
      instantUpdate: {
        title: 'Instant Update',
        description: 'Your menu changes are published instantly. Price updates and new products are visible immediately.'
      },
      analytics: {
        title: 'Detailed Analytics',
        description: 'Get reports on which products are viewed more, customer behavior and sales trends.'
      },
      alwaysOpen: {
        title: '24/7 Access',
        description: 'Your customers can view your menu anytime. Accessible even outside restaurant hours.'
      },
      secure: {
        title: 'Secure and Fast',
        description: 'Secure with SSL certificate, fast loading pages. Customer information is protected.'
      },
      customizable: {
        title: 'Customizable Design',
        description: 'Color, font and design options suitable for your restaurant style. Reflect your brand identity.'
      },
      multiLanguage: {
        title: 'Multi-Language Support',
        description: 'You can offer your menu in multiple languages. Appeal to your international customers.'
      }
    },
    cta: {
      title: 'Ready to Digitize Your Restaurant?',
      subtitle: 'Start today and offer your customers a modern experience. Setup takes only 5 minutes!',
      button: 'Try for Free'
    }
  },

  // Footer
  footer: {
    description: 'Modern, fast and secure digital menu solution for restaurants. Enhance customer experience and digitize your business.',
    contact: {
      phone: '+90 212 345 67 89',
      email: 'info@qrmenu.com',
      address: 'Maslak, Istanbul'
    },
    sections: {
      product: {
        title: 'Product',
        links: {
          features: 'Features',
          pricing: 'Pricing', 
          demo: 'Demo',
          api: 'API Documentation'
        }
      },
      company: {
        title: 'Company',
        links: {
          about: 'About Us',
          blog: 'Blog',
          careers: 'Careers',
          contact: 'Contact'
        }
      },
      support: {
        title: 'Support',
        links: {
          helpCenter: 'Help Center',
          faq: 'FAQ',
          liveSupport: 'Live Support',
          tutorials: 'Tutorial Videos'
        }
      },
      legal: {
        title: 'Legal',
        links: {
          privacy: 'Privacy Policy',
          terms: 'Terms of Service',
          cookies: 'Cookie Policy',
          gdpr: 'GDPR'
        }
      }
    },
    newsletter: {
      title: 'Stay Updated',
      subtitle: 'Get information about new features and updates.',
      placeholder: 'Your email address',
      button: 'Subscribe'
    },
    bottom: {
      copyright: 'All rights reserved.',
      madeWith: 'Designed and developed in Turkey ❤️'
    }
  },

  // Auth Pages
  pages: {
    login: {
      title: 'Login',
      subtitle: 'Sign in to your QR Menu account',
      backToHome: 'Back to Home',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember Me',
      forgotPassword: 'Forgot Password',
      signIn: 'Sign In',
      signingIn: 'Signing In...',
      noAccount: 'Don\'t have an account?',
      registerNow: 'Register Now',
      errors: {
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        passwordRequired: 'Password is required',
        invalidCredentials: 'Invalid email or password',
        generalError: 'An error occurred during login. Please try again.'
      }
    },
    register: {
      title: 'Create Account',
      subtitle: 'Join the QR Menu family and digitize your restaurant',
      backToHome: 'Back to Home',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      createAccount: 'Create Account',
      creating: 'Creating Account...',
      haveAccount: 'Already have an account?',
      signInNow: 'Sign In',
      formProgress: 'Form completion',
      placeholders: {
        firstName: 'Your first name',
        lastName: 'Your last name',
        email: 'example@email.com',
        phone: '05XX XXX XX XX',
        password: '••••••••',
        confirmPassword: 'Re-enter your password'
      },
      validation: {
        nameRequired: 'First name is required',
        nameMin: 'First name must be at least 2 characters',
        surnameRequired: 'Last name is required',
        surnameMin: 'Last name must be at least 2 characters',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Please enter a valid phone number (e.g., 05XX XXX XX XX)',
        passwordRequired: 'Password is required',
        passwordMin: 'Password must be at least 8 characters',
        passwordPattern: 'Password must contain at least one uppercase letter, one lowercase letter and one number',
        passwordConfirmRequired: 'Password confirmation is required',
        passwordMismatch: 'Passwords do not match',
        termsRequired: 'You must accept the terms of service',
        emailExists: 'This email address is already in use'
      },
      passwordStrength: {
        veryWeak: 'Very Weak',
        weak: 'Weak',
        medium: 'Medium',
        good: 'Good',
        strong: 'Strong'
      },
      terms: {
        service: 'Terms of Service',
        and: 'and',
        privacy: 'Privacy Policy',
        accept: 'I accept'
      },
      errors: {
        validation: 'Please check your registration information',
        invalidData: 'Invalid information entered. Please check.',
        general: 'An error occurred during registration. Please try again.'
      },
      success: {
        message: 'Registration successful! Now you can enter your restaurant information.'
      }
    },
    forgotPassword: {
      title: 'Forgot Password',
      subtitle: 'Enter your email address and we\'ll send you a password reset link',
      backToLogin: 'Back to Login',
      email: 'Email',
      sendResetLink: 'Send Reset Link',
      sending: 'Sending...',
      resendCode: 'Resend Code',
      countdown: 'seconds until you can resend',
      placeholders: {
        email: 'example@email.com'
      },
      success: {
        title: 'Email Sent!',
        message: 'Password reset link has been sent to your email address. Please check your email.'
      },
      errors: {
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        emailNotFound: 'No account found with this email address',
        general: 'An error occurred while sending the password reset link. Please try again.'
      }
    }
  },

  // Pricing
  pricing: {
    title: 'Choose Your',
    titleHighlight: 'Perfect',
    titleEnd: 'Plan',
    subtitle: 'Flexible pricing options designed for your needs. You can change or cancel your plan anytime.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    freeMonths: '2 MONTHS FREE',
    mostPopular: 'Most Popular',
    plans: {
      basic: {
        name: 'Starter',
        features: {
          '0': '1 Restaurant',
          '1': '50 Products',
          '2': 'Basic Analytics',
          '3': 'Email Support',
          '4': 'QR Code Generator',
          '5': 'Mobile Optimization'
        },
        button: 'Get Started'
      },
      pro: {
        name: 'Professional',
        features: {
          '0': '3 Restaurants',
          '1': 'Unlimited Products',
          '2': 'Advanced Analytics',
          '3': 'Priority Support',
          '4': 'Custom Design',
          '5': 'Multi-Language Support',
          '6': 'API Access',
          '7': 'White Label'
        },
        button: 'Most Popular'
      },
      enterprise: {
        name: 'Enterprise',
        features: {
          '0': 'Unlimited Restaurants',
          '1': 'Unlimited Products',
          '2': 'Enterprise Analytics',
          '3': '24/7 Phone Support',
          '4': 'Custom Integration',
          '5': 'Dedicated Account Manager',
          '6': 'SLA Guarantee',
          '7': 'Training & Consulting'
        },
        button: 'Contact Us'
      }
    },
    additionalInfo: 'All plans include 14-day free trial • No credit card required • Cancel anytime',
    vatInfo: 'Prices include VAT. Custom pricing available for enterprise plans.',
    perMonth: 'month',
    perYear: 'year',
    monthlyEquivalent: 'Monthly ₺{amount} (2 months free)'
  },

  // Testimonials
  testimonials: {
    title: 'What Our Customers',
    titleHighlight: 'Say',
    subtitle: 'Real user experiences about the QR Menu system trusted by 500+ restaurants across Turkey.',
    customers: [
      {
        name: 'Mehmet Özkan',
        role: 'Restaurant Owner',
        company: 'Lezzet Durağı',
        content: 'Thanks to QR Menu, our customer satisfaction increased by 40%. Especially during the pandemic, contactless menu provided a great advantage. The system is very easy to use.'
      },
      {
        name: 'Ayşe Demir',
        role: 'General Manager',
        company: 'Bella Vista Restaurant',
        content: 'Our customers can now view the menu without waiting for waiters. Our order taking time has been halved. Really a perfect solution!'
      },
      {
        name: 'Can Yılmaz',
        role: 'Business Partner',
        company: 'Keyif Cafe',
        content: 'Thanks to analytics reports, we see which products are more popular. We optimized our menu and our sales increased by 25%.'
      },
      {
        name: 'Fatma Kaya',
        role: 'Restaurant Manager',
        company: 'Anadolu Sofrası',
        content: 'Price updates are reflected instantly. We no longer deal with menu printing. Both cost savings and environmentally friendly.'
      },
      {
        name: 'Emre Şahin',
        role: 'Chain Restaurant Owner',
        company: 'Burger House',
        content: 'We manage all our branches from one place. We can create separate menus and pricing for each branch. Magnificent system!'
      },
      {
        name: 'Zeynep Arslan',
        role: 'Cafe Owner',
        company: 'Kahve Köşesi',
        content: 'Customer support is great. We got help at every step during installation. Now we are a technological cafe and our customers are very satisfied.'
      }
    ],
    stats: {
      restaurants: 'Happy Restaurants',
      satisfaction: 'Satisfaction Rate',
      support: 'Customer Support',
      setup: 'Setup Time'
    }
  },

  // FAQ
  faq: {
    title: 'Frequently Asked',
    titleHighlight: 'Questions',
    subtitle: 'Everything you want to know about QR Menu is here. If you don\'t find your question, you can contact us.',
    questions: {
      '1': {
        question: 'How does QR Menu work?',
        answer: 'Our QR Menu system is very simple. We create a QR code for your restaurant. Your customers can instantly access your menu by scanning this QR code with their phones. No app download required.'
      },
      '2': {
        question: 'How long does setup take?',
        answer: 'Setup takes only 5 minutes! After creating your account, you upload and customize your menu. Your QR code becomes ready to use immediately.'
      },
      '3': {
        question: 'Can I see customer data?',
        answer: 'Yes! We provide detailed analytics such as which products are viewed most, peak hours, customer behaviors. You can optimize your menu with this data.'
      },
      '4': {
        question: 'Can I easily change prices?',
        answer: 'Of course! You can update prices, add new products or edit existing products anytime from your admin panel. Changes are published instantly.'
      },
      '5': {
        question: 'How does it look on mobile devices?',
        answer: 'Your menu looks perfect on all devices. With responsive design, it provides optimal experience on phones, tablets and computers.'
      },
      '6': {
        question: 'Is there customer support?',
        answer: 'Absolutely! We provide 24/7 support via email, phone and live chat. We are with you at every step from installation to usage.'
      },
      '7': {
        question: 'What happens when I want to cancel?',
        answer: 'You can cancel anytime. No contract or penalty. After cancellation, we securely deliver your data to you.'
      },
      '8': {
        question: 'Can I manage multiple restaurants?',
        answer: 'With our Professional and Enterprise plans, you can manage multiple restaurants from a single account. Separate menu and analytics for each restaurant.'
      }
    },
    cta: {
      title: 'Do you have other questions?',
      subtitle: 'Contact us for questions you can\'t find answers to. We respond within 24 hours.',
      button: 'Contact Us'
    }
  },

  // Contact
  contact: {
    title: 'Get in',
    titleHighlight: 'Touch',
    titleEnd: 'with Us',
    subtitle: 'Do you have questions about the QR Menu system? Contact us.',
    info: {
      title: 'Contact Information',
      phone: 'Phone',
      email: 'Email',
      address: 'Address'
    },
    form: {
      title: 'Write to Us',
      name: 'Full Name',
      nameRequired: 'Full Name *',
      namePlaceholder: 'Enter your name',
      email: 'Email',
      emailRequired: 'Email *',
      emailPlaceholder: 'Your email address',
      company: 'Restaurant/Company Name',
      companyPlaceholder: 'Your business name',
      message: 'Your Message',
      messageRequired: 'Your Message *',
      messagePlaceholder: 'Write your message...',
      sending: 'Sending...',
      send: 'Send Message',
      success: {
        title: 'Your Message Has Been Sent!',
        subtitle: 'We will get back to you as soon as possible.'
      }
    }
  },

  // Accessibility
  accessibility: {
    menu: 'Toggle menu',
    theme: 'Change theme',
    language: 'Change language',
    profile: 'Profile menu',
    notifications: 'Notifications'
  },

  // Orders
  orders: {
    loading: 'Loading orders...',
    title: 'Orders',
    description: 'Manage and track all your orders',
    orderNumber: 'Order',
    table: 'Table',
    items: 'Items',
    tabs: {
      all: 'All Orders',
      pending: 'Pending',
      preparing: 'Preparing',
      ready: 'Ready',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    },
    status: {
      pending: 'Pending',
      preparing: 'Preparing',
      ready: 'Ready',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    },
    filters: {
      status: 'Status',
      dateRange: 'Date Range',
      paymentType: 'Payment Type',
      today: 'Today',
      yesterday: 'Yesterday',
      lastWeek: 'Last Week',
      lastMonth: 'Last Month',
      custom: 'Custom'
    },
    actions: {
      refresh: 'Refresh',
      export: 'Export',
      filter: 'Filter',
      search: 'Search orders...',
      viewDetails: 'View Details',
      changeStatus: 'Change Status'
    },
    stats: {
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      pendingOrders: 'Pending Orders',
      avgOrderValue: 'Average Order Value'
    }
  },

  // Table Management
  tableManagement: {
    loading: 'Loading tables...',
    title: 'Table Management',
    description: 'Manage your QR codes and tables',
            noCategories :"Not Found Categories",
    createFirstCategory: "Create First Category",
    error: {
      loadFailed: 'Failed to load branch list',
      dataLoadFailed: 'An error occurred while loading data'
    },
      deleteModal :{ title : "Are You Sure you want delete the item ? " },
    actions: {
      addTable: 'Add Table',
      addQRCode: 'Add QR Code',
      generateQR: 'Generate QR Code',
      downloadQR: 'Download QR Code',
      editTable: 'Edit Table',
      deleteTable: 'Delete Table'
    },
    categories: {
      title: 'Category Management',
      addCategory: 'Add Category',
      editCategory: 'Edit Category',
      deleteCategory: 'Delete Category',
      categoryName: 'Category Name',
      tableCount: 'Table Count'
    },
    qrCodes: {
      title: 'QR Codes',
      tableNumber: 'Table Number',
      category: 'Category',
      status: 'Status',
      actions: 'Actions',
      active: 'Active',
      inactive: 'Inactive'
    }
  },
  // User Management
  userManagement: {
    loading: 'Loading users...',
    title: 'User Management',
    description: 'Manage users, roles and permissions',
    error: {
      loadFailed: 'An error occurred while loading users',
      rolesLoadFailed: 'An error occurred while loading roles',
      createFailed: 'An error occurred while creating user',
      updateFailed: 'An error occurred while updating user',
      deleteFailed: 'An error occurred while deleting user'
    },
    actions: {
      addUser: 'Add User',
      editUser: 'Edit User',
      deleteUser: 'Delete User',
      resetPassword: 'Reset Password',
      changeRole: 'Change Role'
    },
    roles: {
      admin: 'Admin',
      manager: 'Manager',
      staff: 'Staff',
      viewer: 'Viewer'
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended'
    }
  },

  // Subscription
  subscription: {
    title: 'Subscription',
    description: 'Manage your subscription plan and view your bills',
    currentPlan: 'Current Plan',
    planDetails: 'Plan Details',
    billing: 'Billing',
    usage: 'Usage',
    plan: 'Plan',
    renewal: 'Renewal',
    changePlan: 'Change Plan',
    availablePlans: 'Available Plans',
    selectPlan: 'Choose a plan that fits your needs',
    tabs: {
      overview: 'Overview',
      billing: 'Billing',
      usage: 'Usage'
    },
    actions: {
      upgrade: 'Upgrade',
      downgrade: 'Downgrade',
      cancel: 'Cancel',
      renew: 'Renew',
      settings: 'Settings'
    }
  },
  products: {
    status: {
      outOfStock: 'Out of Stock',
      inStock: 'In Stock',
      available: 'Available',
      unavailable: 'Unavailable'
    },
    count: 'products',
    empty: 'No products in this category yet',
    actions: {
      addFirst: 'Add first product',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      deleteProduct: 'Delete Product'
    }
  },
  branchSelector: {
  status: {
    loading: 'Loading...',
    error: 'Could not fetch branch list'
  },
  empty: 'No options found',
  actions: {
    changeBranchRestaurant: 'Change Branch/Restaurant'
  },
  labels: {
    mainRestaurant: 'Main Restaurant',
    branches: 'Branches'
  }
  },
  popularProducts: {
    title: 'Popular Products',
    empty: 'Product sales will appear here',
    labels: {
      orders: 'orders',
      percentage: '%'
    },
    tooltip: {
      ordersFormat: (value: any, percentage: any) => `${value} orders (${percentage}%)`,
      noData: 'No data available'
    }
  },
  weeklyActivity: {
    title: 'Haftalık Aktivite',
    empty: {
      primary: 'No activity data yet',
      secondary: 'Data will appear here soon'
    },
    labels: {
      views: 'Views',
      qrScans: 'QR Scan'
    },
    legend: {
      views: 'Views',
      qrScans: 'QR Scan'
    }
  },
  monthlyRevenue: {
    QuickStats: "Quick Stats",
    title: 'Monthly Revenue Trend',
    empty: {
      primary: 'No revenue data available yet',
      secondary: 'Revenue data will appear here'
    },
    labels: {
      total: 'Total:',
      revenue: 'Revenue'
    },
    currency: {
      symbol: '$',
      format: (value: { toLocaleString: (arg0: string) => any; }) => `$${value.toLocaleString('en-US')}`
    }
  },
  branchCard: {
    status: {
      temporaryClosed: 'Temporarily Closed',
      open: 'Open',
      closed: 'Closed',
      active: 'Active',
      inactive: 'Inactive',
      hidden: 'Hidden'
    },
    actions: {
      edit: 'Edit',
      delete: 'Delete'
    },
    labels: {
      customerVisibility: 'Customer Visibility',
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
      add: 'Add New Branch',
      edit: 'Edit Branch'
    },
    subtitle: 'You can enter branch information step by step',
    steps: {
      basic: 'Basic Information',
      address: 'Address Information', 
      contact: 'Contact & Working Hours'
    },
    sections: {
      basicInfo: 'Basic Information',
      addressInfo: 'Address Information',
      contactInfo: 'Contact Information',
      workingHours: 'Working Hours'
    },
    fields: {
      branchName: {
        label: 'Branch Name *',
        placeholder: 'Enter branch name'
      },
      whatsappNumber: {
        label: 'WhatsApp Order Number *',
        placeholder: 'Enter WhatsApp order number'
      },
      branchLogo: {
        label: 'Branch Logo (Optional)',
        select: 'Select Logo',
        uploading: 'Uploading...',
        success: '✓ Logo uploaded successfully',
        preview: 'Branch logo preview',
        supportText: 'PNG, JPG, GIF formats are supported. Maximum file size: 5MB'
      },
      country: {
        label: 'Country *',
        placeholder: 'Enter country name'
      },
      city: {
        label: 'City *',
        placeholder: 'Enter city name'
      },
      street: {
        label: 'Street *',
        placeholder: 'Enter street name'
      },
      zipCode: {
        label: 'Zip Code *',
        placeholder: 'Enter zip code'
      },
      addressLine1: {
        label: 'Address Line 1 *',
        placeholder: 'Enter detailed address information'
      },
      addressLine2: {
        label: 'Address Line 2 (Optional)',
        placeholder: 'Enter additional address information (optional)'
      },
      phone: {
        label: 'Phone Number *',
        placeholder: 'Enter phone number'
      },
      email: {
        label: 'Email Address *',
        placeholder: 'Enter email address'
      },
      location: {
        label: 'Location Information *',
        placeholder: 'Enter location information (e.g., 40.9795,28.7225)'
      },
      contactHeader: {
        label: 'Contact Header (Optional)',
        placeholder: 'Enter contact header (optional)'
      },
      footerTitle: {
        label: 'Footer Title (Optional)',
        placeholder: 'Enter footer title (optional)'
      },
      footerDescription: {
        label: 'Footer Description (Optional)',
        placeholder: 'Enter footer description (optional)'
      },
      openTitle: {
        label: 'Working Hours Title (Optional)',
        placeholder: 'Enter working hours title (optional)'
      },
      openDays: {
        label: 'Open Days (Optional)',
        placeholder: 'Enter open days (optional)'
      },
      openHours: {
        label: 'Open Hours (Optional)',
        placeholder: 'Enter open hours (optional)'
      }
    },
    workingHours: {
      description: 'Set your business working hours',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      open: 'Open',
      closed: 'Closed',
      openTime: 'Open',
      closeTime: 'Close',
      canOrder: '✓ Customers can place orders on this day',
      infoTitle: 'About Working Hours',
      infoText: 'The hours you set here determine when customers can place orders through your QR menu. No orders are taken on closed days.'
    },
    errors: {
      branchName: 'Branch name is required',
      whatsappNumber: 'WhatsApp order number is required',
      country: 'Country is required',
      city: 'City is required',
      street: 'Street is required',
      zipCode: 'Zip code is required',
      addressLine1: 'Address line 1 is required',
      phone: 'Phone number is required',
      email: 'Email address is required',
      location: 'Location information is required'
    },
    buttons: {
      cancel: 'Cancel',
      back: 'Back',
      next: 'Next',
      save: 'Save',
      saving: 'Saving...'
    }
  },
  branchManagement: {
      title: 'Branch Management',
      description: 'Manage restaurant branches and update their information',
      loading: 'Loading branches...',
      addBranch: 'Add New Branch',
      
      // Error messages
      error: {
        loadFailed: 'Failed to load branches',
        createFailed: 'Failed to create branch',
        updateFailed: 'Failed to update branch',
        deleteFailed: 'Failed to delete branch',
        restaurantIdNotFound: 'Restaurant ID not found',
        detailsLoadFailed: 'Failed to load branch details',
        statusUpdateFailed: 'Failed to update branch status',
        sessionExpired: 'Session expired. Please log in again.',
        noPermission: 'You do not have permission for this operation.',
        branchNotFound: 'Branch not found.',
        connectionError: 'Check your internet connection.',
        unknownError: 'An unexpected error occurred'
      },

      // No branches state
      noBranches: {
        title: 'No branches yet',
        description: 'Start by adding your first restaurant branch'
      },

      // Delete confirmation
      deleteConfirm: {
        title: 'Confirm Branch Deletion',
        description: 'Are you sure you want to delete the branch "{{branchName}}"? This action cannot be undone.'
      },

      // Form labels and fields
      form: {
        branchName: 'Branch Name',
        branchNamePlaceholder: 'Enter branch name',
        branchNameRequired: 'Branch name is required',
        whatsappNumber: 'WhatsApp Order Number',
        whatsappPlaceholder: 'Enter WhatsApp number',
        branchLogo: 'Branch Logo',
        logoUpload: 'Upload Logo',
        logoChange: 'Change Logo',
        logoRemove: 'Remove Logo',
        logoNotSelected: 'No logo selected',
        logoInstructions: 'You can upload JPG, PNG or GIF files, maximum 5MB size.',

        // Address fields
        country: 'Country',
        countryPlaceholder: 'Enter country name',
        city: 'City',
        cityPlaceholder: 'Enter city name',
        street: 'Street',
        streetPlaceholder: 'Enter street name',
        zipCode: 'Zip Code',
        zipCodePlaceholder: 'Enter zip code',
        addressLine1: 'Address Line 1',
        addressLine1Placeholder: 'Enter address details',
        addressLine2: 'Address Line 2',
        addressLine2Placeholder: 'Additional address information (optional)',

        // Contact fields
        phone: 'Phone',
        phonePlaceholder: 'Enter phone number',
        email: 'Email',
        emailPlaceholder: 'Enter email address',
        location: 'Location',
        locationPlaceholder: 'Enter location information',
        contactHeader: 'Contact Header',
        contactHeaderPlaceholder: 'Enter contact header',
        footerTitle: 'Footer Title',
        footerTitlePlaceholder: 'Enter footer title',
        footerDescription: 'Footer Description',
        footerDescriptionPlaceholder: 'Enter footer description',
        openTitle: 'Opening Hours Title',
        openTitlePlaceholder: 'Enter opening hours title',
        openDays: 'Open Days',
        openDaysPlaceholder: 'Enter open days',
        openHours: 'Open Hours',
        openHoursPlaceholder: 'Enter open hours',

        // Working hours
        workingHours: 'Working Hours',
        workingHoursRequired: 'At least one working day must be selected',
        isOpen: 'Open',
        dayNames: {
          0: 'Sunday',
          1: 'Monday',
          2: 'Tuesday',
          3: 'Wednesday',
          4: 'Thursday',
          5: 'Friday',
          6: 'Saturday'
        }
      },

      // Modal titles and tabs
      modal: {
        createTitle: 'Add New Branch',
        createDescription: 'Enter new branch information',
        editTitle: 'Edit Branch - {branchName}',
        editDescription: 'Edit branch information',
        
        tabs: {
          general: 'General Information',
          address: 'Address',
          contact: 'Contact',
          workingHours: 'Working Hours'
        },

        buttons: {
          creating: 'Creating...',
          updating: 'Updating...',
          create: 'Create Branch',
          update: 'Update Branch'
        },

        errors: {
          updateError: 'Update Error',
          validationFailed: 'Please fix the errors in the form and try again.',
          dataValidationError: 'An error occurred during update. Please check the entered data.',
          imageUploadError: 'Failed to upload image. Please try again.',
          imageRemoveError: 'Failed to remove image.',
          uploadingImage: 'Uploading image...',
          invalidFileType: 'Please select a valid image file',
          fileSizeError: 'File size must be less than 5MB'
        }
      },

      // Branch card actions
      card: {
        edit: 'Edit',
        delete: 'Delete',
        temporaryClose: 'Temporary Close',
        temporaryOpen: 'Temporary Open',
        status: {
          open: 'Open',
          closed: 'Closed',
          temporarilyClosed: 'Temporarily Closed'
        }
      }
  },
  // Common translations
  commonBranch: {
    cancel: 'Cancel',
    delete: 'Delete',
    save: 'Save',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    required: 'Required',
    optional: 'Optional'
  },
  productsContent: {
        branch : {
    selectAll:"All",

    },
  title: 'Products Management',
  description: 'Manage menu categories and products',
  
  // Search and filters
  search: {
    placeholder: 'Search menu items...',
    filter: 'Filter',
    sort: 'Sort',
    noResults: 'No products found'
  },

  // View modes
  viewMode: {
    list: 'List view',
    grid: 'Grid view'
  },

  // Buttons and actions
  actions: {
    addFirstCategory: 'Add First Category',
    addCategory: 'New Category',
    newCategory: 'New Category',
    addProduct: 'New Product',
    newProduct: 'New Product',
    editCategory: 'Edit Category',
    deleteCategory: 'Delete Category',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    manageIngredients: 'Manage Ingredients',
    updateIngredients: 'Update Ingredients',
    manageAddons: 'Manage Add-ons',
    importSampleMenu: 'Import Sample Menu',
    addFirstCategoryTitle: 'Add First Category',
    RecycleBin:"Recycle Bin"
  },

  // Empty states
  emptyState: {
    noCategories: {
      title: 'No menu categories yet',
      description: 'Start creating your restaurant menu by adding the first category. For example "Main Dishes", "Beverages" or "Desserts".',
      addFirstCategory: 'Add First Category'
    }
  },

  // Loading states
  loading: {
    categories: 'Loading categories...',
    products: 'Loading products...',
    savingOrder: 'Saving order...',
    savingCategoryOrder: 'Saving category order...',
    savingProductOrder: 'Saving product order...',
    movingProduct: 'Moving product...',
    deleting: 'Deleting...'
  },

  // Drag and drop
  dragDrop: {
    categoryReordering: 'Saving category order...',
    productReordering: 'Saving product order...',
    productMoving: 'Moving product...',
    categoryOrderSaveError: 'An error occurred while saving category order.',
    productOrderSaveError: 'An error occurred while saving product order.',
    productMoveError: 'An error occurred while moving the product.'
  },

  // Delete confirmations
  delete: {
    product: {
      title: 'Delete Product',
      message: 'Are you sure you want to delete "{{productName}}"? This action cannot be undone.',
      success: 'Product deleted successfully'
    },
    category: {
      title: 'Delete Category',
      messageWithProducts: 'Category "{{categoryName}}" contains {{productCount}} products. Deleting this category will also delete all products. Are you sure you want to continue?',
      messageEmpty: 'Are you sure you want to delete category "{{categoryName}}"?',
      success: 'Category deleted successfully'
    }
  },

  // Error messages
  error: {
    loadFailed: 'Failed to load data',
    categoryNotFound: 'Category not found',
    productNotFound: 'Product not found',
    deleteFailed: 'Failed to delete',
    updateFailed: 'Failed to update',
    createFailed: 'Failed to create',
    reorderFailed: 'Failed to reorder',
    invalidData: 'Invalid data',
    networkError: 'Network connection error',
    refreshPage: 'Please refresh the page and try again.'
  },

  // Success messages
  success: {
    categoryCreated: 'Category created successfully',
    categoryUpdated: 'Category updated successfully',
    categoryDeleted: 'Category deleted successfully',
    productCreated: 'Product created successfully',
    productUpdated: 'Product updated successfully',
    productDeleted: 'Product deleted successfully',
    orderSaved: 'Order saved successfully',
    ingredientsUpdated: 'Ingredients updated successfully',
    addonsUpdated: 'Add-ons updated successfully'
  },

  // Categories
  category: {
    products: 'products',
    productCount: 'product',
    noProducts: 'No products in this category',
    expand: 'Expand',
    collapse: 'Collapse'
  },

  // Products
  product: {
    price: 'Price',
    description: 'Description',
    ingredients: 'Ingredients',
    addons: 'Add-ons',
    category: 'Category',
    image: 'Image',
    status: 'Status',
    available: 'Available',
    unavailable: 'Unavailable'
  },

  // Currency
  currency: {
    symbol: '₺',
    format: '{{amount}} ₺'
  },

  // Status indicators
  status: {
    active: 'Active',
    inactive: 'Inactive',
    available: 'Available',
    unavailable: 'Unavailable'
  },

  // Tooltips
  tooltips: {
    dragToReorder: 'Drag to reorder',
    dragToMoveCategory: 'Drag to move product to another category',
    expandCategory: 'Expand category',
    collapseCategory: 'Collapse category',
    editCategory: 'Edit category',
    deleteCategory: 'Delete category',
    editProduct: 'Edit product',
    deleteProduct: 'Delete product',
    manageIngredients: 'Manage product ingredients',
    manageAddons: 'Manage product add-ons'
  }
  },
  createCategoryModal: {
  // Header
  title: 'Add New Category',
  subtitle: 'Create menu category',
  close: 'Close',

  // Form fields
  form: {
    categoryName: {
      label: 'Category Name *',
      placeholder: 'e.g: Main Dishes, Beverages, Desserts',
      required: 'Category name is required'
    },
    status: {
      label: 'Activate category',
      description: 'Active categories appear in the menu'
    }
  },

  // Buttons
  buttons: {
    cancel: 'Cancel',
    create: 'Add Category',
    creating: 'Adding...'
  },

  // Error messages
  errors: {
    general: 'An error occurred while adding the category. Please try again.',
    categoryExists: 'A category with this name already exists. Please choose a different name.',
    invalidData: 'The entered data is invalid. Please check and try again.',
    serverError: 'A server error occurred. Please try again later.',
    networkError: 'Network connection error. Check your connection and try again.',
    unknownError: 'An unexpected error occurred. Please try again.',
    errorLabel: 'Error:'
  },

  // Success messages
  success: {
    categoryCreated: 'Category created successfully',
    categoryAdded: 'Category successfully added to the menu'
  },

  // Validation messages
  validation: {
    nameRequired: 'Category name is required',
    nameMinLength: 'Category name must be more than 2 characters',
    nameMaxLength: 'Category name must be less than 50 characters',
    invalidCharacters: 'Category name contains invalid characters'
  },

  // Accessibility
  accessibility: {
    closeModal: 'Close add category modal',
    formTitle: 'Add new category form',
    requiredField: 'Required field',
    optionalField: 'Optional field'
  }
  },
  createProductModal: {
  // Header
  title: 'Add New Product',
  subtitle: 'Add product to your menu',
  close: 'Close',

  // Form fields
  form: {
    productImage: {
      label: 'Product Image',
      dragActive: 'Drop file here',
      uploadText: 'Upload image',
      supportedFormats: 'PNG, JPG, GIF (5MB max)',
      removeImage: 'Remove image'
    },
    productName: {
      label: 'Product Name',
      placeholder: 'e.g: Margherita Pizza',
      required: 'Product name is required'
    },
    price: {
      label: 'Price (₺)',
      placeholder: '0',
      required: 'Price is required',
      mustBePositive: 'Price must be greater than 0',
      currency: '₺'
    },
    category: {
      label: 'Category',
      placeholder: 'Select category',
      required: 'Category selection is required',
      invalidCategory: 'Selected category is invalid. Available categories: {{categories}}'
    },
    description: {
      label: 'Description',
      placeholder: 'Product description...',
      required: 'Product description is required'
    },
    status: {
      label: 'Activate product',
      description: 'Displays in menu',
      active: 'Active',
      inactive: 'Inactive'
    }
  },

  // Buttons
  buttons: {
    cancel: 'Cancel',
    create: 'Add Product',
    creating: 'Adding...',
    uploading: 'Uploading...'
  },

  // Image upload
  imageUpload: {
    dragToUpload: 'Drag image here or click to upload',
    clickToUpload: 'Click to upload image',
    dragActive: 'Drop file here',
    supportedFormats: 'PNG, JPG, GIF',
    maxSize: '5MB max',
    preview: 'Image preview',
    remove: 'Remove'
  },

  // Error messages
  errors: {
    general: 'An error occurred while adding the product. Please try again.',
    nameRequired: 'Product name is required',
    descriptionRequired: 'Product description is required',
    priceRequired: 'Price is required',
    priceMustBePositive: 'Price must be greater than 0',
    categoryRequired: 'Category selection is required',
    categoryInvalid: 'Selected category is invalid',
    imageInvalid: 'Please select a valid image file',
    imageTooLarge: 'Image file size must be less than 5MB',
    imageUploadFailed: 'Failed to upload image',
    networkError: 'Network connection error. Check your connection and try again.',
    serverError: 'A server error occurred. Please try again later.',
    unknownError: 'An unexpected error occurred. Please try again.',
    errorLabel: 'Error:'
  },

  // Success messages
  success: {
    productCreated: 'Product created successfully',
    productAdded: 'Product successfully added to the menu'
  },

  // Validation messages
  validation: {
    nameMinLength: 'Product name must be more than 2 characters',
    nameMaxLength: 'Product name must be less than 100 characters',
    descriptionMinLength: 'Description must be more than 5 characters',
    descriptionMaxLength: 'Description must be less than 500 characters',
    priceMin: 'Price must be greater than 0',
    priceMax: 'Price must be less than 10000'
  },

  // Accessibility
  accessibility: {
    closeModal: 'Close add product modal',
    formTitle: 'Add new product form',
    requiredField: 'Required field',
    optionalField: 'Optional field',
    imageUpload: 'Upload product image',
    removeImage: 'Remove product image',
    priceInput: 'Enter product price',
    categorySelect: 'Select product category',
    statusToggle: 'Toggle product status'
  }
  },
  productAddonsModal: {
      // Header
      title: 'Product Addons',
      subtitle: 'manage addon products for',
      close: 'Close',

      // Panel titles
      panels: {
        currentAddons: {
          title: 'Current Addons',
          count: '({{count}})',
          dragInstruction: 'You can reorder by dragging',
          emptyState: {
            title: 'No addons added yet.',
            subtitle: 'Select products from the right panel.'
          }
        },
        availableProducts: {
          title: 'Products Available as Addons',
          searchPlaceholder: 'Search products...',
          emptyState: {
            noResults: 'No products found matching search criteria.',
            noProducts: 'No addable products found.'
          }
        }
      },

      // Addon item actions
      actions: {
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
        remove: 'Remove',
        recommended: 'Recommended'
      },

      // Form fields
      form: {
        marketingText: {
          placeholder: 'Marketing text...',
          label: 'Marketing Text'
        },
        isRecommended: {
          label: 'Mark as recommended addon',
          badge: 'Recommended'
        }
      },

      // Product status
      status: {
        outOfStock: 'Out of Stock',
        available: 'Available',
        unavailable: 'Unavailable'
      },

      // Loading states
      loading: {
        addons: 'Loading addons...',
        products: 'Loading products...',
        saving: 'Saving...'
      },

      // Buttons
      buttons: {
        cancel: 'Cancel',
        saveAddons: 'Save Addons',
        saving: 'Saving...'
      },

      // Counter texts
      counters: {
        selectedProducts: '{{count}} products selected',
        availableProducts: '{{count}} available products'
      },

      // Error messages
      errors: {
        loadingData: 'An error occurred while loading addon data.',
        updatingAddon: 'An error occurred while updating addon.',
        deletingAddon: 'An error occurred while deleting addon.',
        savingOrder: 'An error occurred while saving addon order.',
        savingAddons: 'An error occurred while saving addons. Please try again.',
        general: 'An unexpected error occurred. Please try again.',
        networkError: 'Network connection error. Check your connection and try again.'
      },

      // Success messages
      success: {
        addonsSaved: 'Product addons saved successfully',
        orderUpdated: 'Addon order updated successfully',
        addonUpdated: 'Addon updated successfully',
        addonRemoved: 'Addon removed successfully'
      },

      // Accessibility
      accessibility: {
        closeModal: 'Close product addons modal',
        dragHandle: 'Drag to reorder addon',
        editAddon: 'Edit addon details',
        removeAddon: 'Remove addon from product',
        selectProduct: 'Select product as addon',
        productImage: 'Product image',
        toggleRecommended: 'Toggle recommended status'
      }
  },
  editCategoryModal: {
      // Header
      title: 'Edit Category',
      subtitle: 'Update category information',
      close: 'Close',

      // Form fields
      form: {
        categoryName: {
          label: 'Category Name',
          placeholder: 'Enter category name...',
          required: 'Category name is required',
          minLength: 'Category name must be at least 2 characters',
          maxLength: 'Category name must be less than 100 characters'
        },
        description: {
          label: 'Description',
          placeholder: 'Enter category description...',
          optional: 'Optional',
          maxLength: 'Description must be less than 500 characters'
        },
        status: {
          label: 'Active',
          description: 'Category will be visible in the menu when active',
          active: 'Active',
          inactive: 'Inactive'
        }
      },

      // Buttons
      buttons: {
        cancel: 'Cancel',
        save: 'Save',
        saving: 'Saving...',
        update: 'Update Category',
        updating: 'Updating...'
      },

      // Error messages
      errors: {
        updateFailed: 'An error occurred while updating the category. Please try again.',
        nameRequired: 'Category name is required',
        nameMinLength: 'Category name must be at least 2 characters',
        nameMaxLength: 'Category name must be less than 100 characters',
        descriptionMaxLength: 'Description must be less than 500 characters',
        general: 'An unexpected error occurred. Please try again.',
        networkError: 'Network connection error. Check your connection and try again.',
        serverError: 'A server error occurred. Please try again later.'
      },

      // Success messages
      success: {
        categoryUpdated: 'Category updated successfully',
        changesSaved: 'Changes saved successfully'
      },

      // Validation messages
      validation: {
        nameRequired: 'Please enter a category name',
        nameMinLength: 'Category name is too short',
        nameMaxLength: 'Category name is too long',
        descriptionMaxLength: 'Description is too long'
      },

      // Accessibility
      accessibility: {
        closeModal: 'Close edit category modal',
        formTitle: 'Edit category form',
        requiredField: 'Required field',
        optionalField: 'Optional field',
        statusToggle: 'Toggle category status',
        nameInput: 'Category name input',
        descriptionInput: 'Category description input'
      }
  },
  confirmDeleteModal: {
      // Common titles (can be overridden by props)
      defaultTitle: 'Confirm Deletion',
      deleteTitle: 'Delete Item',
      
      // Warning message
      warning: 'This action cannot be undone. The item will be permanently deleted.',
      
      // Item types
      itemTypes: {
        category: 'Category',
        product: 'Product',
        addon: 'Addon',
        user: 'User',
        order: 'Order',
        coupon: 'Coupon',
        discount: 'Discount',
        promotion: 'Promotion',
        review: 'Review',
        comment: 'Comment',
        image: 'Image',
        file: 'File',
        item: 'Item'
      },

      // Buttons
      buttons: {
        cancel: 'Cancel',
        delete: 'Delete',
        deleting: 'Deleting...',
        confirm: 'Confirm',
        confirming: 'Confirming...'
      },

      // Pre-built messages for common scenarios
      messages: {
        category: 'Are you sure you want to delete this category? All products in this category will also be affected.',
        product: 'Are you sure you want to delete this product? This action cannot be undone.',
        addon: 'Are you sure you want to delete this addon? It will be removed from all associated products.',
        user: 'Are you sure you want to delete this user? All their data will be permanently removed.',
        general: 'Are you sure you want to delete this item? This action cannot be undone.'
      },

      // Error messages
      errors: {
        deleteFailed: 'An error occurred during deletion. Please try again.',
        networkError: 'Network connection error. Please check your connection and try again.',
        serverError: 'A server error occurred. Please try again later.',
        permissionError: 'You do not have permission to delete this item.',
        notFound: 'The item to delete was not found.',
        hasRelations: 'Cannot delete this item because it has related data.',
        general: 'An unexpected error occurred. Please try again.'
      },

      // Success messages
      success: {
        deleted: 'Item deleted successfully',
        categoryDeleted: 'Category deleted successfully',
        productDeleted: 'Product deleted successfully',
        addonDeleted: 'Addon deleted successfully'
      },

      // Confirmation prompts
      confirmations: {
        typeToConfirm: 'Type "DELETE" to confirm',
        enterName: 'Enter the name to confirm deletion',
        areYouSure: 'Are you absolutely sure?',
        lastChance: 'This is your last chance to cancel.'
      },

      // Accessibility
      accessibility: {
        closeModal: 'Close delete confirmation modal',
        deleteDialog: 'Delete confirmation dialog',
        warningIcon: 'Warning icon',
        deleteButton: 'Confirm deletion',
        cancelButton: 'Cancel deletion',
        errorAlert: 'Error message'
      }
  },
  editProductModal: {
      // Header
      title: 'Edit Product',
      subtitle: 'Update product information',
      close: 'Close',

      // Form fields
      form: {
        productImage: {
          label: 'Product Image',
          optional: 'Optional'
        },
        productName: {
          label: 'Product Name',
          placeholder: 'e.g: Margherita Pizza',
          required: 'Product name is required'
        },
        description: {
          label: 'Description',
          placeholder: 'Product description...',
          optional: 'Optional'
        },
        price: {
          label: 'Price (₺)',
          placeholder: '0',
          required: 'Price is required',
          currency: '₺'
        },
        category: {
          label: 'Category',
          placeholder: 'Select category',
          required: 'Category selection is required'
        },
        status: {
          label: 'Available in Stock',
          description: 'Product will be visible in menu when available',
          available: 'Available',
          unavailable: 'Unavailable'
        }
      },

      // Buttons
      buttons: {
        cancel: 'Cancel',
        update: 'Update Product',
        updating: 'Updating...',
        save: 'Save Changes',
        saving: 'Saving...',
        uploading: 'Uploading Image...'
      },

      // Image upload
      imageUpload: {
        clickToUpload: 'Click to upload image',
        dragToUpload: 'Drag image here or click to upload',
        dragActive: 'Drop file here',
        supportedFormats: 'PNG, JPG, GIF',
        maxSize: '5MB max',
        preview: 'Image preview',
        remove: 'Remove image',
        changeImage: 'Change image'
      },

      // Error messages
      errors: {
        errorLabel: 'Error:',
        updateFailed: 'An error occurred while updating the product. Please try again.',
        nameRequired: 'Product name is required',
        nameAlreadyExists: 'A product with this name already exists. Please choose a different name.',
        descriptionRequired: 'Product description is required',
        priceRequired: 'Price is required',
        priceMustBePositive: 'Price must be greater than 0',
        categoryRequired: 'Category selection is required',
        imageInvalid: 'Please select a valid image file',
        imageTooLarge: 'Image file size must be less than 5MB',
        imageUploadFailed: 'Failed to upload image',
        productNotFound: 'Product not found',
        permissionDenied: 'You do not have permission to update this product',
        networkError: 'Network connection error. Check your connection and try again.',
        serverError: 'A server error occurred. Please try again later.',
        unknownError: 'An unexpected error occurred. Please try again.'
      },

      // Success messages
      success: {
        productUpdated: 'Product updated successfully',
        changesSaved: 'Changes saved successfully',
        imageUploaded: 'Image uploaded successfully'
      },

      // Validation messages
      validation: {
        nameMinLength: 'Product name must be more than 2 characters',
        nameMaxLength: 'Product name must be less than 100 characters',
        descriptionMaxLength: 'Description must be less than 500 characters',
        priceMin: 'Price must be greater than 0',
        priceMax: 'Price must be less than 10000',
        imageSize: 'Image must be less than 5MB',
        imageType: 'Only image files are allowed'
      },

      // Accessibility
      accessibility: {
        closeModal: 'Close edit product modal',
        formTitle: 'Edit product form',
        requiredField: 'Required field',
        optionalField: 'Optional field',
        imageUpload: 'Upload product image',
        removeImage: 'Remove product image',
        priceInput: 'Enter product price',
        categorySelect: 'Select product category',
        statusToggle: 'Toggle product availability',
        imagePreview: 'Product image preview'
      }
  },
  productIngredientModal: {
      // Header
      title: 'Product Ingredients',
      subtitle: 'select ingredients for',
      close: 'Close',

      // Search
      search: {
        placeholder: 'Search ingredients...',
        label: 'Search ingredients',
        noResults: 'No ingredients found'
      },

      // Summary section
      summary: {
        selectedCount: 'Selected ingredients',
        hasChanges: 'Has changes',
        noChanges: 'No changes'
      },

      // Form fields
      form: {
        quantity: {
          label: 'Quantity',
          placeholder: 'Amount',
          required: 'Quantity is required'
        },
        unit: {
          label: 'Unit',
          placeholder: 'Select unit',
          required: 'Unit is required'
        }
      },

      // Measurement units
      units: {
        grams: 'g',
        milliliters: 'ml',
        pieces: 'piece',
        tablespoons: 'tbsp',
        teaspoons: 'tsp',
        cups: 'cup',
        kilograms: 'kg',
        liters: 'l'
      },

      // Status indicators
      status: {
        available: 'Available',
        unavailable: 'Unavailable',
        containsAllergens: 'Contains Allergens',
        toBeAdded: 'To be added',
        toBeRemoved: 'To be removed',
        selected: 'Selected',
        unselected: 'Unselected'
      },

      // Allergen information
      allergenInfo: {
        count: '{{count}} allergen',
        count_plural: '{{count}} allergens',
        details: 'Allergen details',
        warning: 'This ingredient contains allergens'
      },

      // Loading states
      loading: {
        ingredients: 'Loading ingredients...',
        saving: 'Saving ingredients...',
        data: 'Loading data...'
      },

      // Empty states
      emptyState: {
        noIngredients: 'No ingredients added yet.',
        noSearchResults: 'No ingredients found matching search criteria.',
        noAvailableIngredients: 'No available ingredients found.'
      },

      // Buttons
      buttons: {
        cancel: 'Cancel',
        skip: 'Skip',
        save: 'Save',
        saveIngredients: 'Save Ingredients',
        saving: 'Saving...',
        add: 'Add Ingredients',
        update: 'Update Ingredients'
      },

      // Footer
      footer: {
        totalCount: 'Total: {{count}} ingredients',
        selectedInfo: '{{selected}} of {{total}} selected'
      },

      // Error messages
      errors: {
        loadingData: 'An error occurred while loading ingredient data.',
        savingIngredients: 'An error occurred while saving ingredients. Please try again.',
        quantityRequired: 'All ingredients must have a quantity greater than 0.',
        unitRequired: 'All ingredients must have a unit selected.',
        networkError: 'Network connection error. Check your connection and try again.',
        serverError: 'A server error occurred. Please try again later.',
        general: 'An unexpected error occurred. Please try again.',
        invalidQuantity: 'Please enter a valid quantity',
        ingredientNotFound: 'Ingredient not found',
        permissionDenied: 'You do not have permission to modify ingredients'
      },

      // Success messages
      success: {
        ingredientsSaved: 'Ingredients saved successfully',
        ingredientsUpdated: 'Ingredients updated successfully',
        ingredientAdded: 'Ingredient added successfully',
        ingredientRemoved: 'Ingredient removed successfully'
      },

      // Validation messages
      validation: {
        quantityMin: 'Quantity must be greater than 0',
        quantityMax: 'Quantity must be less than 1000',
        unitRequired: 'Please select a unit',
        ingredientRequired: 'Please select at least one ingredient'
      },

      // Accessibility
      accessibility: {
        closeModal: 'Close ingredient selection modal',
        searchInput: 'Search for ingredients',
        quantityInput: 'Enter ingredient quantity',
        unitSelect: 'Select measurement unit',
        ingredientCheckbox: 'Select ingredient',
        selectedIndicator: 'Ingredient selected',
        allergenWarning: 'Contains allergens',
        availabilityStatus: 'Availability status'
      }
  },

  ProductIngredientUpdateModal: {
  title: 'Update Ingredients',
  searchPlaceholder: 'Search ingredients...',
  selectedCount: 'ingredients selected',
  loadingIngredients: 'Loading ingredients...',
  noIngredientsFound: 'No ingredients found',
  noIngredientsFoundSearch: 'No ingredients found matching search criteria',
  unit: 'Unit:',
  price: 'Price:',
  quantity: 'Quantity',
  cancel: 'Cancel',
  save: 'Save',
  saving: 'Saving...',
  errors: {
    loadingIngredients: 'An error occurred while loading ingredients',
    savingIngredients: 'An error occurred while saving ingredients'
  },
  accessibility: {
    closeModal: 'Close update ingredients modal',
    formTitle: 'Update product ingredients form',
    searchInput: 'Search for ingredients',
    ingredientToggle: 'Toggle ingredient selection',
    quantityInput: 'Enter ingredient quantity',
    selectedIndicator: 'Ingredient selected',
    unselectedIndicator: 'Ingredient not selected',
    ingredientCard: 'Ingredient selection card',
    saveButton: 'Save ingredient changes',
    cancelButton: 'Cancel ingredient update'
  }
  },
  SortableCategory: {
    product: 'product',
    products: 'products', 
    editCategory: 'Edit category',
    deleteCategory: 'Delete category',
    reorderingProducts: 'Saving product order...',
    noCategoryProducts: 'No products in this category yet.',
    expandCategory: 'Expand category',
    collapseCategory: 'Collapse category',
    dragCategory: 'Drag to reorder category',
    accessibility: {
      categoryActions: 'Category actions',
      productCount: 'Product count',
      expandToggle: 'Toggle category expansion',
      editCategoryButton: 'Edit category',
      deleteCategoryButton: 'Delete category',
      dragHandle: 'Drag handle to reorder category',
      categoryCard: 'Category card',
      emptyCategory: 'Empty category',
      reorderingStatus: 'Category is being reordered'
    }
  },
  SortableProduct: {
    outOfStock: 'Out of Stock',
    loadingIngredients: 'Loading ingredients...',
    ingredients: 'Ingredients',
    noIngredients: 'No ingredients added',
    loadingAddons: 'Loading addons...',
    addons: 'Addons',
    noAddons: 'No addons added',
    manageAddons: 'Manage addons',
    editProduct: 'Edit product',
    deleteProduct: 'Delete product',
    dragProduct: 'Drag to reorder product',
    allergenic: 'Contains allergens',
    recommended: 'Recommended',
    price: 'Price',
    errors: {
      loadingIngredients: 'An error occurred while loading ingredients.',
      loadingAddons: 'An error occurred while loading addons.'
    },
    accessibility: {
      productImage: 'Product image',
      productCard: 'Product card',
      productActions: 'Product actions',
      dragHandle: 'Drag handle to reorder product',
      outOfStockBadge: 'Product is out of stock',
      ingredientsList: 'Product ingredients list',
      addonsList: 'Product addons list',
      allergenWarning: 'Contains allergens',
      recommendedAddon: 'Recommended addon',
      editButton: 'Edit product',
      deleteButton: 'Delete product',
      addonsButton: 'Manage product addons'
    }
  },
  IngredientsContent: {
    // Search and filters
    searchPlaceholder: 'Search ingredients...',
    filter: 'Filter',
    sort: 'Sort',
    newIngredient: 'New Ingredient',
    
    // Table headers
    ingredientName: 'Ingredient Name',
    status: 'Status',
    allergenInfo: 'Allergen Information',
    actions: 'Actions',
    
    // Status labels
    available: 'Available',
    unavailable: 'Unavailable',
    containsAllergens: 'Contains Allergens',
    noAllergens: 'No Allergens',
    
    // Actions
    edit: 'Edit',
    delete: 'Delete',
    
    // Empty states
    noIngredientsFound: 'No ingredients found matching search criteria.',
    noIngredientsYet: 'No ingredients added yet.',
    
    // Delete modal
    deleteIngredient: 'Delete Ingredient',
    deleteConfirmMessage: 'Are you sure you want to delete "{name}" ingredient?',
    deleteError: 'An error occurred during deletion. Please try again.',
    cancel: 'Cancel',
    deleting: 'Deleting...',
    
    // Form modal
    editIngredient: 'Edit Ingredient',
    addNewIngredient: 'Add New Ingredient',
    basicInfo: 'Basic Information',
    ingredientNameRequired: 'Ingredient name is required',
    enterIngredientName: 'Enter ingredient name',
    containsAllergensCheckbox: 'Contains Allergens',
    availableForUse: 'Available for Use',
    allergenInfoContent: 'Allergen Information',
    selectAllergensMessage: 'Select allergens contained in this ingredient:',
    enableAllergenMessage: 'Check "Contains Allergens" first to select allergens.',
    allergenDetails: 'Allergen Details',
    containsThisAllergen: 'Contains this allergen',
    additionalNotes: 'Additional notes (optional)',
    updateError: 'An error occurred while updating ingredient.',
    createError: 'An error occurred while adding ingredient.',
    updating: 'Updating...',
    adding: 'Adding...',
    update: 'Update',
    add: 'Add',
    
    accessibility: {
      ingredientsTable: 'Ingredients management table',
      searchInput: 'Search ingredients',
      filterButton: 'Filter ingredients',
      sortButton: 'Sort ingredients',
      addButton: 'Add new ingredient',
      editButton: 'Edit ingredient',
      deleteButton: 'Delete ingredient',
      ingredientCard: 'Ingredient information card',
      allergenSelection: 'Allergen selection',
      formModal: 'Ingredient form modal',
      deleteModal: 'Delete confirmation modal',
      statusBadge: 'Ingredient status',
      allergenBadge: 'Allergen information',
      closeModal: 'Close modal',
      dragToReorder: 'Drag to reorder'
    }
  },
  TableCard: {
    active: 'Active',
    inactive: 'Inactive',
    occupied: 'Occupied',
    empty: 'Empty',
    capacity: 'Person',
    capacityPlural: 'People',
    edit: 'Edit',
    downloadQR: 'Download QR Code',
    disable: 'Disable',
    enable: 'Activate',
    delete: 'Delete',
    viewQRCode: 'View QR Code',
    moreOptions: 'More options',
    accessibility: {
      tableCard: 'Table information card',
      statusBadge: 'Table status',
      occupancyBadge: 'Table occupancy status',
      actionsMenu: 'Table actions menu',
      qrCodePreview: 'QR code preview',
      editButton: 'Edit table',
      downloadButton: 'Download QR code',
      toggleButton: 'Toggle table status',
      deleteButton: 'Delete table'
    }
  },
  QRCodeModal: {
    // Step selection
    tableAddOption: 'Table Adding Option',
    howToAddTables: 'How would you like to add tables?',
    singleTable: 'Add Single Table',
    bulkTable: 'Add Multiple Tables',
    createSingleTable: 'Create a single table',
    createMultipleTables: 'Create multiple tables',
    
    // Branch selection
    branchSelection: 'Branch Selection',
    selectBranch: 'Select Branch',
    branchRequired: 'Required',
    loadingBranches: 'Loading branches...',
    
    // Single table form
    editTable: 'Edit Table',
    addSingleTable: 'Add Single Table',
    tableName: 'Table Name',
    tableNamePlaceholder: 'e.g. Table 1',
    autoNameNote: 'Automatic name will be given if left empty',
    tableCategory: 'Table Category',
    selectCategory: 'Select Category',
    loadingCategories: 'Loading categories...',
    noCategories: 'No categories found',
    capacity: 'Capacity',
    capacityPlaceholder: 'Number of people',
    displayOrder: 'Display Order',
    displayOrderPlaceholder: 'Number for ordering',
    autoOrderNote: 'Automatic ordering will be applied if left empty',
    tableActive: 'Table should be active',
    
    // Bulk table form
    addBulkTables: 'Add Multiple Tables',
    categoryQuantities: 'Category-based Table Quantities',
    addCategory: 'Add Category',
    category: 'Category',
    tableCount: 'Table Count',
    allTablesActive: 'All tables should be active',
    tableSummary: 'Tables to be Created Summary:',
    total: 'Total',
    tables: 'tables',
    
    // Actions
    cancel: 'Cancel',
    adding: 'Adding...',
    addTable: 'Add Table',
    update: 'Update',
    updating: 'Updating...',
    creating: 'Creating... ({count} tables)',
    createTables: '{count} Create Tables',
    
    // Validation
    branchRequiredValidation: 'Branch selection is required',
    categoryRequired: 'At least one category is required',
    
    accessibility: {
      modal: 'Table creation modal',
      stepSelection: 'Table creation method selection',
      branchSelector: 'Branch selection dropdown',
      categorySelector: 'Table category selection',
      tableForm: 'Table creation form',
      bulkForm: 'Bulk table creation form',
      backButton: 'Go back to previous step',
      closeButton: 'Close modal'
    }
  },

  TableCategoryModal: {
    title: 'Add Table Category',
    subtitle: 'Create a new table category',
    categoryName: 'Category Name',
    categoryNamePlaceholder: 'e.g. VIP Tables, Garden Tables',
    description: 'Description (Optional)',
    descriptionPlaceholder: 'Brief description about the category...',
    colorSelection: 'Color Selection',
    customColor: 'Custom color',
    iconSelection: 'Icon Selection',
    branchSelection: 'Branch Selection',
    cancel: 'Cancel',
    addCategory: 'Add Category',
    saving: 'Saving...',
    
    // Icons
    table: 'Table',
    chair: 'Chair',
    service: 'Service',
    label: 'Label',
    layer: 'Layer',
    
    // Validation errors
    categoryNameRequired: 'Category name is required',
    iconRequired: 'You must select an icon',
    branchRequired: 'Branch selection is required',
    invalidData: 'Invalid data sent',
    unauthorized: 'You are not authorized. Please log in again.',
    forbidden: 'You do not have permission for this operation.',
    branchNotFound: 'Selected branch not found.',
    serverError: 'Server error occurred. Please try again later.',
    unexpectedError: 'An unexpected error occurred while adding category',
    
    accessibility: {
      modal: 'Table category creation modal',
      colorPalette: 'Color selection palette',
      colorPreset: 'Preset color option',
      customColorPicker: 'Custom color picker',
      iconGrid: 'Icon selection grid',
      iconOption: 'Icon selection option',
      branchDropdown: 'Branch selection dropdown',
      form: 'Category creation form'
    }
  },

  AddQRCodeCard: {
    title: 'Add New Table',
    subtitle: 'Click to add a new table',
    accessibility: {
      addButton: 'Add new table button',
      addCard: 'Add new table card'
    }
  },
  // translations/en/userManagement.ts
  userManagementPage: {
    // Page header and navigation
    title: 'User Management',
    loading: 'Loading...',
    error: {
      title: 'Error',
      loadFailed: 'Failed to load users',
      rolesLoadFailed: 'Failed to load roles',
      retry: 'Try Again',
      createUserFailed: 'Failed to create user',
      createRoleFailed: 'Failed to create role'
    },

    // Statistics
    stats: {
      total: 'Total',
      active: 'Active',
      users: 'users',
      roles: 'roles',
      system: 'System',
      custom: 'Custom',
      totalUsers: 'Total Users',
      owner: 'Owner',
      manager: 'Manager',
      staff: 'Staff'
    },

    // Tabs
    tabs: {
      users: 'Users',
      roles: 'Roles'
    },

    // Controls and filters
    controls: {
      search: 'Search user, email or phone...',
      searchRoles: 'Search role, description or category...',
      filterAll: 'All Categories',
      filterOwner: 'Restaurant Owner',
      filterManager: 'Branch Manager',
      filterStaff: 'Staff',
      filterActive: 'Active Users',
      filterInactive: 'Inactive Users',
      addUser: 'Add User',
      addRole: 'Add Role'
    },

    // Table headers
    table: {
      user: 'User',
      contact: 'Contact',
      roles: 'Roles',
      location: 'Restaurant/Branch',
      status: 'Status',
      registrationDate: 'Registration Date',
      actions: 'Actions',
      role: 'Role',
      description: 'Description',
      statistics: 'Statistics',
      position: 'Location'
    },

    // Status indicators
    status: {
      active: 'Active',
      inactive: 'Inactive',
      enabled: 'Enabled',
      disabled: 'Disabled',
      systemRole: 'System Role'
    },

    // Role types
    roleTypes: {
      RestaurantOwner: 'Owner',
      BranchManager: 'Manager',
      Staff: 'Staff'
    },

    // Actions menu
    actions: {
      viewDetails: 'View Details',
      edit: 'Edit',
      activate: 'Activate',
      deactivate: 'Deactivate'
    },

    // No results messages
    noResults: {
      usersNotFound: 'No Users Found',
      rolesNotFound: 'No Roles Found',
      usersEmpty: 'No users have been added yet.',
      rolesEmpty: 'No roles have been added yet.',
      searchEmpty: 'No users found matching your search criteria.',
      searchEmptyRoles: 'No roles found matching your search criteria.'
    },

    // Create Role Modal
    createRole: {
      title: 'Create New Role',
      basicInfo: 'Basic Information',
      roleName: 'Role Name',
      roleNamePlaceholder: 'e.g.: Branch Manager',
      category: 'Category',
      categoryPlaceholder: 'e.g.: Management',
      description: 'Description',
      descriptionPlaceholder: 'Describe the role duties and responsibilities...',
      restaurantId: 'Restaurant ID',
      restaurantIdPlaceholder: 'Default: Current restaurant',
      branchId: 'Branch ID',
      branchIdPlaceholder: 'Empty: All branches',
      isActive: 'Role should be active',
      permissions: 'Permissions',
      permissionsSelected: 'selected',
      cancel: 'Cancel',
      create: 'Create Role',
      creating: 'Creating...',
      validation: {
        nameRequired: 'Role name must be at least 3 characters',
        nameMaxLength: 'Role name can be maximum 50 characters',
        descriptionMaxLength: 'Description can be maximum 200 characters',
        categoryMaxLength: 'Category can be maximum 50 characters'
      }
    },

    // Create User Modal
    createUser: {
      title: 'Create New User',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      passwordInfo: 'Password Information',
      locationInfo: 'Location Information',
      roleAssignment: 'Authority and Role Assignment',
      
      // Form fields
      firstName: 'First Name',
      firstNamePlaceholder: 'e.g.: John',
      lastName: 'Last Name',
      lastNamePlaceholder: 'e.g.: Doe',
      userName: 'Username',
      userNamePlaceholder: 'Will be auto-generated',
      userNameHint: 'If left empty, it will be automatically created in firstname.lastname format',
      email: 'Email',
      emailPlaceholder: 'john@example.com',
      phone: 'Phone',
      phonePlaceholder: '+1 555 123 4567',
      password: 'Password',
      passwordPlaceholder: 'At least 6 characters',
      passwordConfirm: 'Confirm Password',
      passwordConfirmPlaceholder: 'Re-enter your password',
      
      // Location
      locationType: 'Location Type',
      restaurant: 'Restaurant',
      branch: 'Branch',
      restaurantId: 'Restaurant ID',
      restaurantIdPlaceholder: 'e.g.: 123',
      branchId: 'Branch ID',
      branchIdPlaceholder: 'e.g.: 456',
      profileImage: 'Profile Image URL',
      profileImagePlaceholder: 'https://example.com/avatar.jpg',
      userCreatorId: 'Creator User ID',
      userCreatorIdPlaceholder: 'Current user ID',
      
      // Role assignment
      assignmentType: 'Assignment Type',
      rolesSelection: 'Select from Existing Roles (Recommended)',
      permissionsSelection: 'Direct Permission Selection (Currently not supported)',
      apiWarning: '⚠️ API only supports role-based user creation. Create roles first, then assign them to users.',
      rolesLabel: 'Roles',
      rolesSelected: 'selected',
      
      // No roles state
      noRoles: {
        title: 'No roles defined yet',
        description: 'Create roles from the roles tab before creating users',
        tip: '💡 Tip: Switch to "Roles" tab first to create necessary roles',
        warning: 'Role Required',
        warningDescription: 'At least one role must be defined to create a user. You can create new roles from the "Roles" tab.'
      },
      
      isActive: 'User should be active',
      cancel: 'Cancel',
      create: 'Create User',
      creating: 'Creating...',
      createRoleFirst: 'Create Role First',
      
      // Validation messages
      validation: {
        nameRequired: 'First name is required',
        nameMaxLength: 'First name can be maximum 50 characters',
        surnameRequired: 'Last name is required',
        surnameMaxLength: 'Last name can be maximum 50 characters',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        passwordRequired: 'Password must be at least 6 characters',
        passwordMaxLength: 'Password can be maximum 100 characters',
        passwordConfirmRequired: 'Password confirmation is required',
        passwordMismatch: 'Passwords do not match',
        phoneRequired: 'Phone number is required',
        restaurantIdRequired: 'Please enter a valid restaurant ID',
        branchIdRequired: 'Please enter a valid branch ID',
        rolesRequired: 'You must select at least one role',
        permissionsNotSupported: 'API only supports role-based user creation. Please select from existing roles.'
      }
    },

    // Role details
    roleDetails: {
      userCount: 'User Count',
      permissionCount: 'Permission Count',
      restaurant: 'Restaurant',
      branch: 'Branch',
      noDescription: 'No description available',
      users: 'users',
      permissions: 'permissions'
    },

    // Permission categories
    permissionCategories: {
      'User Management': 'User Management',
      'Restaurant Management': 'Restaurant Management', 
      'Branch Management': 'Branch Management',
      'Order Management': 'Order Management',
      'Product Management': 'Product Management',
      'Analytics': 'Analytics'
    },

    // Success messages
    success: {
      userCreated: 'User created successfully',
      roleCreated: 'Role created successfully',
      userUpdated: 'User updated successfully',
      roleUpdated: 'Role updated successfully'
    },

  },
  BranchtableManagement: {
    title: "Table Management",
    loading : "Loading...",

    batchCreateTables: "batchCreateTables",
    subtitle: "Manage your restaurant tables and categories", 
    tabs: {
      tables: "Tables",
      categories: "Categories",
      statistics: "Statistics",
      batchCreate: "Batch Create"
    },
    buttons: {
      addTable: "Add Table",
      addCategory: "Add Category", 
      batchCreate: "Batch Create",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      refresh: "Refresh",
      selectAll: "Select All",
      clearSelection: "Clear Selection",
      export: "Export",
      import: "Import"
    },
    labels: {
      tableName: "Table Name",
      category: "Category",
      capacity: "Capacity",
      status: "Status",
      occupation: "Occupation",
      displayOrder: "Display Order",
      search: "Search tables...",
      filterByCategory: "Filter by Category",
      viewMode: "View Mode",
      totalTables: "Total Tables",
      activeTables: "Active Tables", 
      occupiedTables: "Occupied Tables",
      availableTables: "Available Tables"
    },
    status: {
      active: "Active",
      inactive: "Inactive",
      occupied: "Occupied",
      available: "Available",
      outOfService: "Out of Service"
    },
    actions: {
      markOccupied: "Mark as Occupied",
      markAvailable: "Mark as Available",
      activate: "Activate", 
      deactivate: "Deactivate",
      viewDetails: "View Details"
    },
    messages: {
      tableCreated: "Table created successfully",
      tableUpdated: "Table updated successfully",
      tableDeleted: "Table deleted successfully", 
      statusUpdated: "Status updated successfully",
      error: "An error occurred",
      noTables: "No tables found",
      confirmDelete: "Are you sure you want to delete this table?",
      loading: "Loading...",
      saving: "Saving...",
      deleting: "Deleting..."
    },
    statistics: {
      title: "Table Statistics",
      occupancyRate: "Occupancy Rate",
      averageCapacity: "Average Capacity",
      categoryBreakdown: "Category Breakdown",
      dailyOccupancy: "Daily Occupancy", 
      peakHours: "Peak Hours"
    },
    forms: {
      createTable: "Create New Table",
      editTable: "Edit Table",
      batchCreateTables: "Create Multiple Tables",
      quantity: "Quantity",
      namePrefix: "Name Prefix",
      startingNumber: "Starting Number"
    },
  },

  BranchTableManagement: {
    header: "Category & Table Management",
    "clearTable": "Clear Table",
    "refreshTable": "Refresh Status", 
    "clearing": "Clearing...",
    loading : "Loading...",
    category : "Category",
    createTables: "Create Tables",
    creatingTables: "Creating...",
   SelectCategory: "Select Category", 
   Capacity: "Capacity",
   Quantity: "Quantity",
    batchCreateTables: "Batch Create Tables",
    subheader: "Manage restaurant categories and tables with accordion view",
    totalCategories: "Total Categories",
    totalTables: "Total Tables",
    occupiedTables: "Occupied Tables",
    availableTables: "Available Tables",
    searchPlaceholder: "Search categories...",
    refresh: "Refresh",
    addCategory: "Add Category",
    addCategoryTitle: "Add New Category",
    multiCategory: "Create multiple tables across different categories at once",
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
        "tableCleared": "Table {{tableName}} has been cleared and is now available",
      "tableOccupied": "Table {{tableName}} status has been updated to occupied",
      "tableClearedGeneric": "Table has been cleared successfully",
      "tableStatusUpdated": "Table status has been updated successfully",
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
            "clearTableFailed": "Failed to clear table. Please try again.",
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
    title: 'Branch Management',
    description: 'Manage your branch information and settings.',
    loading: 'Loading branch information...',
    noBranchFound: 'No branch found',
    uploadLogo: 'Upload Logo',
    status: {
      open: 'Open',
      closed: 'Closed',
      temporarilyClosed: 'Temporarily Closed',
      reopenBranch: 'Reopen Branch',
      temporaryClose: 'Temporary Close'
    },
    
    actions: {
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      deleting: 'Deleting...',
      confirmDelete: 'Confirm Delete',
      deleteWarning: 'Are you sure you want to delete this branch? This action cannot be undone.',
    },
    
    basicInfo: {
      title: 'Basic Information',
      branchName: 'Branch Name',
      whatsappNumber: 'WhatsApp Number',
      email: 'Email',
      notSpecified: 'Not specified'
    },
    
    addressInfo: {
      title: 'Address Information',
      country: 'Country',
      city: 'City',
      street: 'Street',
      postalCode: 'Postal Code',
      region: 'Region'
    },
    
    workingHours: {
      title: 'Working Hours',
      workingDay: 'Working day',
      openTime: 'Open Time',
      closeTime: 'Close Time',
      noWorkingHours: 'No working hours specified',
      days: {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
      }
    },
    
    messages: {
      updateSuccess: 'Branch information updated successfully',
      deleteSuccess: 'Branch deleted successfully',
      temporaryCloseSuccess: 'Branch temporarily closed',
      reopenSuccess: 'Branch reopened',
      updateError: 'Error occurred during update',
      deleteError: 'Error occurred during deletion',
      statusChangeError: 'Error occurred while changing status',
      loadError: 'Error occurred while loading branch information'
    },
    
    placeholders: {
      branchName: 'Enter branch name',
      whatsappNumber: 'Enter WhatsApp number',
      email: 'Enter email address',
      country: 'Enter country',
      city: 'Enter city',
      street: 'Enter street',
      postalCode: 'Enter postal code',
      region: 'Enter region'
    }
  },
  branchCategories: {
    // Header and Stats
    header: 'Branch Categories Management',
    subheader: 'Manage categories and products for Branch {branchId}',
    lastUpdated: 'Last Updated',
    
    stats: {
      availableCategories: 'Available Categories',
      readyToAdd: 'Ready to add',
      activeCategories: 'Active Categories',
      currentlyInBranch: 'Currently in branch',
      selectedCategories: 'Selected Categories',
      toBeAdded: 'To be added',
      selectedProducts: 'Selected Products',
      fromCategories: 'From categories',
      avalibleAddons: 'Available Addons',
    },

    // Tab Navigation
    tabs: {
      addNew: 'Add New',
      manageExisting: 'Manage Existing'
    },

    // Step Progress
    steps: {
      chooseCategories: 'Choose Categories',
      selectProducts: 'Select Products',
      reviewAdd: 'Review & Add',
      finalStep: 'Final step',
      selected: 'selected',
      back: 'Back'
    },

    // Add New Categories
    addCategories: {
      title: 'Choose Categories',
      subtitle: 'Select categories to add to your branch',
      noAvailable: 'No categories available',
      allAdded: 'All available categories have been added to this branch',
      categoriesSelected: 'categories selected',
      clearSelection: 'Clear Selection',
      nextSelectProducts: 'Next: Select Products'
    },

    // Select Products
    selectProducts: {
      title: 'Select Products',
      subtitle: 'Choose products from selected categories',
      selectAll: 'Select All',
      clearAll: 'Clear All',
      noProducts: 'No products found',
      noProductsInCategories: 'Selected categories don\'t have any products',
      available: 'available',
      productsSelectedFrom: 'products selected from',
      categories: 'categories',
      reviewSelection: 'Review Selection'
    },

    // Review and Add
    review: {
      title: 'Review & Add',
      subtitle: 'Review your selection before adding to branch',
      of: 'of',
      productsSelected: 'products selected',
      all: 'All',
      productsWillBeAdded: 'products will be added',
      totalValue: 'Total value',
      selectedProducts: 'Selected Products',
      readyToAdd: 'Ready to add',
      with: 'with',
      availableInBranch: 'Available in Branch',
      startOver: 'Start Over',
      adding: 'Adding...',
      addToBranch: 'Add to Branch'
    },

    // Manage Existing
    manage: {
      title: 'Manage Existing Categories',
      subtitle: 'Manage categories and products in your branch',
      saving: 'Saving...',
      saveOrder: 'Save Order',
      exitReorder: 'Exit Reorder',
      reorder: 'Reorder',
      noCategoriesAdded: 'No categories added',
      noCategoriesAddedDesc: 'No categories have been added to this branch yet',
      addCategories: 'Add Categories',
      original: 'Original:',
      added: 'added',
      available: 'available',
      total: 'Total',
      active: 'Active',
      inactive: 'Inactive',
      protected: 'Protected'
    },

    // Products Section
    products: {
      inCategory: 'Products in Category',
      added: 'Added',
      available: 'Available',
      ingredients: 'ingredients',
      allergens: 'allergens',
      viewDetails: 'View Details',
      removeFromBranch: 'Remove from Branch',
      addToBranch: 'Add to Branch',
      addedToBranch: 'products added to branch',
      moreAvailableToAdd: 'more available to add',
      withDetailedInfo: 'with detailed info',
      products: 'products'
    },

    // Product Details Modal
    productDetails: {
      addedToBranch: 'Added to Branch',
      allergens: 'Allergens',
      contains: 'Contains',
      mayContain: 'May Contain',
      ingredients: 'Ingredients',
      allergenic: 'Allergenic',
      available: 'Available',
      unavailable: 'Unavailable',
      quantity: 'Quantity:',
      ingredientId: 'Ingredient ID:',
      allergenInformation: 'Allergen Information:',
      additionalInformation: 'Additional Information',
      originalProduct: 'Original Product',
      originalPrice: 'Original Price:',
      originalStatus: 'Original Status:',
      originalDisplayOrder: 'Original Display Order:',
      orderDetails: 'Order Details',
      lastUpdated: 'Last Updated:',
      close: 'Close'
    },

    // Common Actions
    actions: {
      refresh: 'Refresh',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      loading: 'Loading...'
    },

    // Search and Filters
    search: {
      categories: 'Search categories...',
      products: 'Search products...'
    },

    // Status
    status: {
      active: 'Active',
      inactive: 'Inactive',
      available: 'Available',
      unavailable: 'Unavailable'
    },

    // Messages
    messages: {
      success: {
        categoryAdded: 'Category added successfully',
        categoryDeleted: 'Category deleted successfully',
        productAdded: 'Product {name} added successfully',
        productRemoved: 'Product {name} removed successfully',
        orderSaved: 'Category order saved successfully'
      },
      error: {
        cannotDelete: 'Cannot delete category "{name}" because it contains {count} products. Please remove all products first.',
        cannotDeleteTooltip: 'Cannot delete: Category contains {count} products. Remove all products first.',
        productNotFound: 'Product not found',
        addingProduct: 'Error adding product',
        removingProduct: 'Error removing product',
        savingOrder: 'Error saving category order',
        loadingCategories: 'Error loading categories',
        loadingProducts: 'Error loading products'
      }
    },

    // Delete Modal
    deleteModal: {
      title: 'Delete Category',
      message: 'Are you sure you want to delete the category "{name}"? This action cannot be undone.',
      confirm: 'Delete',
      cancel: 'Cancel'
    },

    // Placeholders
    placeholders: {
      searchCategories: 'Search categories...',
      searchProducts: 'Search products...'
    }
  },
  profile: {
      title: 'Profile',
      personalInfo: 'Personal Information',
      editProfile: 'Edit Profile',
      accountStatus: {
        active: 'Active Account',
        inactive: 'Inactive Account',
        status: 'Account Status'
      },
      fields: {
        firstName: 'First Name',
        lastName: 'Last Name',
        username: 'Username',
        email: 'Email',
        registrationDate: 'Registration Date',
        restaurantName: 'Restaurant Name',
        status: 'Status'
      },
      restaurant: {
        info: 'Restaurant Information',
        name: 'Restaurant Name',
        status: {
          active: 'Active',
          inactive: 'Inactive'
        }
      },
      permissions: {
        summary: 'Permission Summary',
        totalCategories: 'Total Categories',
        totalPermissions: 'Total Permissions',
        rolesAndPermissions: 'Categories and Permissions',
        systemRole: 'System Role'
      },
      categories: {
        'Category': 'Category Management',
        'BranchCategory': 'Branch Category Management',
        'Product': 'Product Management',
        'BranchProduct': 'Branch Product Management',
        'BranchQRCode': 'QR Code Management',
        'Order': 'Order Management',
        'Restaurant': 'Restaurant Management',
        'Branch': 'Branch Management',
        'Admin': 'Admin Operations'
      },
      permissionNames: {
        'category.create': 'Create Category',
        'category.delete': 'Delete Category',
        'category.update': 'Update Category',
        'category.read': 'View Category',
        'branch.category.create': 'Create Branch Category',
        'branch.category.delete': 'Delete Branch Category',
        'branch.category.update': 'Update Branch Category',
        'branch.category.read': 'View Branch Category',
        'product.create': 'Create Product',
        'product.delete': 'Delete Product',
        'product.update': 'Update Product',
        'product.read': 'View Product',
        'product.edit': 'Edit Product',
        'branch.product.create': 'Create Branch Product',
        'branch.product.delete': 'Delete Branch Product',
        'branch.product.update': 'Update Branch Product',
        'branch.product.read': 'View Branch Product',
        'branch.qrcode.create': 'Create QR Code',
        'branch.qrcode.delete': 'Delete QR Code',
        'branch.qrcode.update': 'Update QR Code',
        'branch.qrcode.read': 'View QR Code',
        'order.create': 'Create Order',
        'order.delete': 'Delete Order',
        'order.update': 'Update Order',
        'order.read': 'View Order',
        'order.view': 'View Order Details',
        'order.cancel': 'Cancel Order',
        'restaurant.create': 'Create Restaurant',
        'restaurant.delete': 'Delete Restaurant',
        'restaurant.update': 'Update Restaurant',
        'restaurant.read': 'View Restaurant',
        'restaurant.user.create': 'Create Restaurant User',
        'restaurant.user.delete': 'Delete Restaurant User',
        'restaurant.user.update': 'Update Restaurant User',
        'restaurant.user.read': 'View Restaurant User',
        'branch.create': 'Create Branch',
        'branch.delete': 'Delete Branch',
        'branch.update': 'Update Branch',
        'branch.read': 'View Branch',
        'branch.user.create': 'Create Branch User',
        'branch.user.delete': 'Delete Branch User',
        'branch.user.update': 'Update Branch User',
        'branch.user.read': 'View Branch User',
        'admin.api.control': 'API Control'
      },
      error: {
        loadFailed: 'Failed to load profile data'
      }
  },
  addonModal: {
      title: 'Configure Addons',
      loading: 'Loading addons...',
      refresh: 'Refresh',
      search: {
        placeholder: 'Search addons by name, description, or category...'
      },
      stats: {
        available: 'Available',
        assigned: 'Assigned', 
        recommended: 'Recommended'
      },
      sections: {
        assignedAddons: 'Assigned Addons',
        availableAddons: 'Available Addons'
      },
      emptyState: {
        title: 'No addons available',
        description: 'Contact restaurant management to define addon combinations for this product',
        productId: 'Product ID:'
      },
      actions: {
        add: 'Add',
        remove: 'Remove',
        configure: 'Configure',
        done: 'Done',
        saveChanges: 'Save Changes'
      },
      status: {
        assigned: 'ASSIGNED',
        recommended: 'Recommended'
      },
      configuration: {
        title: 'Configuration Settings',
        specialPrice: 'Special Price',
        maxQuantity: 'Max Quantity',
        minQuantity: 'Min Quantity',

        marketingText: 'Marketing Text',
        markRecommended: 'Mark as recommended',
        placeholders: {
          marketingText: 'e.g., Popular choice, Best value, Customer favorite...'
        }
      },
      messages: {
        success: {
          addonAdded: 'Addon added successfully',
          addonRemoved: 'Addon removed successfully',
          addonUpdated: 'Addon updated successfully'
        },
        errors: {
          loadFailed: 'Failed to load product addons',
          updateFailed: 'Failed to update addon assignment',
          propertiesFailed: 'Failed to update addon properties'
        }
      },
      footer: {
        summary: 'of',
        addon: 'addon',
        addons: 'addons',
        assigned: 'assigned'
      }
  },
  menu: {
  title: "Menu",
  loading: "Loading Menu",
  loadingSubtitle: "Preparing our delicious selections for you...",
  error: {
    title: "Menu Unavailable",
    tryAgain: "Try Again"
  },
  search: {
    placeholder: "Search for delicious dishes..."
  },
  categories: "Categories",
  ingredients: "Ingredients",
  open: "Open",
  closed: "Closed",
  chefsChoice: "Chef's Choice",
  add: "Add",
  remove: "Remove",
  items: "items",
  item: "item",
  available: "available",
  deliciousItems: "delicious",
  exploreMenu: "Explore Our Menu",
  noResults: "No results found",
  noResultsDesc: "Try different keywords or browse other categories",
  noItemsCategory: "No items in this category",
  noItemsCategoryDesc: "Check other categories for delicious options",
  selectCategory: "Select a category to start exploring our carefully crafted culinary offerings",
  whyChooseUs: {
    title: "Why Choose Us?",
    subtitle: "Experience culinary excellence with our commitment to quality, freshness, and exceptional service",
    freshIngredients: {
      title: "Fresh Ingredients",
      description: "Locally sourced, premium quality ingredients prepared daily"
    },
    fastDelivery: {
      title: "Fast Delivery",
      description: "Quick and reliable delivery service to your doorstep"
    },
    qualityAssured: {
      title: "Quality Assured",
      description: "Rigorous quality control and hygiene standards"
    },
    expertChefs: {
      title: "Expert Chefs",
      description: "Experienced culinary professionals crafting memorable experiences"
    }
  },
  footer: {
    brand: "MenuHub",
    description: "Discover exceptional dining experiences with our curated selection of restaurants and delicious cuisines.",
    quickLinks: "Quick Links",
    services: "Services",
    getInTouch: "Get in Touch",
    visitUs: "Visit Us",
    callUs: "Call Us",
    emailUs: "Email Us",
    copyright: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    poweredBy: "Powered by",
    links: {
      ourMenu: "Our Menu",
      aboutUs: "About Us",
      locations: "Locations",
      reservations: "Reservations",
      specialOffers: "Special Offers",
      giftCards: "Gift Cards"
    },
    services: {
      onlineOrdering: "Online Ordering",
      tableBooking: "Table Booking",
      privateEvents: "Private Events",
      catering: "Catering",
      takeaway: "Takeaway",
      corporateMeals: "Corporate Meals"
    }
  },
    cart: {
    title: 'Cart',
    newOrder: 'New Order',
    orders: 'Orders',
    orderType: 'Order Type',
    table: 'Table:',
    notes: 'Notes:',
    refresh: 'Refresh',
    refreshing: 'Refreshing...',
    remove: 'Remove',
    empty: 'Your cart is empty',
    emptyDesc: 'Start by adding some items to your cart',
    total: 'Total',
    placeOrder: "Place Order",
    proceed: 'Proceed to Order',
    processing: 'Processing...',
    clear: 'Clear Cart',
    item: 'item',
    items: 'items',
    variant: 'variant',
    variants: 'variants',
    plain: 'Plain',
    customized: 'Customized',
    addons: 'Add-ons',
    variantTotal: 'Variant Total',
    quantity: 'Quantity',
    each: 'each',
    min: 'Min',
    max: 'Max',
    qty: 'Qty',
    minQuantityError: 'Minimum quantity for {name} is {min}',
    maxQuantityError: 'Maximum quantity for {name} is {max}',
    decreaseQuantity: 'Decrease quantity',
    increaseQuantity: 'Increase quantity',
      "creating_order": "Creating order...",
"order_created_success": "Order created successfully!",
"order_creation_failed": "Failed to create order. Please try again.",
"sending_whatsapp": "Sending WhatsApp message...",
"whatsapp_sent_success": "WhatsApp message sent successfully!",
"whatsapp_send_failed": "Failed to send WhatsApp message",
"clearing_basket": "Clearing basket...",
"basket_cleared": "Basket cleared successfully!",
"clear_basket_failed": "Failed to clear basket",
"load_order_types_failed": "Failed to load order types",
"confirming_price_changes": "Confirming price changes...",
"price_changes_confirmed": "Price changes confirmed successfully!",
"price_changes_failed": "Failed to confirm price changes",
"session_required": "Session ID required"
  }
  },
  order: {
    form: {
      title: 'Order Details',
      orderType: 'Order Type',
      orderTypeRequired: 'Order type is required',
      selectOrderType: 'Select order type...',
      customerName: 'Customer Name',
      customerNameRequired: 'Customer name is required',
      customerNamePlaceholder: 'Enter customer name',
      deliveryAddress: 'Delivery Address',
      deliveryAddressRequired: 'Delivery address is required for this order type',
      deliveryAddressPlaceholder: 'Enter delivery address',
      phoneNumber: 'Phone Number',
      phoneNumberRequired: 'Phone number is required for this order type',
      phoneNumberPlaceholder: 'Enter phone number',
      specialInstructions: 'Special Instructions',
      specialInstructionsPlaceholder: 'Any special instructions for your order...',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      serviceCharge: 'Service Charge',
      minimumRequired: 'Minimum required',
      estimatedTime: 'Estimated time',
      minutes: 'minutes',
      backToCart: 'Back to Cart',
      createOrder: 'Create Order',
      creating: 'Creating...',
      loadingOrderTypes: 'Loading order types...',
      noOrderTypes: 'No order types available. Please contact support.',
      minimumOrder: 'Minimum order',
      service: 'service',
      minimumOrderError: 'Minimum order amount for {type} is ${amount}. Current total: ${current}'
    },
    validation: {
      fixErrors: 'Please fix the following errors:',
      customerNameRequired: 'Customer name is required',
      orderTypeRequired: 'Please select an order type',
      addressRequired: 'Delivery address is required for this order type',
      phoneRequired: 'Phone number is required for this order type'
    }
  },
  priceChange: {
    title: 'Price Changes Detected',
    description: 'Some items in your basket have price changes that need to be confirmed before proceeding with the order.',
    changesRequired: 'Changes Required:',
    defaultMessage: 'Price updates need to be confirmed to continue.',
    cancel: 'Cancel',
    confirm: 'Confirm & Continue',
    confirming: 'Confirming...'
  },
  "productModal": {
    "customizeOrder": "Customize Your Order",
    "allergenInformation": "Allergen Information",
    "ingredients": "Ingredients",
    "availableAddons": "Available Add-ons",
    "add": "Add",
    "recommended": "Recommended",
    "min": "Min",
    "max": "Max",
    "orderSummary": "Order Summary",
    "quantity": "Quantity",
    "total": "Total",
    "addToCart": "Add to Cart"
  },
  errors: {
    loadingBasket: 'Failed to load basket',
    loadingOrderTypes: 'Failed to load order types',
    removingItem: 'Failed to remove item from basket',
    increasingQuantity: 'Failed to increase item quantity',
    decreasingQuantity: 'Failed to decrease item quantity',
    increasingAddonQuantity: 'Failed to increase addon quantity',
    clearingBasket: 'Failed to clear basket',
    creatingOrder: 'Failed to create order',
    orderAlreadyProcessing: 'This order is already being processed',
    priceChangeDetails: 'Failed to load price change details',
    confirmingPriceChanges: 'Failed to confirm price changes',
    sessionIdRequired: 'Session ID required for price change confirmation',
    addonProductNotFound: 'Could not find addon product ID',
    cartItemNotFound: 'Cart item not found'
  },
  "ordersManager": {
    total : 'Total',
    subTotal:"Sub Total",
    OrderType : 'Order Type',
    serviceFeeApplied:"Service Charge",
    DeliveryAddress : 'Delivery Address',
    OrderNotesInformation : 'Order Notes & Information',
    OrderMetadata: 'Order Metadata',
    ItemCount : 'Item Count',
    TotalItems: 'Total Items',
    OrderTimeline: 'Order Timeline',
    searchPlaceholder:"Write here",
    showAdvancedFilter:"Show Advanced Filters",
    hideAdvancedFilter:"Hide Advanced Filters",
    of:"of",
    orders:"orders",
    clearFilter:"Clear Filters",
    customerName:"Customer Name",
    tableName:"Table Name",
    orderType:"Order type",
    minPrice :"Min Price",
    maxPrice:"Max price",
    Showing:"Showing",
    to:"to",
    perpage : "Per Page",
    cancelOrder:"Cancel Order",
    cancelOrderConfirmation :"Are you sure you want to cancel the order?",
    deletedOrders:"Deleted Orders",
    "title": "Order Management",
    "description": "Easily manage and track your restaurant's orders.",
    "pendingOrders": "Pending Orders",
    "branchOrders": "Branch Orders",
    "allStatuses": "All Statuses",
    "statusFilter": "Status Filter",
    "noOrders": "No {viewMode} orders yet.",
    "customer": "Customer",
    "orderNumber": "Order Number",
    "status": "Status",
    "table": "Table",
    "amount": "Amount",
    "date": "Date",
    "actions": "Actions",
    "viewDetails": "View Details",
    "confirm": "Confirm",
    "reject": "Reject",
    "changeStatus": "Change Status",
    "orderItems": "Order Items",
    "createdAt": "Created At",
    "confirmedAt": "Confirmed At",
    "rowVersion": "Row Version",
    "confirmOrderTitle": "Confirm Order",
    "confirmOrderPrompt": "Are you sure you want to confirm this order?",
    "rejectOrderTitle": "Reject Order",
    "rejectOrderPrompt": "Enter the reason for rejection:",
    "rejectReasonPlaceholder": "Reason for rejection...",
    "updateStatusTitle": "Update Status",
    "updateStatusPrompt": "Are you sure you want to update the order status ?",
    "cancel": "Cancel",
    "confirmAction": "Confirm",
    "rejectAction": "Reject",
    "updateAction": "Update",
    "confirming": "Confirming...",
    "rejecting": "Rejecting...",
    "updating": "Updating...",
    "orderDetailsTitle": "Order Details",
    "successNotification": "Operation Successful",
    "orderConfirmedSuccess": "Order confirmed successfully!",
    "orderRejectedSuccess": "Order rejected successfully!",
    "orderStatusUpdatedSuccess": "Order status updated successfully!",
    "errorInvalidStatusTransition": "Invalid status transition: Please confirm the order first (move to Confirmed status).",
    "errorCannotConfirm": "This order cannot be confirmed. Current status: {currentStatus}.",
    "quantity": "Quantity",
    "unitPrice": "Unit Price",
    "addonPrice": "Addon Price",
    "notes": "Notes",
    "amountLabel": "Total Amount",
    DeliveryInformation: "Delivery Information",
    TableInformation: "Table Information",
    CustomerInformation: "Customer Information",
    CustomerName: "Customer Name",
    PhoneNumber: "Phone Number",
    OrderTag: "Order Tag",
    OrderNotes: "Order Notes",
    MinOrderAmount: "Minimum Order Amount",
    CompletedAt: "Completed At",
    time: "Time",
    Status: "Status",
  },
  "orderService": {
    "statuses": {
      "pending": "Pending",
      "confirmed": "Confirmed",
      "preparing": "Preparing",
      "ready": "Ready",
      "completed": "Completed",
      "delivered": "Delivered",
      "cancelled": "Cancelled",
      "rejected": "Rejected",
      "unknown": "Unknown"
    },
    "errors": {
      "createSessionOrder": "Error creating session order",
      "getPendingOrders": "Error fetching pending orders",
      "getTableOrders": "Error fetching table orders",
      "getOrder": "Error fetching order",
      "getBranchOrders": "Error fetching branch orders",
      "confirmOrder": "Error confirming order",
      "rejectOrder": "Error rejecting order",
      "updateOrderStatus": "Error updating order status",
      "trackOrder": "Error fetching order tracking",
      "getOrderTrackingQR": "Error fetching order tracking QR",
      "smartCreateOrder": "Error creating smart order",
      "getTableBasketSummary": "Error fetching table basket summary",
      "validationError": "Validation error: {errors}",
      "invalidRequest": "Invalid request. Please check the data.",
      "sessionExpired": "Session expired. Please log in again.",
      "unauthorized": "You are not authorized for this action.",
      "orderNotFound": "Order not found.",
      "invalidStatus": "Order status is not suitable for this action.",
      "noInternet": "Check your internet connection.",
      "unknownError": "Unknown error",
      "getOrderTypeText": "Error fetching order type text",
      "getOrderType": "Error fetching order type",
      "getActiveOrderTypes": "Error fetching active order types",
      "getAllOrderTypes": "Error fetching all order types",
      "orderTotalCalculation": "Error calculating order total",
      "getEstimatedTime": "Error fetching estimated delivery time",
      "getOrderTypeByCode": "Error fetching order type by code",
      "getOrderTypesForDisplay": "Error fetching order types for display",
      "unknownOrderType": "Unknown order type"
    }
  },
  branchPreferences: {
  "title": "Branch Preferences",
  "description": "Configure branch-specific settings and preferences",
  "loading": "Loading branch preferences...",
  "saving": "Saving...",
  "refresh": "Refresh",
  "saveChanges": "Save Changes",
  "saveSuccess": "Branch preferences saved successfully!",
  "cleanupModes": {
    "afterTimeout": "After Timeout",
    "afterClosing": "After Closing", 
    "disabled": "Disabled"
  },
  "sections": {
    "orderManagement": {
      "title": "Order Management",
      "description": "Configure how orders are handled and processed",
      "autoConfirmOrders": "Auto Confirm Orders",
      "autoConfirmOrdersDesc": "Automatically confirm incoming orders without manual approval",
      "useWhatsappForOrders": "WhatsApp for Orders",
      "useWhatsappForOrdersDesc": "Enable WhatsApp integration for order notifications"
    },
    "displaySettings": {
      "title": "Display Settings",
      "description": "Configure what information is displayed to customers",
      "showProductDescriptions": "Show Product Descriptions",
      "showProductDescriptionsDesc": "Display detailed product descriptions to customers",
      "enableAllergenDisplay": "Display Allergen Information",
      "enableAllergenDisplayDesc": "Show allergen warnings and information",
      "enableIngredientDisplay": "Display Ingredients",
      "enableIngredientDisplayDesc": "Show ingredient lists for products"
    },
    "paymentMethods": {
      "title": "Payment Methods",
      "description": "Configure accepted payment methods",
      "acceptCash": "Accept Cash Payments",
      "acceptCashDesc": "Allow customers to pay with cash",
      "acceptCreditCard": "Accept Credit Cards",
      "acceptCreditCardDesc": "Allow customers to pay with credit/debit cards",
      "acceptOnlinePayment": "Accept Online Payments",
      "acceptOnlinePaymentDesc": "Allow customers to pay online through digital payment methods"
    },
    "localization": {
      "title": "Localization",
      "description": "Configure language and regional settings",
      "defaultLanguage": "Default Language",
      "defaultCurrency": "Default Currency",
      "timeZone": "Time Zone",
      "supportedLanguages": "Supported Languages"
    },
    "sessionManagement": {
      "title": "Session Management",
      "description": "Configure session timeout and cleanup settings",
      "sessionTimeout": "Session Timeout (Minutes)",
      "cleanupMode": "Cleanup Mode",
      "cleanupDelay": "Cleanup Delay After Close (Minutes)",
          "cleanupModeDesc": "Choose when to cleanup expired sessions",
    "sessionTimeoutDesc": "Minutes before session expires due to inactivity",
    "cleanupDelayDesc": "Minutes to wait after closing before cleanup",
    "cleanupDisabledMessage": "Session cleanup is disabled. Sessions will not be automatically cleaned up."
    }
  },
  "currencies": {
    "TRY": "Turkish Lira (₺)",
    "USD": "US Dollar ($)",
    "EUR": "Euro (€)"
  },
  "languages": {
    "tr": "Turkish",
    "en": "English",
    "ar": "Arabic",
    "de": "German",
    "fr": "French",
    "es": "Spanish",
    "it": "Italian",
    "ru": "Russian",
    "zh": "Chinese",
    "ja": "Japanese"
  },
  "timezones": {
    "Europe/Istanbul": "Istanbul (UTC+3)",
    "Europe/London": "London (UTC+0)",
    "America/New_York": "New York (UTC-5)"
  },
  "errors": {
    "loadFailed": "Failed to load branch preferences",
    "saveFailed": "Failed to save branch preferences",
    "validationError": "Validation error: {errors}",
    "invalidRequest": "Invalid request. Please check the data.",
    "sessionExpired": "Session expired. Please log in again.",
    "unauthorized": "You don't have permission for this action.",
    "notFound": "Branch preferences not found.",
    "conflict": "Data is not up to date. Please refresh the page and try again.",
    "noInternet": "Check your internet connection.",
    "unknownError": "An unknown error occurred",
    "invalidPaymentSettings": "Invalid payment settings. At least one payment method must be selected.",
    "invalidSessionSettings": "Invalid session settings. Please check the values."
  }
  },
  whatsapp: {
  confirmation: {
    title: 'Send to WhatsApp?',
    subtitle: 'Notify restaurant via WhatsApp',
    sendTo: 'Your order details will be sent to:',
    restaurant: 'Restaurant',
    whatWillBeSent: 'What will be sent:',
    orderDetails: '• Your order details and items',
    customerInfo: '• Customer name and table number',
    totalPrice: '• Total price and any special notes',
    timestamp: '• Order timestamp',
    note: 'Note:',
    noteDescription: 'This will open WhatsApp on your device. Your order will still be processed even if you choose not to send to WhatsApp.',
    skipWhatsApp: 'Skip WhatsApp',
    sendToWhatsApp: 'Send to WhatsApp',
    sending: 'Sending...'
  }
  },
  recycleBin: {
    title: 'Recycle Bin',
    titleProducts: 'Deleted Products and Categories',
    titleBranches: 'Deleted Branches',
    titleTables: 'Deleted Tables',
    titleBranchProducts: 'Deleted Branch Products and Categories',
    titleBranchCategories: 'Deleted Branch Categories',
    titleTableCategories: 'Deleted Table Categories',
    description: 'Manage deleted branches, categories, products, and tables',
    descriptionProducts: 'Manage deleted products and categories',
    descriptionBranches: 'Manage deleted branches',
    descriptionTables: 'Manage deleted tables',
    descriptionBranchProducts: 'Manage deleted branch products and categories',
    descriptionBranchCategories: 'Manage deleted branch categories',
    descriptionTableCategories: 'Manage deleted table categories',
    search: 'Search items...',
    filter: {
      all: 'All Items',
      group1: 'All Group 1',
      group2: 'All Group 2',
      group1Label: '📋 Restaurant Level (Branches, Products, Tables)',
      group2Label: '🏢 Branch Level (Branch Products & Categories)',
      branches: 'Branches',
      categories: 'Categories',
      products: 'Products',
      tables: 'Tables',
      branchProducts: 'Branch Products',
      branchCategories: 'Branch Categories',
      tableCategories: 'Table Categories'
    },
    refresh: 'Refresh',
    loading: 'Loading...',
    stats: {
      group1: 'Restaurant Level',
      group1Desc: 'Branches, Products, Tables',
      group2: 'Branch Level',
      group2Desc: 'Branch Products & Categories',
      totalDeleted: 'Total Deleted',
      totalDesc: 'All deleted items',
      filtered: 'Showing',
      filteredDesc: 'Current filter results',
      deletedBranch: 'Deleted Branches',
      deletedCategory: 'Deleted Categories',
      deletedProduct: 'Deleted Products',
      deletedTable: 'Deleted Tables',
      deletedBranchProduct: 'Deleted Branch Products',
      deletedBranchCategory: 'Deleted Branch Categories',
      deletedTableCategory: 'Deleted Table Categories',

    },
    entityTypes: {
      category: 'Category',
      product: 'Product',
      branch: 'Branch',
      table: 'Table',
      branchProduct: 'Branch Product',
      branchCategory: 'Branch Category',
      tableCategory: 'Table Category',
      other: 'Other'
    },
    contextInfo: {
      category: 'Category:',
      branch: 'Branch:',
      restaurant: 'Restaurant:'
    },
    deletedAt: 'Deleted:',
    restore: {
      button: 'Restore',
      restoring: 'Restoring...',
      successCategory: '"{name}" category has been restored successfully',
      successProduct: '"{name}" product has been restored successfully',
      successBranch: '"{name}" branch has been restored successfully',
      successTable: '"{name}" table has been restored successfully',
      successBranchCategory: '"{name}" branch category has been restored successfully',
      successTableCategory: '"{name}" table category has been restored successfully',
      error: 'Restore operation failed'
    },
    empty: {
      title: 'Recycle bin is empty',
      titleFiltered: 'No results found',
      description: 'No deleted items found yet',
      descriptionFiltered: 'No deleted items match your search criteria'
    },
    errors: {
      loadingError: 'Error loading deleted items'
    }
  },
  "management": {
      "title": "Management Information",
      "subtitle": "Company and legal details",
      "noDataTitle": "No Management Information",
      "noDataMessage": "Management information has not been set up yet. Please add restaurant details to get started.",
      
      "buttons": {
        "edit": "Edit",
        "cancel": "Cancel",
        "save": "Save Changes",
        "saving": "Saving Changes..."
      },

      "sections": {
        "restaurantDetails": "Restaurant Details",
        "companyInfo": "Company Information",
        "taxInfo": "Tax & Registration",
        "certificates": "Certificates & Permits",
        "additionalSettings": "Additional Settings"
      },

      "fields": {
        "restaurantName": "Restaurant Name",
        "restaurantLogo": "Restaurant Logo",
        "companyTitle": "Company Title",
        "legalType": "Legal Type",
        "taxNumber": "Tax Number",
        "taxOffice": "Tax Office",
        "mersisNumber": "MERSIS Number",
        "tradeRegistry": "Trade Registry Number",
        "workPermit": "Work Permit",
        "foodCertificate": "Food Certificate",
        "alcoholService": "Has Alcohol Service",
        "logo": "Logo"
      },

      "placeholders": {
        "restaurantName": "Enter restaurant name",
        "companyTitle": "Enter company title",
        "taxNumber": "Enter tax number",
        "taxOffice": "Enter tax office",
        "mersisNumber": "Enter MERSIS number",
        "tradeRegistry": "Enter trade registry number",
        "selectLegalType": "Select Legal Type"
      },

      "legalTypes": {
        "llc": "LLC",
        "corporation": "Corporation",
        "partnership": "Partnership"
      },

      "status": {
        "uploaded": "Uploaded",
        "notUploaded": "Not uploaded",
        "available": "Available",
        "notAvailable": "Not Available",
        "alcoholService": "Alcohol Service:"
      },

      "common": {
        "na": "N/A"
      }
    },
  "branches": {
  "status": {
    "active": "Active",
    "inactive": "Inactive"
  },
  "fields": {
    "branchType": "Branch Type",
    "branchTag": "Branch Tag"
  }
  },
  "restaurantsTab": {
    "status": {
      "active": "Active",
      "inactive": "Inactive"
    },
    "actions": {
      "edit": "Edit Restaurant",
      "delete": "Delete Restaurant"
    },
    "stats": {
      "totalBranches": "Total Branches",
      "active": "Active",
      "inactive": "Inactive",
      "alcohol": "Alcohol"
    },
    "common": {
      "yes": "Yes",
      "no": "No"
    },
    "modal": {
      "editTitle": "Edit Restaurant",
      "placeholders": {
        "restaurantName": "Restaurant Name",
        "cuisineType": "Cuisine Type"
      },
      "labels": {
        "hasAlcoholService": "Has Alcohol Service"
      },
      "buttons": {
        "update": "Update Restaurant",
        "updating": "Updating..."
      }
    }
  },
  "tabs": {
    "restaurants": "Restaurants",
    "branches": "Branches",
    "management": "Management Info",
    "deleted": "Deleted"
  },
    "allergens": {
    "GLUTEN": {
      "name": "Gluten",
      "description": "Wheat, rye, barley, oats"
    },
    "CRUSTACEANS": {
      "name": "Crustaceans",
      "description": "Prawns, crabs, lobster"
    },
    "EGGS": {
      "name": "Eggs",
      "description": "Eggs and egg products"
    },
    "FISH": {
      "name": "Fish",
      "description": "All fish products"
    },
    "PEANUTS": {
      "name": "Peanuts",
      "description": "Peanuts and peanut products"
    },
    "SOYBEANS": {
      "name": "Soybeans",
      "description": "Soya and soya products"
    },
    "MILK": {
      "name": "Milk",
      "description": "Milk and dairy products"
    },
    "NUTS": {
      "name": "Tree Nuts",
      "description": "Almonds, hazelnuts, walnuts, cashews, etc."
    },
    "CELERY": {
      "name": "Celery",
      "description": "Celery and celeriac"
    },
    "MUSTARD": {
      "name": "Mustard",
      "description": "Mustard and mustard products"
    },
    "SESAME": {
      "name": "Sesame",
      "description": "Sesame seeds and products"
    },
    "SULPHITES": {
      "name": "Sulphites",
      "description": "Sulphur dioxide and sulphites (>10mg/kg)"
    },
    "LUPIN": {
      "name": "Lupin",
      "description": "Lupin and lupin products"
    },
    "MOLLUSCS": {
      "name": "Molluscs",
      "description": "Clams, mussels, oysters, snails, squid"
    }
  }
}; 