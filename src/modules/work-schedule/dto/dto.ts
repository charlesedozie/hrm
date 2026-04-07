import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, 
  IsNumber,
  IsBoolean,
  IsUUID,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayFrequency, IndicatorType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------


export class CreateWorkScheduleDto {

  @ApiProperty({
    example: "Standard Office Schedule",
    description: "Name of the work schedule used to identify it in the HR system"
  })
  @IsString()
  @IsNotEmpty()
  name!: string;


  @ApiProperty({
    example: '["MON","TUE","WED","THU","FRI"]',
    description:
      "JSON string representing the working days in the week. Example: ['MON','TUE','WED','THU','FRI']"
  })
  @IsString()
  workingDays!: string;


  @ApiProperty({
    example: 60,
    description:
      "Break duration allowed per working day in minutes"
  })
  @IsNumber()
    @Type(() => Number)
  @IsNumber()
  breakDurationMinutes!: number;


  @ApiProperty({
    example: "2026-03-06T09:00:00.000Z",
    description: "Official work start time for the schedule"
  })
  @Type(() => Date)
  @IsDate()
  startTime!: Date;


  @ApiProperty({
    example: "2026-03-06T17:00:00.000Z",
    description: "Official work end time for the schedule"
  })
  @Type(() => Date)
  @IsDate()
  endTime!: Date;


  @ApiPropertyOptional({
    example: 30,
    description:
      "Optional flexibility window in minutes before the official start time where employees can clock in"
  })
  @IsOptional()
  @IsNumber()
    @Type(() => Number)
  flexibleStartWindow?: number;


  @ApiPropertyOptional({
    example: 30,
    description:
      "Optional flexibility window in minutes after the official end time where employees can clock out"
  })
  @IsOptional()
  @IsNumber()
    @Type(() => Number)
  flexibleEndWindow?: number;

  @ApiPropertyOptional({
    example: "c7b2e6a0-1e02-4c9d-bf7c-63c41f9e5a1a",
    description:
      "Optional ID of the holiday calendar linked to this schedule"
  })
  @IsOptional()
  @IsUUID()
  holidayCalendarId?: string;


  @ApiPropertyOptional({
    example: false,
    description:
      "Indicates whether the schedule is meant for night shifts"
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
export class UpdateWorkScheduleDto extends PartialType(CreateWorkScheduleDto) {
  // You can add extra rules or override examples if needed
}

export class QueryWorkScheduleDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
