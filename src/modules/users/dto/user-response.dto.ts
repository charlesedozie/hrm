import { Role } from '@prisma/client';

export class UserResponseDto {
  id!: string;
  username!: string;
  role?: Role;
  employeeId?: string | null;
  staffId?: string | null;
}
