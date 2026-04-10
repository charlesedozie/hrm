import { IsString, Matches } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current user password', example: '*********' })
  @IsString()
  currentPassword!: string;

  
  @ApiProperty({ description: 'New password', example: '*********' })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,50}$/, {
    message:
      "Password must be 8-50 characters long and include at least one uppercase letter, one lowercase letter, and one special character",
  })
  newPassword!: string;

   @ApiProperty({ description: 'Confirm password', example: '**********' })
  @IsString()
  confirmPassword!: string;
}