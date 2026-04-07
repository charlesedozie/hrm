import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional, IsInt,
IsString,
IsEnum,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------

export class CreateLeaveRequestDto {
  @ApiProperty({
    description: 'UUID of the selected leave type',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  leaveTypeId!: string;

  @ApiProperty({
    description: 'Start date of the leave (ISO format)',
    example: '2025-04-15T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @ApiProperty({
    description: 'End date of the leave (ISO format)',
    example: '2025-04-20T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @ApiPropertyOptional({
    description: 'Number of days/hours requested (can be calculated on backend)',
    example: 5.0,
  })
  @IsOptional()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
  daysRequested!: number;

  @ApiPropertyOptional({
    description: 'Reason for the leave',
    example: 'Family vacation and rest',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({
    description: 'Optional comment or additional notes',
    example: 'Will be available on phone if emergency',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comments?: string;

  // attachmentUrl usually handled via file upload → signed URL
  // We don't include it here — it's set on backend after upload
}
// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateLeaveRequestDto extends PartialType(CreateLeaveRequestDto) {
  // You can add extra rules or override examples if needed
}

export class QueryLeaveRequestDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
