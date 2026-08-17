import { apiRequest } from './client';
import { RiskHotspot } from '../types';

interface ApiHotspot extends Omit<RiskHotspot, 'category'> { category: string }
export const getHotspots = () => apiRequest<ApiHotspot[]>('/api/v1/disaster/hotspots').then((items) => items as RiskHotspot[]);
