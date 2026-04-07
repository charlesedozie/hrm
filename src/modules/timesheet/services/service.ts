import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTimesheetDto, UpdateTimesheetDto, QueryTimesheetDto } from '../dto/dto';
import { Timesheet } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class TimesheetService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateTimesheetDto, userId: string): Promise<Timesheet> {
// 3. Prepare Prisma create input
const data: Prisma.TimesheetCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
createdBy: {
connect: { id: userId },
},
// ... other fields (name, phone, etc.)
};
return this.prisma.timesheet.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Timesheet[]; pagination: any }> {
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
    entries: true,
     _count: {
        select: {
          entries: true,   // ← this gives { applicationForm: number }
        },
      },
  };
  
  if (id) {
    const item = await this.prisma.timesheet.findUnique({
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
  const where: Prisma.TimesheetWhereInput = {};
  const total = await this.prisma.timesheet.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: Timesheet[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.timesheet.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      include: includeRelations,
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.timesheet.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: includeRelations,
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}


async update(id: string, data: UpdateTimesheetDto): Promise<Timesheet> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.timesheet.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<Timesheet> {
await this.getById(id);
return this.prisma.timesheet.delete({ where: { id } });
}

async getById(id: string): Promise<Timesheet> {
const item = await this.prisma.timesheet.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
