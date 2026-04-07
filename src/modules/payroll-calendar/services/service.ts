import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePayrollCalendarDto, UpdatePayrollCalendarDto, QueryPayrollCalendarDto } from '../dto/dto';
import { PayrollCalendar } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { PayrollPeriodService } from '@/modules/payperiod/services/service';

@Injectable()
export class PayrollCalendarService {
constructor(private prisma: PrismaService,
private readonly payrollPeriodService: PayrollPeriodService
) {}

async create(dto: CreatePayrollCalendarDto, userId: string): Promise<PayrollCalendar> {
// 1. Check if name already exists (case-insensitive is often better)
const name = (dto.name ?? '').trim();
if (!name) { throw new BadRequestException('name is required'); }
const existing = await this.prisma.payrollCalendar.findFirst({
where: {
name: {
equals: dto.name,
mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
},},});

if (existing) { throw new BadRequestException(`${dto.name} already exists.`,); }

// 3. Prepare Prisma create input
const data: Prisma.PayrollCalendarCreateInput = {  // or BeneficiaryCreateInput etc.
...dto,
//createdBy: { connect: { id: userId }, },
// ... other fields (name, phone, etc.)
};
return this.prisma.payrollCalendar.create({  // or beneficiary.create
data,
});
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: PayrollCalendar[]; pagination: any }> {
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
    const item = await this.prisma.payrollCalendar.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.PayrollCalendarWhereInput = {};
  if (search) {
    where.OR = [
      { description: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.payrollCalendar.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: PayrollCalendar[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.payrollCalendar.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.payrollCalendar.findMany({
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

async update(id: string, data: UpdatePayrollCalendarDto, userId:string) {
  await this.getById(id);

    await this.prisma.payrollCalendar.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });

  
    // 3️⃣ Generate periods for current year (skipping duplicates)
  const year = new Date().getFullYear();
  await this.payrollPeriodService.generatePeriods(id, year, userId);



  return this.prisma.payrollCalendar.update({
    where: { id },
    data,
  });
}




async delete(id: string): Promise<PayrollCalendar> {
await this.getById(id);
return this.prisma.payrollCalendar.delete({ where: { id } });
}

async getById(id: string): Promise<PayrollCalendar> {
const item = await this.prisma.payrollCalendar.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
