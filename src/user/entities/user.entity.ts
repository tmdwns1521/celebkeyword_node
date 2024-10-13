import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  userId: string;

  @Column({ length: 20 })
  username: string;

  @Column({ length: 100 })
  password: string;

  @Column({ unique: true, length: 30 })
  email: string;

  @Column({ unique: true, length: 20 })
  phoneNumber: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdDate: Date;
}