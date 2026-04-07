import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkScheduleService } from '../services/service';
import { CreateWorkScheduleDto, UpdateWorkScheduleDto, QueryWorkScheduleDto } from '../dto/dto';
import { WorkSchedule } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('WorkSchedule')
@ApiBearerAuth()
@Controller('workschedule')
@UseGuards(JwtAuthGuard)
export class WorkScheduleController {
  constructor(private readonly service: WorkScheduleService) {}

  @Post()
create(
  @Body() dto: CreateWorkScheduleDto,
  //@Body() body: any,
  @CurrentUser() user: JwtPayload,
) {

  if (!user?.id) {
    throw new UnauthorizedException('User ID not found in token');
  }

  try {
    const dto = new CreateWorkScheduleDto();
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }
  return this.service.create(dto, user.id);
}


  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateWorkScheduleDto): Promise<WorkSchedule> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<WorkSchedule> {
    return this.service.delete(id);
  }


  @Get()
findAll(@Query() query: QueryWorkScheduleDto) {
  return this.service.getAll(query);
}


@Get(':id')
async findOne(@Param('id') id: string) {
  const result = await this.service.getAll({ id });
  // pick the first item or throw if not found
  if (!result.items || result.items.length === 0) {
    throw new NotFoundException('Item not found');
  }
  return result.items[0]; // <-- return the object directly
}






}
