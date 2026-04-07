import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateGenderDto, UpdateGenderDto, QueryGenderDto } from '../dto/dto';
import { Gender } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class GenderService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateGenderDto, userId: string): Promise<Gender> {
// 1. Check if name already exists (case-insensitive is often better)
const code = (dto.name ?? '').trim();
if (!code) { throw new BadRequestException('CODE is required'); }
const existing = await this.prisma.gender.findFirst({
where: {
name: {
equals: dto.name,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.name} already exists.`,); }

// 3. Prepare Prisma create input
const data: Prisma.GenderCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
// ... other fields (name, phone, etc.)
};
return this.prisma.gender.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Gender[]; pagination: any }> {
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
    const item = await this.prisma.gender.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.GenderWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.gender.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: Gender[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.gender.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.gender.findMany({
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


async update(id: string, data: UpdateGenderDto): Promise<Gender> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.gender.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<Gender> {
await this.getById(id);
return this.prisma.gender.delete({ where: { id } });
}

async getById(id: string): Promise<Gender> {
const item = await this.prisma.gender.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
