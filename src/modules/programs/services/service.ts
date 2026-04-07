import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProgramDto, UpdateProgramDto, QueryProgramDto } from '../dto/dto';
import { Program } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class ProgramService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateProgramDto, userId: string): Promise<Program> {
// 1. Check if name already exists (case-insensitive is often better)
const name = (dto.name ?? '').trim();
if (!name) { throw new BadRequestException('name is required'); }
const existing = await this.prisma.program.findFirst({
where: {
name: {
equals: dto.name,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.name} already exists.`,); }

if (!dto.startDate) {
throw new BadRequestException('Start Date is required');
}
const startDate = new Date(dto.startDate);
if (isNaN(startDate.getTime())) {
throw new BadRequestException('Invalid date format for start Date');
}

// 2. Validate terminationDate (optional but stricter rules if present)
let endDate: Date | null = null;

if (dto.endDate) {
endDate = new Date(dto.endDate);

if (isNaN(endDate.getTime())) {
throw new BadRequestException('Invalid date format for end Date');
}

// Ensure termination is AFTER hire date
if (endDate <= startDate) {
throw new BadRequestException(
'end Date must be after  start date'
);
}
}



let budget: number | undefined = undefined;

if (dto.budget !== undefined && dto.budget !== null) {
  const parsedBudget = Number(
    String(dto.budget).replace(/,/g, '') // remove commas if any
  );

  if (isNaN(parsedBudget)) {
    throw new BadRequestException('Budget must be a valid number');
  }

  budget = parsedBudget;
}

// 3. Prepare Prisma create input
const data: Prisma.ProgramCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
startDate, 
budget,                   // Date object
endDate: endDate ?? undefined,  // null/undefined = not set
createdBy: {
connect: { id: userId },
},
// ... other fields (name, phone, etc.)
};
return this.prisma.program.create({  // or beneficiary.create
data,
});
}


/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Program[]; pagination: any }> {
  const {
    page = 1,
    limit,
    search,
    id,
    name,
    sortBy = 'name',
    sortOrder = SortOrder.DESC,
  } = params || {};

const includeRelations = {
    indicators: true,
    projects: {
      include: {
        indicators: true,          // all fields from Gender
        organization: true,  // all fields from MarritalStatus
      },
    },
    interventions: true,
  };



  
  if (id) {
    const item = await this.prisma.program.findUnique({
      where: { id },
      include: includeRelations,
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.ProgramWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.program.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: Program[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.program.findMany({
      where,
      include: includeRelations,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.program.findMany({
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

async update(id: string, data: UpdateProgramDto): Promise<Program> {
  await this.getById(id);

  let budget: number | undefined = undefined;

  if (data.budget !== undefined && data.budget !== null) {
    const parsedBudget = Number(String(data.budget).replace(/,/g, ''));

    if (isNaN(parsedBudget)) {
      throw new BadRequestException('Budget must be a valid number');
    }

    budget = parsedBudget;
  }

  



  
if (!data.startDate) {
throw new BadRequestException('Start Date is required');
}
const startDate = new Date(data.startDate);
if (isNaN(startDate.getTime())) {
throw new BadRequestException('Invalid date format for start Date');
}

// 2. Validate terminationDate (optional but stricter rules if present)
let endDate: Date | null = null;

if (data.endDate) {
endDate = new Date(data.endDate);

if (isNaN(endDate.getTime())) {
throw new BadRequestException('Invalid date format for end Date');
}

// Ensure termination is AFTER hire date
if (endDate <= startDate) {
throw new BadRequestException(
'end Date must be after  start date'
);
}
}



  const updatePayload: any = {
    ...data,
    budget,
  };

  // ✅ Convert startDate if present
  if (data.startDate !== undefined) {
    const startDate = new Date(data.startDate);

    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Invalid start date');
    }

    updatePayload.startDate = startDate;
  }

  // ✅ Convert endDate if present
  if (data.endDate !== undefined) {
    const endDate = new Date(data.endDate);

    if (isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid end date');
    }

    updatePayload.endDate = endDate;
  }

  return this.prisma.program.update({
    where: { id },
    data: updatePayload,
  });
}

async delete(id: string): Promise<Program> {
await this.getById(id);
return this.prisma.program.delete({ where: { id } });
}

async getById(id: string): Promise<Program> {
const item = await this.prisma.program.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}

}
