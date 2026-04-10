import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOfficeLocationDto, UpdateOfficeLocationDto, QueryOfficeLocationDto } from '../dto/dto';
import { OfficeLocation } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class OfficeLocationService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateOfficeLocationDto, userId: string): Promise<OfficeLocation> {
// 1. Check if name already exists (case-insensitive is often better)
const name = (dto.name ?? '').trim();
if (!name) { throw new BadRequestException('name is required'); }
const existing = await this.prisma.officeLocation.findFirst({
where: {
name: {
equals: dto.name,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.name} already exists.`,); }

// 3. Prepare Prisma create input
const data: Prisma.OfficeLocationCreateInput = {  // or BeneficiaryCreateInput etc.
 name: name,
createdBy: {
connect: { id: userId },
},
state: {
connect: { id: dto.stateId },
},
// ... other fields (name, phone, etc.)
};
return this.prisma.officeLocation.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: OfficeLocation[]; pagination: any }> {
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
    const item = await this.prisma.officeLocation.findUnique({
      where: { id },
    include: { state: { select: { name: true, },}, },
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.AssetCategoryWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.assetCategory.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: OfficeLocation[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.officeLocation.findMany({
      where,  
      include: { state: { select: { name: true, },}, },
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.officeLocation.findMany({
      where,
    include: { state: { select: { name: true, },}, },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}


async update(id: string, data: UpdateOfficeLocationDto): Promise<OfficeLocation> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  return this.prisma.officeLocation.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<OfficeLocation> {
await this.getById(id);
return this.prisma.officeLocation.delete({ where: { id } });
}

async getById(id: string): Promise<OfficeLocation> {
const item = await this.prisma.officeLocation.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
