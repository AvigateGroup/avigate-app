// src/modules/community/entities/comment-vote.entity.ts
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
import { CommunityComment } from './community-comment.entity';

export enum VoteType {
  UP = 'up',
  DOWN = 'down',
}

@Entity('comment_votes')
@Unique(['userId', 'commentId'])
export class CommentVote {
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
  commentId: string;

  @ManyToOne(() => CommunityComment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  comment: CommunityComment;

  @Column({
    type: 'enum',
    enum: VoteType,
  })
  voteType: VoteType;

  @CreateDateColumn()
  createdAt: Date;
}
