import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------



export class CreateJobLevelDto {
  @ApiProperty({
    example: 'Level 1',
    description: 'Name of the job level (must be unique)',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'JL-01',
    description: 'Unique code for the job level',
  })
  @IsString()
  code!: string;

  @ApiPropertyOptional({
    example: 'Entry-level management staff',
    description: 'Optional description of the job level',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'uuid-of-user',
    description: 'User ID of the creator',
  })
  @IsOptional()
  @IsUUID()
  createdById?: string;
}


// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateJobLevelDto extends PartialType(CreateJobLevelDto) {
  // You can add extra rules or override examples if needed
}

export class QueryJobLevelDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
