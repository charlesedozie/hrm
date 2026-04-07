import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, IsDateString, IsNumber, IsUUID, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayFrequency, ProgramStatus } from '@prisma/client';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------
import { Type } from 'class-transformer';


export class CreateProgramDto {
@ApiProperty({
description: 'Name of the program',
example: 'Youth Empowerment Initiative 2025',
uniqueItems: true,
})
@IsString()
name!: string;

@ApiPropertyOptional({
description: 'Detailed description of the program',
example: 'A 3-year program aimed at providing vocational training...',
})
@IsString()
@IsOptional()
description?: string;

@ApiProperty({
description: 'Start date of the program',
example: '2025-03-01',
})
@IsDateString()
@IsNotEmpty()
startDate!: string;

@ApiProperty({
description: 'Start date of the program',
example: '2025-03-01',
})
@IsDateString()
@IsOptional()
endDate?: string;

@ApiPropertyOptional({
description: 'Total budget allocated to the program',
example: 12500000.75,
})
@IsOptional()
@IsNumber()
@Type(() => Number)
budget?: number;

@ApiPropertyOptional({
description: 'Main objective of the program',
example: 'Increase youth employment rate by 25% in target regions',
})
@IsString()
@IsOptional()
objective?: string;

@ApiPropertyOptional({
description: 'Baseline measurement/assessment',
example: 'Current youth unemployment rate: 42%',
})
@IsString()
@IsOptional()
baseline?: string;

@ApiPropertyOptional({
description: 'Midline measurement/assessment',
example: 'Midline: 35% (2026)',
})
@IsString()
@IsOptional()
midline?: string;

@ApiPropertyOptional({
description: 'Endline measurement/assessment',
example: 'Target: 25% or lower',
})
@IsString()
@IsOptional()
endline?: string;

@ApiProperty({
description: 'Current status of the program',
enum: ProgramStatus,
default: ProgramStatus.ACTIVE,
example: ProgramStatus.ACTIVE,
})
@IsEnum(ProgramStatus)
status: ProgramStatus = ProgramStatus.ACTIVE;   // ← TypeScript default value

@ApiProperty({
description: 'Reporting frequency',
enum: PayFrequency,
default: PayFrequency.QUARTERLY,
example: PayFrequency.QUARTERLY,
})
@IsEnum(PayFrequency)
reportingFrequency: PayFrequency = PayFrequency.QUARTERLY;

}



// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateProgramDto extends PartialType(CreateProgramDto) {
// You can add extra rules or override examples if needed
}

export class QueryProgramDto extends PaginationDto {
@ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
@IsOptional()
@IsString()
id?: string;

@ApiPropertyOptional({ description: 'Filter vacancies by name' })
@IsOptional()
@IsString()
name?: string;
}
