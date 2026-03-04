import { apiGet } from './client';
import { API_ROUTES } from './routes';
import type { ApiUserResponseOrError } from '../types/api';
import type { SummaryData } from '../types/summary';

export async function fetchCashbackSummary(): Promise<ApiUserResponseOrError<SummaryData>> {
  return apiGet(API_ROUTES['user.summary.cashback']);
}

export async function fetchBonusSummary(): Promise<ApiUserResponseOrError<SummaryData>> {
  return apiGet(API_ROUTES['user.summary.bonus']);
}

export async function fetchReferralSummary(): Promise<ApiUserResponseOrError<SummaryData>> {
  return apiGet(API_ROUTES['user.summary.referral']);
}

export async function fetchClickSummary(): Promise<ApiUserResponseOrError<SummaryData>> {
  return apiGet(API_ROUTES['user.summary.click']);
}

export async function fetchPaymentSummary(): Promise<ApiUserResponseOrError<SummaryData>> {
  return apiGet(API_ROUTES['user.summary.payment']);
}
