import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty,
IsUUID, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayFrequency, IndicatorType } from '@prisma/client';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------
export class CreateOfficePositionDto {
  @ApiProperty({
    description: 'Unique name of the office position (e.g. "Senior Software Engineer")',
    example: 'Head of Finance',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: 'Optional reference to the job level this position belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  jobLevelId?: string;
}

// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateOfficePositionDto extends PartialType(CreateOfficePositionDto) {
  // You can add extra rules or override examples if needed
}

export class QueryOfficePositionDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific office position by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter office positions by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
