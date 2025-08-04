import { useState } from 'react';
import { mediaService } from '../services/mediaService';

/**
 * useLogoUpload
 * Ortak logo/yükleme mantığını kapsüller.
 */
export function useLogoUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadLogo = async (file: File, previousUrl?: string): Promise<string> => {
    setIsUploading(true);
    try {
      const url = await mediaService.uploadFile(file, previousUrl);
      return url;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadLogo, isUploading } as const;
} 