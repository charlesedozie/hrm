import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path

export class QueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter  by name' })
  @IsOptional()
  @IsString()
  beneficiaryType?: string;
}
