import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Destination } from './destination.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => Destination, (destination) => destination.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'destinationId' })
  destination: Destination;

  @Column()
  destinationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
