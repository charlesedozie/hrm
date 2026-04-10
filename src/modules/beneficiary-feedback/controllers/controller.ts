import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BeneficiaryFeedbackService } from '../services/service';
import { CreateBeneficiaryFeedbackDto, UpdateBeneficiaryFeedbackDto, QueryBeneficiaryFeedbackDto } from '../dto/dto';
import { BeneficiaryFeedback } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('BeneficiaryFeedback')
@ApiBearerAuth()
@Controller('beneficiary-feedback')
@UseGuards(JwtAuthGuard)
export class BeneficiaryFeedbackController {
  constructor(private readonly service: BeneficiaryFeedbackService) {}

  @Post()
create(
  @Body() dto: CreateBeneficiaryFeedbackDto,
  //@Body() body: any,
  @CurrentUser() user: JwtPayload,
) {

  if (!user?.id) {
    throw new UnauthorizedException('User ID not found in token');
  }

  try {
    const dto = new CreateBeneficiaryFeedbackDto();
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }
  return this.service.create(dto, user.id);
}


  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateBeneficiaryFeedbackDto,  @CurrentUser() user: JwtPayload,): Promise<BeneficiaryFeedback> {
    return this.service.update(id, data, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<BeneficiaryFeedback> {
    return this.service.delete(id);}

@Get()
findAll(@Query() query: QueryBeneficiaryFeedbackDto) {
  return this.service.getAll(query);}

  @Get('me')
findAllMe(@Query() query: QueryBeneficiaryFeedbackDto,  @CurrentUser() user: JwtPayload,) {
  return this.service.getAllMe(user.id, query);
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
