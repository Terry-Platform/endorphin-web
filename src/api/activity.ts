import { apiGet } from './client';
import { API_ROUTES } from './routes';
import type { ApiUserResponseOrError } from '../types/api';
import type { ActivityData, ActivityType } from '../types/activity';

const activityRoutes: Record<ActivityType, string> = {
  cashback: API_ROUTES['user.activity.cashback'],
  bonus: API_ROUTES['user.activity.bonus'],
  referral: API_ROUTES['user.activity.referral'],
};

export async function fetchActivity(
  type: ActivityType,
  monthyear: string,
): Promise<ApiUserResponseOrError<ActivityData>> {
  return apiGet(`${activityRoutes[type]}${monthyear}`);
}
