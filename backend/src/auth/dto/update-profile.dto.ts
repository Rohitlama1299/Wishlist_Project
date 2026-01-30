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
  @MaxLength(200000)
  @Matches(/^(\/uploads\/|https:\/\/|data:image\/)/, {
    message:
      'Profile picture must be a valid HTTPS URL, local upload path, or base64 data URL',
  })
  profilePicture?: string;
}
