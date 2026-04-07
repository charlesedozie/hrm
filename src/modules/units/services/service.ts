import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUnitDto, UpdateUnitDto, QueryUnitDto } from '../dto/dto';
import { Unit } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class UnitService {
constructor(private prisma: PrismaService) {}
async create(dto: CreateUnitDto, userId: string): Promise<Unit> {
  const name = (dto.name ?? '').trim();
  if (!name) {
    throw new BadRequestException('NAME is required');
  }

  const existing = await this.prisma.unit.findFirst({
    where: {
      name: {
        equals: dto.name,
        mode: 'insensitive',
      },
    },
  });

  if (existing) {
    throw new BadRequestException(`${dto.name} already exists.`);
  }

  // Validate department exists (optional but strongly recommended)
  if (!dto.departmentId) {
    throw new BadRequestException('departmentId is required');
  }

  const departmentExists = await this.prisma.department.findUnique({
    where: { id: dto.departmentId },
  });

  if (!departmentExists) {
    throw new BadRequestException('Department not found');
  }

  // Now build the safe create input
  const data: Prisma.UnitCreateInput = {
    name: dto.name,
    description: dto.description,
    // ... spread other scalar fields from dto if needed, but avoid spreading id/relations blindly
    department: {
      connect: { id: dto.departmentId },  // ← this is what was missing
    },
    createdBy: {
      connect: { id: userId },
    },
  };

  return this.prisma.unit.create({ data });
}


/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Unit[]; pagination: any }> {
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
    const item = await this.prisma.unit.findUnique({
      where: { id },
    include: {  
     department: true,
  },
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.UnitWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.unit.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: Unit[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.unit.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
        include: {    
     department: true,
  },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.unit.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
       include: {  
     department: true,
  },
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}


async update(id: string, data: UpdateUnitDto): Promise<Unit> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.unit.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<Unit> {
await this.getById(id);
return this.prisma.unit.delete({ where: { id } });
}

async getById(id: string): Promise<Unit> {
const item = await this.prisma.unit.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
