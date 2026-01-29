import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Matches(/^(\/uploads\/|https:\/\/)/, {
    message:
      'Profile picture must be a valid HTTPS URL or local upload path starting with /uploads/',
  })
  profilePicture?: string;
}
