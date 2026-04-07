import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  MaxLength
} from "class-validator"

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------


export class CreateHolidayCalendarDto {

  @ApiProperty({
    example: "Christmas Day",
    description: "Name of the holiday"
  })
  @IsString()
  @MaxLength(100)
  name!: string


  @ApiProperty({
    example: "2026-12-25",
    description: "Date the holiday occurs"
  })
  @Type(() => Date)
  @IsDate()  
  date!: Date;


  @ApiPropertyOptional({
    example: true,
    description: "Indicates whether the holiday occurs every year"
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true') // ensures boolean
  isRecurring?: boolean = false;

}



// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateHolidayCalendarDto extends PartialType(CreateHolidayCalendarDto) {
  // You can add extra rules or override examples if needed
}

export class QueryHolidayCalendarDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
