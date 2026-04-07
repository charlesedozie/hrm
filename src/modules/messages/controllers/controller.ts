import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessageService } from '../services/service';
import { CreateMessageDto, UpdateMessageDto, QueryMessageDto } from '../dto/dto';
import { Message } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

@ApiTags('Message')
@ApiBearerAuth()
@Controller('message')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @Post()
create(
  @Body() dto: CreateMessageDto,
  //@Body() body: any,
  @CurrentUser() user: JwtPayload,
) {

  if (!user?.id) {
    throw new UnauthorizedException('User ID not found in token');
  }

  try {
    const dto = new CreateMessageDto();
  } catch (e) {
    console.error('DTO instantiation failed:', e);
  }
  return this.service.create(user.id, dto);
}


  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateMessageDto): Promise<Message> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Message> {
    return this.service.delete(id);
  }







}
