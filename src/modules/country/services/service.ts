import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Country } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';


@Injectable()
export class CountryService {
  constructor(private prisma: PrismaService) {}
  /**
   * Get vacancies with optional pagination and search
   */
  async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Country[]; pagination: any }> {
  const {
    page = 1,
    limit,                    // no default here
    search,
    id,
    name,
    sortBy = 'createdAt',
    sortOrder = SortOrder.DESC,
  } = params || {};

  // Handle single item by ID
  if (id) {
    const item = await this.prisma.country.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build where clause
  const where: Prisma.CountryWhereInput = {};

  if (search) {
    where.OR = [
      {
      name: {
        contains: search,
        mode: Prisma.QueryMode.insensitive,
      },
    },
    ];
  }

  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.country.count({ where });

  let items: Country[];
  let pagination: any;

  const wantsAll = limit === undefined || limit === null || limit <= 0;

  if (wantsAll) {
    // Return ALL items — no pagination applied
    items = await this.prisma.country.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      // IMPORTANT: no skip, no take
    });

    pagination = {
      total,
      page: 1,
      limit: null,           // or total, or undefined — null is clearest
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
  } else {
    // Normal pagination
    const skip = (page - 1) * limit;
    items = await this.prisma.country.findMany({
      where,
      skip,
      take: limit,           // now safe — limit is a positive number
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const totalPages = Math.ceil(total / limit);

    pagination = {
      total,
      page,
      limit,                 // the actual value sent by client
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  return { items, pagination };
}


  async getById(id: string): Promise<Country> { 
  const item = await this.prisma.country.findUnique({
    where: { id },
  });

  if (!item) throw new NotFoundException('item not found');

  // ─── Add these lines for debugging ──────────────────────────────
 return item;
}


}
