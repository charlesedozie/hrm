import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UsersService } from '@/modules/users/services/users.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { User, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from "crypto";
import { JwtService } from '@nestjs/jwt';
import { request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ========================
  // REGISTER
  // ========================
  async register(userData: {
    username: string;
    password: string;
    role?: Role;
    employeeId?: string;
    staffId?: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await this.usersService.findByEmail(userData.username);

    if (user) {
      throw new UnauthorizedException('Invalid credentials, user already exists');
    }
    // Map AppRole to Prisma Role
    const prismaRole: Role =
      Role[userData.role as keyof typeof Role];

    return this.prisma.user.create({
      data: {
        username: userData.username,
        password: hashedPassword,
        role: prismaRole,
  
      },
    });
  }

  // ========================
  // VALIDATE USER (LOGIN)
  // ========================
  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    module: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;

    return result;
  }

   // ========================
  // MERGE PERMISSIONS (MULTI-ROLE)
  // ========================
  private mergePermissions(roleAssignments: any[]) {
  const permissions: Record<
    string,
    { create: boolean; read: boolean; update: boolean; delete: boolean }
  > = {};

  let isSuperAdmin = false;

  for (const assignment of roleAssignments) {
    const role = assignment.role;

    if (role.code === 'SUPER_ADMIN') {
      isSuperAdmin = true;
      break;
    }

    for (const p of role.permissions) {
      const moduleCode = p.module.code;

      if (!permissions[moduleCode]) {
        permissions[moduleCode] = {
          create: false,
          read: false,
          update: false,
          delete: false,
        };
      }

      permissions[moduleCode].create ||= p.canCreate;
      permissions[moduleCode].read ||= p.canRead;
      permissions[moduleCode].update ||= p.canUpdate;
      permissions[moduleCode].delete ||= p.canDelete;
    }
  }

  return {
    isSuperAdmin,
    permissions,
  };
}

  // ========================
  // LOGIN
  // ========================
  async login(user: any) {
    const { isSuperAdmin, permissions } = this.mergePermissions(user.roles);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      beneficiaryId: user.beneficiaryId,
      isSuperAdmin,
      permissions,
    };

    console.log('payload', payload)

// Successful login → log activity
await this.prisma.userActivity.create({
data: {
createdById: user.id,
activityType: 'LOGIN',
details: {
method: 'credentials', // or 'google', 'github', etc.
ipAddress: request?.headers?.['x-forwarded-for'] ?? null,
userAgent: request?.headers?.['user-agent'] ?? null,
},
timestamp: new Date(),
},
});


    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }


  // change password
   async changePassword(userId: string, dto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = dto;

     // ✅ 1. Confirm passwords match
  if (newPassword !== confirmPassword) {
    throw new BadRequestException("Passwords do not match");
  }

    // 1. Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // 2. Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    // 3. Prevent same password reuse
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new UnauthorizedException("New password must be different");
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: "Password changed successfully",
    };
  }


  
  // 🔹 1. Request Password Reset
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: email }, // email stored as username
    });

    // Always return success (avoid user enumeration)
    if (!user) {
      return { message: "If user exists, reset link has been sent" };
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Hash token before saving (extra security)
    const hashedToken = await bcrypt.hash(token, 10);

    // Expiry (e.g. 1 hour)
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: expiry,
      },
    });

    // TODO: Replace with your email service
    const resetLink = `https://your-frontend.com/reset-password?token=${token}`;

    console.log("Reset link:", resetLink);

    return {
      message: "If user exists, reset link has been sent",
    };
  }

  // 🔹 2. Reset Password
  async resetPassword(token: string, newPassword: string) {
    // Find users with valid (non-expired) token
    const users = await this.prisma.user.findMany({
      where: {
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    let matchedUser = null;

    // Compare token manually (since it's hashed)
    for (const user of users) {
      if (!user.resetToken) continue;

      const isMatch = await bcrypt.compare(token, user.resetToken);
      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      throw new BadRequestException("Invalid or expired token");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password + clear reset fields
    await this.prisma.user.update({
      where: { id: matchedUser.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return {
      message: "Password reset successful",
    };
  }
  
}
