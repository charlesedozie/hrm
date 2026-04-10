import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDepartmentDto, UpdateDepartmentDto, QueryDepartmentDto } from '../dto/dto';
import { Department } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class DepartmentService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateDepartmentDto, userId: string): Promise<Department> {
// 1. Check if name already exists (case-insensitive is often better)
const name = (dto.name ?? '').trim();
if (!name) { throw new BadRequestException('NAME is required'); }
const existing = await this.prisma.department.findFirst({
where: {
name: {
equals: dto.name,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.name} already exists.`,); }

// 3. Prepare Prisma create input
const data: Prisma.DepartmentCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
createdBy: {
connect: { id: userId },
},
// ... other fields (name, phone, etc.)
};
return this.prisma.department.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Department[]; pagination: any }> {
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
    const item = await this.prisma.department.findUnique({
      where: { id },
    include: {    
    employmentHistory: {
      select: {
       // id: true,               // optional
        employee: {
          select: {
            id: true,
            fname: true,     
            hireDate: true,  
            lname: true,     
            mname: true,         // or firstName, lastName, email...
            // Add any other employee fields you need
          },
        },
      },
    },
  _count: {
        select: {
          employmentHistory: true,   // ← this gives { applicationForm: number }
        },
      },
  },
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.DepartmentWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.department.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: Department[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.department.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
        include: {    
 employmentHistory: {
      select: {
       // id: true,               // optional
        employee: {
          select: {
            id: true,
            fname: true,     
            hireDate: true,  
            lname: true,     
            mname: true,         // or firstName, lastName, email...
            // Add any other employee fields you need
          },
        },
      },
    },
  _count: {
        select: {
          employmentHistory: true,   
        },
      },
  },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.department.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
       include: {    
 employmentHistory: {
      select: {
       // id: true,               // optional
        employee: {
          select: {
            id: true,
            fname: true,  
            hireDate: true,     
            lname: true,     
            mname: true,         // or firstName, lastName, email...
            // Add any other employee fields you need
          },
        },
      },
    },
  _count: {
        select: {
          employmentHistory: true,   
        },
      },
  },
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}


async update(id: string, data: UpdateDepartmentDto): Promise<Department> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.department.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<Department> {
await this.getById(id);
return this.prisma.department.delete({ where: { id } });
}

async getById(id: string): Promise<Department> {
const item = await this.prisma.department.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
