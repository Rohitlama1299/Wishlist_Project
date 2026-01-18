import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  @IsNotEmpty()
  destinationId: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
