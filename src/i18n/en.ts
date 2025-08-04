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
    products: {
      title: 'Products',
      description: 'View and manage your products.'
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
      }
    },
    sidebar: {
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

  // Branch Management
  branchManagement: {
    loading: 'Loading branches...',
    error: {
      loadFailed: 'An error occurred while loading branch list.',
      updateFailed: 'An error occurred while updating branch.',
      createFailed: 'An error occurred while creating branch.',
      deleteFailed: 'An error occurred while deleting branch.',
      restaurantIdNotFound: 'Restaurant ID not found. Please login again.',
      noBranchesFound: 'No branches found'
    },
    actions: {
      addBranch: 'Add Branch',
      editBranch: 'Edit Branch',
      deleteBranch: 'Delete Branch',
      selectBranch: 'Select Branch',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close'
    },
    confirmation: {
      deleteTitle: 'Delete Branch',
      deleteMessage: 'Are you sure you want to delete this branch? This action cannot be undone.',
      deleteConfirm: 'Yes, Delete',
      deleteCancel: 'Cancel'
    },
    form: {
      branchName: 'Branch Name',
      whatsappNumber: 'WhatsApp Number',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      workingHours: 'Working Hours',
      logo: 'Logo'
    }
  },

  // Table Management
  tableManagement: {
    loading: 'Loading tables...',
    title: 'Table Management',
    description: 'Manage your QR codes and tables',
    error: {
      loadFailed: 'Failed to load branch list',
      dataLoadFailed: 'An error occurred while loading data'
    },
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

  // Profile
  profile: {
    title: 'Profile',
    description: 'View and edit your personal information',
    error: {
      loadFailed: 'Failed to load profile data'
    },
    personalInfo: 'Personal Information',
    accountSettings: 'Account Settings',
    security: 'Security',
    preferences: 'Preferences',
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      changePassword: 'Change Password',
      updateProfile: 'Update Profile'
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

  // Products
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
  }
}; 