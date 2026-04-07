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


export class CreateInterventionDto {
  /**
   * Unique name of the intervention (e.g. "Cash Transfer Round 3", "Skills Training for Widows")
   * Must be unique across the system
   * @example "Emergency Food Distribution - Q1 2026"
   */
  @ApiProperty({
    description: 'Unique name of the intervention',
    example: 'Emergency Food Distribution - Q1 2026',
    minLength: 3,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  name!: string;

  /**
   * Optional detailed description of the intervention
   * Purpose, target group, objectives, etc.
   * @example "Monthly unconditional cash transfer of ₦30,000 to 450 registered widows in Kano State LGA"
   */
  @ApiPropertyOptional({
    description: 'Detailed description of the intervention (purpose, objectives, target group, etc.)',
    example: 'Monthly unconditional cash transfer of ₦30,000 to 450 registered widows...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * UUID of the intervention category this intervention belongs to
   * Required - must reference an existing category
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  @ApiProperty({
    description: 'UUID of the intervention category',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  categoryId!: string;

  /**
   * Optional UUID of the project this intervention is linked to
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiPropertyOptional({
    description: 'UUID of the associated project (optional)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString()
  @IsOptional()
  @IsUUID('4')
  projectId?: string;
}

// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateInterventionDto extends PartialType(CreateInterventionDto) {
  // You can add extra rules or override examples if needed
}

export class QueryInterventionDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
