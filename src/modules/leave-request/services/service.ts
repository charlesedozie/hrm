import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateLeaveRequestDto, UpdateLeaveRequestDto, QueryLeaveRequestDto } from '../dto/dto';
import { LeaveRequest } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class LeaveRequestService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateLeaveRequestDto, userId: string): Promise<LeaveRequest> {
// 1. Check if name already exists (case-insensitive is often better)

// 3. Prepare Prisma create input
const { leaveTypeId, ...dtoData } = dto; // remove employeeId
const data: Prisma.LeaveRequestCreateInput = {  // or BeneficiaryCreateInput etc.
...dtoData,

employee: { connect: { id: userId } },
leaveType: { connect: { id: dto.leaveTypeId } },    

createdBy: {
connect: { id: userId },
},
// ... other fields (name, phone, etc.)
};
return this.prisma.leaveRequest.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: LeaveRequest[]; pagination: any }> {
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
    employee: true,
    leaveType: true,
  };

  
  if (id) {
    const item = await this.prisma.leaveRequest.findUnique({
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
  const where: Prisma.LeaveRequestWhereInput = {};
  if (search) {
    where.OR = [
      { employeeId: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.employeeId = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.leaveRequest.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: LeaveRequest[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.leaveRequest.findMany({
      where,
      include: includeRelations,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.leaveRequest.findMany({
      where,
      include: includeRelations,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}


async update(id: string, data: UpdateLeaveRequestDto): Promise<LeaveRequest> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.leaveRequest.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<LeaveRequest> {
await this.getById(id);
return this.prisma.leaveRequest.delete({ where: { id } });
}

async getById(id: string): Promise<LeaveRequest> {
const item = await this.prisma.leaveRequest.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
