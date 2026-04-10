import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path

import { IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class LevelDto {
  @IsString()
  roleId!: string;

  @IsInt()
  @Min(1)
  escalationHours!: number;
}

export class CreateWorkflowDto {
  @IsString()
  name!: string;

  @IsString()
  module!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LevelDto)
  levels!: LevelDto[];
}

export class UpdateWorkflowDto extends PartialType(CreateWorkflowDto) {}


export class QueryWorkflowDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}

