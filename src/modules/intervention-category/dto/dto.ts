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
import { IsUUID, Length } from 'class-validator';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------
// src/interventions/dto/create-intervention.dto.ts

export class CreateInterventionCategoryDto {
  /**
   * The display name of the intervention category
   * This value must be unique in the system
   * @example "WASH (Water, Sanitation & Hygiene)"
   */
  @ApiProperty({
    description: 'Unique name of the intervention category',
    example: 'WASH (Water, Sanitation & Hygiene)',
    minLength: 3,
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  @Length(3, 120, {
    message: 'Name must be between 3 and 120 characters long',
  })
  name!: string;

  // ────────────────────────────────────────────────────────────────
  // Optional fields you might want to add later
  // ────────────────────────────────────────────────────────────────

  /**
   * Optional short description or purpose of this category
   * @example "Interventions related to water supply, sanitation facilities, and hygiene promotion"
   */
  @ApiPropertyOptional({
    description: 'Optional short description of the category',
    example: 'Interventions related to water supply, sanitation facilities, and hygiene promotion',
  })
  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

}


// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateInterventionCategoryDto extends PartialType(CreateInterventionCategoryDto) {
  // You can add extra rules or override examples if needed
}

export class QueryInterventionCategoryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
