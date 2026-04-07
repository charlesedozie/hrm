import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateHolidayCalendarDto, UpdateHolidayCalendarDto, QueryHolidayCalendarDto } from '../dto/dto';
import { HolidayCalendar } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class HolidayCalendarService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateHolidayCalendarDto, userId: string): Promise<HolidayCalendar> {
// 1. Check if name already exists (case-insensitive is often better)
const name = (dto.name ?? '').trim();
if (!name) { throw new BadRequestException('Name is required'); }
const existing = await this.prisma.holidayCalendar.findFirst({
where: {
name: {
equals: dto.name,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.name} already exists.`,); }

// 3. Prepare Prisma create input
const data: Prisma.HolidayCalendarCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
createdBy: {
connect: { id: userId },
},
// ... other fields (name, phone, etc.)
};
return this.prisma.holidayCalendar.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: HolidayCalendar[]; pagination: any }> {
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
    const item = await this.prisma.holidayCalendar.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.HolidayCalendarWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.holidayCalendar.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: HolidayCalendar[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.holidayCalendar.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.holidayCalendar.findMany({
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


async update(id: string, data: UpdateHolidayCalendarDto): Promise<HolidayCalendar> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.holidayCalendar.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<HolidayCalendar> {
await this.getById(id);
return this.prisma.holidayCalendar.delete({ where: { id } });
}

async getById(id: string): Promise<HolidayCalendar> {
const item = await this.prisma.holidayCalendar.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
