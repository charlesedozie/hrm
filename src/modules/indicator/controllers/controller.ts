import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MasterIndicatorService } from '../services/service';
import { CreateMasterIndicatorDto, UpdateMasterIndicatorDto, QueryMasterIndicatorDto } from '../dto/dto';
import { MasterIndicator } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('MasterIndicator')
@ApiBearerAuth()
@Controller('masterindicator')
@UseGuards(JwtAuthGuard)
export class MasterIndicatorController {
  constructor(private readonly service: MasterIndicatorService) {}

  @Post()
create(
  @Body() dto: CreateMasterIndicatorDto,
  //@Body() body: any,
  @CurrentUser() user: JwtPayload,
) {

  if (!user?.id) {
    throw new UnauthorizedException('User ID not found in token');
  }

  try {
    const dto = new CreateMasterIndicatorDto();
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }
  return this.service.create(dto, user.id);
}


  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateMasterIndicatorDto): Promise<MasterIndicator> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<MasterIndicator> {
    return this.service.delete(id);
  }


  @Get()
findAll(@Query() query: QueryMasterIndicatorDto) {
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
