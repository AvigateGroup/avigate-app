// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { LocationModule } from './modules/location/location.module';
import { RouteModule } from './modules/route/route.module';
import { FareModule } from './modules/fare/fare.module';
import { ReputationModule } from './modules/reputation/reputation.module';
import { CommunityModule } from './modules/community/community.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { EmailModule } from './modules/email/email.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import databaseConfig from './config/database.config';

// Import all entities explicitly
import { Admin } from './modules/admin/entities/admin.entity';
import { AdminSession } from './modules/admin/entities/admin-session.entity';
import { User } from './modules/user/entities/user.entity';
import { UserDevice } from './modules/user/entities/user-device.entity';
import { UserOTP } from './modules/user/entities/user-otp.entity';
import { Location } from './modules/location/entities/location.entity';
import { Landmark } from './modules/location/entities/landmark.entity';
import { Route } from './modules/route/entities/route.entity';
import { RouteStep } from './modules/route/entities/route-step.entity';
import { RouteSegment } from './modules/route/entities/route-segment.entity';
import { ActiveTrip } from './modules/route/entities/active-trip.entity';
import { FareFeedback } from './modules/fare/entities/fare-feedback.entity';
import { Journey } from './modules/journey/entities/journey.entity';
import { JourneyLeg } from './modules/journey/entities/journey-leg.entity';
import { CommunityPost } from './modules/community/entities/community-post.entity';
import { CommunityComment } from './modules/community/entities/community-comment.entity';
import { PostVote } from './modules/community/entities/post-vote.entity';
import { CommentVote } from './modules/community/entities/comment-vote.entity';
import { DirectionShare } from './modules/community/entities/direction-share.entity';
import { RouteContribution } from './modules/community/entities/route-contribution.entity';
import { SafetyReport } from './modules/community/entities/safety-report.entity';
import { Notification } from './modules/notifications/entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [
      Admin,
      AdminSession,
      User,
      UserDevice,
      UserOTP,
      Location,
      Landmark,
      Route,
      RouteStep,
      RouteSegment,
      ActiveTrip,
      FareFeedback,
      Journey,
      JourneyLeg,
      CommunityPost,
      CommunityComment,
      PostVote,
      CommentVote,
      DirectionShare,
      RouteContribution,
      SafetyReport,
      Notification,
    ],
    synchronize: false, // Disabled to avoid schema conflicts - use migrations instead
    logging: configService.get('NODE_ENV') === 'development',
    ssl: configService.get('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
    retryAttempts: 10,
    retryDelay: 3000,
    connectTimeoutMS: 60000, // Increased from 10s to 60s
    maxQueryExecutionTime: 30000, // Increased from 5s to 30s
    // Connection pool settings
    extra: {
      max: 20, // Maximum pool size
      min: 5, // Minimum pool size
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 60000, // Wait up to 60s for connection from pool
      statement_timeout: 30000, // Cancel queries running longer than 30s
    },
  }),
  inject: [ConfigService],
}),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get('RATE_LIMIT_TTL') || 60,
          limit: configService.get('RATE_LIMIT_MAX') || 100,
        },
      ],
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    AdminModule,
    LocationModule,
    RouteModule,
    ReputationModule,
    FareModule,
    CommunityModule,
    AnalyticsModule,
    EmailModule,
    WebsocketModule,
    NotificationsModule,
  ],
})
export class AppModule {}
