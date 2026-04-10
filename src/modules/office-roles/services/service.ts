import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOfficeRoleDto, UpdateOfficeRoleDto, QueryOfficeRoleDto } from '../dto/dto';
import { OfficeRole } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class OfficeRoleService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateOfficeRoleDto, userId: string): Promise<OfficeRole> {
// 1. Check if name already exists (case-insensitive is often better)
const name = (dto.name ?? '').trim();
if (!name) { throw new BadRequestException('NAME is required'); }
const existing = await this.prisma.officeRole.findFirst({
where: {
name: {
equals: dto.name,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.name} already exists.`,); }

// 3. Prepare Prisma create input
const data: Prisma.OfficeRoleCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
createdBy: {
connect: { id: userId },
},
// ... other fields (name, phone, etc.)
};
return this.prisma.officeRole.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: OfficeRole[]; pagination: any }> {
  const {
    page = 1,
    limit,
    search,
    id,
    name,
    sortBy = 'updatedAt',
    sortOrder = SortOrder.DESC,
  } = params || {};

const includes = {    
 _count: {
  select: {
    employmentHistory: {
      where: {
        isCurrent: true,
      },
    },
  },
}
  }
  
  if (id) {
    const item = await this.prisma.officeRole.findUnique({
      where: { id },
    include: includes,
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.OfficeRoleWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.officeRole.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: OfficeRole[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.officeRole.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
        include: includes,
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.officeRole.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
       include: includes,
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}


async update(id: string, data: UpdateOfficeRoleDto): Promise<OfficeRole> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.officeRole.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<OfficeRole> {
await this.getById(id);
return this.prisma.officeRole.delete({ where: { id } });
}

async getById(id: string): Promise<OfficeRole> {
const item = await this.prisma.officeRole.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
