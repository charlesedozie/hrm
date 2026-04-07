import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,50}$/, {
    message:
      "Password must be 8-50 characters long and include at least one uppercase letter, one lowercase letter, and one special character",
  })
  newPassword!: string;

  @IsString()
  confirmPassword!: string;
}