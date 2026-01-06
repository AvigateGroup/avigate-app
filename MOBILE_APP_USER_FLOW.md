# Avigate Mobile App - User Flow Guide
## Bolt-Inspired Navigation Experience

---

## Table of Contents
1. [App Overview](#app-overview)
2. [Complete User Flow: Finding and Starting a Trip](#complete-user-flow-finding-and-starting-a-trip)
3. [Feature Flows](#feature-flows)
4. [Screen-by-Screen Guide](#screen-by-screen-guide)
5. [Navigation Structure](#navigation-structure)

---

## App Overview

### Tech Stack
- **Framework**: React Native (Expo)
- **Router**: Expo Router (file-based routing)
- **Maps**: React Native Maps
- **Icons**: Ionicons (react-native-vector-icons)
- **State Management**: React Hooks + Context API
- **API**: Axios with custom hooks

### Design Philosophy
The app follows Bolt's clean, minimalist design with:
- Full-screen map as primary interface
- Minimal UI elements that don't obstruct the map
- Quick access to key actions via floating buttons
- Bottom navigation for main features
- Clean white sheets for input/details

---

## Complete User Flow: Finding and Starting a Trip

### Step 1: Home Screen (Launch)
```
┌─────────────────────────────────┐
│  8:20                  [🔔] [📍]│
│  [☰]                            │
│                                 │
│         MAP VIEW                │
│     (Your current location      │
│      shown with green pin)      │
│                                 │
│         👤 (You)                │
│         🔵 Blue dot              │
│                                 │
│                                 │
│                       [➡️]      │
│                       [🔄]      │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 🔍 Where to?             │  │
│  └──────────────────────────┘  │
│                                 │
│  [🏠] [📍 Share] [👤 Profile]   │
└─────────────────────────────────┘
```

**What happens:**
1. App launches and requests location permission
2. Gets current location (e.g., Port Harcourt 500102)
3. Shows full-screen map centered on user's location
4. User sees:
   - **Top Left**: Hamburger menu (☰)
   - **Top Right**: Notification bell (🔔) + Location icon (📍)
   - **Map**: User's location with green pin and person icon
   - **Right Side**: Two floating action buttons:
     - Navigation arrow (➡️) - Centers map on user
     - Refresh (🔄) - Refreshes current location
   - **Bottom**: "Where to?" search bar
   - **Bottom Nav**: Home, Share Location, Profile tabs

**User Actions:**
- Tap **"Where to?"** to search for destination
- Tap **Hamburger menu** to access Profile, Settings, Community
- Tap **Notification icon** to view notifications
- Tap **Navigation arrow** to recenter map
- Tap **Refresh** to update location

### Step 2: Destination Search Screen
**User taps "Where to?" search bar**

```
┌─────────────────────────────────┐
│  ✕    Your route                │
│                                 │
│  📍 Port Harcourt 500102    [+] │
│  ┌──────────────────────────┐  │
│  │ 🔍 Dropoff location  📍 ↕│  │
│  └──────────────────────────┘  │
│                                 │
│  🕐 Market Square Choba          │
│     Obio/Akpor             1.4km│
│                                 │
│  🕐 44 Olu Obasanjo Road         │
│     Port Harcourt 500101  12.9km│
│                                 │
│  🕐 66 Elipokwoudu Road          │
│     Rukpokwu-Obio 500102   8.5km│
│                                 │
│  📍 Port Harcourt Pleasure Park  │
│     Obio/Akpor            12.2km│
│                                 │
│  📍 Waterlines Bus Stop          │
│     323 Port Harcourt...   13km │
│                                 │
│  🍴 Casablanca Restaurant        │
│     Sports Bar & Karaoke  11.6km│
│     2 Sani Abacha Road...       │
│                                 │
│  🛍️ Rumuokoro Motor Park         │
│     Obio/Akpor              9km │
│                                 │
│  🛍️ Mile 1 Market                │
│     Ikwerre Road          14.3km│
└─────────────────────────────────┘
```

**What happens:**
1. App navigates to `/search` route
2. Shows header: "✕ Your route"
3. Displays origin (current location) with blue pin icon
4. Shows searchable destination input field
5. Loads suggested destinations:
   - **API Call**: `GET /routes/popular?city=Port Harcourt&limit=20`
   - Falls back to mock data if API fails
6. Calculates distances from current location
7. Categorizes destinations with icons:
   - 🕐 Recent destinations
   - 📍 Landmarks/Saved places
   - 🍴 Restaurants
   - 🛍️ Shopping centers

**User Actions:**
- **Type in search field** to filter destinations
- **Tap any destination** from the list
- **Tap ✕** to go back to home
- **Tap +** to add waypoint (future feature)
- **Tap 📍** to select from map (future feature)
- **Tap ↕** to swap start/end locations (future feature)

### Step 3: Route Details Screen
**User taps a destination (e.g., "Market Square Choba")**

```
┌─────────────────────────────────┐
│  ←                              │
│                                 │
│         MAP VIEW                │
│      (Route highlighted         │
│       with blue line)           │
│                                 │
│   📍 Start (green pin)          │
│    ━━━━━━━━━━━━━ (blue line)   │
│                  📍 End (red pin)│
│                                 │
│┌───────────────────────────────┐│
││ ━━━━ (drag handle)            ││
││                               ││
││ Market Square Choba           ││
││                               ││
││ [➡️ 1.4 km]  [⏱ 8 min]       ││
││                               ││
││ ┌─────────────────────────┐  ││
││ │ ➡️  Start Trip          │  ││
││ └─────────────────────────┘  ││
││                               ││
││ Directions                    ││
││ ┌─────────────────────────┐  ││
││ │ ➡️ Head north            │  ││
││ │    0.5 km                │  ││
││ ├─────────────────────────┤  ││
││ │ ➡️ Turn right onto...    │  ││
││ │    0.7 km                │  ││
││ ├─────────────────────────┤  ││
││ │ 🏁 Arrive at destination │  ││
││ │    0.2 km                │  ││
││ └─────────────────────────┘  ││
│└───────────────────────────────┘│
└─────────────────────────────────┘
```

**What happens:**
1. App navigates to `/search/route-details` with params:
   ```typescript
   {
     destName: "Market Square Choba",
     destAddress: "Obio/Akpor",
     destLat: 4.8986,
     destLng: 6.9201,
     startLat: 4.8156,
     startLng: 7.0498
   }
   ```

2. **API Call**: `POST /routes/search/smart`
   ```json
   {
     "startLat": 4.8156,
     "startLng": 7.0498,
     "endLat": 4.8986,
     "endLng": 6.9201,
     "endAddress": "Market Square Choba"
   }
   ```

3. Backend returns:
   - Route polyline (coordinates for blue line)
   - Total distance and duration
   - Step-by-step directions
   - Route ID (for trip tracking)

4. Map displays:
   - Start marker (green pin with person icon)
   - End marker (red pin)
   - Route polyline (blue line)
   - Map fits to show entire route

5. Bottom sheet shows:
   - Destination name
   - Distance and estimated time
   - **"Start Trip"** button
   - Turn-by-turn directions list

**User Actions:**
- **Tap "Start Trip"** to begin navigation
- **Tap ←** to go back to search
- **Drag bottom sheet** to expand/collapse
- **Scroll directions** to preview route

### Step 4: Start Trip
**User taps "Start Trip" button**

**What happens:**
1. **API Call**: `POST /routes/trips/start`
   ```json
   {
     "routeId": "route-uuid-from-step-3",
     "currentLat": 4.8156,
     "currentLng": 7.0498
   }
   ```

2. Backend:
   - Creates trip record in database
   - Sets status to "active"
   - Returns trip ID and initial data

3. App receives success response:
   ```json
   {
     "success": true,
     "data": {
       "trip": {
         "id": "trip-uuid",
         "routeId": "route-uuid",
         "status": "active",
         "startTime": "2026-01-04T08:30:00Z",
         ...
       }
     }
   }
   ```

4. App shows success alert: "Trip Started"

5. App navigates to `/trips/active` (Active Trip Screen)

### Step 5: Active Trip Navigation
```
┌─────────────────────────────────┐
│  ✕                          ⋮   │
│                                 │
│         MAP VIEW                │
│      (Route + user location     │
│       updating in real-time)    │
│                                 │
│   📍 You                        │
│    ━━━━━━━━━━━━━               │
│                  📍 Destination │
│                                 │
│┌───────────────────────────────┐│
││ In 200m                       ││
││ ➡️ Turn right onto            ││
││    Elipokwoudu Road           ││
││                               ││
││ 1.2 km • 5 min remaining      ││
│└───────────────────────────────┘│
│                                 │
│  [End Trip]  [Report Issue]     │
└─────────────────────────────────┘
```

**What happens:**
1. Map shows:
   - Current route (blue line)
   - User's live location (blue dot + green pin)
   - Destination marker (red pin)
   - Map follows user's movement

2. Top card shows:
   - **Next instruction**: "In 200m, Turn right onto..."
   - **Progress**: "1.2 km • 5 min remaining"

3. **Real-time location tracking**:
   - Every 3-5 seconds, app sends location update
   - **API Call**: `PATCH /routes/trips/:tripId/location`
     ```json
     {
       "latitude": 4.8167,
       "longitude": 7.0510,
       "speed": 25,
       "heading": 180,
       "accuracy": 10
     }
     ```

4. Backend responds with updated progress:
   ```json
   {
     "success": true,
     "data": {
       "progress": {
         "distanceRemaining": 1200,
         "timeRemaining": 300,
         "nextInstruction": "Turn right onto Elipokwoudu Road",
         "distanceToNextTurn": 200,
         "percentComplete": 65
       }
     }
   }
   ```

5. App updates UI:
   - Changes next instruction when user reaches turn
   - Updates distance/time remaining
   - May show alerts for:
     - Traffic ahead
     - Route deviations
     - Community updates on route

**User Actions:**
- **Tap "End Trip"** to stop before destination
- **Tap "Report Issue"** to post community update
- **Tap ⋮** for trip options (pause, cancel, share)

### Step 6: Trip Completion
**User arrives at destination or taps "End Trip"**

**What happens:**

**Option A: User Arrives at Destination**
1. App detects user is within 50m of destination
2. **API Call**: `POST /routes/trips/:tripId/complete`
3. Backend:
   - Updates trip status to "completed"
   - Calculates final stats
   - Sends trip summary email
   - Updates user statistics
   - Awards reputation points

4. App shows success alert: "Trip Completed!"

**Option B: User Ends Trip Manually**
1. User taps "End Trip"
2. **API Call**: `POST /routes/trips/:tripId/end`
3. Backend marks trip as "ended" (not completed)
4. Sends email summary

**Option C: User Cancels Trip**
1. User taps ⋮ → Cancel
2. Shows cancel reason dialog
3. **API Call**: `POST /routes/trips/:tripId/cancel`
   ```json
   {
     "reason": "Changed plans"
   }
   ```

5. All options:
   - Navigate back to home screen
   - Show trip summary (optional)
   - Prompt for rating (optional)

---

## Feature Flows

### Flow 1: Share Location

**Starting Point**: Any screen

**Steps:**
1. Tap **"Share Location"** in bottom navigation
2. Map shows with current location highlighted
3. User sees share options:
   - Share with specific users
   - Generate public link
   - Event location
4. Configure settings:
   - Add description
   - Set expiration time
   - Limit max viewers
5. Tap **"Generate Share Link"**
6. **API Call**: `POST /location-share`
7. Receive share link and QR code
8. Share via:
   - Copy link
   - WhatsApp, Email, SMS
   - Download QR code

**Backend Integration:**
- Uses `useLocationShareService` hook
- Endpoints: `/location-share/*`

### Flow 2: Community Feed

**Starting Point**: Home screen

**Steps:**
1. Tap ☰ → **"Community"**
2. Navigate to `/community`
3. See tabs:
   - **Nearby**: Posts from current area
   - **Popular**: Most upvoted
   - **Following**: From followed users (future)
4. Scroll through posts showing:
   - Traffic updates
   - Route alerts
   - Safety concerns
   - Navigation tips
5. User can:
   - Upvote/downvote posts
   - Comment
   - Share
   - Report
6. Tap **[➕ New Post]** to create:
   - Select post type
   - Add title and description
   - Attach location
   - Upload photos (optional)
   - Submit

**Backend Integration:**
- `GET /community/posts?page=1&limit=20`
- `POST /community/posts`

### Flow 3: Community Contribution

**Starting Point**: Active trip or home screen

**Steps:**
1. During trip, tap **"Report Issue"**
   OR from menu, tap **"Contribute"**
2. Navigate to `/community/contribute`
3. Select contribution type:
   - Report road condition
   - Report road closure
   - Add new landmark
   - Suggest route update
   - Share navigation tip
4. Fill form:
   - Location (auto-filled or select)
   - Condition type / details
   - Description
   - Add photos
   - Severity rating
5. Tap **"Submit Contribution"**
6. **API Call**: `POST /community/contributions`
7. Backend:
   - Creates pending contribution
   - Notifies moderators
   - Awards reputation points
8. User sees confirmation
9. Track status in "My Contributions"

**Backend Integration:**
- `POST /community/contributions`
- `GET /community/contributions?status=approved`

### Flow 4: View Trip History

**Starting Point**: Profile tab

**Steps:**
1. Tap **Profile** in bottom navigation
2. Tap **"Trip History"** or **"My Trips"**
3. **API Call**: `GET /routes/trips/history?limit=20`
4. See list of past trips:
   - Date and time
   - Start → End locations
   - Distance traveled
   - Duration
   - Status (completed/ended/cancelled)
5. Tap any trip to view details:
   - Route map
   - Full timeline
   - Photos (if any)
   - Rating given

### Flow 5: User Settings

**Starting Point**: Home screen

**Steps:**
1. Tap ☰ → **"Settings"**
2. Navigate to `/settings`
3. Options:
   - **Notifications**: Trip updates, community, promotions
   - **Privacy**: Location sharing, visibility
   - **Map Settings**: Default map type, traffic layer
   - **Trip Preferences**: Auto-start, waypoints
   - **Account**: Email, phone, password
   - **Legal**: Terms, Privacy Policy
   - **About**: App version, help
4. Change any setting
5. Auto-saves or tap **"Save"**

---

## Screen-by-Screen Guide

### 1. Home Screen
**File**: `app/(tabs)/index.tsx` → `src/screens/home/HomeScreen.tsx`

**Components:**
- Full-screen `MapView` with user location
- Hamburger menu button (top left)
- Notification + Location icons (top right)
- Floating action buttons (right side)
- "Where to?" search bar (bottom)
- Bottom tab navigation

**State:**
- `location`: Current GPS coordinates
- `address`: Reverse-geocoded address
- `loading`: Location loading state
- `mapReady`: Map initialization state

**API Calls:**
- None on load (just location services)

---

### 2. Search Screen
**File**: `app/search/index.tsx`

**Components:**
- Header with "✕" and "Your route" title
- Origin display (current location)
- Destination search input
- Scrollable list of suggested destinations

**State:**
- `searchQuery`: User's search text
- `currentLocation`: User's coordinates
- `destinations`: Array of destination objects
- `loading`: Destinations loading state

**API Calls:**
- `GET /routes/popular?city=Port Harcourt&limit=20`
  - Gets popular routes as destination suggestions
  - Falls back to mock data on error

**Data Flow:**
1. On mount → Get current location
2. Call `getPopularRoutes()`
3. Transform routes → destinations with icons
4. Display list with distances
5. Filter on search query change

---

### 3. Route Details Screen
**File**: `app/search/route-details.tsx`

**Components:**
- Full-screen map with route
- Start and end markers
- Route polyline (blue line)
- Bottom sheet with:
  - Route summary
  - Distance and time
  - "Start Trip" button
  - Turn-by-turn directions

**State:**
- `routeData`: Full route object from API
- `selectedRoute`: Index of selected route (if multiple)
- `loading`: Route loading state

**API Calls:**
- `POST /routes/search/smart`
  - Input: Start/end coordinates + destination name
  - Output: Route with polyline, distance, duration, steps

- `POST /routes/trips/start` (when "Start Trip" tapped)
  - Input: Route ID + current location
  - Output: Trip object with ID

**Data Flow:**
1. Receive params from search screen
2. Call `findSmartRoutes()`
3. Fit map to route bounds
4. Display route on map
5. Show bottom sheet with details
6. On "Start Trip" → Create trip → Navigate to active trip

---

### 4. Active Trip Screen
**File**: `app/trips/active.tsx` (to be enhanced)

**Components:**
- Full-screen map following user
- Current location indicator
- Route polyline
- Destination marker
- Instruction card (top or bottom)
- Action buttons: End Trip, Report Issue

**State:**
- `trip`: Active trip object
- `userLocation`: Real-time GPS updates
- `progress`: Distance/time remaining
- `nextInstruction`: Next turn/direction
- `tracking`: Location tracking on/off

**API Calls:**
- `GET /routes/trips/active` (on mount)
  - Gets currently active trip

- `PATCH /routes/trips/:tripId/location` (every 3-5 seconds)
  - Updates trip with current GPS position
  - Returns updated progress

- `POST /routes/trips/:tripId/complete` (on arrival)
  - Marks trip as completed

- `POST /routes/trips/:tripId/end` (manual end)
  - Ends trip before destination

- `POST /routes/trips/:tripId/cancel` (cancel)
  - Cancels trip with reason

**Data Flow:**
1. Load active trip on mount
2. Start location tracking
3. Every update:
   - Send location to backend
   - Receive progress update
   - Update UI (instruction, distance, time)
4. Detect arrival or manual end
5. Complete/end trip
6. Navigate to home

---

### 5. Community Feed Screen
**File**: `app/community/index.tsx`

**Components:**
- Header with tabs: Nearby, Popular, Following
- Scrollable feed of posts
- Post cards with:
  - Author + timestamp
  - Post type badge
  - Content
  - Location tag
  - Engagement buttons
- Floating "New Post" button

**State:**
- `posts`: Array of community posts
- `activeTab`: Current tab (nearby/popular/following)
- `loading`: Posts loading state

**API Calls:**
- `GET /community/posts?page=1&limit=20`
  - Optional filters: `postType`, `locationId`

**Data Flow:**
1. Load posts based on active tab
2. Show in scrollable list
3. User can upvote, comment, share
4. Pull-to-refresh for new posts
5. Infinite scroll for pagination

---

### 6. Profile Screen
**File**: `app/(tabs)/profile.tsx`

**Components:**
- Profile header (avatar, name, stats)
- Menu items:
  - Edit Profile
  - Trip History
  - My Contributions
  - Settings
  - Help & Support
  - Log Out

**State:**
- `user`: User profile data
- `stats`: User statistics (trips, reputation)

**API Calls:**
- `GET /users/profile`
- `GET /users/stats`

---

## Navigation Structure

### Tab Navigation (Bottom)
```
app/(tabs)/_layout.tsx
  ├── index.tsx         → Home Screen
  ├── share.tsx         → Share Location Screen
  └── profile.tsx       → Profile Screen
```

### Modal/Stack Screens
```
app/
  ├── search/
  │   ├── index.tsx           → Destination Search
  │   └── route-details.tsx   → Route Details & Start Trip
  │
  ├── trips/
  │   └── active.tsx          → Active Trip Navigation
  │
  ├── community/
  │   ├── index.tsx           → Community Feed
  │   ├── create.tsx          → Create Post
  │   ├── contribute.tsx      → Submit Contribution
  │   └── [id].tsx           → Post Details
  │
  ├── profile/
  │   ├── edit.tsx            → Edit Profile
  │   └── devices.tsx         → Manage Devices
  │
  ├── settings.tsx            → App Settings
  ├── notifications.tsx       → Notifications
  ├── privacy/index.tsx       → Privacy Policy
  └── terms/index.tsx         → Terms of Service
```

### Navigation Flow Diagram
```
┌─────────────┐
│  Home (/)   │◄──────────────────┐
└──────┬──────┘                   │
       │                          │
       │ Tap "Where to?"          │
       ▼                          │
┌─────────────────┐               │
│  Search         │               │
│  /search        │               │
└────────┬────────┘               │
         │                        │
         │ Select destination     │
         ▼                        │
┌──────────────────────┐          │
│  Route Details       │          │
│  /search/route-details│         │
└──────────┬───────────┘          │
           │                      │
           │ Tap "Start Trip"     │
           ▼                      │
┌───────────────────┐             │
│  Active Trip      │             │
│  /trips/active    │             │
└──────────┬────────┘             │
           │                      │
           │ End/Complete         │
           └──────────────────────┘
```

---

## Key Interactions Summary

### Tap Actions
| Element | Action | Result |
|---------|--------|--------|
| "Where to?" bar | Open search | Navigate to `/search` |
| Destination in list | View route | Navigate to `/search/route-details` |
| "Start Trip" button | Begin navigation | Create trip, navigate to `/trips/active` |
| End Trip | Stop navigation | Complete/end trip, return to home |
| ☰ Menu | Open menu | Show profile/settings/community options |
| 🔔 Notification | View notifications | Navigate to `/notifications` |
| 📍 Location | Re-request permission | Trigger location permission dialog |
| ➡️ Navigate button | Center map | Animate map to user location |
| 🔄 Refresh button | Update location | Fetch new GPS coordinates |

### Swipe Gestures
| Gesture | Action | Result |
|---------|--------|--------|
| Pull down on feed | Refresh | Reload community posts |
| Swipe bottom sheet | Expand/collapse | Show more/less route details |

---

## API Integration Points

### Complete API Flow for Starting a Trip

```
1. HOME SCREEN
   └── No API calls (just location services)

2. SEARCH SCREEN
   └── GET /routes/popular?city=Port Harcourt&limit=20
       Response: Array of popular routes

3. ROUTE DETAILS SCREEN
   └── POST /routes/search/smart
       Request: { startLat, startLng, endLat, endLng, endAddress }
       Response: { routes: [{ id, polyline, distance, duration, steps }] }

4. START TRIP
   └── POST /routes/trips/start
       Request: { routeId, currentLat, currentLng }
       Response: { trip: { id, status, startTime, ... } }

5. ACTIVE TRIP (continuous)
   └── PATCH /routes/trips/:tripId/location (every 3-5 seconds)
       Request: { lat, lng, speed, heading, accuracy }
       Response: { progress: { distanceRemaining, timeRemaining, nextInstruction, ... } }

6. TRIP COMPLETION
   ├── POST /routes/trips/:tripId/complete (if arrived)
   ├── POST /routes/trips/:tripId/end (if manual end)
   └── POST /routes/trips/:tripId/cancel (if cancelled)
       Response: { trip: { status, endTime, ... } }
```

---

## Next Steps / Future Enhancements

### Phase 1 (Completed)
- ✅ Bolt-inspired home screen
- ✅ Destination search with suggestions
- ✅ Route details with map
- ✅ Trip start integration
- ✅ Top right icons (notifications, location)

### Phase 2 (To Implement)
- [ ] Active trip screen enhancements:
  - [ ] Voice navigation instructions
  - [ ] Auto-arrival detection
  - [ ] Route deviation alerts
  - [ ] Community alerts overlay
- [ ] Recent destinations tracking (local storage)
- [ ] Favorite places
- [ ] Trip scheduling ("Later" button)
- [ ] Multiple route options display
- [ ] Waypoints support

### Phase 3 (Advanced Features)
- [ ] Real-time traffic layer
- [ ] User following system
- [ ] In-app messaging
- [ ] Trip sharing (share live location)
- [ ] Offline maps support
- [ ] Dark mode
- [ ] Multi-language support

---

## Troubleshooting

### Common Issues

**1. "Location permission denied"**
- **Solution**: User must enable location in device settings
- **Flow**: Show alert → "Open Settings" button → Request permission again

**2. "No routes found"**
- **Cause**: Backend can't find route between locations
- **Solution**: Show error, suggest different destination

**3. "Failed to start trip"**
- **Cause**: No route ID or user not authenticated
- **Solution**: Retry route search, check authentication

**4. "Destination list empty"**
- **Cause**: API error or no popular routes
- **Solution**: App falls back to mock destinations

**5. "Map not loading"**
- **Cause**: No location permission or slow internet
- **Solution**: Show loading indicator, retry after 5 seconds

---

## Conclusion

The Avigate mobile app provides a streamlined, Bolt-inspired user experience for navigation with strong community features. The user flow is designed to be:

1. **Simple**: 3 taps to start a trip (Home → Search → Destination → Start)
2. **Visual**: Full-screen map keeps user oriented
3. **Informative**: Clear instructions, distances, and times
4. **Connected**: Community features enhance navigation
5. **Reliable**: Fallback data ensures app always works

The backend API integration is robust, with proper error handling and fallback mechanisms throughout the flow.
