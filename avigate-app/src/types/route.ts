// src/types/route.ts

export interface DataAvailability {
  hasVehicleData: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason?: string;
}

export interface AlternativeOptions {
  askLocals: boolean;
  localPhrases: string[];
  walkable: boolean;
}

export interface WalkingDirections {
  distance: number;
  duration: number;
  steps: Array<{
    instruction: string;
    distance: number;
    duration: number;
  }>;
}

export interface AlternativeTransport {
  type: 'okada' | 'keke';
  estimatedFare: number;
  instructions: string;
}

export interface RouteStep {
  id?: string; // ADD THIS - optional for backward compatibility
  order: number;
  fromLocation: string;
  toLocation: string;
  transportMode: 'bus' | 'taxi' | 'keke' | 'okada' | 'walk';
  instructions: string;
  duration: number;
  distance: number;
  estimatedFare?: number;
  dataAvailability?: DataAvailability;
  walkingDirections?: WalkingDirections;
  alternativeTransport?: AlternativeTransport;
  alternativeOptions?: AlternativeOptions;
}

export interface Route {
  routeId?: string;
  routeName: string;
  source: 'database' | 'google_maps' | 'intermediate_stop' | 'with_walking';
  distance: number;
  duration: number;
  minFare?: number;
  maxFare?: number;
  steps: RouteStep[];
  confidence: number;
  requiresWalking?: boolean;
  finalDestinationInfo?: {
    needsWalking: boolean;
    dropOffLocation: any;
    walkingDirections?: WalkingDirections;
    alternativeTransport?: AlternativeTransport;
  };
}
