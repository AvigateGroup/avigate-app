import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommentsAndVotes1736423700000 implements MigrationInterface {
  name = 'AddCommentsAndVotes1736423700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create community_comments table
    await queryRunner.query(`
      CREATE TABLE "community_comments" (
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

    // Create indexes for community_comments
    await queryRunner.query(`CREATE INDEX "IDX_community_comments_postId" ON "community_comments" ("postId")`);
    await queryRunner.query(`CREATE INDEX "IDX_community_comments_authorId" ON "community_comments" ("authorId")`);
    await queryRunner.query(`CREATE INDEX "IDX_community_comments_isActive" ON "community_comments" ("isActive")`);
    await queryRunner.query(`CREATE INDEX "IDX_community_comments_createdAt" ON "community_comments" ("createdAt")`);

    // Create post_votes table
    await queryRunner.query(`
      CREATE TABLE "post_votes" (
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

    // Create indexes for post_votes
    await queryRunner.query(`CREATE INDEX "IDX_post_votes_userId" ON "post_votes" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_post_votes_postId" ON "post_votes" ("postId")`);

    // Create comment_votes table
    await queryRunner.query(`
      CREATE TABLE "comment_votes" (
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

    // Create indexes for comment_votes
    await queryRunner.query(`CREATE INDEX "IDX_comment_votes_userId" ON "comment_votes" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_comment_votes_commentId" ON "comment_votes" ("commentId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "comment_votes"`);
    await queryRunner.query(`DROP TABLE "post_votes"`);
    await queryRunner.query(`DROP TABLE "community_comments"`);
  }
}
