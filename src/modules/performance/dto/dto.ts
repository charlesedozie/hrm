import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, 
  IsUUID,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayFrequency, IndicatorType } from '@prisma/client';
import { Type } from 'class-transformer';
import { RecordStatus, CycleStatus, AppraisalStatus } from '@prisma/client';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------
export class CreatePerformanceDevelopmentPlanDto {
  @ApiProperty()
  @IsUUID()
  employeeId!: string;
  
  @ApiProperty()
  @IsUUID()
  managerId!: string;
  
  @ApiProperty()
  @IsUUID()
  cycleId!: string;

  @ApiProperty()
  @IsUUID()
  appraisalId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  strengths?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  weaknesses?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actionPlan?: string;
}

export class CreatePerformanceRatingScaleDto {
  @ApiProperty({ example: 'Excellent' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsNumber()
  score!: number;
}

export class CreatePerformanceFeedbackDto {
  @ApiProperty()
  @IsUUID()
  employeeId!: string;

  @ApiProperty()
  @IsUUID()
  reviewerId!: string;

  @ApiProperty()
  @IsUUID()
  cycleId!: string;

  @ApiProperty({ example: 'Great collaboration and delivery' })
  @IsString()
  comment!: string;

  @ApiPropertyOptional({ example: 4.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rating?: number;
}

export class CreatePerformanceAppraisalRatingDto {
  @ApiProperty()
  @IsUUID()
  appraisalId!: string;

  @ApiProperty()
  @IsUUID()
  goalId!: string;

  @ApiProperty({ example: 3.8 })
  @Type(() => Number)
  @IsNumber()
  score!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}


export class CreatePerformanceGoalDto {
  @ApiProperty()
  @IsUUID()
  employeeId!: string;

  @ApiProperty()
  @IsUUID()
  cycleId!: string;

  @ApiProperty({ example: 'Increase monthly sales' })
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsNumber()
  weight!: number;

  @ApiPropertyOptional({ example: 100000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  targetValue?: number;

  @ApiPropertyOptional({ example: 85000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  achievedValue?: number;

  @ApiPropertyOptional({ example: 85 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  progress?: number;

  @ApiPropertyOptional({ enum: RecordStatus })
  @IsOptional()
  @IsEnum(RecordStatus)
  recordStatus?: RecordStatus;
}

export class CreatePerformanceCycleDto {
  @ApiProperty({ example: '2026 Q1 Review Cycle' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '2026-03-31' })
  @IsDateString()
  endDate!: string;

  @ApiProperty({ enum: CycleStatus })
  @IsEnum(CycleStatus)
  status!: CycleStatus;

  @ApiPropertyOptional({ enum: RecordStatus })
  @IsOptional()
  @IsEnum(RecordStatus)
  recordStatus?: RecordStatus;
}

export class CreatePerformanceAppraisalDto {
  @ApiProperty()
  @IsUUID()
  employeeId!: string;

  @ApiProperty()
  @IsUUID()
  managerId!: string;

  @ApiProperty()
  @IsUUID()
  cycleId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  selfComment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  managerComment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hrComment?: string;

  @ApiPropertyOptional({ example: 4.2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  finalScore?: number;

  @ApiProperty({ enum: AppraisalStatus })
  @IsEnum(AppraisalStatus)
  status!: AppraisalStatus;
}

// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdatePerformanceDevelopmentPlanDto extends PartialType(CreatePerformanceDevelopmentPlanDto) {
  // You can add extra rules or override examples if needed
}

export class UpdatePerformanceRatingScaleDto extends PartialType(CreatePerformanceRatingScaleDto) {
  // You can add extra rules or override examples if needed
}

export class UpdatePerformanceFeedbackDto extends PartialType(CreatePerformanceFeedbackDto) {
  // You can add extra rules or override examples if needed
}

export class UpdatePerformanceAppraisalRatingDto extends PartialType(CreatePerformanceAppraisalRatingDto) {
  // You can add extra rules or override examples if needed
}

export class UpdatePerformanceGoalDto extends PartialType(CreatePerformanceGoalDto) {
  // You can add extra rules or override examples if needed
}

export class UpdatePerformanceCycleDto extends PartialType(CreatePerformanceCycleDto) {
  // You can add extra rules or override examples if needed
}

export class UpdatePerformanceAppraisalDto extends PartialType(CreatePerformanceAppraisalDto) {
  // You can add extra rules or override examples if needed
}