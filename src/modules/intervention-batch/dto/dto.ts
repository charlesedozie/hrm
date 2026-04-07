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

import {
  IsUUID,
  IsInt,
  IsNumber,
  IsDate,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------



export class CreateInterventionBatchDto {
  @ApiProperty({
    description: 'Name of the intervention batch',
    example: 'Batch A - January Outreach',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Intervention ID',
    example: 'uuid-intervention-id',
  })
  @IsUUID()
  interventionId!: string;

  @ApiPropertyOptional({
    description: 'Program ID',
    example: 'uuid-program-id',
  })
  @IsOptional()
  @IsUUID()
  programId?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of beneficiaries',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  capacity?: number;

  @ApiPropertyOptional({
    description: 'Facilitator name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  facilitator?: string;

  @ApiPropertyOptional({
    description: 'State ID',
    example: 'uuid-state-id',
  })
  @IsOptional()
  @IsUUID()
  stateId?: string;

  @ApiPropertyOptional({
    description: 'LGA ID',
    example: 'uuid-lga-id',
  })
  @IsOptional()
  @IsUUID()
  lgaId?: string;

  @ApiPropertyOptional({
    description: 'Total budget for the batch',
    example: 500000.75,
  })
  @IsOptional()
  @Transform(({ value }) => (value !== null ? Number(value) : value))
  @IsNumber()
  totalBudget?: number;

  @ApiPropertyOptional({
    description: 'Location description',
    example: 'Community Hall, Ikeja',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Start date',
    example: '2026-03-01T10:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End date',
    example: '2026-03-05T16:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Latitude of the intervention location',
    example: 6.5244,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude of the intervention location',
    example: 3.3792,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Geo-fence radius in meters',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  radiusMeters?: number;
}



// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateInterventionBatchDto extends PartialType(CreateInterventionBatchDto) {
  // You can add extra rules or override examples if needed
}

export class QueryInterventionBatchDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
