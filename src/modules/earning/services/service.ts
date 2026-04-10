import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateEarningDto, UpdateEarningDto, QueryEarningDto } from '../dto/dto';
import { Earning } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class EarningService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateEarningDto, userId: string): Promise<Earning> {
// 1. Check if name already exists (case-insensitive is often better)
const name = (dto.name ?? '').trim();
if (!name) { throw new BadRequestException('name is required'); }
const existing = await this.prisma.earning.findFirst({
where: {
name: {
equals: name,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.name} already exists.`,); }
// 3. Prepare Prisma create input
const data: Prisma.EarningUncheckedCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
// ... other fields (name, phone, etc.)
};
return this.prisma.earning.create({  // or beneficiary.create
data,
});
}






/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Earning[]; pagination: any }> {
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
    const item = await this.prisma.earning.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Earning not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.EarningWhereInput = {};
  if (search) {
    where.OR = [
      { description: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.earning.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: Earning[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.earning.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.earning.findMany({
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


async update(id: string, data: UpdateEarningDto): Promise<Earning> {
await this.getById(id);

// Convert date strings to Date objects if they exist
const updateData: any = { ...data };
return this.prisma.earning.update({
where: { id },
data: updateData,
});
}



async delete(id: string): Promise<Earning> {
await this.getById(id);
return this.prisma.earning.delete({ where: { id } });
}

async getById(id: string): Promise<Earning> {
const item = await this.prisma.earning.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
