import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto, QueryLeaveTypeDto } from '../dto/dto';
import { LeaveType, LeaveBalance } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class LeaveTypeService {
constructor(private prisma: PrismaService) {}


async create(dto: CreateLeaveTypeDto, userId: string): Promise<LeaveType> {
  // ────────────────────────────────────────────────
  // 1. Normalize & validate basic fields
  // ────────────────────────────────────────────────
  const name = (dto.name ?? '').trim();
  if (!name) {
    throw new BadRequestException('Leave type name is required');
  }

  // Optional: you can add more sanitization here (min length, forbidden chars, etc.)
  if (name.length > 100) {
    throw new BadRequestException('Name must be 100 characters or less');
  }

  // ────────────────────────────────────────────────
  // 2. Check for duplicate name (most important uniqueness constraint)
  // ────────────────────────────────────────────────
  const existingByName = await this.prisma.leaveType.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive', // prevents "Annual Leave" vs "annual leave"
      },
    },
    select: { id: true, name: true },
  });

  if (existingByName) {
    throw new ConflictException(`A leave type named "${existingByName.name}" already exists`);
  }

  // Optional: also check code if provided (usually unique too)
  if (dto.code) {
    const trimmedCode = dto.code.trim();
    const existingByCode = await this.prisma.leaveType.findFirst({
      where: {
        code: {
          equals: trimmedCode,
          mode: 'insensitive',
        },
      },
      select: { id: true, code: true },
    });

    if (existingByCode) {
      throw new ConflictException(`Leave code "${existingByCode.code}" is already in use`);
    }
  }

  // ────────────────────────────────────────────────
  // 3. Prepare clean Prisma create input
  // ────────────────────────────────────────────────
  const data: Prisma.LeaveTypeCreateInput = {
    name,

    // Optional fields – only include if defined (prevents Prisma errors)
    ...(dto.code?.trim()                ? { code: dto.code.trim() }                : {}),
    ...(dto.description?.trim()         ? { description: dto.description.trim() } : {}),
    
    unit: dto.unit,                     // required enum
    isPaid: dto.isPaid ?? false,        // boolean with fallback
    requiresAttachment: dto.requiresAttachment ?? false,
    
    // Optional numerics – only set if explicitly provided
    ...(dto.maxDaysPerRequest !== undefined ? { maxDaysPerRequest: dto.maxDaysPerRequest } : {}),
    ...(dto.minNoticeDays     !== undefined ? { minNoticeDays:     dto.minNoticeDays     } : {}),
    
    accrualFrequency: dto.accrualFrequency, // required enum
    
    ...(dto.accrualRate        !== undefined ? { accrualRate:        dto.accrualRate        } : {}),
    ...(dto.maxAccrualBalance  !== undefined ? { maxAccrualBalance:  dto.maxAccrualBalance  } : {}),
    
    carryOverAllowed: dto.carryOverAllowed ?? false,
    
    ...(dto.maxCarryOverDays      !== undefined ? { maxCarryOverDays:      dto.maxCarryOverDays      } : {}),
    ...(dto.carryOverExpiryMonths !== undefined ? { carryOverExpiryMonths: dto.carryOverExpiryMonths } : {}),
    
    isActive: dto.isActive ?? true,     // most systems default to active

    // Relation – always set
    createdBy: {
      connect: { id: userId },
    },
  };

  // ────────────────────────────────────────────────
  // 4. Create and return
  // ────────────────────────────────────────────────
  try {
    return await this.prisma.leaveType.create({
      data,
    });
  } catch (err) {
    // Optional: handle known Prisma errors more gracefully
    if ((err as any).code === 'P2002') {
      throw new ConflictException('Unique constraint violation – value already exists');
    }
    throw err;
  }
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: LeaveType[]; pagination: any }> {
  const {
    page = 1,
    limit,
    search,
    id,
    name,
    sortBy = 'updatedAt',
    sortOrder = SortOrder.DESC,
  } = params || {};


  
  if (id) {
    const item = await this.prisma.leaveType.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.LeaveTypeWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.leaveType.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: LeaveType[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.leaveType.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.leaveType.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}



async getAllBalance(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: LeaveBalance[]; pagination: any }> {
  const {
    page = 1,
    limit,
    search,
    id,
    name,
    sortBy = 'updatedAt',
    sortOrder = SortOrder.DESC,
  } = params || {};

  const includeRelations = {
    employee: true,
    leaveType: true,
  };
  
  if (id) {
    const item = await this.prisma.leaveBalance.findUnique({
      where: { id },
       include: includeRelations,
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.LeaveBalanceWhereInput = {};
  if (search) {
    where.OR = [
      { employeeId: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.employeeId = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.leaveBalance.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: LeaveBalance[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.leaveBalance.findMany({
      where,      
       include: includeRelations,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.leaveBalance.findMany({
      where,
      skip,
       include: includeRelations,      
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}


async update(id: string, data: UpdateLeaveTypeDto): Promise<LeaveType> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.leaveType.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<LeaveType> {
await this.getById(id);
return this.prisma.leaveType.delete({ where: { id } });
}

async getById(id: string): Promise<LeaveType> {
const item = await this.prisma.leaveType.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
