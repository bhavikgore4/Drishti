import { API_BASE_URL, apiRequest } from './client';

export interface ApiGrievance {
  id: string; docketNumber: string; registrationNumber: string; description: string;
  status: string; ministry?: string; category?: string; subCategory?: string; location?: string;
  priority?: string; aiTriaged: boolean; attachmentName?: string; attachmentSize?: string;
  attachmentUrl?: string; createdAt: string;
}
export interface CreateGrievanceInput {
  description: string; category: string; title?: string; ministry?: string; sub_category?: string;
  location?: string; priority?: 'low' | 'medium' | 'high' | 'urgent'; attachment_name?: string;
  attachment_size?: string; attachment_url?: string;
}
export const getGrievances = () => apiRequest<ApiGrievance[]>('/api/v1/grievances');
export const createGrievance = (payload: CreateGrievanceInput) =>
  apiRequest<ApiGrievance>('/api/v1/grievances', { method: 'POST', body: JSON.stringify(payload) });
export const uploadAttachment = (file: File) => {
  const form = new FormData(); form.append('file', file);
  return apiRequest<{ filename: string; sizeBytes: number; url: string }>('/api/v1/uploads', { method: 'POST', body: form })
    .then((upload) => ({ ...upload, url: `${API_BASE_URL}${upload.url}` }));
};
