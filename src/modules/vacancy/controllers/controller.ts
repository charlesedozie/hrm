import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VacancyService } from '../services/service';
import { CreateVacancyDto, UpdateVacancyDto, QueryDto } from '../dto/dto';
import { Vacancy } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
/*
import { Request } from 'express';
import { User } from '@prisma/client';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
*/


import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('Vacancies')
@ApiBearerAuth()
@Controller('vacancies')
@UseGuards(JwtAuthGuard)
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post()
create(
  @Body() dto: CreateVacancyDto,
  //@Body() body: any,
  @CurrentUser() user: JwtPayload,
) {

  if (!user?.id) {
    throw new UnauthorizedException('User ID not found in token');
  }

  try {
    const dto = new CreateVacancyDto();
    console.log('DTO class name:', dto.constructor.name);
    console.log('DTO expected fields:', Object.getOwnPropertyNames(dto));
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }

  return this.vacancyService.create(dto, user.id);
  //return this.vacancyService.create(body, user.id);
}


  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateVacancyDto): Promise<Vacancy> {
    return this.vacancyService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Vacancy> {
    return this.vacancyService.delete(id);
  }


  @Get()
findAll(@Query() query: QueryDto) {
  return this.vacancyService.getAll(query);
}

@Get(':id')
async findOne(@Param('id') id: string) {
  const result = await this.vacancyService.getAll({ id });
  // pick the first item or throw if not found
  if (!result.items || result.items.length === 0) {
    throw new NotFoundException('Item not found');
  }
  return result.items[0]; // <-- return the object directly
}






}
