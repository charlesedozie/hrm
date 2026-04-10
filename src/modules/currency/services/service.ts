import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCurrencyDto, UpdateCurrencyDto, QueryCurrencyDto } from '../dto/dto';
import { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class CurrencyService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateCurrencyDto, userId: string): Promise<Currency> {
  const name = (dto.name ?? '').trim();
  const code = (dto.code ?? '').trim();
  const symbol = dto.symbol?.trim();

  if (!name) throw new BadRequestException('Name is required');
  if (!code) throw new BadRequestException('Code is required');

  const existing = await this.prisma.currency.findFirst({
    where: {
      OR: [
        { name: { equals: name, mode: 'insensitive' } },
        { code: { equals: code, mode: 'insensitive' } },
      ],
    },
  });

  if (existing) {
    throw new BadRequestException(`${name} or ${code} already exists`);
  }

  return this.prisma.currency.create({
    data: {
      name,
      code,
      symbol: symbol || '',
      createdBy: {
        connect: { id: userId },
      },
    },
  });
}


/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Currency[]; pagination: any }> {

  const {
    page = 1,
    limit,
    search,
    id,
    name,
    sortBy = 'updatedAt',
    sortOrder = SortOrder.DESC,
  } = params || {};

    const includeRelations = {salaryBands: true, };

  const allowedSortFields = ['id', 'code', 'name', 'symbol', 'updatedAt'];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'updatedAt';

  if (id) {
    const item = await this.prisma.currency.findUnique({ where: { id },  include: includeRelations, });
    if (!item) throw new NotFoundException('Item not found');

    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  const where: Prisma.CurrencyWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.currency.count({ where });

  const wantsAll = !limit || limit <= 0;

  let items: Currency[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.currency.findMany({
      where,
      include: includeRelations,
      orderBy: { [orderField]: sortOrder },
    });

    pagination = {
      total,
      page: 1,
      limit: null,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };

  } else {
    const skip = (page - 1) * limit;

    items = await this.prisma.currency.findMany({
      where,
      skip,
      take: limit,
      include: includeRelations,
      orderBy: { [orderField]: sortOrder },
    });

    const totalPages = Math.ceil(total / limit);

    pagination = {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  return { items, pagination };
}


async update(id: string, data: UpdateCurrencyDto): Promise<Currency> {
await this.getById(id);

// Convert date strings to Date objects if they exist
const updateData: any = { ...data };
return this.prisma.currency.update({
where: { id },
data: updateData,
});
}

async delete(id: string): Promise<Currency> {
await this.getById(id);
return this.prisma.currency.delete({ where: { id } });
}

async getById(id: string): Promise<Currency> {
const item = await this.prisma.currency.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
