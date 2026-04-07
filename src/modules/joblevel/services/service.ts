import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateJobLevelDto, UpdateJobLevelDto, QueryJobLevelDto } from '../dto/dto';
import { JobLevel } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class JobLevelService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateJobLevelDto, userId: string): Promise<JobLevel> {
// 1. Check if name already exists (case-insensitive is often better)
const name = (dto.name ?? '').trim();
const code = (dto.code ?? '').trim();
if (!name) { throw new BadRequestException('NAME is required'); }
if (!code) { throw new BadRequestException('Code is required'); }
const existing = await this.prisma.jobLevel.findFirst({
  where: {
    OR: [
      { name: { equals: dto.name, mode: 'insensitive', }, },
      { code: { equals: dto.code, mode: 'insensitive', }, },
    ],
  },
});

if (existing) { throw new BadRequestException(`${dto.name} or ${dto.code}   already exists.`,); }

// 3. Prepare Prisma create input
const data: Prisma.JobLevelCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
createdBy: {
connect: { id: userId },
},
// ... other fields (name, phone, etc.)
};
return this.prisma.jobLevel.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: JobLevel[]; pagination: any }> {
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
         
  _countsalaryStructures: {
        select: {
           salaryStructures: true,   // ← this gives { applicationForm: number }
        },
      },
         
  _countofficePosition: {
        select: {
          officePosition: true,   // ← this gives { applicationForm: number }
        },
      },
         
  _countsalaryBand: {
        select: {
          salaryBand: true,   // ← this gives { applicationForm: number }
        },
      }, 
  };

  
  if (id) {
    const item = await this.prisma.jobLevel.findUnique({
      where: { id },
    include: {  
      employmentHistory: true, 
      salaryBand: true, 
      officePosition: true, 
      salaryStructures: true, 
  },
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.JobLevelWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.jobLevel.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: JobLevel[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.jobLevel.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
        include: {    
 employmentHistory: true, 
      salaryBand: true, 
      officePosition: true, 
      salaryStructures: true, 
  },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.jobLevel.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
       include: {    
 employmentHistory: true, 
      salaryBand: true, 
      officePosition: true, 
      salaryStructures: true, 
  },
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}


async update(id: string, data: UpdateJobLevelDto): Promise<JobLevel> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.jobLevel.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<JobLevel> {
await this.getById(id);
return this.prisma.jobLevel.delete({ where: { id } });
}

async getById(id: string): Promise<JobLevel> {
const item = await this.prisma.jobLevel.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
