import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayFrequency, IndicatorType } from '@prisma/client';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------
export class CreateMasterIndicatorDto {
  @ApiProperty({
    description: 'Unique code/identifier for the indicator (must be unique)',
    example: 'IND-CORE-001',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({
    description: 'Full name/title of the indicator',
    example: 'Number of children under 5 vaccinated against measles',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Detailed definition/explanation of what is being measured',
    example: 'Children aged 6–59 months who received at least one dose of measles-containing vaccine',
  })
  @IsString()
  @IsNotEmpty()
  definition!: string;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'Children',
    enum: ['Persons', 'Households', 'Communities', 'Schools', 'Health Facilities', 'Units', 'Workshops', 'Percentage', '%', 'Ratio'],
  })
  @IsString()
  @IsNotEmpty()
  unit!: string;

  @ApiProperty({
    description: 'Reporting frequency',
    enum: PayFrequency,
    example: 'MONTHLY',
  })
  @IsEnum(PayFrequency)
  frequency!: PayFrequency;

  @ApiProperty({
    description: 'Type of indicator according to results chain',
    enum: IndicatorType,
    example: 'OUTPUT',
  })
  @IsEnum(IndicatorType)
  type!: IndicatorType;
}

// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateMasterIndicatorDto extends PartialType(CreateMasterIndicatorDto) {
  // You can add extra rules or override examples if needed
}

export class QueryMasterIndicatorDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
