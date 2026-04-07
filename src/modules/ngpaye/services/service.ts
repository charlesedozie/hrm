import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateNgpayeBandDto, UpdateNgpayeBandDto, QueryNgpayeBandDto } from '../dto/dto';
import { NgpayeBand } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class NgpayeBandService {
constructor(private prisma: PrismaService) {}

/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: NgpayeBand[]; pagination: any }> {
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
    const item = await this.prisma.ngpayeBand.findUnique({
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
      { id: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.id = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.assetCategory.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: NgpayeBand[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.ngpayeBand.findMany({
      where,  
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.ngpayeBand.findMany({
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


async update(id: string, data: UpdateNgpayeBandDto): Promise<NgpayeBand> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  return this.prisma.ngpayeBand.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<NgpayeBand> {
await this.getById(id);
return this.prisma.ngpayeBand.delete({ where: { id } });
}

async getById(id: string): Promise<NgpayeBand> {
const item = await this.prisma.ngpayeBand.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
