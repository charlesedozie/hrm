import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PayrollPeriodService } from '../services/service';
import { CreatePayrollPeriodDto, UpdatePayrollPeriodDto, QueryPayrollPeriodDto } from '../dto/dto';
import { PayrollPeriod } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('PayrollPeriods')
@ApiBearerAuth()
@Controller('payrollperiods')
@UseGuards(JwtAuthGuard)
export class PayrollPeriodController {
  constructor(private readonly service: PayrollPeriodService) {}
/*
  @Post()
create(
  @Body() dto: CreatePayrollPeriodDto,
  //@Body() body: any,
  @CurrentUser() user: JwtPayload,
) {

  try {
    const dto = new CreatePayrollPeriodDto();
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }
  return this.service.create(dto, user.id);
}


  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdatePayrollPeriodDto): Promise<PayrollPeriod> {
    return this.service.update(id, data);
  }
*/
  @Delete(':id')
  remove(@Param('id') id: string): Promise<PayrollPeriod> {
    return this.service.delete(id);
  }


  @Get()
findAll(@Query() query: QueryPayrollPeriodDto) {
  return this.service.getAll(query);
}

@Get(':id')
async findOne(@Param('id') id: string) {
  const result = await this.service.getAll({ id });
  if (!result.items || result.items.length === 0) {
    throw new NotFoundException('Item not found');
  }
  return result.items[0]; 
}


}