import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CountryService } from '../services/service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { QueryCountryDto } from '../dto/QueryDto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Countries')
@ApiBearerAuth()
@Controller('countries')
@UseGuards(JwtAuthGuard)
export class CountryController {
  constructor(private readonly service: CountryService) {}

  @Get()
findAll(@Query() query: QueryCountryDto) {
  return this.service.getAll(query);
}

@Get(':id')
async findOne(@Param('id') id: string) {
  const result = await this.service.getAll({ id });
  // pick the first item or throw if not found
  if (!result.items || result.items.length === 0) {
    throw new NotFoundException('Employee not found');
  }
  return result.items[0]; // <-- return the object directly
}

}
