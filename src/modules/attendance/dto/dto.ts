import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, 
IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CaptureMethod, TimestampSource } from '@prisma/client';
import {
IsUUID,
IsDateString,
IsNumber,
IsBoolean,
IsLatitude,
IsLongitude,
} from 'class-validator';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------

export class CreateAttendanceDto {
@IsString()
clockIn!: string;

@IsOptional()
@IsString()
clockOut?: string;

@IsOptional()
@IsUUID()
shiftId?: string;

@IsOptional()
@IsUUID()
employeeId?: string;

@IsOptional()
@IsEnum(CaptureMethod)
captureMethod?: CaptureMethod;

@IsOptional()
@IsLatitude()
gpsLatitude?: number;

@IsOptional()
@IsLongitude()
gpsLongitude?: number;

@IsOptional()
@IsString()
ipAddress?: string;

@IsOptional()
@IsString()
notes?: string;

@IsOptional()
@IsEnum(TimestampSource)
timestampSource?: TimestampSource;

@IsOptional()
@IsUUID()
statusId?: string;

@IsOptional()
@IsNumber()
overtimeHours?: number;


@ApiProperty({
example: true,
default: true,
})
@IsBoolean()
@Transform(({ value }) => value === true || value === 'true') // ensures boolean
isManualOverride?: boolean = false;

@IsOptional()
@IsUUID()
createdById?: string;

@ApiPropertyOptional({
example: '2026-02-04',
})
@Type(() => Date)
@IsDate()
workDate!: Date;
}

// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {
// You can add extra rules or override examples if needed
}

export class QueryAttendanceDto extends PaginationDto {
@ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
@IsOptional()
@IsString()
id?: string;

@ApiPropertyOptional({ description: 'Filter vacancies by name' })
@IsOptional()
@IsString()
name?: string;
}
