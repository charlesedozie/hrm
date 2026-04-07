import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

import { Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Controller, Get, Post, Put, Delete, Body, Param, Patch, } from '@nestjs/common';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ChangePasswordDto } from "../dto/change-password.dto";
import { RequestPasswordResetDto } from "../dto/request-password-reset.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';


@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}

@Post('login')
async login(@Body() dto: LoginDto) {
const user = await this.authService.validateUser(dto.email, dto.password);
return this.authService.login(user);
}


@Post('register')
async register(@Body() dto: RegisterDto) {
const user = await this.authService.register(dto);
return { message: 'User registered successfully', user };
}

@UseGuards(JwtAuthGuard)
@Post("change-password")
async changePassword(@CurrentUser() user: JwtPayload, @Body() dto: ChangePasswordDto,) {
return this.authService.changePassword(user.id, dto);
}

// 📧 Request reset link
@Post("request-password-reset")
async requestReset(@Body() dto: RequestPasswordResetDto) {
return this.authService.requestPasswordReset(dto.email);
}

// 🔑 Reset password
@Post("reset-password")
async resetPassword(@Body() dto: ResetPasswordDto) {
return this.authService.resetPassword(dto.token, dto.newPassword);
}
}
