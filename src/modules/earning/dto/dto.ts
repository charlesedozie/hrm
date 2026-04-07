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
import { EmploymentStatus } from '@prisma/client';
import { DepreciationMethod, AssetStatus, AssetDisposalMethod } from '@prisma/client';
import {
  IsBoolean,
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

/* ============================= */
/* CREATE ASSET DTO */
/* ============================= */


import { AllowanceType, CalculationType, BaseComponent } from '@prisma/client';

export class CreateEarningDto {
  @ApiProperty({
    example: 'Housing Allowance',
    description: 'Name of the earning or allowance',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    enum: AllowanceType,
    example: AllowanceType.ALLOWANCE,
    description: 'Type of earning',
  })
  @IsEnum(AllowanceType)
  type!: AllowanceType;

  @ApiProperty({
    enum: CalculationType,
    example: CalculationType.PERCENTAGE,
    description: 'How the earning is calculated',
  })
  @IsEnum(CalculationType)
  calculationType!: CalculationType;

  @ApiProperty({
    enum: BaseComponent,
    example: BaseComponent.BASIC,
    description: 'Salary component used as calculation base',
  })
  @IsEnum(BaseComponent)
  base!: BaseComponent;

  @ApiPropertyOptional({
    example: 30,
    description: 'Rate or amount depending on calculation type',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rate?: number;

  @ApiProperty({
    example: true,
    description: 'Whether the earning recurs every payroll period',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  recurring!: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the earning is taxable',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  taxable!: boolean;

  @ApiPropertyOptional({
    example: 50000,
    description: 'Maximum amount allowed for this earning',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cap?: number;

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Date the earning becomes effective',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveFrom?: Date;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the earning is active',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    example: 'Allowance for employee accommodation',
    description: 'Additional description of the earning',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: { minSales: 100000, bonusRate: 5 },
    description: 'Conditional rules for the earning',
  })
  @IsOptional()
  @IsObject()
  condition?: Record<string, any>;
}



export class UpdateEarningDto extends PartialType(CreateEarningDto) {}

export class QueryEarningDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific asset by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter assets by name' })
  @IsOptional()
  @IsString()
  name?: string;
}

