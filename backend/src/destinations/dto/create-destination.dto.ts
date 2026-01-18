import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateDestinationDto {
  @IsNumber()
  @IsNotEmpty()
  cityId: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  visited?: boolean;

  @IsDateString()
  @IsOptional()
  visitedDate?: string;

  @IsDateString()
  @IsOptional()
  plannedDate?: string;

  @IsNumber()
  @IsOptional()
  priority?: number;
}
