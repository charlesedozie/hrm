import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateInterventionCategoryDto, UpdateInterventionCategoryDto, QueryInterventionCategoryDto } from '../dto/dto';
import { InterventionCategory } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class InterventionCategoryService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateInterventionCategoryDto, userId: string): Promise<InterventionCategory> {
// 1. Check if name already exists (case-insensitive is often better)
const code = (dto.name ?? '').trim();
if (!code) { throw new BadRequestException('name is required'); }
const existing = await this.prisma.interventionCategory.findFirst({
where: {
name: {
equals: dto.name,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.name} already exists.`,); }

// 3. Prepare Prisma create input
const data: Prisma.InterventionCategoryCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
createdBy: {
connect: { id: userId },
},
// ... other fields (name, phone, etc.)
};
return this.prisma.interventionCategory.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: InterventionCategory[]; pagination: any }> {
  const {
    page = 1,
    limit,
    search,
    id,
    name,
    sortBy = 'updatedAt',
    sortOrder = SortOrder.DESC,
  } = params || {};

const includes =  {
     _count: {
        select: {
          interventions: true,   // ← this gives { applicationForm: number }
        },
      },
  };
  
  if (id) {
    const item = await this.prisma.interventionCategory.findUnique({
      where: { id },
      include: includes,
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.InterventionCategoryWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.interventionCategory.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: InterventionCategory[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.interventionCategory.findMany({
      where,
      include: includes,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.interventionCategory.findMany({
      where,
      include: includes,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}


async update(id: string, data: UpdateInterventionCategoryDto): Promise<InterventionCategory> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.interventionCategory.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<InterventionCategory> {
await this.getById(id);
return this.prisma.interventionCategory.delete({ where: { id } });
}

async getById(id: string): Promise<InterventionCategory> {
const item = await this.prisma.interventionCategory.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
