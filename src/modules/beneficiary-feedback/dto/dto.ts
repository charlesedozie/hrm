import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, Length, IsUUID
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import { FeedbackType, FeedbackCategory, Priority, FeedbackStatus } from '@prisma/client';
// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------
// src/interventions/dto/create-intervention.dto.ts

export class CreateBeneficiaryFeedbackDto {
@ApiProperty({
    description: 'Type of the feedback',
    enum: FeedbackType,
    example: FeedbackType.SUGGESTION,
  })
  @IsEnum(FeedbackType)
  @Transform(({ value }) => value.toUpperCase()) // frontend may send lowercase
  feedbackType!: FeedbackType;

  @ApiPropertyOptional({
    description: 'Optional category of the feedback',
    enum: FeedbackCategory,
    example: FeedbackCategory.PAYMENT,
  })
  @IsOptional()
  @IsEnum(FeedbackCategory)
  @Transform(({ value }) => value?.toUpperCase())
  category?: FeedbackCategory;

  @ApiPropertyOptional({
    description: 'Subject of the feedback',
    example: 'Issue with program access',
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    description: 'Detailed message of the feedback',
    example: 'I have not received my payment for last month.',
  })
  @IsNotEmpty()
  @IsString()
  message!: string;

  @ApiPropertyOptional({
    description: 'Priority of the feedback; will be assigned by system if not provided',
    enum: Priority,
    example: Priority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(Priority)
  @Transform(({ value }) => value?.toUpperCase())
  priority?: Priority;

  @ApiPropertyOptional({
    description: 'Optional user ID assigned to handle this feedback',
    example: 'b1c2d3e4-f5g6-7890-abcd-0987654321fe',
  })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

    @ApiPropertyOptional({
    description: 'Beneficiary ID assigned',
    example: 'b1c2d3e4-f5g6-7890-abcd-0987654321fe',
  })
  @IsOptional()
  @IsUUID()
  beneficiaryId!: string;
}

// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateBeneficiaryFeedbackDto extends PartialType(CreateBeneficiaryFeedbackDto) {
  // You can add extra rules or override examples if needed
}

export class QueryBeneficiaryFeedbackDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  beneficiaryId?: string;
}
