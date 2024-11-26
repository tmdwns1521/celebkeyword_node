import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 191, unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'datetime', nullable: true })
  singlePlaceDate: Date;

  @Column({ default: false })
  isEmailVerified: boolean; // 이메일 인증 여부 필드

  @Column({ nullable: true })
  emailVerificationToken: string; // 이메일 인증 토큰 필드

  @CreateDateColumn()
  createdAt: Date; // 자동으로 현재 시간으로 설정
}
