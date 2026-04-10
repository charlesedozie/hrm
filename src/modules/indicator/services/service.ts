import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateMasterIndicatorDto, UpdateMasterIndicatorDto, QueryMasterIndicatorDto } from '../dto/dto';
import { MasterIndicator } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class MasterIndicatorService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateMasterIndicatorDto, userId: string): Promise<MasterIndicator> {
// 1. Check if name already exists (case-insensitive is often better)
const code = (dto.code ?? '').trim();
if (!code) { throw new BadRequestException('CODE is required'); }
const existing = await this.prisma.masterIndicator.findFirst({
where: {
code: {
equals: dto.code,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.code} already exists.`,); }

// 3. Prepare Prisma create input
const data: Prisma.MasterIndicatorCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
createdBy: {
connect: { id: userId },
},
// ... other fields (name, phone, etc.)
};
return this.prisma.masterIndicator.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: MasterIndicator[]; pagination: any }> {
  const {
    page = 1,
    limit,
    search,
    id,
    name,
    sortBy = 'name',
    sortOrder = SortOrder.DESC,
  } = params || {};


  
  if (id) {
    const item = await this.prisma.masterIndicator.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.MasterIndicatorWhereInput = {};
  if (search) {
    where.OR = [
      { code: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.code = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.masterIndicator.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: MasterIndicator[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.masterIndicator.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.masterIndicator.findMany({
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


async update(id: string, data: UpdateMasterIndicatorDto): Promise<MasterIndicator> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.masterIndicator.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<MasterIndicator> {
await this.getById(id);
return this.prisma.masterIndicator.delete({ where: { id } });
}

async getById(id: string): Promise<MasterIndicator> {
const item = await this.prisma.masterIndicator.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
