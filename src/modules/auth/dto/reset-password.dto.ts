import { IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Enter the token sent to your email', example: 'auth_token_from_your_email' })
  @IsString()
  token!: string;

  
  @ApiProperty({ description: 'Enter new password', example: '**********' })@IsString()
  @MinLength(6)
  newPassword!: string;
}