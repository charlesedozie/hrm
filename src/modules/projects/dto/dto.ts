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
import { IsNumber, IsDateString } from 'class-validator';
import { RiskLevel, ProgramStatus } from '@prisma/client'; // or wherever your enum is defined
// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------

export class CreateProjectDto {
  @ApiProperty({ 
    description: 'Project name (required)',
    example: 'Solar Electrification Phase II',
    minLength: 2,
    maxLength: 120 
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Main objective of the project',
    example: 'Provide clean energy access to 12,000 rural households',
  })
  @IsString()
  @IsOptional()
  objective?: string;

  @ApiPropertyOptional({
    description: 'Key deliverables / outputs',
    example: '300 solar home systems, 15 community boreholes with solar pumps',
  })
  @IsString()
  @IsOptional()
  deliverables?: string;

  @ApiPropertyOptional({ description: 'Detailed project description' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({ 
    description: 'Project implementation location',
    example: 'Borno & Yobe States, Nigeria' 
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ 
    description: 'Approved total budget (in USD or project currency)',
    example: 1250000.75 
  })
  @IsNumber()
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional({ 
    description: 'Amount already spent', 
    example: 458000 
  })
  @IsNumber()
  @IsOptional()
  amountSpent?: number;

  @ApiPropertyOptional({
    enum: RiskLevel,
    default: RiskLevel.LOW,
    description: 'Current risk level',
  })
  @IsEnum(RiskLevel)
  @IsOptional()
  riskLevel?: RiskLevel;

  @ApiPropertyOptional({
    enum: ProgramStatus,
    default: ProgramStatus.ACTIVE,
    description: 'Current status of the project',
  })
  @IsEnum(ProgramStatus)
  @IsOptional()
  programStatus?: ProgramStatus;

  @ApiProperty({
    description: 'Project start date (ISO format)',
    example: '2025-03-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({
    description: 'Project end date (ISO format) – can be null for ongoing projects',
    example: '2026-12-31T23:59:59.999Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'ID of the parent Program this project belongs to',
    example: 'clxyz1234567890abcdef',
  })
  @IsUUID()
  programId!: string;

  @ApiPropertyOptional({
    description: 'ID of the Organization (can be null)',
    example: 'org_abc123',
  })
  @IsUUID()
  @IsOptional()
  organizationId?: string;

  // ─── Audit / system fields – usually not sent by client ───
  // id, createdAt, updatedAt, deletedAt, relations, etc.
  // are typically managed by the backend
}


// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  // You can add extra rules or override examples if needed
}

export class QueryProjectDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
