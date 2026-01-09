// src/modules/community/community.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { CommunityPost } from './entities/community-post.entity';
import { CommunityComment } from './entities/community-comment.entity';
import { PostVote } from './entities/post-vote.entity';
import { CommentVote } from './entities/comment-vote.entity';
import { DirectionShare } from './entities/direction-share.entity';
import { RouteContribution } from './entities/route-contribution.entity';
import { SafetyReport } from './entities/safety-report.entity';
import { ReputationModule } from '../reputation/reputation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommunityPost,
      CommunityComment,
      PostVote,
      CommentVote,
      DirectionShare,
      RouteContribution,
      SafetyReport,
    ]),
    ReputationModule,
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService],
})
export class CommunityModule {}
