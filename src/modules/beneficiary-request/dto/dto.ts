import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, Min, 
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayFrequency, IndicatorType } from '@prisma/client';
import { IsUUID, Length } from 'class-validator';

import { Transform, Type } from 'class-transformer';
import { RequestType, RequestStatus, Priority } from '@prisma/client';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------
// src/interventions/dto/create-intervention.dto.ts


export class CreateBeneficiaryRequestDto {
@ApiProperty({
  example: '07b07458-8ae5-4b64-b7c2-a5fbbfa0fe5e',
  description: 'Beneficiary ID',
})
@IsOptional()
@IsUUID()
beneficiaryId?: string;

  @ApiProperty({
    enum: RequestType,
    example: RequestType.CASH_SUPPORT,
    description: 'Type of request',
  })
  @IsEnum(RequestType)
  requestType!: RequestType;

  @ApiProperty({
    example: 'Request for school fees support',
    description: 'Title of the request',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  title!: string;

  @ApiPropertyOptional({
    example: 'I need assistance to pay my tuition fees.',
    description: 'Detailed description',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({
    example: 50000,
    description: 'Amount requested',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amountRequested?: number;

  @ApiPropertyOptional({
    example: 'HIGH',
    enum: Priority,
    description: 'Priority level',
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({
    example: '2b50ebba-8ce6-48a0-b3bf-4811f95a7f8c',
    description: 'User assigned to handle this request',
  })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}


// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateBeneficiaryRequestDto extends PartialType(CreateBeneficiaryRequestDto) {
  // You can add extra rules or override examples if needed
}

export class QueryBeneficiaryRequestDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
