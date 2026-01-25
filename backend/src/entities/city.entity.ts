import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Country } from './country.entity';
import { Destination } from './destination.entity';
import { CityActivity } from './city-activity.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @ManyToOne(() => Country, (country) => country.cities)
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @Column()
  countryId: number;

  @OneToMany(() => Destination, (destination) => destination.city)
  destinations: Destination[];

  @OneToMany(() => CityActivity, (activity) => activity.city)
  suggestedActivities: CityActivity[];
}
