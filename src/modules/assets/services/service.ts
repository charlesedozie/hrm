import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAssetDto, UpdateAssetDto, QueryAssetDto } from '../dto/dto';
import { Asset } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AssetService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateAssetDto, userId: string): Promise<Asset> {
// 1. Check if name already exists (case-insensitive is often better)
const assetTag = (dto.assetTag ?? '').trim();
if (!assetTag) { throw new BadRequestException('Asset Tag is required'); }
const existing = await this.prisma.asset.findFirst({
where: {
assetTag: {
equals: assetTag,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.assetTag} already exists.`,); }
// 3. Prepare Prisma create input
const data: Prisma.AssetUncheckedCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
 createdById: userId,
// ... other fields (name, phone, etc.)
};
return this.prisma.asset.create({  // or beneficiary.create
data,
});
}






/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Asset[]; pagination: any }> {
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
    assignments: true,
    depreciations: true,
    projectAllocations: true,
    location: true,
    category: true,
  };


  if (id) {
    const item = await this.prisma.asset.findUnique({
      where: { id },
      include: includeRelations,
    });
    if (!item) throw new NotFoundException('Asset not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.AssetWhereInput = {};
  if (search) {
    where.OR = [
      { assetTag: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.asset.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: Asset[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.asset.findMany({
      where,
      include: includeRelations,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.asset.findMany({
      where,
      skip,
      take: limit,
      include: includeRelations,
      orderBy: { [sortBy]: sortOrder },
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}


async update(id: string, data: UpdateAssetDto): Promise<Asset> {
await this.getById(id);

// Convert date strings to Date objects if they exist
const updateData: any = { ...data };
return this.prisma.asset.update({
where: { id },
data: updateData,
});
}



async delete(id: string): Promise<Asset> {
await this.getById(id);
return this.prisma.asset.delete({ where: { id } });
}

async getById(id: string): Promise<Asset> {
const item = await this.prisma.asset.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
