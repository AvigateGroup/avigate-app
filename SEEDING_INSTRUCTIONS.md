# Database Seeding Instructions

This guide will help you populate the Avigate database with test data for notifications.

## Prerequisites

Make sure you have:
1. Database running and accessible
2. Environment variables properly configured in `.env` file
3. Already seeded users (run `npm run seed:users` if not done yet)
4. Already seeded community posts (run `npm run seed:community` if not done yet)

## Step 1: Navigate to API Directory

```bash
cd avigate-api
```

## Step 2: Run the Notifications Seed Script

```bash
npm run seed:notifications
```

This will:
- Connect to your PostgreSQL database
- Fetch existing users
- Create multiple notifications for each user including:
  - **Trip notifications**: Trip started, completed, approaching stops
  - **Journey notifications**: Journey started, transfer alerts, destination alerts
  - **Community notifications**: New posts, safety alerts
  - **Contribution notifications**: Approved, implemented, changes requested
  - **Location sharing**: Shared location alerts
  - **System alerts**: Welcome messages, new features

## Expected Output

You should see output like this:

```
🌱 Starting Notifications Seed...

🔌 Connecting to database...
✅ Database connected!

👥 Fetching existing users...
✅ Found 10 users

📝 Creating 16 notifications for each user...

👤 Creating notifications for John Doe...
✅ Created 16 notifications for John

...

✅ Created 160 total notifications!
📊 Summary by Notification Type:
   trip_started: 10 notifications
   trip_completed: 10 notifications
   approaching_stop: 10 notifications
   ...

📊 Read Status:
   Unread: 96 notifications
   Read: 64 notifications

✅ Notifications seeding completed successfully!
```

## Step 3: Restart API Server

If your API server is running, restart it to ensure all changes are picked up:

```bash
npm run start:dev
```

## Step 4: Test in Mobile App

1. Open the Avigate mobile app
2. Navigate to the notifications screen (bell icon)
3. You should now see multiple notifications with different types and statuses

## Verification

To verify the data was seeded correctly, you can run this SQL query:

```sql
SELECT type, COUNT(*) as count, SUM(CASE WHEN "isRead" THEN 1 ELSE 0 END) as read_count
FROM notifications
GROUP BY type
ORDER BY count DESC;
```

## Troubleshooting

**No users found error:**
- Run `npm run seed:users` first to create test users

**Database connection error:**
- Check your `.env` file has correct database credentials
- Ensure PostgreSQL is running
- Verify DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, and DATABASE_PASSWORD

**TypeORM entity error:**
- Make sure you've applied the latest migrations
- Check that Notification entity is registered in app.module.ts

## Re-seeding

To re-seed notifications:

1. Delete existing notifications (optional):
```sql
DELETE FROM notifications;
```

2. Run the seed script again:
```bash
npm run seed:notifications
```

## All Seed Scripts Available

```bash
npm run seed:users           # Seed admin and regular users
npm run seed:ph              # Seed Port Harcourt routes and locations
npm run seed:community       # Seed community posts
npm run seed:notifications   # Seed notifications (new!)
```

Run them in this order for best results:
1. `seed:users`
2. `seed:ph`
3. `seed:community`
4. `seed:notifications`
