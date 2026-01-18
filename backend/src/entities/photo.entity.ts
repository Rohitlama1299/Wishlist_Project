import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Destination } from './destination.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  caption: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => Destination, (destination) => destination.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'destinationId' })
  destination: Destination;

  @Column()
  destinationId: string;

  @CreateDateColumn()
  createdAt: Date;
}
