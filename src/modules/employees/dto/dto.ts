import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsDateString,
IsUUID,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmploymentStatus } from '@prisma/client';

export class CreateEmployeeDto {
@ApiPropertyOptional({
example: 'EMP-00123',
description: 'Unique employee code',
})
@IsString()
@IsNotEmpty()
empId!: string;

@ApiPropertyOptional({
example: 'you@example.com',
description: 'Unique employee username/email',
})
@IsString()
@IsNotEmpty()
username!: string;

@ApiPropertyOptional({
example: 'Doe',
description: 'First name',
})
@IsString()
@IsNotEmpty()
fname!: string;

@ApiPropertyOptional({
example: 'Doe',
description: 'Last name',
})
@IsString()
@IsNotEmpty()
lname!: string;

@ApiPropertyOptional({
example: 'Joe',
description: 'Middle name',
})
@IsString()
@IsOptional()
mname?: string;

@ApiPropertyOptional({
enum: EmploymentStatus,
example: EmploymentStatus.ACTIVE,
description: 'Current employment status',
})
@IsOptional()
@IsEnum(EmploymentStatus)
status?: EmploymentStatus;

@ApiProperty({
example: '2024-01-15',
description: 'Employee hire date',
})
@IsDateString()
hireDate!: string;

@ApiPropertyOptional({
example: '2026-05-01',
description: 'Termination date if applicable',
})
@IsOptional()
@IsDateString()
terminationDate?: string;

@ApiPropertyOptional({
example: 'uuid-of-admin',
description: 'User who created the employee record',
})
@IsOptional()
@IsUUID()
createdById?: string;

@ApiPropertyOptional({
example: 'uuid-of-gender',
description: 'genderid',
})
@IsOptional()
@IsUUID()
genderId?: string;

    @ApiProperty({
    description: 'Photo',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

      @ApiProperty({
    description: 'Photo',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

      @ApiProperty({
    description: 'Photo',
    required: false,
  })
  @IsString()
  @IsOptional()
  originalName?: string;
}



export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}


export class QueryEmployeeDto extends PaginationDto {
@ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
@IsOptional()
@IsString()
id?: string;

@ApiPropertyOptional({ description: 'Filter vacancies by name' })
@IsOptional()
@IsString()
name?: string;
}

