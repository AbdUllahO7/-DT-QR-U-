import { httpClient } from '../utils/http';
import type { ApiResponse } from '../types/api';

interface UploadResponse {
  filePath: string;
}

class MediaService {
  private baseUrl = '/api/Medias';

  async uploadFile(file: File, previousUrl?: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Eğer previousUrl varsa, onu da gönder
    if (previousUrl) {
      formData.append('previousUrl', previousUrl);
    }

    const response = await httpClient.post(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async deleteFile(filePath: string): Promise<void> {
    await httpClient.delete(`/api/Media/${encodeURIComponent(filePath)}`);
  }
}

export const mediaService = new MediaService(); 