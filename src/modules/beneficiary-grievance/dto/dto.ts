import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, Length, IsBoolean, IsUUID
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { GrievanceStatus } from '@prisma/client';
// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------
// src/interventions/dto/create-intervention.dto.ts

export class CreateGrievanceDto {
  @ApiProperty({
    example: 'Delay in salary payment',
    description: 'Subject/title of the grievance',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  subject!: string;

  @ApiProperty({
    example: 'My salary for March has not been paid.',
    description: 'Detailed description of the grievance',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  description!: string;

  @ApiPropertyOptional({
    enum: GrievanceStatus,
    example: GrievanceStatus.SUBMITTED,
    description: 'Current status of the grievance',
  })
  @IsOptional()
  @IsEnum(GrievanceStatus)
  status?: GrievanceStatus;

  @ApiPropertyOptional({
    example: false,
    description: 'Indicates if the grievance is anonymous',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    return value === 'true' || value === '1';
  })
  isAnonymous?: boolean;

  @ApiPropertyOptional({
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
    description: 'Employee submitting the grievance',
  })
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @ApiPropertyOptional({
    example: 'b5bb189e-8bf9-3888-9912-ace4e6543002',
    description: 'Employee assigned to handle the grievance',
  })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}

// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateGrievanceDto extends PartialType(CreateGrievanceDto) {
  // You can add extra rules or override examples if needed
}

export class QueryGrievanceDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  beneficiaryId?: string;
}
