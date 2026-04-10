import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, MaxLength } from 'class-validator'

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------

export class CreateUnitDto {

  @ApiProperty({
    example: 'Child Protection',
    description: 'Name of the unit'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string


  @ApiPropertyOptional({
    example: 'Handles child safeguarding cases and interventions',
    description: 'Optional description of the unit'
  })
  @IsOptional()
  @IsString()
  description?: string


  @ApiProperty({
    example: 'fe3226e5-9d91-4cfe-9953-f85552b64961',
    description: 'Department ID the unit belongs to'
  })
  @IsUUID()
  @IsNotEmpty()
  departmentId!: string
}


// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateUnitDto extends PartialType(CreateUnitDto) {
  // You can add extra rules or override examples if needed
}

export class QueryUnitDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific unit by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter units by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
