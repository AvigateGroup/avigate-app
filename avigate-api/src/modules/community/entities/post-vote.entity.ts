// src/modules/community/entities/post-vote.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CommunityPost } from './community-post.entity';

export enum VoteType {
  UP = 'up',
  DOWN = 'down',
}

@Entity('post_votes')
@Unique(['userId', 'postId'])
export class PostVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  @Index()
  postId: string;

  @ManyToOne(() => CommunityPost, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: CommunityPost;

  @Column({
    type: 'enum',
    enum: VoteType,
  })
  voteType: VoteType;

  @CreateDateColumn()
  createdAt: Date;
}
