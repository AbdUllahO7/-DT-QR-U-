export interface LanguageOption {
  code: string;
  displayName: string;
  nativeName: string;
  isRtl: boolean;
  flag: string;
}

export const availableLanguages: LanguageOption[] = [
  {
    code: "sq",
    displayName: "Albanian",
    nativeName: "Shqip",
    isRtl: false,
    flag: "🇦🇱"
  },
  {
    code: "ar",
    displayName: "Arabic",
    nativeName: "العربية",
    isRtl: true,
    flag: "🇸🇦"
  },
  {
    code: "az",
    displayName: "Azerbaijani",
    nativeName: "Azərbaycan",
    isRtl: false,
    flag: "🇦🇿"
  },
  {
    code: "bs",
    displayName: "Bosnian",
    nativeName: "Bosanski",
    isRtl: false,
    flag: "🇧🇦"
  },
  {
    code: "bg",
    displayName: "Bulgarian",
    nativeName: "Български",
    isRtl: false,
    flag: "🇧🇬"
  },
  {
    code: "zh-CN",
    displayName: "Chinese (Simplified)",
    nativeName: "中文（简体）",
    isRtl: false,
    flag: "🇨🇳"
  },
  {
    code: "zh-TW",
    displayName: "Chinese (Traditional)",
    nativeName: "中文（繁體）",
    isRtl: false,
    flag: "🇹🇼"
  },
  {
    code: "hr",
    displayName: "Croatian",
    nativeName: "Hrvatski",
    isRtl: false,
    flag: "🇭🇷"
  },
  {
    code: "cs",
    displayName: "Czech",
    nativeName: "Čeština",
    isRtl: false,
    flag: "🇨🇿"
  },
  {
    code: "nl",
    displayName: "Dutch",
    nativeName: "Nederlands",
    isRtl: false,
    flag: "🇳🇱"
  },
  {
    code: "en",
    displayName: "English",
    nativeName: "English",
    isRtl: false,
    flag: "🇺🇸"
  },
  {
    code: "fr",
    displayName: "French",
    nativeName: "Français",
    isRtl: false,
    flag: "🇫🇷"
  },
  {
    code: "ka",
    displayName: "Georgian",
    nativeName: "ქართული",
    isRtl: false,
    flag: "🇬🇪"
  },
  {
    code: "de",
    displayName: "German",
    nativeName: "Deutsch",
    isRtl: false,
    flag: "🇩🇪"
  },
  {
    code: "el",
    displayName: "Greek",
    nativeName: "Ελληνικά",
    isRtl: false,
    flag: "🇬🇷"
  },
  {
    code: "hi",
    displayName: "Hindi",
    nativeName: "हिन्दी",
    isRtl: false,
    flag: "🇮🇳"
  },
  {
    code: "hu",
    displayName: "Hungarian",
    nativeName: "Magyar",
    isRtl: false,
    flag: "🇭🇺"
  },
  {
    code: "id",
    displayName: "Indonesian",
    nativeName: "Bahasa Indonesia",
    isRtl: false,
    flag: "🇮🇩"
  },
  {
    code: "it",
    displayName: "Italian",
    nativeName: "Italiano",
    isRtl: false,
    flag: "🇮🇹"
  },
  {
    code: "ja",
    displayName: "Japanese",
    nativeName: "日本語",
    isRtl: false,
    flag: "🇯🇵"
  },
  {
    code: "ko",
    displayName: "Korean",
    nativeName: "한국어",
    isRtl: false,
    flag: "🇰🇷"
  },
  {
    code: "fa",
    displayName: "Persian",
    nativeName: "فارسی",
    isRtl: true,
    flag: "🇮🇷"
  },
  {
    code: "pl",
    displayName: "Polish",
    nativeName: "Polski",
    isRtl: false,
    flag: "🇵🇱"
  },
  {
    code: "pt",
    displayName: "Portuguese",
    nativeName: "Português",
    isRtl: false,
    flag: "🇵🇹"
  },
  {
    code: "ro",
    displayName: "Romanian",
    nativeName: "Română",
    isRtl: false,
    flag: "🇷🇴"
  },
  {
    code: "ru",
    displayName: "Russian",
    nativeName: "Русский",
    isRtl: false,
    flag: "🇷🇺"
  },
  {
    code: "sr",
    displayName: "Serbian",
    nativeName: "Srpski",
    isRtl: false,
    flag: "🇷🇸"
  },
  {
    code: "sk",
    displayName: "Slovak",
    nativeName: "Slovenčina",
    isRtl: false,
    flag: "🇸🇰"
  },
  {
    code: "es",
    displayName: "Spanish",
    nativeName: "Español",
    isRtl: false,
    flag: "🇪🇸"
  },
  {
    code: "th",
    displayName: "Thai",
    nativeName: "ไทย",
    isRtl: false,
    flag: "🇹🇭"
  },
  {
    code: "tr",
    displayName: "Turkish",
    nativeName: "Türkçe",
    isRtl: false,
    flag: "🇹🇷"
  },
  {
    code: "uk",
    displayName: "Ukrainian",
    nativeName: "Українська",
    isRtl: false,
    flag: "🇺🇦"
  }
];

// Get language codes that have translation files
export const getLanguagesWithTranslations = (): string[] => {
  return ['en', 'tr', 'ar'];
};

// Check if a language has a translation file
export const hasTranslationFile = (code: string): boolean => {
  return getLanguagesWithTranslations().includes(code);
};
