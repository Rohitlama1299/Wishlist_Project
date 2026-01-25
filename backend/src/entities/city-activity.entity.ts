import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';

@Entity('city_activities')
export class CityActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  category: string; // 'sightseeing', 'food', 'adventure', 'culture', 'nature', 'nightlife', 'shopping'

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ nullable: true })
  duration: string; // e.g., '2-3 hours', 'Half day', 'Full day'

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => City, (city) => city.suggestedActivities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cityId' })
  city: City;

  @Column()
  cityId: number;
}
