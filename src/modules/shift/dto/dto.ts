import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum, Min, IsDate,
IsNotEmpty, IsDateString, IsBoolean, IsNumber
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayFrequency, IndicatorType } from '@prisma/client';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------

export class CreateShiftDto {
  @ApiProperty({
    description: 'Name of the shift (must be unique)',
    example: 'Morning Shift',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Optional description of the shift',
    example: 'Shift for regular office hours',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Start time of the shift (ISO 8601 string)',
    example: '2026-03-06T07:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()  
  startTime!: Date;

  @ApiProperty({
    description: 'End time of the shift (ISO 8601 string)',
    example: '2026-03-06T15:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()  
  endTime!: Date;

  @ApiPropertyOptional({
    description: 'Break duration in minutes',
    example: 60,
  })
  @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    breakMinutes?: number;

  @ApiPropertyOptional({
    description: 'Shift differential rate multiplier (for night or overtime pay)',
    example: 1.25,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  shiftDifferentialRate?: number;

  @ApiPropertyOptional({
    description: 'Rotation pattern in JSON format for repeating shifts',
    example: '{"week1":["Mon","Tue"],"week2":["Wed","Thu"]}',
  })
  @IsOptional()
  @IsString()
  rotationPattern?: string;

  @ApiPropertyOptional({
    description: 'Reference ID of the schedule this shift belongs to',
    example: 'b7f4c2de-51c8-4a3b-9c4d-abcdef123456',
  })
  @IsOptional()
  @IsString()
  scheduleId?: string;

  @ApiPropertyOptional({
    description: 'Indicates whether this is a night shift',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true') // ensures boolean
  isNightShift?: boolean = false;
}


// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateShiftDto extends PartialType(CreateShiftDto) {
  // You can add extra rules or override examples if needed
}

export class QueryShiftDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}

/*
| Field                   | Type      | Purpose / Data Stored                                               |
| ----------------------- | --------- | ------------------------------------------------------------------- |
| `id`                    | `string`  | Unique UUID for the shift. Primary key in the database.             |
| `name`                  | `string`  | Unique name of the shift (e.g., "Morning Shift").                   |
| `description`           | `string?` | Optional text explaining the shift.                                 |
| `startTime`             | `Date`    | Start time of the shift. Stored in ISO 8601 format.                 |
| `endTime`               | `Date`    | End time of the shift. Stored in ISO 8601 format.                   |
| `breakMinutes`          | `number?` | Duration of breaks within the shift in minutes.                     |
| `shiftDifferentialRate` | `number?` | Multiplier for pay/allowance (used for night/overtime shifts).      |
| `rotationPattern`       | `string?` | JSON string defining shift rotation (e.g., days assigned per week). |
| `scheduleId`            | `string?` | Reference ID to the `WorkSchedule` this shift is part of.           |
| `isNightShift`          | `boolean` | Indicates whether the shift is a night shift. Defaults to `false`.  |
| `deletedAt`             | `Date?`   | Timestamp of soft deletion (if shift was deleted).                  |
| `deletedById`           | `string?` | User ID who deleted the shift (for audit).                          |
| `createdById`           | `string?` | User ID who created the shift.                                      |
| `createdAt`             | `Date`    | Timestamp when the shift was created.                               |
| `updatedAt`             | `Date`    | Timestamp when the shift was last updated.                          |


*/