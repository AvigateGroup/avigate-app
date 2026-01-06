# Network Error Fix Guide

## Problem
The app is showing a network error when trying to connect to the API:
```
ERROR  Request OTP error: [AxiosError: Network Error]
```

The app is trying to connect to: `http://192.168.0.134:3000/api/v1`

## Root Causes
1. **Backend API not running** - The avigate-api server is not started
2. **IP address changed** - Your computer's IP address might have changed
3. **Firewall blocking** - Your firewall or network is blocking the connection
4. **Wrong network** - Phone and computer are on different WiFi networks

## Solutions

### Option 1: Start the Backend API (Recommended)

1. Open a terminal in the `avigate-api` directory
2. Start the backend server:
   ```bash
   cd avigate-api
   npm run start:dev
   ```
3. Verify the server is running - you should see:
   ```
   NestJS application successfully started
   ```

### Option 2: Update IP Address

If your computer's IP address has changed:

1. Find your current IP address:
   - **Windows**: Open CMD and run `ipconfig`, look for "IPv4 Address"
   - **Mac/Linux**: Run `ifconfig` or `ip addr`, look for your local IP

2. Update the IP in `avigate-app/.env`:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://YOUR_NEW_IP:3000/api/v1
   ```

3. Restart the Expo development server:
   ```bash
   cd avigate-app
   npm start
   ```

### Option 3: Use Android Emulator

If using an Android emulator instead of a physical device:

1. The emulator automatically uses `10.0.2.2` to connect to localhost
2. No changes needed - just ensure the backend is running

### Option 4: Use Production API

If you don't want to run the backend locally:

1. Update `avigate-app/.env`:
   ```
   EXPO_PUBLIC_API_BASE_URL=https://avigate-api-production.up.railway.app/api/v1
   ```

2. Restart Expo

## Verification Steps

After fixing:

1. Check that backend is running:
   ```bash
   curl http://YOUR_IP:3000/api/v1/health
   ```
   Should return: `{"status":"ok"}`

2. Restart the Avigate app on your phone

3. Try logging in again - the network error should be gone

## Current Configuration

According to the logs:
- **Environment**: Development
- **Platform**: android
- **Base URL**: http://192.168.0.134:3000/api/v1

Make sure your phone and computer are on the **same WiFi network** for local development.
