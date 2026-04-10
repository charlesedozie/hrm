import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { User, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
//import { Role as AppRole } from 'src/common/enums/role.enum'; // your custom enum alias
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(username: string) {
  return this.prisma.user.findUnique({
    where: { username },
  });
}


    async getUsers(
    params?: PaginationDto & { id?: string; name?: string },
  ): Promise<{ items: User[]; pagination: any }> {
    const {
      page = 1,
      limit,                    // no default here
      search,
      id,
      name,
      sortBy = 'username',
      sortOrder = SortOrder.ASC,
    } = params || {};
  
    // Handle single item by ID
    if (id) {
      const items = await this.prisma.user.findUnique({ where: { id },
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
      employee: {
        select: {
          fname: true,
          lname: true,
          mname: true,
        },
      },
    },
   });
      if (!items) throw new NotFoundException('Item not found');
      return {
        items: [items],
        pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
      };
    }
  
    // Build where clause
    const where: Prisma.UserWhereInput = {};
  
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }
  
    if (name) {
      where.username = { contains: name, mode: 'insensitive' };
    }
  
    const total = await this.prisma.user.count({ where });
  
    let items: User[];
    let pagination: any;
  
    const wantsAll = limit === undefined || limit === null || limit <= 0;
  
    if (wantsAll) {
      // Return ALL items — no pagination applied
      items = await this.prisma.user.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        // IMPORTANT: no skip, no take
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
      employee: {
        select: {
          fname: true,
          lname: true,
          mname: true,
        },
      },
    },
    
      });
  
      pagination = {
        total,
        page: 1,
        limit: null,           // or total, or undefined — null is clearest
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };
    } else {
      // Normal pagination
      const skip = (page - 1) * limit;
      items = await this.prisma.user.findMany({
        where,
        skip,
        take: limit,           // now safe — limit is a positive number
        orderBy: {
          [sortBy]: sortOrder,
        },
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
      employee: {
        select: {
          id: true,
          fname: true,
          lname: true,
          mname: true,
        },
      },
    },
      });
  
      const totalPages = Math.ceil(total / limit);
  
      pagination = {
        total,
        page,
        limit,                 // the actual value sent by client
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    }
  
    return { items, pagination };
  }
  

// Find by PK (UUID)
  async getUser(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }




  async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Default role if not provided
    const role = dto.role ?? Role.EMPLOYEE;

    // Map AppRole to Prisma Role
    const prismaRole: Role = Role[role as keyof typeof Role];

 return this.prisma.user.create({
  data: {
    username: dto.username,
    password: hashedPassword,
    role: prismaRole,
    // Optional connections
    employee: dto.employeeId
      ? { connect: { id: dto.employeeId } }
      : undefined,
  },
  include: {
    employee: true,
  },
});

  }

   // --------------------------
  // Update user
  // --------------------------
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    // Throws if user not found
    const existing = await this.getUser(id);
    if (!existing) throw new NotFoundException('User not found');

    // Map app enum role to Prisma role
  const updateData = {
    ...data,
    role: data.role ? (Role[data.role as keyof typeof Role] as Role) : undefined,
  };

return this.prisma.user.update({
    where: { id },
    data: updateData,
  });
  }

  // --------------------------
  // Delete user
  // --------------------------
  async deleteUser(id: string): Promise<User> {
    // Throws if user not found
    const existing = await this.getUser(id);
    if (!existing) throw new NotFoundException('User not found');

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
