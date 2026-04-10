import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationformService } from '../services/service';
import { CreateApplicationformDto, UpdateApplicationformDto, QueryApplicationformDto } from '../dto/dto';
import { Applicationform } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('Applicationforms')
@ApiBearerAuth()
@Controller('applicationforms')
export class ApplicationformController {
  constructor(private readonly service: ApplicationformService) {}

  @Post()
create(
  @Body() dto: CreateApplicationformDto,
  //@Body() body: any,
 // @CurrentUser() user: JwtPayload,
) {


  try {
    const dto = new CreateApplicationformDto();
    console.log('DTO class name:', dto.constructor.name);
    console.log('DTO expected fields:', Object.getOwnPropertyNames(dto));
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }

  return this.service.create(dto);
}


  @Put(':id')
@UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() data: UpdateApplicationformDto): Promise<Applicationform> {
    return this.service.update(id, data);
  }

  @Delete(':id')
@UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, 
  @CurrentUser() user: JwtPayload,): Promise<Applicationform> {
    return this.service.remove(id, user.id);
  }


  @Get()
@UseGuards(JwtAuthGuard)
findAll(@Query() query: QueryApplicationformDto) {
  return this.service.findAll(query);
}



@Get(':id')
@UseGuards(JwtAuthGuard)
async findOne(@Param('id') id: string) {
  const result = await this.service.findOne(id);
  return result;
}






}
