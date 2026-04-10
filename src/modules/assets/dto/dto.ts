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
import { Type } from 'class-transformer';


/* ============================= */
/* CREATE ASSET DTO */
/* ============================= */

export class CreateAssetDto {
  @ApiProperty({ example: 'LAG-CMP-001' })
  @IsString()
  @MaxLength(50)
  assetTag!: string;

  @ApiProperty({ example: 'file' })
  @IsString()
  @IsOptional()
  avatar?: string;

    @ApiProperty({ example: 'url' })
  @IsString()
  url?: string;

    @ApiProperty({ example: 'filename' })
  @IsString()
  originalName?: string;

  @ApiProperty({ example: 'Dell Latitude 5420 Laptop' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Laptop for Monitoring & Evaluation team' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'SN123456789' })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional({ example: 'Latitude 5420' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 'Dell' })
  @IsOptional()
  @IsString()
  manufacturer?: string;


  @ApiPropertyOptional({
  example: '2026-02-04',
})
@IsOptional()
@Type(() => Date)
@IsDate()
purchaseDate?: Date;

  @ApiPropertyOptional({ example: 850000 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  purchasePrice?: number;

  @ApiPropertyOptional({ example: 'NGN', default: 'NGN' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 50000, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salvageValue?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  usefulLifeYears?: number;

  @ApiPropertyOptional({
    enum: DepreciationMethod,
    default: DepreciationMethod.STRAIGHT_LINE,
  })
  @IsOptional()
  @IsEnum(DepreciationMethod)
  depreciationMethod?: DepreciationMethod;

  @ApiPropertyOptional({
    enum: AssetStatus,
    default: AssetStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(AssetStatus)
  status?: AssetStatus;

  @ApiPropertyOptional({ example: 'uuid-category-id' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'uuid-location-id' })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional({ example: 'Procured under 2024 ICT budget' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'uuid-user-id' })
  @IsOptional()
  @IsUUID()
  createdById?: string;
}
export class UpdateAssetDto extends PartialType(CreateAssetDto) {}

export class QueryAssetDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific asset by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter assets by name' })
  @IsOptional()
  @IsString()
  name?: string;
}

