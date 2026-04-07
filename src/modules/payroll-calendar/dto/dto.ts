import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional, IsUUID, 
IsString,
IsEnum,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayFrequency, IndicatorType } from '@prisma/client';

import { IsInt, IsBoolean, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------


export class CreatePayrollCalendarDto {

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PayFrequency)
  frequency!: PayFrequency;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(31)
  payDay?: number;



@ApiProperty({
example: true,
default: true,
})
@IsOptional()
@Transform(({ value }) => value === true || value === 'true')
@IsBoolean()
isActive?: boolean;

  @ApiPropertyOptional({
    example: 'd9a4a7f2-1234-4abc-98de-abcdef123456',
    description: 'User ID of the creator',
  })
  @IsOptional()
  @IsUUID()
  createdById?: string;
}


// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdatePayrollCalendarDto extends PartialType(CreatePayrollCalendarDto) {
  // You can add extra rules or override examples if needed
}

export class QueryPayrollCalendarDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
