// src/modules/auth/dto/request-password-reset.dto.ts
import { IsString } from "class-validator";

export class RequestPasswordResetDto {
  @IsString()
  email!: string; // maps to username
}