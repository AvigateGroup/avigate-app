// src/scripts/seed-notifications.ts
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Load environment variables
config();

async function seedNotifications() {
  // Create a new DataSource instance
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'postgres',
    password: String(process.env.DATABASE_PASSWORD || ''),
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: true,
  });

  console.log('🌱 Starting Notifications Seed...\n');

  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connected!\n');

    // Get existing users
    console.log('👥 Fetching existing users...');
    const users = await dataSource.query(`
      SELECT id, "firstName", "lastName", email
      FROM users
      WHERE "isActive" = true
      ORDER BY "createdAt" DESC
      LIMIT 10
    `);

    if (users.length === 0) {
      console.log('⚠️  No users found. Please run seed-admin-and-users.ts first.');
      return;
    }

    console.log(`✅ Found ${users.length} users\n`);

    // Get some community posts if they exist
    const communityPosts = await dataSource.query(`
      SELECT id, title, "postType"
      FROM community_posts
      WHERE "isActive" = true
      ORDER BY "createdAt" DESC
      LIMIT 5
    `);

    console.log(`✅ Found ${communityPosts.length} community posts\n`);

    // Notifications data
    const notifications = [
      // Trip notifications
      {
        type: 'trip_started',
        title: 'Trip Started',
        body: 'Your trip to Rumuokoro has started. Follow the directions for a smooth journey.',
        data: { tripId: 'demo-trip-1', destination: 'Rumuokoro' },
        isRead: false,
        hoursAgo: 2,
      },
      {
        type: 'trip_completed',
        title: 'Trip Completed',
        body: 'You have arrived at your destination. How was your trip?',
        data: { tripId: 'demo-trip-2', destination: 'Choba' },
        actionUrl: '/profile',
        isRead: false,
        hoursAgo: 5,
      },
      {
        type: 'approaching_stop',
        title: 'Approaching Stop',
        body: 'You are approaching Choba Junction. Prepare to alight.',
        data: { stopName: 'Choba Junction', nextStop: 'Alakahia' },
        isRead: true,
        hoursAgo: 8,
      },
      {
        type: 'next_step',
        title: 'Next Step',
        body: 'Take a keke from Mile 3 Park to Rumuokoro Junction. Fare: ₦100-150',
        data: { stepNumber: 2, totalSteps: 3 },
        isRead: false,
        hoursAgo: 12,
      },

      // Journey notifications
      {
        type: 'journey_start',
        title: 'Journey Started',
        body: 'Your journey from Eliozu to Town has begun. Stay safe!',
        data: { journeyId: 'demo-journey-1', from: 'Eliozu', to: 'Town' },
        isRead: true,
        hoursAgo: 24,
      },
      {
        type: 'transfer_alert',
        title: 'Transfer Coming Up',
        body: 'In 5 minutes, you will need to change from bus to keke at Garrison Junction.',
        data: { transferPoint: 'Garrison Junction', nextTransport: 'keke' },
        isRead: false,
        hoursAgo: 3,
      },
      {
        type: 'destination_alert',
        title: 'Almost There',
        body: 'You are 2 stops away from your destination at Rumuola.',
        data: { remainingStops: 2, destination: 'Rumuola' },
        isRead: false,
        hoursAgo: 1,
      },
      {
        type: 'rating_request',
        title: 'Rate Your Journey',
        body: 'How was your journey from Choba to Mile 1? Your feedback helps improve routes.',
        data: { journeyId: 'demo-journey-2' },
        actionUrl: '/profile',
        isRead: true,
        hoursAgo: 18,
      },

      // Community notifications
      {
        type: 'community_post',
        title: 'New Route Alert in Your Area',
        body: 'Heavy traffic reported at Choba Roundabout. Check community feed for updates.',
        data: { area: 'Choba' },
        actionUrl: '/community',
        isRead: false,
        hoursAgo: 1,
      },
      {
        type: 'community_post',
        title: 'Safety Alert',
        body: 'Poor lighting reported at Mile 3 Park. Stay alert when traveling at night.',
        data: { area: 'Mile 3' },
        actionUrl: '/community',
        isRead: false,
        hoursAgo: 4,
      },

      // Contribution notifications
      {
        type: 'contribution_approved',
        title: 'Contribution Approved!',
        body: 'Your route suggestion for Eliozu to Rumuokoro was approved! You earned 25 reputation points.',
        data: { contributionId: 'demo-contrib-1', reputationEarned: 25 },
        actionUrl: '/community/contribute',
        isRead: false,
        hoursAgo: 6,
      },
      {
        type: 'contribution_implemented',
        title: 'Your Contribution is Live!',
        body: 'Your fare update for Choba to Alakahia route is now live! You earned 50 bonus reputation points.',
        data: { contributionId: 'demo-contrib-2', reputationEarned: 50 },
        actionUrl: '/community/contribute',
        isRead: false,
        hoursAgo: 10,
      },
      {
        type: 'contribution_changes_requested',
        title: 'Changes Requested',
        body: 'Your route contribution needs some updates. Please review the feedback.',
        data: { contributionId: 'demo-contrib-3' },
        actionUrl: '/community/contribute',
        isRead: true,
        hoursAgo: 48,
      },

      // Location sharing
      {
        type: 'location_shared',
        title: 'Location Shared',
        body: 'Chidi shared their location with you. They are currently at Mile 1 Market.',
        data: { sharedBy: 'Chidi', location: 'Mile 1 Market' },
        isRead: true,
        hoursAgo: 72,
      },

      // System alerts
      {
        type: 'system_alert',
        title: 'Welcome to Avigate!',
        body: 'Start exploring routes, join the community, and contribute to help fellow travelers. Earn reputation points along the way!',
        data: { alertType: 'welcome' },
        actionUrl: '/community',
        isRead: false,
        hoursAgo: 120,
      },
      {
        type: 'system_alert',
        title: 'New Feature: Community Feed',
        body: 'Check out the new community feed to see real-time updates about routes, traffic, and safety alerts.',
        data: { feature: 'community_feed' },
        actionUrl: '/community',
        isRead: true,
        hoursAgo: 96,
      },
    ];

    console.log(`📝 Creating ${notifications.length} notifications for each user...\n`);

    let createdCount = 0;

    // Create notifications for each user
    for (const user of users) {
      console.log(`\n👤 Creating notifications for ${user.firstName} ${user.lastName}...`);

      for (const notification of notifications) {
        // Calculate created date
        const createdAt = new Date();
        createdAt.setHours(createdAt.getHours() - notification.hoursAgo);

        // Add some randomness to make it more realistic
        createdAt.setMinutes(createdAt.getMinutes() - Math.floor(Math.random() * 60));

        await dataSource.query(
          `
          INSERT INTO notifications (
            "userId",
            type,
            title,
            body,
            data,
            "imageUrl",
            "isRead",
            "actionUrl",
            "createdAt",
            "updatedAt"
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $9
          )
        `,
          [
            user.id,
            notification.type,
            notification.title,
            notification.body,
            JSON.stringify(notification.data),
            null,
            notification.isRead,
            notification.actionUrl || null,
            createdAt,
          ],
        );

        createdCount++;
      }

      console.log(`✅ Created ${notifications.length} notifications for ${user.firstName}`);
    }

    console.log(`\n✅ Created ${createdCount} total notifications!`);
    console.log('\n📊 Summary by Notification Type:');

    const summary = await dataSource.query(`
      SELECT type, COUNT(*) as count
      FROM notifications
      GROUP BY type
      ORDER BY count DESC
    `);

    summary.forEach((item: any) => {
      console.log(`   ${item.type}: ${item.count} notifications`);
    });

    const readStats = await dataSource.query(`
      SELECT "isRead", COUNT(*) as count
      FROM notifications
      GROUP BY "isRead"
    `);

    console.log('\n📊 Read Status:');
    readStats.forEach((item: any) => {
      console.log(`   ${item.isRead ? 'Read' : 'Unread'}: ${item.count} notifications`);
    });

    console.log('\n✅ Notifications seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('\n🔌 Database connection closed');
    }
  }
}

seedNotifications();
