# Manual Updates Required

The following files need to be updated to include the `type` parameter in `sendToUser()` calls:

## Files to Update:
1. `src/modules/route/services/trip.service.ts`
2. `src/modules/journey/services/journey-notification.service.ts`
3. `src/modules/admin/services/contribution-management.service.ts`
4. `src/modules/location-share/location-share.service.ts`
5. `src/modules/community/services/feed.service.ts`
6. `src/modules/route/gateways/trip.gateway.ts`

## Change Required:
Add `type: NotificationType.XXX` to each sendToUser() call.

### Example:
```typescript
// Before:
await this.notificationsService.sendToUser(userId, {
  title: 'Trip Started',
  body: 'Your journey has begun',
  data: { tripId: '123' },
});

// After:
import { NotificationType } from '@/modules/notifications/entities/notification.entity';

await this.notificationsService.sendToUser(userId, {
  type: NotificationType.TRIP_STARTED,
  title: 'Trip Started',
  body: 'Your journey has begun',
  data: { tripId: '123' },
});
```

## Available NotificationTypes:
- TRIP_STARTED
- TRIP_COMPLETED
- TRIP_CANCELLED
- NEXT_STEP
- APPROACHING_STOP
- LOCATION_SHARED
- COMMUNITY_POST
- CONTRIBUTION_APPROVED
- CONTRIBUTION_REJECTED
- SYSTEM_ALERT

**Note:** The backend will still work without these updates, but new notifications won't be saved to the database until the `type` field is added.
