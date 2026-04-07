import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional,
IsString,
IsEnum,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CalculationType } from '@prisma/client'; // adjust import if needed

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------

export class CreateLoanTypeDto {
  @ApiProperty({
    example: 'Car Loan',
    description: 'Name of the loan type (must be unique)',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    example: 'Loan for purchasing company-approved vehicles',
    description: 'Optional description of the loan type',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 20,
    description:
      'Default rate for deductions: either % of salary or fixed amount depending on calculation type',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  defaultRate?: number;

  @ApiProperty({
    enum: CalculationType,
    example: CalculationType.PERCENTAGE,
    description: 'Whether deduction is fixed amount or percentage of base',
  })
  @IsEnum(CalculationType)
  calculationType!: CalculationType;

  @ApiProperty({
    enum: CalculationType,
    example: CalculationType.PERCENTAGE,
    description: 'Whether deduction is fixed amount or percentage of base',
  })
  @IsEnum(CalculationType)
  maxAmountType!: CalculationType;

  @ApiPropertyOptional({
    example: 500000,
    description: 'Maximum allowed principal for this loan type',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxAmount?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether this loan type is currently active',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  active?: boolean;
}



// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateLoanTypeDto extends PartialType(CreateLoanTypeDto) {
  // You can add extra rules or override examples if needed
}

export class QueryLoanTypeDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}
