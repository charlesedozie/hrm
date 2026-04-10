import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BeneficiaryService } from '../services/service';
import { CreateDto, UpdateDto } from '../dto/dto';
import { Beneficiary } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { QueryDto } from '../dto/QueryDto';


import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('Beneficiaries')
@ApiBearerAuth()
@Controller('beneficiaries')
@UseGuards(JwtAuthGuard)
export class BeneficiaryController {
  constructor(private readonly service: BeneficiaryService) {}

  @Post()
create(
  @Body() dto: CreateDto,
  @CurrentUser() user: JwtPayload,
) {

  if (!user?.id) {
    throw new UnauthorizedException('User ID not found in token');
  }

  try {
    const dto = new CreateDto();
    console.log('DTO class name:', dto.constructor.name);
    console.log('DTO expected fields:', Object.getOwnPropertyNames(dto));
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }

  return this.service.create(dto, user.id);
}

  @Post('partial')
  partialUpdate(@CurrentUser() user: JwtPayload, @Body() data: UpdateDto): Promise<Beneficiary> {
    return this.service.partialUpdate(user.id, data);
  }



  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateDto): Promise<Beneficiary> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Beneficiary> {
    return this.service.delete(id);
  }


  @Get()
findAll(@Query() query: QueryDto) {
  return this.service.getAll(query);
}


@Get('me/:id')
findAllMe(@Query() query: QueryDto, 
  @CurrentUser() user: JwtPayload,) {
  return this.service.getAllMe(user.id, query);
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
