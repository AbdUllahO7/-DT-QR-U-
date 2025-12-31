export interface LanguageOptionDto {
  code: string;
  displayName: string;
  nativeName: string;
  isRtl: boolean;
}

export interface BranchLanguagesDto {
  branchId: number;
  defaultLanguage: string;
  availableLanguages: LanguageOptionDto[];
}
