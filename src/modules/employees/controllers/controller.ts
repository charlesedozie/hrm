import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeService } from '../services/service';
import { CreateEmployeeDto, UpdateEmployeeDto, QueryEmployeeDto } from '../dto/dto';
import { Employee } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @Post()
create(
  @Body() dto: CreateEmployeeDto,
  @CurrentUser() user: JwtPayload,
) {

  if (!user?.id) {
    throw new UnauthorizedException('User ID not found in token');
  }

  try {
    const dto = new CreateEmployeeDto();
    console.log('DTO class name:', dto.constructor.name);
    console.log('DTO expected fields:', Object.getOwnPropertyNames(dto));
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }

  return this.service.create(dto, user.id);
}


  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateEmployeeDto): Promise<Employee> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Employee> {
    return this.service.delete(id);
  }


  @Get()
findAll(@Query() query: QueryEmployeeDto) {
  return this.service.getAll(query);
}


  @Get('unassignedtouser')
findAllUnassignedToUser(@Query() query: QueryEmployeeDto) {
  return this.service.getUnassignedToUser(query);
}



// employee.controller.ts
@Get('me/reports')
getMyDirectReports(@CurrentUser() user: JwtPayload, ) {
  const employeeId = user.id; // ← adjust to your auth context
  return this.service.getMyDirectReports(employeeId);
}

@Get('me/manager')
async getMyManager(@CurrentUser() user: JwtPayload, ) {
  const employeeId = user.id;
  return this.service.getMyManager(employeeId);
}

@Get('me/reporting-line')
async getMyReportingLine(@CurrentUser() user: JwtPayload,
) {
  const employeeId = user.id;
  return this.service.getMyReportingLine(employeeId);
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
