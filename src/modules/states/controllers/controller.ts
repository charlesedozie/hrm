import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NigeriaStateService } from '../services/service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { QueryStatesDto } from '../dto/QueryDto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('NigeriaState')
@ApiBearerAuth()
@Controller('nigeriastates')
@UseGuards(JwtAuthGuard)
export class NigeriaStateController {
  constructor(private readonly service: NigeriaStateService) {}

  @Get()
findAll(@Query() query: QueryStatesDto) {
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
