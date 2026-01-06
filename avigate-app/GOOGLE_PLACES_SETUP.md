# Google Places Autocomplete Setup Guide

This guide will help you enable and configure Google Places API for the autocomplete functionality in the search destination screen.

## Prerequisites

You need a Google Maps API key configured in your `.env` file:
```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

## Steps to Enable Google Places API

### 1. Enable Places API in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the one associated with your API key)
3. Navigate to "APIs & Services" > "Library"
4. Search for "Places API"
5. Click on "Places API" and click "Enable"
6. Also enable "Places API (New)" for better results

### 2. Enable Billing (Required)

Google Places API requires billing to be enabled:

1. Go to "Billing" in the Google Cloud Console
2. Link a billing account to your project
3. Don't worry - Google provides $200 free credit per month for Maps Platform
4. The autocomplete API calls are very affordable (around $2.83-$17 per 1000 requests depending on usage)

### 3. Configure API Key Restrictions

For security, restrict your API key:

1. Go to "APIs & Services" > "Credentials"
2. Click on your API key
3. Under "Application restrictions":
   - Select "Android apps" or "iOS apps" depending on your platform
   - Add your app's package name and SHA-1 fingerprint (for Android)
   - Add your app's bundle identifier (for iOS)
4. Under "API restrictions":
   - Select "Restrict key"
   - Enable these APIs:
     - Places API
     - Maps SDK for Android (if building for Android)
     - Maps SDK for iOS (if building for iOS)
     - Geocoding API (recommended)

### 4. Test the Implementation

1. Run your app: `npm start` or `npx expo start`
2. Navigate to the search destination screen
3. Start typing in the "Dropoff location" field
4. You should see Google Places autocomplete suggestions appear

## Troubleshooting

### Issue: No autocomplete results appearing

**Solution:**
- Check that Places API is enabled in Google Cloud Console
- Verify billing is enabled on your Google Cloud project
- Check the console logs for any API errors
- Ensure your API key has proper permissions

### Issue: API returns "REQUEST_DENIED" error

**Solution:**
- Verify the API key is correctly set in `.env`
- Check that the API key restrictions allow Places API
- Ensure Places API is enabled for your project

### Issue: API returns "OVER_QUERY_LIMIT" error

**Solution:**
- You've exceeded the free quota
- Enable billing or wait for quota reset
- Consider implementing request caching to reduce API calls

## Alternative: Backend Proxy (Recommended for Production)

For better security and to hide your API key, consider creating a backend proxy:

1. Add endpoints to your backend API:
   - `GET /api/v1/places/autocomplete?input=<query>`
   - `GET /api/v1/places/details?placeId=<placeId>`

2. Update `useGooglePlacesAutocomplete.ts` to call your backend instead of Google directly

3. Your backend will handle the Google Places API calls with the API key stored securely

## Cost Estimation

- **Autocomplete requests**: ~$2.83 per 1000 requests
- **Place Details requests**: ~$17 per 1000 requests
- **Free tier**: $200 credit per month (≈ 70,000 autocomplete + 11,000 details requests)

For most apps, this stays well within the free tier!

## Files Modified

- `app/search/index.tsx` - Added autocomplete UI and logic
- `src/hooks/useGooglePlacesAutocomplete.ts` - New hook for Google Places API
- This setup guide

## Need Help?

If you encounter issues, check:
1. [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
2. [Google Cloud Console](https://console.cloud.google.com/)
3. Your app's console logs for detailed error messages
