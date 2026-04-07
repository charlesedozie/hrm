import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BeneficiaryRequestService } from '../services/service';
import { CreateBeneficiaryRequestDto, UpdateBeneficiaryRequestDto, QueryBeneficiaryRequestDto } from '../dto/dto';
import { BeneficiaryRequest } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('BeneficiaryRequest')
@ApiBearerAuth()
@Controller('beneficiary-request')
@UseGuards(JwtAuthGuard)
export class BeneficiaryRequestController {
constructor(private readonly service: BeneficiaryRequestService) {}

@Post()
create(
@Body() dto: CreateBeneficiaryRequestDto,
@CurrentUser() user: JwtPayload,
) {

if (!user?.id) {
throw new UnauthorizedException('User ID not found in token');
}

try {
const dto = new CreateBeneficiaryRequestDto();
} catch (e) {
console.error('DTO instantiation failed:', e);
}
return this.service.create(dto, user.id);
}


@Put(':id')
update(@Param('id') id: string, @Body() data: UpdateBeneficiaryRequestDto, 
@CurrentUser() user: JwtPayload,): Promise<BeneficiaryRequest> {
return this.service.update(id, data, user.id);
}

@Delete(':id')
remove(@Param('id') id: string): Promise<BeneficiaryRequest> {
return this.service.delete(id);
}


@Get()
findAll(@Query() query: QueryBeneficiaryRequestDto) {
return this.service.getAll(query);
}

@Get('me')
findAllMe(@Query() query: QueryBeneficiaryRequestDto,
@CurrentUser() user: JwtPayload,) {
return this.service.getAllMeRequest(user.id, query);
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
