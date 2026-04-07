import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GrievanceService } from '../services/service';
import { CreateGrievanceDto, UpdateGrievanceDto, QueryGrievanceDto } from '../dto/dto';
import { Grievance } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('Grievance')
@ApiBearerAuth()
@Controller('beneficiary-grievance')
@UseGuards(JwtAuthGuard)
export class GrievanceController {
  constructor(private readonly service: GrievanceService) {}

@Post()
create(
  @Body() dto: CreateGrievanceDto,
  //@Body() body: any,
  @CurrentUser() user: JwtPayload,
) {

  if (!user?.id) {
    throw new UnauthorizedException('User ID not found in token');
  }

  try {
    const dto = new CreateGrievanceDto();
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }
  return this.service.create(dto, user.id);
}


@Post('complaint')
createComplaint(
  @Body() dto: CreateGrievanceDto,
  //@Body() body: any,
  @CurrentUser() user: JwtPayload,
) {

  if (!user?.id) {
    throw new UnauthorizedException('User ID not found in token');
  }

  try {
    const dto = new CreateGrievanceDto();
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }
  return this.service.createComplaint(dto, user.id);
}


  @Put('complaint/:id')
  updateComplaint(@Param('id') id: string, @Body() data: UpdateGrievanceDto,  @CurrentUser() user: JwtPayload,): Promise<Grievance> {
    return this.service.update(id, data, user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateGrievanceDto,  @CurrentUser() user: JwtPayload,): Promise<Grievance> {
    return this.service.update(id, data, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Grievance> {
    return this.service.delete(id);}

@Get()
findAll(@Query() query: QueryGrievanceDto) {
  return this.service.getAll(query);}

  @Get('complaints')
findAllComplaint(@Query() query: QueryGrievanceDto) {
  return this.service.getAllComplaint(query);}

  @Get('me')
findAllMe(@Query() query: QueryGrievanceDto,  @CurrentUser() user: JwtPayload,) {
  return this.service.getAllMe(user.id, query);
}
  @Get('me-complaint')
findAllMeComplaint(@Query() query: QueryGrievanceDto,  @CurrentUser() user: JwtPayload,) {
  return this.service.getAllMeComplaint(user.id, query);
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
