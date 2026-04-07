import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { ApprovalService } from '../services/service';
import { CreateWorkflowDto, UpdateWorkflowDto } from '../dto/dto';
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

@ApiTags('Approvals')
@ApiBearerAuth()
@Controller('approvals')
@UseGuards(JwtAuthGuard)
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  /*
  @Post('request')
  createRequest(@Body() dto: any) {
    return this.approvalService.createApprovalRequest(dto);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body() dto: any) {
    return this.approvalService.approve(id, dto.userId, dto.comment);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string, @Body() dto: any) {
    return this.approvalService.reject(id, dto.userId, dto.comment);
  }

  @Post('workflows')
   @Post()
  async createWorkflow(@Body() dto: CreateWorkflowDto) {
    return this.approvalService.createWorkflow(dto);
  }
  

@Get('roles')
getAll(@Param('id') id: string, @Body() dto: any) {
    return this.approvalService.getAll();
  }
*/

}
