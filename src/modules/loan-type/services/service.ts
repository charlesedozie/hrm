import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateLoanTypeDto, UpdateLoanTypeDto, QueryLoanTypeDto } from '../dto/dto';
import { LoanType } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class LoanTypeService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateLoanTypeDto, userId: string): Promise<LoanType> {
// 1. Check if name already exists (case-insensitive is often better)
const name = (dto.name ?? '').trim();
if (!name) { throw new BadRequestException('NAME is required'); }
const existing = await this.prisma.loanType.findFirst({
where: {
name: {
equals: dto.name,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.name} already exists.`,); }

// 3. Prepare Prisma create input
const data: Prisma.LoanTypeCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
// ... other fields (name, phone, etc.)
};
return this.prisma.loanType.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: LoanType[]; pagination: any }> {
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
    const item = await this.prisma.loanType.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.LoanTypeWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.loanType.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: LoanType[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.loanType.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.loanType.findMany({
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


async update(id: string, data: UpdateLoanTypeDto): Promise<LoanType> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.loanType.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<LoanType> {
await this.getById(id);
return this.prisma.loanType.delete({ where: { id } });
}

async getById(id: string): Promise<LoanType> {
const item = await this.prisma.loanType.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
