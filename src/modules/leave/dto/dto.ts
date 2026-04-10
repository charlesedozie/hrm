import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeaveUnit, AccrualFrequency } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------


export class CreateLeaveTypeDto {
  @ApiProperty({
    example: 'Annual Leave',
    description: 'Unique leave type name',
  })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    example: 'AL',
    description: 'Short leave code',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @ApiPropertyOptional({
    example: 'Employee annual vacation leave',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: LeaveUnit,
    example: LeaveUnit.DAYS,
    default: LeaveUnit.DAYS,
  })
  @IsEnum(LeaveUnit)
  unit!: LeaveUnit;

  @ApiProperty({
    example: true,
    default: true,
  })
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true') // ensures boolean
  isPaid: boolean = false;



  @ApiProperty({
    example: false,
    default: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true') // ensures boolean
  requiresAttachment?: boolean = false;

  @ApiPropertyOptional({
    example: 21,
    description: 'Maximum days allowed per request',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  maxDaysPerRequest?: number;

  @ApiPropertyOptional({
    example: 7,
    description: 'Minimum notice days required before leave start',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  minNoticeDays?: number;

  @ApiProperty({
    enum: AccrualFrequency,
    example: AccrualFrequency.ANNUALLY,
    default: AccrualFrequency.ANNUALLY,
  })
  @IsEnum(AccrualFrequency)
  accrualFrequency!: AccrualFrequency;

  @ApiPropertyOptional({
    example: 1.75,
    description: 'Accrual rate (e.g. 1.75 days per month)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  accrualRate?: number;

  @ApiPropertyOptional({
    example: 30,
    description: 'Maximum accrued leave balance',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxAccrualBalance?: number;

  @ApiProperty({
    example: false,
    default: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true') // ensures boolean
  carryOverAllowed?: boolean = false;

  @ApiPropertyOptional({
    example: 10,
    description: 'Maximum days allowed for carry over',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxCarryOverDays?: number;

  @ApiPropertyOptional({
    example: 6,
    description: 'Carry-over expiry period in months',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  carryOverExpiryMonths?: number;

  @ApiProperty({
    example: true,
    default: true,
  })
   @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true') // ensures boolean
  isActive?: boolean = false;

  
  @ApiPropertyOptional({
    description: 'User ID of creator',
  })
  @IsOptional()
  @IsUUID()
  createdById?: string;
}



// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateLeaveTypeDto extends PartialType(CreateLeaveTypeDto) {
  // You can add extra rules or override examples if needed
}

export class QueryLeaveTypeDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific leave type by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter leave types by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
