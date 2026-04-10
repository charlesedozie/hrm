import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------
export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Unique department name',
    example: 'Finance',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

}

// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  // You can add extra rules or override examples if needed
}

export class QueryDepartmentDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific department by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter departments by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
