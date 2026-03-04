import { apiGet, apiPost } from './client';
import { API_ROUTES } from './routes';
import type { ApiUserResponseOrError } from '../types/api';
import type { DashboardData } from '../types/dashboard';

export async function fetchDashboard(): Promise<ApiUserResponseOrError<DashboardData>> {
  return apiGet(API_ROUTES['user.dashboard']);
}

export async function changeProject(projectId: number): Promise<ApiUserResponseOrError<DashboardData>> {
  return apiPost(API_ROUTES['user.change.project'], { project_id: projectId });
}
