import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class UpdateDestinationDto {
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
