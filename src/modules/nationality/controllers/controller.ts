import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NationalityService } from '../services/service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { QueryNationalityDto } from '../dto/QueryDto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Nationalities')
@ApiBearerAuth()
@Controller('nationalities')
@UseGuards(JwtAuthGuard)
export class NationalityController {
  constructor(private readonly service: NationalityService) {}

  @Get()
findAll(@Query() query: QueryNationalityDto) {
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
