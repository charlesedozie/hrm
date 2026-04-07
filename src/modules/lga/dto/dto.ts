import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, Length } from 'class-validator';
import { Transform } from 'class-transformer';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------

export class CreateLgaDto {
  @ApiProperty({
    example: 'Ikeja',
    description: 'Name of the Local Government Area',
  })
  @IsString()
  @Length(2, 100)
  @Transform(({ value }) => value?.trim())
  name!: string;

  @ApiProperty({
    example: '8a7b1c3a-9b1e-4f8c-a9c1-3c8a9c1e8a7b',
    description: 'State ID that this LGA belongs to',
  })
  @IsUUID()
  stateId!: string;
}

// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateLgaDto extends PartialType(CreateLgaDto) {
  // You can add extra rules or override examples if needed
}

export class QueryLgaDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
