# Avigate User Flow Documentation
## Bolt-Inspired Design Implementation

---

## Table of Contents
1. [Overview](#overview)
2. [Core Features](#core-features)
3. [User Flow 1: Starting a Trip](#user-flow-1-starting-a-trip)
4. [User Flow 2: Share Location](#user-flow-2-share-location)
5. [User Flow 3: Community Contribution](#user-flow-3-community-contribution)
6. [User Flow 4: Community Feed (Route Updates)](#user-flow-4-community-feed-route-updates)
7. [User Flow 5: Following Users](#user-flow-5-following-users)
8. [Backend API Endpoints](#backend-api-endpoints)
9. [Design Patterns from Bolt](#design-patterns-from-bolt)

---

## Overview

Avigate is a navigation app inspired by Bolt's clean design. It helps users navigate routes, share their location, contribute to the community, and get real-time route updates from other users.

### Key Features Inspired by Bolt:
- **Clean Map Interface**: Minimalist map with clear user location indicator
- **"Where to?" Search**: Quick destination search with suggestions
- **Bottom Navigation**: Home, Share Location/Rides, Profile/Account
- **Suggested Destinations**: Recent places, saved locations, nearby points of interest
- **Step-by-Step Guidance**: Turn-by-turn navigation with distance indicators

---

## Core Features

### 1. Navigation & Trip Management
- Find routes between two locations
- Start trips with real-time tracking
- Step-by-step turn guidance
- End/Complete/Cancel trips

### 2. Location Sharing
- Share current location with specific users or publicly
- Generate shareable links and QR codes
- Set expiration time for shares
- Track who accessed shared locations

### 3. Community Contributions
- Submit route improvements
- Report road conditions
- Add new landmarks or points of interest

### 4. Community Feed (Route Updates)
- Post traffic updates
- Share route alerts
- Report safety concerns
- Share navigation tips
- General community posts

### 5. User Following (To Be Implemented)
- Follow other users
- See followed users' route updates
- Get notifications from followed users

---

## User Flow 1: Starting a Trip

### Design (Based on Bolt Screenshots)

**Home Screen:**
```
┌─────────────────────────────────┐
│  8:20                    [🔔📍] │
│  [☰]                            │
│                                 │
│         MAP VIEW                │
│     (User location marked       │
│      with green pin + icon)     │
│                                 │
│    Helena Haven 📍              │
│                                 │
│         👤 (User)               │
│         🔵 (Blue dot)           │
│                                 │
│    Amora Resort                 │
│                                 │
│                       [➡️]      │
│                       [🔄]      │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 🔍 Where to?             │  │
│  └──────────────────────────┘  │
│                                 │
│  [🏠 Home] [📍 Share] [👤 Profile] │
└─────────────────────────────────┘
```

**Route Selection Screen:**
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
└─────────────────────────────────┘
```

### Step-by-Step User Flow

#### Step 1: Open Home Screen
- User sees map with their current location (blue dot or green pin)
- Map shows nearby landmarks and points of interest
- Bottom navigation: **Home (active)**, **Share Location**, **Profile**
- Floating action buttons on right: **Navigation arrow**, **Refresh/Recenter**

#### Step 2: Tap "Where to?" Search Bar
- App opens destination search screen
- Shows **current location** at top (e.g., "Port Harcourt 500102")
- Shows **destination input field** with location pin icon
- Displays **suggested destinations** list:
  - 🕐 **Recent destinations** (with distances)
  - 📍 **Saved/favorite places**
  - 🍴 **Restaurants** nearby
  - 🛍️ **Shopping centers**
  - Other points of interest

#### Step 3: Select or Search Destination
- **Option A**: Tap a suggested destination
- **Option B**: Type in search field to find specific location
- **Option C**: Tap location pin icon to select from map

#### Step 4: View Route Options
- App calls `POST /routes/search/smart` with:
  ```json
  {
    "startLat": 4.8156,
    "startLng": 7.0498,
    "endAddress": "Market Square Choba"
  }
  ```
- Backend returns route options with:
  - Total distance
  - Estimated time
  - Step-by-step directions
  - Alternative routes

#### Step 5: Confirm Route & Start Trip
- User reviews route on map
- Tap **"Start Trip"** button
- App calls `POST /routes/trips/start`:
  ```json
  {
    "routeId": "route-uuid",
    "currentLat": 4.8156,
    "currentLng": 7.0498
  }
  ```
- Backend creates trip record and returns trip ID

#### Step 6: Active Trip Navigation
```
┌─────────────────────────────────┐
│  ✕                          ⋮   │
│                                 │
│         MAP VIEW                │
│     (Route highlighted          │
│      with blue line)            │
│                                 │
│  ┌──────────────────────────┐  │
│  │ In 200m                     │
│  │ ➡️ Turn right onto          │
│  │    Elipokwoudu Road         │
│  │                             │
│  │ 1.2 km • 5 min remaining    │
│  └──────────────────────────┘  │
│                                 │
│  [End Trip]  [Report Issue]     │
└─────────────────────────────────┘
```

- App tracks user's location continuously
- Calls `PATCH /routes/trips/:tripId/location` every few seconds:
  ```json
  {
    "latitude": 4.8167,
    "longitude": 7.0510,
    "speed": 25,
    "heading": 180
  }
  ```
- Backend responds with:
  - Current progress percentage
  - Next instruction
  - Distance to next turn
  - ETA updates

#### Step 7: Trip Completion
- When user reaches destination, app detects arrival
- User can tap **"End Trip"** or app auto-detects
- App calls `POST /routes/trips/:tripId/complete`
- Backend:
  - Updates trip status to "completed"
  - Sends trip summary email
  - Updates user statistics
  - May prompt for rating/feedback

---

## User Flow 2: Share Location

### Design Pattern
Following Bolt's approach with a dedicated "Share Location" tab in bottom navigation.

### Step-by-Step User Flow

#### Step 1: Access Share Location
- User taps **"Share Location"** in bottom navigation
- Or taps share icon on map

#### Step 2: Share Location Screen
```
┌─────────────────────────────────┐
│  ✕    Share Your Location       │
│                                 │
│         MAP VIEW                │
│      (Your location 📍)         │
│                                 │
│  Current Location:              │
│  📍 Port Harcourt 500102        │
│                                 │
│  Share Type:                    │
│  ○ Share with specific users    │
│  ● Share link (anyone)          │
│  ○ Event location               │
│                                 │
│  Description (optional):        │
│  ┌──────────────────────────┐  │
│  │ Meeting at the cafe      │  │
│  └──────────────────────────┘  │
│                                 │
│  Expires in:                    │
│  [1 hour ▼]                     │
│                                 │
│  [Generate Share Link]          │
└─────────────────────────────────┘
```

#### Step 3: Configure Share Settings
- **Share Type**:
  - Specific users (select from contacts)
  - Public link (anyone with link)
  - Event location (with event details)
- **Description**: Optional message
- **Expiration**: 15 min, 1 hour, 3 hours, 24 hours, custom
- **Max Access**: Limit number of people who can view

#### Step 4: Generate Share
- User taps **"Generate Share Link"**
- App calls `POST /location-share`:
  ```json
  {
    "shareType": "link",
    "locationName": "Port Harcourt 500102",
    "latitude": 4.8156,
    "longitude": 7.0498,
    "description": "Meeting at the cafe",
    "expiresAt": "2026-01-04T09:23:53Z",
    "maxAccess": 10
  }
  ```
- Backend creates share and returns:
  ```json
  {
    "success": true,
    "data": {
      "share": {
        "id": "share-uuid",
        "shareToken": "abc123",
        "shareUrl": "https://avigate.app/share/abc123",
        "qrCode": "data:image/png;base64,..."
      }
    }
  }
  ```

#### Step 5: Share Options
```
┌─────────────────────────────────┐
│  ✕    Share Link Ready          │
│                                 │
│  ┌──────────────────────────┐  │
│  │                           │  │
│  │      QR CODE              │  │
│  │                           │  │
│  └──────────────────────────┘  │
│                                 │
│  avigate.app/share/abc123       │
│                                 │
│  Valid until: 09:23 AM          │
│  Access count: 0 / 10           │
│                                 │
│  [📋 Copy Link]                 │
│  [💬 Share via WhatsApp]        │
│  [📧 Share via Email]           │
│  [💾 Download QR Code]          │
│                                 │
│  [View My Shares]               │
└─────────────────────────────────┘
```

- User can:
  - Copy link to clipboard
  - Share via social apps
  - Download/print QR code
  - View active shares

#### Step 6: Recipient Access
- Recipient opens link: `https://avigate.app/share/abc123`
- App calls `GET /location-share/token/abc123?lat=4.820&lng=7.055`
- Backend validates share and returns location data
- Recipient sees:
  - Shared location on map
  - Description/message
  - "Get Directions" button
  - Distance from their location to shared location

#### Step 7: Get Directions to Shared Location
- Recipient taps **"Get Directions"**
- App calls `GET /location-share/token/abc123/directions?fromLat=4.820&fromLng=7.055`
- Backend returns route to shared location
- Recipient can start trip to navigate there

#### Step 8: Manage Shares
- User can view their active shares: `GET /location-share/my-shares`
- Update share status: `PATCH /location-share/:shareId/status`
  - Active, paused, expired, cancelled
- Regenerate QR code if needed

---

## User Flow 3: Community Contribution

### Purpose
Users can contribute to improving routes by reporting issues, suggesting improvements, or adding new landmarks.

### Step-by-Step User Flow

#### Step 1: Access Community Contribution
- **Option A**: From map, long-press a location → "Report/Contribute"
- **Option B**: From bottom nav, tap menu → "Contribute"
- **Option C**: During active trip, tap "Report Issue" button

#### Step 2: Contribution Type Screen
```
┌─────────────────────────────────┐
│  ✕    Community Contribution    │
│                                 │
│  What would you like to do?     │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 🛣️  Report Road Condition │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 🚧  Report Road Closure   │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 📍  Add New Landmark      │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ ✏️  Suggest Route Update  │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 💡  Share Navigation Tip  │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

#### Step 3: Fill Contribution Form
Example: Report Road Condition
```
┌─────────────────────────────────┐
│  ✕    Report Road Condition     │
│                                 │
│  Location:                      │
│  📍 Elipokwoudu Road            │
│  [Change Location]              │
│                                 │
│  Condition Type:                │
│  ● Pothole                      │
│  ○ Flooding                     │
│  ○ Poor surface                 │
│  ○ Other                        │
│                                 │
│  Description:                   │
│  ┌──────────────────────────┐  │
│  │ Large pothole near the   │  │
│  │ junction, affects both   │  │
│  │ lanes                    │  │
│  └──────────────────────────┘  │
│                                 │
│  Add Photos (optional):         │
│  [📷 Take Photo] [🖼️ Gallery]   │
│                                 │
│  Severity:                      │
│  ○ Low  ● Medium  ○ High        │
│                                 │
│  [Submit Contribution]          │
└─────────────────────────────────┘
```

#### Step 4: Submit Contribution
- User fills in details and taps **"Submit Contribution"**
- App calls `POST /community/contributions`:
  ```json
  {
    "contributionType": "road_condition",
    "routeId": "route-uuid",
    "description": "Large pothole near the junction, affects both lanes",
    "proposedData": {
      "conditionType": "pothole",
      "severity": "medium",
      "latitude": 4.8156,
      "longitude": 7.0498,
      "photos": ["image-url-1", "image-url-2"]
    }
  }
  ```
- Backend:
  - Creates contribution record with status "pending"
  - Notifies moderators for review
  - Awards reputation points to user
  - May auto-approve based on user reputation

#### Step 5: Contribution Review
- Moderators/Admins review via admin panel
- Can approve, reject, or request more info
- Approved contributions:
  - Update route data
  - Notify nearby users
  - Award additional reputation points
  - May appear in community feed

#### Step 6: View Contributions
- User can view their contributions: `GET /community/contributions?status=approved`
- See status: pending, approved, rejected
- Track impact (how many users benefited)

---

## User Flow 4: Community Feed (Route Updates)

### Purpose
Twitter/X-like feed where users post and view real-time route updates, traffic info, safety alerts, and navigation tips.

### Design Pattern
```
┌─────────────────────────────────┐
│  ✕    Community Feed            │
│                                 │
│  [📍 Nearby] [🔥 Popular] [Following] │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 👤 John Doe • 5 min ago  │  │
│  │ 🚦 TRAFFIC UPDATE         │  │
│  │                          │  │
│  │ Heavy traffic on Aba Road│  │
│  │ near Rumuokwuta junction.│  │
│  │ Expect 15-20 min delay.  │  │
│  │                          │  │
│  │ 📍 Aba Road, Port Harcourt│  │
│  │                          │  │
│  │ 👍 24  💬 5  🔄 8        │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 👤 Sarah ✓ • 15 min ago  │  │
│  │ ⚠️ ROUTE ALERT           │  │
│  │                          │  │
│  │ Road closed for repairs  │  │
│  │ on Ikwerre Road. Use     │  │
│  │ Eleme Rd as alternative. │  │
│  │                          │  │
│  │ [📷 Image]               │  │
│  │                          │  │
│  │ 👍 45  💬 12  🔄 18      │  │
│  └──────────────────────────┘  │
│                                 │
│  [➕ New Post]                  │
└─────────────────────────────────┘
```

### Step-by-Step User Flow

#### Step 1: Access Community Feed
- From bottom nav: Tap menu → **"Community Feed"**
- Or from map: Tap feed icon
- Or during trip: View route-specific updates

#### Step 2: View Feed
- Feed tabs:
  - **Nearby**: Posts from current area (sorted by distance)
  - **Popular**: Most upvoted posts
  - **Following**: Posts from followed users (requires follow feature)
- App calls `GET /community/posts?postType=&page=1&limit=20`
- Each post shows:
  - Author name + profile picture
  - Post time (relative: "5 min ago")
  - Post type badge (Traffic, Route Alert, Safety, Tip)
  - Content/description
  - Location tag
  - Optional: Image(s)
  - Engagement: Upvotes, Comments, Shares
  - **Verified badge** for trusted contributors

#### Step 3: Create New Post
- User taps **[➕ New Post]** floating action button
- Post creation screen:
```
┌─────────────────────────────────┐
│  ✕    New Community Post        │
│                                 │
│  Post Type:                     │
│  [🚦 Traffic] [⚠️ Alert] [🛡️ Safety]│
│  [💡 Tip] [💬 General]           │
│                                 │
│  Title:                         │
│  ┌──────────────────────────┐  │
│  │ Heavy traffic on Aba Rd  │  │
│  └──────────────────────────┘  │
│                                 │
│  Description:                   │
│  ┌──────────────────────────┐  │
│  │ Traffic jam near         │  │
│  │ Rumuokwuta junction.     │  │
│  │ Police checkpoint ahead. │  │
│  └──────────────────────────┘  │
│                                 │
│  Location:                      │
│  ● Current Location             │
│  ○ Select on Map                │
│  ○ Select Route                 │
│                                 │
│  Add Photos (optional):         │
│  [📷] [🖼️]                      │
│                                 │
│  [Post to Community]            │
└─────────────────────────────────┘
```

#### Step 4: Submit Post
- User fills details and taps **"Post to Community"**
- App calls `POST /community/posts`:
  ```json
  {
    "postType": "traffic_update",
    "title": "Heavy traffic on Aba Rd",
    "content": "Traffic jam near Rumuokwuta junction. Police checkpoint ahead.",
    "locationId": "location-uuid",
    "images": ["image-url"]
  }
  ```
- Backend:
  - Creates post
  - Notifies nearby users
  - May push to relevant trip notifications
  - Awards reputation points

#### Step 5: Engage with Posts
- **Upvote/Downvote**: Tap thumbs up/down
  - Helps prioritize useful posts
  - Awards reputation to author
- **Comment**: Tap comment icon
  - Add additional info or updates
  - Creates thread discussion
- **Share**: Share post with others
- **Report**: Flag inappropriate content

#### Step 6: Route-Specific Updates
- During active trip, user sees:
  - Posts relevant to current route
  - Real-time alerts ahead
  - Automatic notifications for important updates
- App filters by: `GET /community/posts?routeId=route-uuid`

#### Step 7: Post Lifecycle
- **Fresh posts** (< 30 min): Highlighted
- **Active posts** (< 3 hours): Normal display
- **Stale posts** (> 3 hours for traffic): Grayed out or hidden
- **Evergreen tips**: Remain visible longer

---

## User Flow 5: Following Users

### Purpose
Users can follow trusted contributors to receive their route updates and tips.

### Status: **TO BE IMPLEMENTED**

### Required Backend Changes

#### New Entity: `UserFollow`
```typescript
@Entity('user_follows')
export class UserFollow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  followerId: string; // User who is following

  @Column('uuid')
  followingId: string; // User being followed

  @CreateDateColumn()
  createdAt: Date;
}
```

#### New Endpoints
```typescript
// Follow user
POST /users/:userId/follow

// Unfollow user
DELETE /users/:userId/follow

// Get user's followers
GET /users/:userId/followers

// Get users being followed
GET /users/:userId/following

// Get follow suggestions (based on reputation, mutual follows)
GET /users/follow-suggestions
```

### Step-by-Step User Flow

#### Step 1: Discover Users to Follow
- **From Community Feed**: See posts from active contributors
- **From Post**: Tap author name/avatar
- **From Suggestions**: App recommends trusted users
  - Users with high reputation
  - Verified contributors
  - Active in user's area
  - Mutual connections

#### Step 2: View User Profile
```
┌─────────────────────────────────┐
│  ← Sarah Johnson           ⋮    │
│                                 │
│  ┌─────────────────┐            │
│  │   Profile Pic   │  ✓ Verified│
│  └─────────────────┘            │
│                                 │
│  @sarahjohnson                  │
│  Port Harcourt, Nigeria         │
│                                 │
│  🏆 Reputation: 892             │
│  📊 456 Followers • 123 Following│
│                                 │
│  [+ Follow]                     │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Recent Posts             │  │
│  │                          │  │
│  │ • Road closure update    │  │
│  │ • Traffic tip for GRA    │  │
│  │ • New route to airport   │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Contributions            │  │
│  │ • 45 Approved            │  │
│  │ • 12 Landmarks added     │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

#### Step 3: Follow User
- User taps **[+ Follow]** button
- App calls `POST /users/:userId/follow`
- Backend:
  - Creates follow relationship
  - May notify followed user
  - Updates follower/following counts
- Button changes to **[✓ Following]**

#### Step 4: View Following Feed
- In Community Feed, tap **"Following"** tab
- App calls `GET /community/posts` filtered by following
- Shows posts only from followed users
- Sorted by recency

#### Step 5: Notifications from Followed Users
- When followed user posts:
  - Push notification (if enabled)
  - Badge on feed icon
  - Highlighted in feed
- User can customize notification preferences:
  - All posts
  - Only important (alerts, safety)
  - None (just show in feed)

#### Step 6: Manage Following
- View all followed users: `GET /users/me/following`
- Unfollow: Tap **[✓ Following]** → Confirm unfollow
- View followers: `GET /users/me/followers`

---

## Backend API Endpoints

### Journey/Trip Management
```
POST   /journey                     - Create journey plan
POST   /journey/:id/start           - Start journey tracking
PUT    /journey/:id/location        - Update location during journey
PUT    /journey/:id/stop            - Stop journey tracking
GET    /journey/:id                 - Get journey details
GET    /journey/active/current      - Get active journey
GET    /journey                     - Get journey history
POST   /journey/:id/rate            - Rate completed journey
```

### Route & Trip Management
```
POST   /routes/find                 - Find routes
POST   /routes/search/smart         - Smart route search (address or coords)
POST   /routes/search/street-level  - Street-level guidance for off-road
GET    /routes/popular              - Get popular routes
GET    /routes/:id                  - Get route by ID

POST   /routes/trips/start          - Start new trip
GET    /routes/trips/active         - Get active trip
PATCH  /routes/trips/:tripId/location - Update trip location
POST   /routes/trips/:tripId/complete - Complete trip (arrived)
POST   /routes/trips/:tripId/end    - End trip manually
POST   /routes/trips/:tripId/cancel - Cancel trip
GET    /routes/trips/history        - Get trip history
GET    /routes/trips/statistics     - Get trip stats

GET    /routes/geocode/search       - Geocode address
GET    /routes/geocode/reverse      - Reverse geocode
```

### Location Sharing
```
POST   /location-share              - Create location share
GET    /location-share/token/:shareToken - Access shared location
GET    /location-share/token/:shareToken/directions - Get directions to share
PATCH  /location-share/:shareId/status - Update share status
GET    /location-share/my-shares    - Get user's shares
GET    /location-share/accessible   - Get shares accessible by user
POST   /location-share/event        - Share event location
GET    /location-share/token/:shareToken/qr-code - Get QR code
GET    /location-share/token/:shareToken/qr-code/print - Printable QR
POST   /location-share/:shareId/qr-code/regenerate - Regenerate QR
```

### Community Feed
```
POST   /community/posts             - Create community post
GET    /community/posts             - Get community posts
                                      ?postType=traffic_update
                                      ?locationId=uuid
                                      ?page=1&limit=20

POST   /community/directions/share  - Share directions
GET    /community/directions/share/:shareToken - Get shared directions

POST   /community/contributions     - Submit route contribution
GET    /community/contributions     - Get contributions
                                      ?status=approved

POST   /community/safety/report     - Report safety concern
GET    /community/safety/reports    - Get safety reports
```

### User Following (TO BE IMPLEMENTED)
```
POST   /users/:userId/follow        - Follow user
DELETE /users/:userId/follow        - Unfollow user
GET    /users/:userId/followers     - Get followers
GET    /users/:userId/following     - Get following
GET    /users/follow-suggestions    - Get follow suggestions
```

### User Profile
```
GET    /users/profile               - Get user profile
PUT    /users/profile               - Update profile
POST   /users/profile/picture       - Upload profile picture
GET    /users/stats                 - Get user statistics
```

---

## Design Patterns from Bolt

### 1. Map Interface
- **Full-screen map** as primary view
- **User location** indicated with:
  - Blue dot (simple)
  - OR Green pin with person icon (enhanced)
- **Landmarks** shown with category-based icons:
  - 🏨 Hotels (pink pins)
  - 🍴 Restaurants (fork/knife icon)
  - 🛍️ Shopping (bag icon)
  - 🏛️ Institutions (building icon)

### 2. Search Interface
- **"Where to?" search bar** at bottom
  - Always visible on home screen
  - Minimal design, rounded corners
  - Search icon on left
- **Optional "Later" button** for scheduling

### 3. Destination Suggestions
- **Icons indicate type**:
  - 🕐 Clock = Recent destinations
  - 📍 Pin = Saved/favorite locations
  - 🍴 Restaurant icon = Food places
  - 🛍️ Bag = Shopping
- **Distance shown** on right side
- **Subtitle** with area/address

### 4. Navigation Elements
- **Top left**: Hamburger menu (☰)
- **Top right**: Notifications (🔔), Location permission (📍)
- **Floating action buttons** on right side:
  - Navigation/Compass button
  - Recenter/Refresh button
- **Bottom navigation** (3-4 tabs):
  - Home
  - Rides/Share Location
  - Account/Profile

### 5. Color Scheme
- **Primary**: Green (for user location, CTAs, active states)
- **Secondary**: Blue (for routes, informational)
- **Accent**: Pink/Magenta (for landmarks, alerts)
- **Background**: White/Light gray map
- **Text**: Dark gray/Black

### 6. Route Display
- **Route line**: Blue or green highlighted path
- **Current location**: Green pin or blue dot
- **Destination**: Red pin or custom icon
- **Step cards**: Bottom sheet with:
  - Distance to next turn
  - Turn instruction with icon
  - Total remaining distance and time

---

## Implementation Priority

### Phase 1: Core Navigation (EXISTING)
- [x] Map interface with user location
- [x] "Where to?" search
- [x] Route finding
- [x] Trip start/stop/complete
- [x] Real-time location tracking

### Phase 2: Location Sharing (EXISTING)
- [x] Share location with link
- [x] QR code generation
- [x] Access shared locations
- [x] Get directions to shared location

### Phase 3: Community Features (EXISTING)
- [x] Community posts (feed)
- [x] Community contributions
- [x] Safety reports
- [x] Route alerts

### Phase 4: Enhanced UX (TO DO)
- [ ] Bolt-inspired UI redesign
  - [ ] Redesign home screen with Bolt layout
  - [ ] Implement destination suggestions with icons
  - [ ] Add floating action buttons
  - [ ] Update bottom navigation
- [ ] Recent destinations tracking
- [ ] Saved/favorite places
- [ ] "Later" trip scheduling

### Phase 5: Social Features (TO DO)
- [ ] User following system
  - [ ] Follow/unfollow endpoints
  - [ ] User profile enhancements
  - [ ] Following feed
  - [ ] Follow suggestions
  - [ ] Notification preferences
- [ ] User reputation system (PARTIALLY EXISTING)
- [ ] Verified contributor badges
- [ ] Post engagement (upvote/comment/share)

---

## Technical Notes

### Real-time Updates
- Use **WebSocket** or **Server-Sent Events** for:
  - Live location tracking during trips
  - Real-time community feed updates
  - Notifications from followed users
  - Trip progress updates

### Caching Strategy
- **Cache recent destinations** locally
- **Cache route data** for offline access
- **Cache community posts** for quick feed loading
- **Invalidate cache** based on location changes

### Notification Strategy
- **Trip notifications**:
  - Turn-by-turn guidance
  - Traffic alerts ahead
  - Route deviations
- **Community notifications**:
  - Posts from followed users
  - Relevant route alerts
  - Contributions approved
- **Share notifications**:
  - Someone accessed your shared location
  - Share about to expire

### Performance Optimizations
- **Lazy load** community feed (pagination)
- **Debounce** location updates (max 1 req/sec)
- **Compress images** before upload
- **Use CDN** for static assets (QR codes, images)

---

## Conclusion

Avigate's user flow is designed to provide a seamless, Bolt-like experience with enhanced community features. The app enables users to:

1. **Navigate efficiently** with step-by-step guidance
2. **Share locations** easily with links and QR codes
3. **Contribute** to route improvements
4. **Stay informed** through community feed
5. **Follow trusted users** for better route intelligence (upcoming)

The backend API is robust and ready to support all these features. The next step is implementing the Bolt-inspired UI redesign and user following functionality.
