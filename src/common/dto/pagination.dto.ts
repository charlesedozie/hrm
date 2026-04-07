import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DocGroup } from '@prisma/client';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}


export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term (applied to relevant fields like name, title, etc.)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // ────────────────────────────────────────────────
  // Optional: Sorting (very useful in most list endpoints)
  // ────────────────────────────────────────────────
  @ApiPropertyOptional({
    description: 'Field to sort by (e.g. createdAt, name, startDate)',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: SortOrder,
    example: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

@ApiPropertyOptional({ enum: DocGroup })
@IsOptional()
@IsEnum(DocGroup)
docGroup?: DocGroup;
}