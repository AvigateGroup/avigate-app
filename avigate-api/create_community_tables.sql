-- SQL Script to Create Community Tables
-- Run this script on your Railway PostgreSQL database

-- ============================================
-- 1. Create ENUM types
-- ============================================

-- PostType enum
CREATE TYPE community_posts_posttype_enum AS ENUM (
    'traffic_update',
    'route_alert',
    'safety_concern',
    'tip',
    'general'
);

-- ContributionStatus enum
CREATE TYPE route_contributions_status_enum AS ENUM (
    'pending',
    'under_review',
    'approved',
    'rejected',
    'implemented'
);

-- SafetyLevel enum
CREATE TYPE safety_reports_safetylevel_enum AS ENUM (
    'safe',
    'caution',
    'unsafe',
    'dangerous'
);

-- ============================================
-- 2. Create community_posts table
-- ============================================

CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "authorId" UUID NOT NULL,
    "postType" community_posts_posttype_enum NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    "locationId" UUID,
    "routeId" UUID,
    images TEXT[] DEFAULT '{}',
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    "isVerified" BOOLEAN DEFAULT false,
    "isActive" BOOLEAN DEFAULT true,
    "verifiedBy" UUID,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes for community_posts
CREATE INDEX "IDX_community_posts_authorId" ON community_posts("authorId");
CREATE INDEX "IDX_community_posts_postType" ON community_posts("postType");
CREATE INDEX "IDX_community_posts_locationId" ON community_posts("locationId");
CREATE INDEX "IDX_community_posts_isVerified" ON community_posts("isVerified");
CREATE INDEX "IDX_community_posts_isActive" ON community_posts("isActive");
CREATE INDEX "IDX_community_posts_createdAt" ON community_posts("createdAt");

-- ============================================
-- 3. Create direction_shares table
-- ============================================

CREATE TABLE direction_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdBy" UUID NOT NULL,
    "startLocationId" UUID,
    "endLocationId" UUID,
    "shareToken" VARCHAR(255) UNIQUE NOT NULL,
    "customInstructions" TEXT,
    "routePreferences" JSONB,
    "accessCount" INTEGER DEFAULT 0,
    "expiresAt" TIMESTAMP,
    status VARCHAR(255) DEFAULT 'active',
    "lastAccessedBy" UUID,
    "lastAccessedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes for direction_shares
CREATE INDEX "IDX_direction_shares_createdBy" ON direction_shares("createdBy");
CREATE INDEX "IDX_direction_shares_shareToken" ON direction_shares("shareToken");
CREATE INDEX "IDX_direction_shares_status" ON direction_shares(status);

-- ============================================
-- 4. Create route_contributions table
-- ============================================

CREATE TABLE route_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "contributorId" UUID NOT NULL,
    "contributionType" VARCHAR(255) NOT NULL,
    "routeId" UUID,
    "startLocationId" UUID,
    "endLocationId" UUID,
    description TEXT NOT NULL,
    "proposedData" JSONB NOT NULL,
    status route_contributions_status_enum DEFAULT 'pending',
    "reviewNotes" TEXT,
    "reviewedBy" UUID,
    "reviewedAt" TIMESTAMP,
    "implementedBy" UUID,
    "implementedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes for route_contributions
CREATE INDEX "IDX_route_contributions_contributorId" ON route_contributions("contributorId");
CREATE INDEX "IDX_route_contributions_status" ON route_contributions(status);

-- ============================================
-- 5. Create safety_reports table
-- ============================================

CREATE TABLE safety_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "reportedBy" UUID NOT NULL,
    "locationId" UUID,
    "routeId" UUID,
    "safetyLevel" safety_reports_safetylevel_enum NOT NULL,
    "incidentType" VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    "incidentDate" TIMESTAMP NOT NULL,
    "isVerified" BOOLEAN DEFAULT false,
    status VARCHAR(255) DEFAULT 'open',
    "verifiedBy" UUID,
    "resolvedBy" UUID,
    "resolvedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes for safety_reports
CREATE INDEX "IDX_safety_reports_reportedBy" ON safety_reports("reportedBy");
CREATE INDEX "IDX_safety_reports_locationId" ON safety_reports("locationId");
CREATE INDEX "IDX_safety_reports_status" ON safety_reports(status);

-- ============================================
-- Done!
-- ============================================

-- Verify tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('community_posts', 'direction_shares', 'route_contributions', 'safety_reports')
ORDER BY table_name;
