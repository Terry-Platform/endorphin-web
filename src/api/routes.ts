export const API_ROUTES = {
  // Auth
  'auth.csrf': '/auth/csrf-token',
  'auth.login': '/auth/login',
  'auth.social': '/auth/social-auth/',
  'auth.logout': '/user/logout',

  // Public
  'app.projects': '/public/app/projects',
  'app.stores': '/public/app/stores',

  // Dashboard
  'user.dashboard': '/user/dashboard',
  'user.modules': '/user/modules',
  'user.change.project': '/user/project/change',

  // Summary
  'user.summary.cashback': '/user/summary/cashback',
  'user.summary.bonus': '/user/summary/bonus',
  'user.summary.referral': '/user/summary/referral',
  'user.summary.click': '/user/summary/click',
  'user.summary.payment': '/user/summary/payment',

  // Activity
  'user.activity.cashback': '/user/activity/cashback/',
  'user.activity.bonus': '/user/activity/bonus/',
  'user.activity.referral': '/user/activity/referral/',
  'user.activity.click.recent': '/user/activity/click/recent',
  'user.activity.click': '/user/activity/click/',

  // Graph
  'user.graph.earning': '/user/graph/earning/year',
  'user.graph.clicks': '/user/graph/click/30',
} as const;
