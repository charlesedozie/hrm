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
import { PayFrequency, IndicatorType } from '@prisma/client';
import { MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------


export class CreateOfficeLocationDto {
  @ApiProperty({
    example: 'Head Office - Lagos',
    description: 'Unique name of the office location',
  })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({
    example: 'b7f9a9c2-6f9b-4f2c-9d3a-123456789abc',
    description: 'Nigeria state ID',
  })
  @IsOptional()
  @IsUUID()
  stateId?: string;

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
export class UpdateOfficeLocationDto extends PartialType(CreateOfficeLocationDto) {
  // You can add extra rules or override examples if needed
}

export class QueryOfficeLocationDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
