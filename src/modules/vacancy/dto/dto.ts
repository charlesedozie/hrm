import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path


export class CreateVacancyDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ required: false })
  @IsString()
  assignedToId?: string;

  @ApiProperty({ required: true, type: 'string', format: 'date' })
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @ApiProperty({ required: true, type: 'string', format: 'date' })
  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  requirements!: string;
}

export class UpdateVacancyDto extends PartialType(CreateVacancyDto) {}


export class QueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}

