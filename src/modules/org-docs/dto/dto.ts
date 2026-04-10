import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocGroup } from '@prisma/client';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------
export class CreateOrgDocsDto {
@ApiProperty({
description: 'file name',
example: 'Baaselne result',
minLength: 3,
maxLength: 50,
})
@IsString()
@IsNotEmpty()
name!: string;

@ApiProperty({
description: 'Original file name',
example: 'baseline.pdf',
})
@IsString()
@IsNotEmpty()
originalName!: string;

@ApiProperty({
description: '',
example: '',
})
@IsString()
@IsNotEmpty()
description!: string;

@ApiProperty({
description: 'URL',
example: '',
})
@IsString()
@IsNotEmpty()
url!: string;

@ApiProperty({
description: '',
example: '',
})
@IsString()
@IsOptional()
programId?: string;

@ApiProperty({
description: '',
example: '',
})
@IsString()
@IsOptional()
employeeId?: string;

@ApiProperty({
description: '',
example: '',
})
@IsString()
@IsOptional()
organizationId?: string;

@ApiProperty({
description: '',
example: '',
})
@IsString()
@IsOptional()
beneficiaryId?: string;

@ApiProperty({
description: 'placeholder for the file input',
example: '',
})
@IsString()
@IsOptional()
file?: string;

@ApiProperty({
description: '',
example: '',
})
@IsString()
@IsOptional()
leaveRequestId?: string;

@ApiProperty({
description: '',
example: '',
})
@IsString()
@IsOptional()
meFieldMonitorId?: string;

@ApiProperty({
description: 'Reporting frequency',
enum: DocGroup,
example: 'EMPLOYEE',
})
@IsEnum(DocGroup)
docGroup!: DocGroup;

}

// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateOrgDocsDto extends PartialType(CreateOrgDocsDto) {
// You can add extra rules or override examples if needed
}

export class QueryOrgDocsDto extends PaginationDto {
@ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
@IsOptional()
@IsString()
id?: string;

@ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
@IsOptional()
@IsString()
programId?: string;

@ApiPropertyOptional({ description: 'Filter vacancies by name' })
@IsOptional()
@IsString()
name?: string;
}