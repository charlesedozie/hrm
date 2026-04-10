import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrgDocsService } from '../services/service';
import { CreateOrgDocsDto, UpdateOrgDocsDto, QueryOrgDocsDto } from '../dto/dto';
import { OrgDocs } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('OrgDocs')
@ApiBearerAuth()
@Controller('orgdocs')
@UseGuards(JwtAuthGuard)
export class OrgDocsController {
  constructor(private readonly service: OrgDocsService) {}

  @Post()
create(
  @Body() dto: CreateOrgDocsDto,
  //@Body() body: any,
  @CurrentUser() user: JwtPayload,
) {

  if (!user?.id) {
    throw new UnauthorizedException('User ID not found in token');
  }

  try {
    const dto = new CreateOrgDocsDto();
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }
  return this.service.create(dto, user.id);
}


  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateOrgDocsDto): Promise<OrgDocs> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<OrgDocs> {
    return this.service.delete(id);
  }


  @Get()
findAll(@Query() query: QueryOrgDocsDto) {
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
