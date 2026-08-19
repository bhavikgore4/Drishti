import { apiRequest } from './client';

export interface TriageResult {
  label: string;
  ministry: string;
  category: string;
  subCategory: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  confidence: number;
  signals: string[];
  engine: string;
}

export const triageGrievance = (description: string, filename?: string) =>
  apiRequest<TriageResult>('/api/v1/ml/triage', {
    method: 'POST',
    body: JSON.stringify({ description, filename: filename || null }),
  });
