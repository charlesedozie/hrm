import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EarningService } from '../services/service';
import { CreateEarningDto, UpdateEarningDto, QueryEarningDto } from '../dto/dto';
import { Earning } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('Earnings')
@ApiBearerAuth()
@Controller('earnings')
@UseGuards(JwtAuthGuard)
export class EarningController {
  constructor(private readonly service: EarningService) {}

  @Post()
create(
  @Body() dto: CreateEarningDto,
  //@Body() body: any,
  @CurrentUser() user: JwtPayload,
) {

  try {
    const dto = new CreateEarningDto();
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }
  return this.service.create(dto, user.id);
}


  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateEarningDto): Promise<Earning> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Earning> {
    return this.service.delete(id);
  }


  @Get()
findAll(@Query() query: QueryEarningDto) {
  return this.service.getAll(query);
}

@Get(':id')
async findOne(@Param('id') id: string) {
  const result = await this.service.getAll({ id });
  if (!result.items || result.items.length === 0) {
    throw new NotFoundException('Item not found');
  }
  return result.items[0]; // <-- return the object directly
}
}
