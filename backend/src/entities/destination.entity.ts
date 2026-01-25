import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { City } from './city.entity';
import { Photo } from './photo.entity';
import { Activity } from './activity.entity';

@Entity('destinations')
export class Destination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: false })
  visited: boolean;

  @Column({ nullable: true })
  visitedDate: Date;

  @Column({ nullable: true })
  plannedDate: Date;

  @Column({ default: 0 })
  priority: number;

  @ManyToOne(() => User, (user) => user.destinations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => City, (city) => city.destinations)
  @JoinColumn({ name: 'cityId' })
  city: City;

  @Column()
  cityId: number;

  @OneToMany(() => Photo, (photo) => photo.destination, { cascade: true })
  photos: Photo[];

  @OneToMany(() => Activity, (activity) => activity.destination, {
    cascade: true,
  })
  activities: Activity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
