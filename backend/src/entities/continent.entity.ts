import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Country } from './country.entity';

@Entity('continents')
export class Continent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Country, (country) => country.continent)
  countries: Country[];
}
