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
import { MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------

export class CreateNgpayeBandDto {
  @ApiProperty({ example: 300000, description: 'Band 1 income threshold' })
  @Type(() => Number)
  @IsNumber()
  B1!: number;

  @ApiProperty({ example: 300000, description: 'Band 2 income threshold' })
  @Type(() => Number)
  @IsNumber()
  B2!: number;

  @ApiProperty({ example: 500000, description: 'Band 3 income threshold' })
  @Type(() => Number)
  @IsNumber()
  B3!: number;

  @ApiProperty({ example: 500000, description: 'Band 4 income threshold' })
  @Type(() => Number)
  @IsNumber()
  B4!: number;

  @ApiProperty({ example: 1600000, description: 'Band 5 income threshold' })
  @Type(() => Number)
  @IsNumber()
  B5!: number;

  @ApiProperty({ example: 3200000, description: 'Band 6 income threshold' })
  @Type(() => Number)
  @IsNumber()
  B6!: number;

  @ApiProperty({ example: 7, description: 'Tax percentage for Band 1' })
  @Type(() => Number)
  @IsNumber()
  P1!: number;

  @ApiProperty({ example: 11, description: 'Tax percentage for Band 2' })
  @Type(() => Number)
  @IsNumber()
  P2!: number;

  @ApiProperty({ example: 15, description: 'Tax percentage for Band 3' })
  @Type(() => Number)
  @IsNumber()
  P3!: number;

  @ApiProperty({ example: 19, description: 'Tax percentage for Band 4' })
  @Type(() => Number)
  @IsNumber()
  P4!: number;

  @ApiProperty({ example: 21, description: 'Tax percentage for Band 5' })
  @Type(() => Number)
  @IsNumber()
  P5!: number;

  @ApiProperty({ example: 24, description: 'Tax percentage for Band 6' })
  @Type(() => Number)
  @IsNumber()
  P6!: number;
}



// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateNgpayeBandDto extends PartialType(CreateNgpayeBandDto) {
  // You can add extra rules or override examples if needed
}

export class QueryNgpayeBandDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
