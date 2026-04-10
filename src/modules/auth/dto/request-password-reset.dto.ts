import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";

export class RequestPasswordResetDto { 
  @ApiProperty({ description: 'Your email address', example: 'you@yyour_org.com' })
  @IsString()
  email!: string; // maps to username
}