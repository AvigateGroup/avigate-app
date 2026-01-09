// src/modules/community/community.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In } from 'typeorm';
import { CommunityPost } from './entities/community-post.entity';
import { CommunityComment } from './entities/community-comment.entity';
import { PostVote, VoteType as PostVoteType } from './entities/post-vote.entity';
import { CommentVote, VoteType as CommentVoteType } from './entities/comment-vote.entity';
import { DirectionShare } from './entities/direction-share.entity';
import { RouteContribution, ContributionStatus } from './entities/route-contribution.entity';
import { SafetyReport } from './entities/safety-report.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { CreateDirectionShareDto } from './dto/create-direction-share.dto';
import { ReputationService } from '../reputation/reputation.service';
import * as crypto from 'crypto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(CommunityPost)
    private postRepository: Repository<CommunityPost>,
    @InjectRepository(CommunityComment)
    private commentRepository: Repository<CommunityComment>,
    @InjectRepository(PostVote)
    private postVoteRepository: Repository<PostVote>,
    @InjectRepository(CommentVote)
    private commentVoteRepository: Repository<CommentVote>,
    @InjectRepository(DirectionShare)
    private directionShareRepository: Repository<DirectionShare>,
    @InjectRepository(RouteContribution)
    private contributionRepository: Repository<RouteContribution>,
    @InjectRepository(SafetyReport)
    private safetyReportRepository: Repository<SafetyReport>,
    private reputationService: ReputationService,
  ) {}

  async createPost(createPostDto: CreatePostDto, userId: string) {
    const post = this.postRepository.create({
      ...createPostDto,
      authorId: userId,
      isVerified: false,
      isActive: true,
    });

    await this.postRepository.save(post);

    return {
      success: true,
      message: 'Post created successfully',
      data: { post },
    };
  }

  async getPosts(postType?: string, locationId?: string, page: number = 1, limit: number = 20) {
    // Ensure page and limit are numbers
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.location', 'location')
      .where('post.isActive = :isActive', { isActive: true })
      .orderBy('post.createdAt', 'DESC')
      .take(limitNum)
      .skip((pageNum - 1) * limitNum);

    if (postType) {
      queryBuilder.andWhere('post.postType = :postType', { postType });
    }

    if (locationId) {
      queryBuilder.andWhere('post.locationId = :locationId', { locationId });
    }

    const [posts, total] = await queryBuilder.getManyAndCount();

    // Transform posts to include author information and hide sensitive fields
    const transformedPosts = posts.map(post => ({
      id: post.id,
      postType: post.postType,
      title: post.title,
      content: post.content,
      author: {
        id: post.author?.id,
        firstName: post.author?.firstName,
        lastName: post.author?.lastName,
        profilePicture: post.author?.profilePicture,
        reputationScore: post.author?.reputationScore,
      },
      location: post.location ? {
        id: post.location.id,
        name: post.location.name,
      } : null,
      images: post.images,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      isVerified: post.isVerified,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    return {
      success: true,
      data: {
        posts: transformedPosts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    };
  }

  async createDirectionShare(createDirectionShareDto: CreateDirectionShareDto, userId: string) {
    const shareToken = this.generateShareToken();

    const directionShare = this.directionShareRepository.create({
      ...createDirectionShareDto,
      createdBy: userId,
      shareToken,
      status: 'active',
      accessCount: 0,
    });

    await this.directionShareRepository.save(directionShare);

    return {
      success: true,
      message: 'Direction share created successfully',
      data: {
        directionShare,
        shareUrl: `https://avigate.co/share/${shareToken}`,
      },
    };
  }

  async getDirectionShare(shareToken: string, userId?: string) {
    const directionShare = await this.directionShareRepository.findOne({
      where: { shareToken, status: 'active' },
    });

    if (!directionShare) {
      throw new NotFoundException('Direction share not found or expired');
    }

    // Check expiration
    if (directionShare.expiresAt && directionShare.expiresAt < new Date()) {
      directionShare.status = 'expired';
      await this.directionShareRepository.save(directionShare);
      throw new NotFoundException('Direction share has expired');
    }

    // Update access tracking
    directionShare.accessCount += 1;
    directionShare.lastAccessedBy = userId ?? '';
    directionShare.lastAccessedAt = new Date();
    await this.directionShareRepository.save(directionShare);

    return {
      success: true,
      data: { directionShare },
    };
  }

  async submitContribution(contributionData: CreateContributionDto, userId: string) {
    const contribution = this.contributionRepository.create({
      ...contributionData,
      contributorId: userId,
      status: ContributionStatus.PENDING,
    });

    const savedContribution = await this.contributionRepository.save(contribution);

    // TypeScript now knows savedContribution is a RouteContribution with id
    await this.reputationService.awardRouteContributionPoints(userId, savedContribution.id);

    return {
      success: true,
      message: 'Contribution submitted. You earned 15 reputation points!',
      data: { contribution: savedContribution },
    };
  }

  async getContributions(status?: ContributionStatus, page: number = 1, limit: number = 20) {
    const where: any = {};
    if (status) where.status = status;

    const [contributions, total] = await this.contributionRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      success: true,
      data: {
        contributions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async reportSafetyConcern(reportData: any, userId: string) {
    const report = this.safetyReportRepository.create({
      ...reportData,
      reportedBy: userId,
      isVerified: false,
      status: 'open',
    });

    await this.safetyReportRepository.save(report);

    return {
      success: true,
      message: 'Safety report submitted successfully',
      data: { report },
    };
  }

  async getSafetyReports(locationId?: string, status?: string) {
    const where: any = {};
    if (locationId) where.locationId = locationId;
    if (status) where.status = status;

    // Get reports from last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    where.createdAt = MoreThan(ninetyDaysAgo);

    const reports = await this.safetyReportRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return {
      success: true,
      data: { reports, count: reports.length },
    };
  }

  async getPostById(postId: string, userId?: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId, isActive: true },
      relations: ['author', 'location'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Get comment count
    const commentCount = await this.commentRepository.count({
      where: { postId, isActive: true },
    });

    // Get user's vote if userId provided
    let userVote = null;
    if (userId) {
      const vote = await this.postVoteRepository.findOne({
        where: { postId, userId },
      });
      userVote = vote?.voteType || null;
    }

    return {
      success: true,
      data: {
        post: {
          id: post.id,
          postType: post.postType,
          title: post.title,
          content: post.content,
          author: {
            id: post.author?.id,
            firstName: post.author?.firstName,
            lastName: post.author?.lastName,
            profilePicture: post.author?.profilePicture,
            reputationScore: post.author?.reputationScore,
          },
          location: post.location
            ? {
                id: post.location.id,
                name: post.location.name,
              }
            : null,
          images: post.images,
          upvotes: post.upvotes,
          downvotes: post.downvotes,
          commentCount,
          isVerified: post.isVerified,
          createdAt: post.createdAt,
          userVote,
        },
      },
    };
  }

  async getComments(postId: string, userId?: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { postId, isActive: true },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    // Get user votes for all comments if userId provided
    let userVotes: Map<string, string> = new Map();
    if (userId && comments.length > 0) {
      const commentIds = comments.map(c => c.id);
      const votes = await this.commentVoteRepository.find({
        where: {
          userId,
          commentId: In(commentIds),
        },
      });
      votes.forEach(vote => {
        userVotes.set(vote.commentId, vote.voteType);
      });
    }

    const transformedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      author: {
        id: comment.author?.id,
        firstName: comment.author?.firstName,
        lastName: comment.author?.lastName,
        profilePicture: comment.author?.profilePicture,
        reputationScore: comment.author?.reputationScore,
      },
      upvotes: comment.upvotes,
      downvotes: comment.downvotes,
      createdAt: comment.createdAt,
      userVote: userVotes.get(comment.id) || null,
    }));

    return {
      success: true,
      data: {
        comments: transformedComments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async addComment(postId: string, userId: string, content: string) {
    // Verify post exists
    const post = await this.postRepository.findOne({
      where: { id: postId, isActive: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentRepository.create({
      postId,
      authorId: userId,
      content,
      isActive: true,
    });

    const savedComment = await this.commentRepository.save(comment);

    // Fetch comment with author details
    const fullComment = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['author'],
    });

    return {
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: {
          id: fullComment.id,
          content: fullComment.content,
          author: {
            id: fullComment.author?.id,
            firstName: fullComment.author?.firstName,
            lastName: fullComment.author?.lastName,
            profilePicture: fullComment.author?.profilePicture,
            reputationScore: fullComment.author?.reputationScore,
          },
          upvotes: fullComment.upvotes,
          downvotes: fullComment.downvotes,
          createdAt: fullComment.createdAt,
          userVote: null,
        },
      },
    };
  }

  async votePost(postId: string, userId: string, voteType: 'up' | 'down') {
    const post = await this.postRepository.findOne({
      where: { id: postId, isActive: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check existing vote
    const existingVote = await this.postVoteRepository.findOne({
      where: { postId, userId },
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote (toggle off)
        await this.postVoteRepository.remove(existingVote);
        if (voteType === 'up') {
          post.upvotes = Math.max(0, post.upvotes - 1);
        } else {
          post.downvotes = Math.max(0, post.downvotes - 1);
        }
      } else {
        // Change vote
        existingVote.voteType = voteType === 'up' ? PostVoteType.UP : PostVoteType.DOWN;
        await this.postVoteRepository.save(existingVote);

        if (voteType === 'up') {
          post.upvotes += 1;
          post.downvotes = Math.max(0, post.downvotes - 1);
        } else {
          post.downvotes += 1;
          post.upvotes = Math.max(0, post.upvotes - 1);
        }
      }
    } else {
      // New vote
      const vote = this.postVoteRepository.create({
        postId,
        userId,
        voteType: voteType === 'up' ? PostVoteType.UP : PostVoteType.DOWN,
      });
      await this.postVoteRepository.save(vote);

      if (voteType === 'up') {
        post.upvotes += 1;
      } else {
        post.downvotes += 1;
      }
    }

    await this.postRepository.save(post);

    return {
      success: true,
      message: 'Vote recorded',
      data: {
        upvotes: post.upvotes,
        downvotes: post.downvotes,
      },
    };
  }

  async voteComment(commentId: string, userId: string, voteType: 'up' | 'down') {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, isActive: true },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check existing vote
    const existingVote = await this.commentVoteRepository.findOne({
      where: { commentId, userId },
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote (toggle off)
        await this.commentVoteRepository.remove(existingVote);
        if (voteType === 'up') {
          comment.upvotes = Math.max(0, comment.upvotes - 1);
        } else {
          comment.downvotes = Math.max(0, comment.downvotes - 1);
        }
      } else {
        // Change vote
        existingVote.voteType = voteType === 'up' ? CommentVoteType.UP : CommentVoteType.DOWN;
        await this.commentVoteRepository.save(existingVote);

        if (voteType === 'up') {
          comment.upvotes += 1;
          comment.downvotes = Math.max(0, comment.downvotes - 1);
        } else {
          comment.downvotes += 1;
          comment.upvotes = Math.max(0, comment.upvotes - 1);
        }
      }
    } else {
      // New vote
      const vote = this.commentVoteRepository.create({
        commentId,
        userId,
        voteType: voteType === 'up' ? CommentVoteType.UP : CommentVoteType.DOWN,
      });
      await this.commentVoteRepository.save(vote);

      if (voteType === 'up') {
        comment.upvotes += 1;
      } else {
        comment.downvotes += 1;
      }
    }

    await this.commentRepository.save(comment);

    return {
      success: true,
      message: 'Vote recorded',
      data: {
        upvotes: comment.upvotes,
        downvotes: comment.downvotes,
      },
    };
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId, authorId: userId, isActive: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found or you do not have permission to delete it');
    }

    // Soft delete
    post.isActive = false;
    await this.postRepository.save(post);

    return {
      success: true,
      message: 'Post deleted successfully',
    };
  }

  async reportPost(postId: string, userId: string, reason: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId, isActive: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Store report in metadata
    if (!post.metadata) {
      post.metadata = {};
    }
    if (!post.metadata.reports) {
      post.metadata.reports = [];
    }

    post.metadata.reports.push({
      userId,
      reason,
      timestamp: new Date(),
    });

    await this.postRepository.save(post);

    return {
      success: true,
      message: 'Post reported successfully',
    };
  }

  private generateShareToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}
