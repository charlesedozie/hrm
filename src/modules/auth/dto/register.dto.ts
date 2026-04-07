import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ description: 'User name', example: 'admin@local.local' })
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ description: 'Password (min 6 characters)', example: 'strongpassword' })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ description: 'Role of the user', enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

    employeeId?: string; // optional
  staffId?: string;    // optional
}
