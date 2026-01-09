// src/scripts/run-migration-comments.ts
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Load environment variables
config();

async function runMigration() {
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

  console.log('🔌 Connecting to database...');
  await dataSource.initialize();
  console.log('✅ Database connected!\n');

  try {
    console.log('📝 Creating community_comments table...');
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS "community_comments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "postId" uuid NOT NULL,
        "authorId" uuid NOT NULL,
        "content" text NOT NULL,
        "upvotes" integer NOT NULL DEFAULT 0,
        "downvotes" integer NOT NULL DEFAULT 0,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_comment_post" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_comment_author" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    console.log('✅ community_comments table created');

    console.log('📝 Creating indexes for community_comments...');
    await dataSource.query(`CREATE INDEX IF NOT EXISTS "IDX_community_comments_postId" ON "community_comments" ("postId")`);
    await dataSource.query(`CREATE INDEX IF NOT EXISTS "IDX_community_comments_authorId" ON "community_comments" ("authorId")`);
    await dataSource.query(`CREATE INDEX IF NOT EXISTS "IDX_community_comments_isActive" ON "community_comments" ("isActive")`);
    await dataSource.query(`CREATE INDEX IF NOT EXISTS "IDX_community_comments_createdAt" ON "community_comments" ("createdAt")`);
    console.log('✅ Indexes created for community_comments');

    console.log('📝 Creating post_votes table...');
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS "post_votes" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "postId" uuid NOT NULL,
        "voteType" VARCHAR NOT NULL CHECK ("voteType" IN ('up', 'down')),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_post_votes_user_post" UNIQUE ("userId", "postId"),
        CONSTRAINT "FK_post_vote_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_post_vote_post" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE
      )
    `);
    console.log('✅ post_votes table created');

    console.log('📝 Creating indexes for post_votes...');
    await dataSource.query(`CREATE INDEX IF NOT EXISTS "IDX_post_votes_userId" ON "post_votes" ("userId")`);
    await dataSource.query(`CREATE INDEX IF NOT EXISTS "IDX_post_votes_postId" ON "post_votes" ("postId")`);
    console.log('✅ Indexes created for post_votes');

    console.log('📝 Creating comment_votes table...');
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS "comment_votes" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "commentId" uuid NOT NULL,
        "voteType" VARCHAR NOT NULL CHECK ("voteType" IN ('up', 'down')),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_comment_votes_user_comment" UNIQUE ("userId", "commentId"),
        CONSTRAINT "FK_comment_vote_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_comment_vote_comment" FOREIGN KEY ("commentId") REFERENCES "community_comments"("id") ON DELETE CASCADE
      )
    `);
    console.log('✅ comment_votes table created');

    console.log('📝 Creating indexes for comment_votes...');
    await dataSource.query(`CREATE INDEX IF NOT EXISTS "IDX_comment_votes_userId" ON "comment_votes" ("userId")`);
    await dataSource.query(`CREATE INDEX IF NOT EXISTS "IDX_comment_votes_commentId" ON "comment_votes" ("commentId")`);
    console.log('✅ Indexes created for comment_votes');

    console.log('\n✅ All tables and indexes created successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('\n🔌 Database connection closed');
  }
}

runMigration();
