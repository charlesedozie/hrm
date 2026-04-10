import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { UserSettingsService } from '../services/service';
import { Patch } from '@nestjs/common';
import { UpdateUserSettingsDto } from '../dto/dto';
import { Request } from 'express';

import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('UserSettings')
@ApiBearerAuth()
@Controller('user-settings')
@UseGuards(JwtAuthGuard)
export class UserSettingsController {
constructor(private readonly service: UserSettingsService) {}

@Get()
async getSettings(@Req() req: Request,  @CurrentUser() user: JwtPayload,) {
if (!user?.id) {
throw new UnauthorizedException('User ID not found in token');
}
const userId = user.id;
return this.service.getUserSettings(userId);

}

@Patch()
async updateSettings(
@Req() req: Request,
@Body() dto: UpdateUserSettingsDto,  
@CurrentUser() user: JwtPayload
) {

if (!user.id) {
throw new UnauthorizedException('User not authenticated');
}
const userId = user.id;

return this.service.updateSettings(userId, dto);

}

}