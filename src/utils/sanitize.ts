export const sanitizePlaceholder = (value?: string | null, placeholder: string = 'string'): string => {
  if (!value) return '';
  return value.toLowerCase() === placeholder ? '' : value;
}; 