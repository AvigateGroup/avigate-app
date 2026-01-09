// src/modules/community/community.controller.ts
import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateDirectionShareDto } from './dto/create-direction-share.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@/common/guards/optional-jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('community')
@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create community post' })
  async createPost(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.communityService.createPost(createPostDto, user.id);
  }

  @Get('posts')
  @ApiOperation({ summary: 'Get community posts' })
  async getPosts(
    @Query('postType') postType?: string,
    @Query('locationId') locationId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.communityService.getPosts(postType, locationId, page, limit);
  }

  @Post('directions/share')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create direction share' })
  async createDirectionShare(
    @Body() createDirectionShareDto: CreateDirectionShareDto,
    @CurrentUser() user: User,
  ) {
    return this.communityService.createDirectionShare(createDirectionShareDto, user.id);
  }

  @Get('directions/share/:shareToken')
  @ApiOperation({ summary: 'Get shared directions' })
  async getDirectionShare(@Param('shareToken') shareToken: string, @CurrentUser() user?: User) {
    return this.communityService.getDirectionShare(shareToken, user?.id);
  }

  @Post('contributions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit route contribution' })
  async submitContribution(@Body() contributionData: any, @CurrentUser() user: User) {
    return this.communityService.submitContribution(contributionData, user.id);
  }

  @Get('contributions')
  @ApiOperation({ summary: 'Get contributions' })
  async getContributions(
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.communityService.getContributions(status as any, page, limit);
  }

  @Post('safety/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report safety concern' })
  async reportSafetyConcern(@Body() reportData: any, @CurrentUser() user: User) {
    return this.communityService.reportSafetyConcern(reportData, user.id);
  }

  @Get('safety/reports')
  @ApiOperation({ summary: 'Get safety reports' })
  async getSafetyReports(
    @Query('locationId') locationId?: string,
    @Query('status') status?: string,
  ) {
    return this.communityService.getSafetyReports(locationId, status);
  }

  @Get('posts/:id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get single post by ID' })
  async getPostById(@Param('id') postId: string, @CurrentUser() user?: User) {
    return this.communityService.getPostById(postId, user?.id);
  }

  @Get('posts/:id/comments')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get comments for a post' })
  async getComments(
    @Param('id') postId: string,
    @CurrentUser() user?: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.communityService.getComments(postId, user?.id, page, limit);
  }

  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment to a post' })
  async addComment(
    @Param('id') postId: string,
    @CurrentUser() user: User,
    @Body('content') content: string,
  ) {
    return this.communityService.addComment(postId, user.id, content);
  }

  @Post('posts/:id/vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vote on a post' })
  async votePost(
    @Param('id') postId: string,
    @CurrentUser() user: User,
    @Body('voteType') voteType: 'up' | 'down',
  ) {
    return this.communityService.votePost(postId, user.id, voteType);
  }

  @Post('posts/:postId/comments/:commentId/vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vote on a comment' })
  async voteComment(
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
    @Body('voteType') voteType: 'up' | 'down',
  ) {
    return this.communityService.voteComment(commentId, user.id, voteType);
  }

  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  async deletePost(@Param('id') postId: string, @CurrentUser() user: User) {
    return this.communityService.deletePost(postId, user.id);
  }

  @Post('posts/:id/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report a post' })
  async reportPost(
    @Param('id') postId: string,
    @CurrentUser() user: User,
    @Body('reason') reason: string,
  ) {
    return this.communityService.reportPost(postId, user.id, reason);
  }
}
