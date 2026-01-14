// src/modules/route/services/trip.service.ts (UPDATED WITH EMAIL INTEGRATION)
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveTrip, TripStatus } from '../entities/active-trip.entity';
import { Route } from '../entities/route.entity';
import { RouteStep } from '../entities/route-step.entity';
import { RouteSegment } from '../entities/route-segment.entity';
import { User } from '../../user/entities/user.entity';
import { GeofencingService } from './geofencing.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserTripEmailService } from '../../email/user-trip-email.service';
import { logger } from '@/utils/logger.util';

export interface LocationUpdate {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: Date;
}

export interface TripProgressUpdate {
  currentStepCompleted: boolean;
  nextStepStarted: boolean;
  distanceToNextWaypoint: number;
  estimatedArrival: Date;
  alerts: string[];
}

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(ActiveTrip)
    private tripRepository: Repository<ActiveTrip>,
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @InjectRepository(RouteStep)
    private stepRepository: Repository<RouteStep>,
    @InjectRepository(RouteSegment)
    private segmentRepository: Repository<RouteSegment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private geofencingService: GeofencingService,
    private notificationsService: NotificationsService,
    private userTripEmailService: UserTripEmailService,
  ) {}

  /**
   * Start a new trip
   */
  async startTrip(
    userId: string,
    routeId: string,
    startLocation: { lat: number; lng: number },
  ): Promise<ActiveTrip> {
    // Check if user already has an active trip
    const existingTrip = await this.tripRepository.findOne({
      where: {
        userId,
        status: TripStatus.IN_PROGRESS,
      },
    });

    if (existingTrip) {
      throw new BadRequestException(
        'You already have an active trip. Please complete or cancel it first.',
      );
    }

    // Try to get route with steps first
    let route = await this.routeRepository.findOne({
      where: { id: routeId },
      relations: ['steps', 'startLocation', 'endLocation'],
    });

    // If not found, try to get segment (for intermediate stop routes)
    let segment: RouteSegment | null = null;
    if (!route) {
      segment = await this.segmentRepository.findOne({
        where: { id: routeId },
        relations: ['startLocation', 'endLocation'],
      });

      if (!segment) {
        throw new NotFoundException('Route or segment not found');
      }
    }

    let firstStepId: string | undefined = undefined;
    let endLocationId: string;
    let startLocationId: string;
    let endLocationName: string;
    let endLat: number;
    let endLng: number;

    if (route) {
      // Traditional route with steps
      route.steps.sort((a, b) => a.stepOrder - b.stepOrder);
      const firstStep = route.steps[0];
      firstStepId = firstStep.id;
      startLocationId = route.startLocationId;
      endLocationId = route.endLocationId;
      endLocationName = route.endLocation.name;
      endLat = Number(route.endLocation.latitude);
      endLng = Number(route.endLocation.longitude);
    } else if (segment) {
      // Segment-based route (intermediate stop)
      startLocationId = segment.startLocationId;
      endLocationId = segment.endLocationId;
      endLocationName = segment.endLocation?.name || 'destination';
      endLat = Number(segment.endLocation?.latitude);
      endLng = Number(segment.endLocation?.longitude);
    } else {
      throw new NotFoundException('Route not found');
    }

    // Calculate ETA
    const estimatedArrival = this.geofencingService.calculateETA(
      startLocation,
      { lat: endLat, lng: endLng },
      30, // average speed in km/h
    );

    // Create trip
    // For segment-based routes, don't set routeId (to avoid FK constraint violation)
    // We store the segment info via start/end locations and metadata instead
    const trip = new ActiveTrip();
    trip.userId = userId;
    trip.startLocationId = startLocationId;
    trip.endLocationId = endLocationId;
    trip.currentLat = startLocation.lat;
    trip.currentLng = startLocation.lng;
    trip.status = TripStatus.IN_PROGRESS;
    trip.startedAt = new Date();
    trip.estimatedArrival = estimatedArrival;
    trip.locationHistory = [
      {
        lat: startLocation.lat,
        lng: startLocation.lng,
        timestamp: new Date().toISOString(),
      },
    ];
    trip.stepProgress = firstStepId
      ? {
          [firstStepId]: {
            startedAt: new Date().toISOString(),
          },
        }
      : {};
    trip.notificationsSent = {};

    // Only set routeId if it's an actual route (not a segment)
    if (route) {
      trip.routeId = routeId;
    }

    // Only set currentStepId if it exists
    if (firstStepId) {
      trip.currentStepId = firstStepId;
    }

    // Store segment info in metadata for segment-based trips
    if (segment) {
      trip.metadata = {
        segmentId: segment.id,
        isSegmentBased: true,
      };
    }

    await this.tripRepository.save(trip);

    // Send welcome notification
    await this.notificationsService.sendToUser(userId, {
      title: 'Trip Started',
      body: `Your journey to ${endLocationName} has begun. Safe travels!`,
      type: 'trip_started' as any,
      data: {
        tripId: trip.id,
        routeId: routeId,
      },
    });

    logger.info(`Trip started: ${trip.id} for user ${userId}`);

    return trip;
  }

  /**
   * Update user location and check progress
   */
  async updateLocation(
    tripId: string,
    userId: string,
    location: LocationUpdate,
  ): Promise<TripProgressUpdate> {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId, userId },
      relations: ['route', 'route.steps', 'currentStep', 'route.endLocation', 'endLocation'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.status !== TripStatus.IN_PROGRESS) {
      throw new BadRequestException('Trip is not in progress');
    }

    // Update location
    trip.currentLat = location.lat;
    trip.currentLng = location.lng;

    // Add to location history
    if (!trip.locationHistory) {
      trip.locationHistory = [];
    }
    trip.locationHistory.push({
      lat: location.lat,
      lng: location.lng,
      timestamp: (location.timestamp || new Date()).toISOString(),
      accuracy: location.accuracy,
    });

    // Handle segment-based trips (no route/steps)
    if (!trip.route || !trip.route.steps || trip.route.steps.length === 0) {
      // For segment-based trips, check if user has arrived at end location
      const endLocation = trip.route?.endLocation || trip.endLocation;
      const destination = {
        lat: Number(endLocation.latitude),
        lng: Number(endLocation.longitude),
      };

      const distanceToDestination = this.geofencingService.calculateDistance(
        { lat: location.lat, lng: location.lng },
        destination,
      );

      const alerts: string[] = [];
      let currentStepCompleted = false;

      // Check arrival
      if (
        this.geofencingService.hasArrived({ lat: location.lat, lng: location.lng }, destination)
      ) {
        currentStepCompleted = true;
        await this.completeTrip(trip.id, userId);
        alerts.push('Trip completed! You have arrived at your destination.');
      }
      // Check if approaching
      else if (
        this.geofencingService.isApproaching(
          { lat: location.lat, lng: location.lng },
          destination,
        )
      ) {
        const notificationKey = `approaching_destination`;
        if (!trip.notificationsSent[notificationKey]) {
          await this.notificationsService.sendToUser(userId, {
            title: 'Approaching Destination',
            body: `You are approaching ${endLocation.name}. Get ready to alight.`,
            type: 'approaching' as any,
            data: {
              tripId: trip.id,
            },
          });
          alerts.push(`Approaching ${endLocation.name}`);
          trip.notificationsSent[notificationKey] = true;
        }
      }

      // Update ETA
      trip.estimatedArrival = this.geofencingService.calculateETA(
        { lat: location.lat, lng: location.lng },
        destination,
      );

      await this.tripRepository.save(trip);

      return {
        currentStepCompleted,
        nextStepStarted: false,
        distanceToNextWaypoint: distanceToDestination,
        estimatedArrival: trip.estimatedArrival,
        alerts,
      };
    }

    // Sort steps for traditional routes
    trip.route.steps.sort((a, b) => a.stepOrder - b.stepOrder);

    const currentStep = trip.currentStep;
    const currentStepIndex = trip.route.steps.findIndex(s => s.id === currentStep.id);

    const alerts: string[] = [];
    let currentStepCompleted = false;
    let nextStepStarted = false;

    // Check if arrived at current step's destination
    const stepDestination = {
      lat: Number(currentStep.toLocation?.latitude || trip.route.endLocation.latitude),
      lng: Number(currentStep.toLocation?.longitude || trip.route.endLocation.longitude),
    };

    const distanceToDestination = this.geofencingService.calculateDistance(
      { lat: location.lat, lng: location.lng },
      stepDestination,
    );

    // Check arrival at current step
    if (
      this.geofencingService.hasArrived({ lat: location.lat, lng: location.lng }, stepDestination)
    ) {
      currentStepCompleted = true;

      // Update step progress
      if (!trip.stepProgress[currentStep.id].completedAt) {
        trip.stepProgress[currentStep.id].completedAt = new Date().toISOString();

        const notificationKey = `step_completed_${currentStep.id}`;
        if (!trip.notificationsSent[notificationKey]) {
          const isLastStep = currentStepIndex === trip.route.steps.length - 1;

          if (isLastStep) {
            // Trip completed - this will trigger email
            await this.completeTrip(trip.id, userId);
            alerts.push('Trip completed! You have arrived at your destination.');
          } else {
            // Move to next step
            const nextStep = trip.route.steps[currentStepIndex + 1];
            trip.currentStepId = nextStep.id;
            trip.stepProgress[nextStep.id] = {
              startedAt: new Date().toISOString(),
            };
            nextStepStarted = true;

            await this.notificationsService.sendToUser(userId, {
              title: 'Next Step',
              body: `Step ${currentStepIndex + 1} completed. Now: ${nextStep.instructions.substring(0, 100)}...`,
              type: 'step_completed' as any,
              data: {
                tripId: trip.id,
                stepId: nextStep.id,
              },
            });

            alerts.push(`Step ${currentStepIndex + 1} completed. Moving to next step.`);
            trip.notificationsSent[notificationKey] = true;
          }
        }
      }
    }
    // Check if approaching
    else if (
      this.geofencingService.isApproaching(
        { lat: location.lat, lng: location.lng },
        stepDestination,
      )
    ) {
      const notificationKey = `approaching_${currentStep.id}`;
      if (!trip.notificationsSent[notificationKey]) {
        const locationName = currentStep.toLocation?.name || 'your destination';

        await this.notificationsService.sendToUser(userId, {
          title: 'Approaching Stop',
          body: `You are approaching ${locationName}. Get ready to alight.`,
          type: 'approaching' as any,
          data: {
            tripId: trip.id,
            stepId: currentStep.id,
          },
        });

        alerts.push(`Approaching ${locationName}`);
        trip.notificationsSent[notificationKey] = true;
      }
    }

    // Update ETA
    trip.estimatedArrival = this.geofencingService.calculateETA(
      { lat: location.lat, lng: location.lng },
      {
        lat: Number(trip.route.endLocation.latitude),
        lng: Number(trip.route.endLocation.longitude),
      },
    );

    await this.tripRepository.save(trip);

    return {
      currentStepCompleted,
      nextStepStarted,
      distanceToNextWaypoint: distanceToDestination,
      estimatedArrival: trip.estimatedArrival,
      alerts,
    };
  }

  /**
   * Get active trip for user
   */
  async getActiveTrip(userId: string): Promise<ActiveTrip | null> {
    const trip = await this.tripRepository.findOne({
      where: {
        userId,
        status: TripStatus.IN_PROGRESS,
      },
      relations: [
        'route',
        'route.steps',
        'route.steps.fromLocation',
        'route.steps.toLocation',
        'currentStep',
        'startLocation',
        'endLocation',
      ],
    });

    // For segment-based trips, create a route structure with steps from segment
    if (trip && !trip.route && trip.metadata?.isSegmentBased) {
      const segmentId = trip.metadata.segmentId;

      // Fetch the segment to get instructions and intermediate stops
      const segment = await this.segmentRepository.findOne({
        where: { id: segmentId },
        relations: ['startLocation', 'endLocation'],
      });

      if (segment) {
        // Create a single step from the segment with full instructions
        // Convert distance to meters and duration to seconds to match API convention
        const distanceMeters = Number(segment.distance) * 1000;
        const durationSeconds = Number(segment.estimatedDuration) * 60;

        const steps = [
          {
            id: `segment-step-${segment.id}`,
            stepOrder: 1,
            instructions: segment.instructions,
            transportMode: segment.transportModes[0] || 'bus',
            distance: distanceMeters,
            duration: durationSeconds, // Frontend expects 'duration' field in seconds
            estimatedDuration: durationSeconds, // Also set for compatibility
            estimatedFare: segment.minFare ? Number(segment.minFare) : undefined,
            fromLocation: segment.startLocation,
            toLocation: segment.endLocation,
          },
        ];

        // Create a minimal route object for segment-based trips
        (trip as any).route = {
          id: segment.id,
          name: segment.name,
          distance: distanceMeters, // in meters
          duration: durationSeconds, // in seconds
          estimatedDuration: durationSeconds, // in seconds
          minFare: segment.minFare ? Number(segment.minFare) : undefined,
          maxFare: segment.maxFare ? Number(segment.maxFare) : undefined,
          transportModes: segment.transportModes,
          steps: steps,
          startLocation: segment.startLocation,
          endLocation: segment.endLocation,
        };

        // Set the current step to the segment step if not already set
        if (!trip.currentStepId) {
          trip.currentStepId = steps[0].id;
          (trip as any).currentStep = steps[0];
        }
      } else {
        // Fallback if segment not found
        (trip as any).route = {
          id: trip.metadata.segmentId,
          name: `${trip.startLocation?.name || 'Start'} to ${trip.endLocation?.name || 'End'}`,
          distance: 0,
          estimatedDuration: 0,
          steps: [],
          startLocation: trip.startLocation,
          endLocation: trip.endLocation,
        };
      }
    }

    return trip;
  }

  /**
   * Complete a trip (with email notification)
   */
  async completeTrip(tripId: string, userId: string): Promise<ActiveTrip> {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId, userId },
      relations: [
        'route',
        'route.endLocation',
        'route.startLocation',
        'route.steps',
        'route.steps.fromLocation',
        'route.steps.toLocation',
        'startLocation',
        'endLocation',
      ],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    trip.status = TripStatus.COMPLETED;
    trip.completedAt = new Date();

    await this.tripRepository.save(trip);

    // Get location info (works for both route and segment-based trips)
    const endLocation = trip.route?.endLocation || trip.endLocation;
    const startLocation = trip.route?.startLocation || trip.startLocation;

    // Send push notification
    await this.notificationsService.sendToUser(userId, {
      title: 'Trip Completed',
      body: `You have arrived at ${endLocation.name}. We hope you had a safe journey!`,
      type: 'trip_completed' as any,
      data: {
        tripId: trip.id,
      },
    });

    // Send email with trip summary
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user && user.email) {
        // For segment-based trips, we may not have detailed steps
        const hasSteps = trip.route && trip.route.steps && trip.route.steps.length > 0;

        if (hasSteps) {
          // Sort steps for email
          trip.route.steps.sort((a, b) => a.stepOrder - b.stepOrder);
        }

        await this.userTripEmailService.sendTripCompletionEmail({
          tripId: trip.id,
          userName: user.firstName,
          userEmail: user.email,
          startLocation: startLocation.name,
          endLocation: endLocation.name,
          startTime: trip.startedAt,
          endTime: trip.completedAt,
          distance: trip.route ? Number(trip.route.distance) : 0,
          duration: trip.route ? Number(trip.route.estimatedDuration) : 0,
          transportModes: trip.route?.transportModes || [],
          steps: hasSteps
            ? trip.route.steps.map((step, index) => ({
                stepNumber: index + 1,
                instruction: step.instructions,
                distance: Number(step.distance),
                duration: Number(step.estimatedDuration),
                fromLocation: step.fromLocation?.name,
                toLocation: step.toLocation?.name,
              }))
            : [],
          fare: trip.route?.minFare
            ? {
                min: Number(trip.route.minFare),
                max: Number(trip.route.maxFare),
              }
            : undefined,
          status: 'completed',
        });

        logger.info(`Trip completion email sent for trip ${trip.id}`);
      }
    } catch (emailError) {
      logger.error('Failed to send trip completion email:', emailError);
      // Don't fail the trip completion if email fails
    }

    logger.info(`Trip completed: ${trip.id} for user ${userId}`);

    return trip;
  }

  /**
   * Cancel a trip (with email notification)
   */
  async cancelTrip(tripId: string, userId: string, reason?: string): Promise<ActiveTrip> {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId, userId },
      relations: [
        'route',
        'route.startLocation',
        'route.endLocation',
        'route.steps',
        'route.steps.fromLocation',
        'route.steps.toLocation',
        'startLocation',
        'endLocation',
      ],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.status !== TripStatus.IN_PROGRESS) {
      throw new BadRequestException('Only active trips can be cancelled');
    }

    const previousStatus = trip.status;
    trip.status = TripStatus.CANCELLED;
    trip.completedAt = new Date();
    trip.metadata = {
      ...trip.metadata,
      cancellationReason: reason,
      cancelledAt: new Date().toISOString(),
      previousStatus,
    };

    await this.tripRepository.save(trip);

    // Get location info (works for both route and segment-based trips)
    const endLocation = trip.route?.endLocation || trip.endLocation;
    const startLocation = trip.route?.startLocation || trip.startLocation;

    // Send push notification
    await this.notificationsService.sendToUser(userId, {
      title: 'Trip Cancelled',
      body: reason ? `Trip cancelled: ${reason}` : 'Your trip has been cancelled.',
      type: 'trip_cancelled' as any,
      data: {
        tripId: trip.id,
      },
    });

    // Send cancellation email
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user && user.email) {
        // For segment-based trips, we may not have detailed steps
        const hasSteps = trip.route && trip.route.steps && trip.route.steps.length > 0;

        if (hasSteps) {
          // Sort steps for email
          trip.route.steps.sort((a, b) => a.stepOrder - b.stepOrder);
        }

        await this.userTripEmailService.sendTripCancellationEmail({
          tripId: trip.id,
          userName: user.firstName,
          userEmail: user.email,
          startLocation: startLocation.name,
          endLocation: endLocation.name,
          startTime: trip.startedAt,
          endTime: trip.completedAt,
          distance: trip.route ? Number(trip.route.distance) : 0,
          duration: trip.route ? Number(trip.route.estimatedDuration) : 0,
          transportModes: trip.route?.transportModes || [],
          steps: hasSteps
            ? trip.route.steps.map((step, index) => ({
                stepNumber: index + 1,
                instruction: step.instructions,
                distance: Number(step.distance),
                duration: Number(step.estimatedDuration),
                fromLocation: step.fromLocation?.name,
                toLocation: step.toLocation?.name,
              }))
            : [],
          fare: trip.route?.minFare
            ? {
                min: Number(trip.route.minFare),
                max: Number(trip.route.maxFare),
              }
            : undefined,
          status: 'cancelled',
          cancellationReason: reason,
        });

        logger.info(`Trip cancellation email sent for trip ${trip.id}`);
      }
    } catch (emailError) {
      logger.error('Failed to send trip cancellation email:', emailError);
      // Don't fail the cancellation if email fails
    }

    logger.info(
      `Trip cancelled: ${trip.id} for user ${userId}. Reason: ${reason || 'Not provided'}`,
    );

    return trip;
  }

  /**
   * End trip manually (alias for cancel with specific reason)
   */
  async endTrip(tripId: string, userId: string): Promise<ActiveTrip> {
    return this.cancelTrip(tripId, userId, 'Ended by user');
  }

  /**
   * Get trip history for user
   */
  async getTripHistory(userId: string, limit: number = 20) {
    return this.tripRepository.find({
      where: { userId },
      relations: ['route', 'route.startLocation', 'route.endLocation'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get trip statistics for user
   */
  async getTripStatistics(userId: string) {
    const trips = await this.tripRepository.find({
      where: { userId },
      relations: ['route'],
    });

    const completed = trips.filter(t => t.status === TripStatus.COMPLETED);
    const cancelled = trips.filter(t => t.status === TripStatus.CANCELLED);

    const totalDistance = completed.reduce(
      (sum, trip) => sum + Number(trip.route.distance || 0),
      0,
    );

    return {
      totalTrips: trips.length,
      completedTrips: completed.length,
      cancelledTrips: cancelled.length,
      activeTrips: trips.filter(t => t.status === TripStatus.IN_PROGRESS).length,
      totalDistance: totalDistance.toFixed(2),
    };
  }
}
