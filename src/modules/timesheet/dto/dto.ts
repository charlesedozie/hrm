import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApprovalStatus } from '@prisma/client';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------



// Main DTO
export class CreateTimesheetDto {
  @ApiProperty({ description: 'Employee ID for this timesheet', example: 'f3d147bd-51c8-4e2d-a3b7-1234567890ab' })
  @IsUUID()
  employeeId!: string;

  @ApiProperty({ description: 'Start date of the timesheet period', example: '2026-03-01' })
  @IsDate()
  @Type(() => Date)
  periodStart!: Date;

  @ApiProperty({ description: 'End date of the timesheet period', example: '2026-03-07' })
  @IsDate()
  @Type(() => Date)
  periodEnd!: Date;

  @ApiPropertyOptional({ description: 'Datetime when timesheet was submitted', example: '2026-03-07T10:00:00Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  submittedAt?: Date;

  @ApiPropertyOptional({ description: 'Datetime when supervisor approved', example: '2026-03-07T12:00:00Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  supervisorApprovedAt?: Date;

  @ApiPropertyOptional({ description: 'Datetime when HR approved', example: '2026-03-07T14:00:00Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  hrApprovedAt?: Date;

  @ApiPropertyOptional({ description: 'Rejection reason if any', example: 'Incorrect hours entered' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional({ enum: ApprovalStatus, description: 'Timesheet approval status', example: 'PENDING' })
  @IsOptional()
  approvalStatus?: ApprovalStatus;
}



// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateTimesheetDto extends PartialType(CreateTimesheetDto) {
  // You can add extra rules or override examples if needed
}

export class QueryTimesheetDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
