import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Continent } from './continent.entity';
import { City } from './city.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  flagUrl: string;

  @ManyToOne(() => Continent, (continent) => continent.countries)
  @JoinColumn({ name: 'continentId' })
  continent: Continent;

  @Column()
  continentId: number;

  @OneToMany(() => City, (city) => city.country)
  cities: City[];
}
