import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAssetCategoryDto, UpdateAssetCategoryDto, QueryAssetCategoryDto } from '../dto/dto';
import { AssetCategory } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AssetCategoryService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateAssetCategoryDto, userId: string): Promise<AssetCategory> {
// 1. Check if name already exists (case-insensitive is often better)
const name = (dto.name ?? '').trim();
if (!name) { throw new BadRequestException('name is required'); }
const existing = await this.prisma.assetCategory.findFirst({
where: {
name: {
equals: dto.name,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.name} already exists.`,); }

// 3. Prepare Prisma create input
const data: Prisma.AssetCategoryCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
createdBy: {
connect: { id: userId },
},
// ... other fields (name, phone, etc.)
};
return this.prisma.assetCategory.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: AssetCategory[]; pagination: any }> {
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
    const item = await this.prisma.assetCategory.findUnique({
      where: { id },
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
  let items: AssetCategory[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.assetCategory.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.assetCategory.findMany({
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


async update(id: string, data: UpdateAssetCategoryDto): Promise<AssetCategory> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  return this.prisma.assetCategory.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<AssetCategory> {
await this.getById(id);
return this.prisma.assetCategory.delete({ where: { id } });
}

async getById(id: string): Promise<AssetCategory> {
const item = await this.prisma.assetCategory.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
