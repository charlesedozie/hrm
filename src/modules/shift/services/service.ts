import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateShiftDto, UpdateShiftDto, QueryShiftDto } from '../dto/dto';
import { Shift } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class ShiftService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateShiftDto, userId: string): Promise<Shift> {
// 1. Check if name already exists (case-insensitive is often better)
const name = (dto.name ?? '').trim();
if (!name) { throw new BadRequestException('Name is required'); }
const existing = await this.prisma.shift.findFirst({
where: {
name: {
equals: dto.name,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.name} already exists.`,); }

// 3. Prepare Prisma create input
 const { scheduleId, ...dtoData } = dto; // remove employeeId
const data: Prisma.ShiftCreateInput = {  // or BeneficiaryCreateInput etc.
...dtoData,
 schedule: {
      connect: { id: dto.scheduleId }
    },
createdBy: {
connect: { id: userId },
},
// ... other fields (name, phone, etc.)
};
return this.prisma.shift.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Shift[]; pagination: any }> {
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
    const item = await this.prisma.shift.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.ShiftWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.shift.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: Shift[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.shift.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.shift.findMany({
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


async update(id: string, data: UpdateShiftDto): Promise<Shift> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.shift.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<Shift> {
await this.getById(id);
return this.prisma.shift.delete({ where: { id } });
}

async getById(id: string): Promise<Shift> {
const item = await this.prisma.shift.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
