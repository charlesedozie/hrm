import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsUUID,
  IsNotEmpty, 
  IsNumber,
  IsInt,
  Min,
  MaxLength,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayrollStatus } from '@prisma/client';
import { DepreciationMethod, AssetStatus, AssetDisposalMethod } from '@prisma/client';
import { IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
/* ============================= */
/* CREATE ASSET DTO */
/* ============================= */

export class CreatePayrollPeriodDto {
  @IsString()
  name!: string;

  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @IsDate()
  @Type(() => Date)
  endDate!: Date;

  @IsEnum(PayrollStatus)
  @IsOptional()
  status?: PayrollStatus = PayrollStatus.DRAFT;

  @IsBoolean()
  @IsOptional()
  locked?: boolean = false;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  payDate?: Date;

  @IsUUID()
  calendarId!: string;

  // Optional: Include related entities if needed
  @IsOptional()
  payrolls?: any[];

}

export class UpdatePayrollPeriodDto extends PartialType(CreatePayrollPeriodDto) {}

export class QueryPayrollPeriodDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific asset by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter assets by name' })
  @IsOptional()
  @IsString()
  name?: string;
}

