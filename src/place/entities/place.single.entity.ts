import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity'; // User 엔티티의 경로에 맞게 수정하세요.

@Entity()
export class PlaceSingle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  searchDate: Date;

  @Column()
  searchKeyword: string;

  @Column()
  companyCode: string;

  @Column()
  companyName: string;

  @Column()
  address: string;

  @Column({ default: '0' })
  saveCount: string;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ default: 0 })
  visitCount: number;

  @Column({ default: 0 })
  totalCount: number;

  @Column()
  rank: number;

  @Column()
  memo: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
