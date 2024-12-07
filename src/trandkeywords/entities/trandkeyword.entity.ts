import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Trandkeyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  keyword: string;

  @Column()
  rank: number;

  @Column()
  platform: string;

  @CreateDateColumn()
  createdAt: Date; // 자동으로 현재 시간으로 설정
}
