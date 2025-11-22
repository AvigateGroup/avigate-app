// src/config/api.ts
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Locations
  LOCATIONS_SEARCH: '/locations/search',
  LOCATIONS_NEARBY: '/locations/nearby',
  
  // Routes (with walking support)
  ROUTES_SEARCH_SMART: '/routes/search/smart',
  ROUTES_FIND: '/routes/find',
  
  // Community
  COMMUNITY_FEED: '/community/posts',
  COMMUNITY_CONTRIBUTE: '/community/contributions',
  COMMUNITY_VOTE: '/community/posts/:id/vote',
  
  // Location Share (with QR codes)
  LOCATION_SHARE_CREATE: '/location-share',
  LOCATION_SHARE_QR: '/location-share/token/:token/qr-code',
  LOCATION_SHARE_PRINT: '/location-share/token/:token/qr-code/print',
};