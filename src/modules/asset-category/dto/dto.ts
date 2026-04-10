import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayFrequency, IndicatorType } from '@prisma/client';
import { MaxLength, MinLength } from 'class-validator';
// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------

export class CreateAssetCategoryDto {
  @ApiProperty({
    description: 'Unique name of the asset category (e.g. "Laptops", "Furniture")',
    example: 'Laptops',
    minLength: 2,
    maxLength: 80,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @ApiPropertyOptional({
    description: 'Optional longer description of the category',
    example: 'All portable computers including ultrabooks, gaming laptops and workstations',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}


// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateAssetCategoryDto extends PartialType(CreateAssetCategoryDto) {
  // You can add extra rules or override examples if needed
}

export class QueryAssetCategoryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
