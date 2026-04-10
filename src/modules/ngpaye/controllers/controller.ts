import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NgpayeBandService } from '../services/service';
import { CreateNgpayeBandDto, UpdateNgpayeBandDto, QueryNgpayeBandDto } from '../dto/dto';
import { NgpayeBand } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('NgpayeBand')
@ApiBearerAuth()
@Controller('ngpayeband')
@UseGuards(JwtAuthGuard)
export class NgpayeBandController {
  constructor(private readonly service: NgpayeBandService) {}

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateNgpayeBandDto): Promise<NgpayeBand> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<NgpayeBand> {
    return this.service.delete(id);
  }


  @Get()
findAll(@Query() query: QueryNgpayeBandDto) {
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
