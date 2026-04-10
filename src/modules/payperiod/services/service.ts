import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePayrollPeriodDto, UpdatePayrollPeriodDto, QueryPayrollPeriodDto } from '../dto/dto';
import { PayrollPeriod, PayFrequency, Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class PayrollPeriodService {
constructor(private prisma: PrismaService) {}
/*
async create(dto: CreatePayrollPeriodDto, userId: string): Promise<PayrollPeriod> {
  const name = (dto.name ?? '').trim();
  if (!name) throw new BadRequestException('PayrollPeriod name is required');

  const existing = await this.prisma.payrollPeriod.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });

  if (existing) throw new BadRequestException(`${dto.name} already exists.`);

  // Prepare Prisma create input
  const data: Prisma.PayrollPeriodUncheckedCreateInput = {
    ...dto,
    // Only connect calendar if calendarId exists
    ...(dto.calendarId ? { calendar: { connect: { id: dto.calendarId } } } : {}),
    createdBy: { connect: { id: userId } },
  };

  return this.prisma.payrollPeriod.create({ data });
}
*/





/**
* Get items with optional pagination and search
*/async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: PayrollPeriod[]; pagination: any }> {
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
    calendar: true,
  };

  // ────────────────────────────────────────────────
  //           Main change is here
  // ────────────────────────────────────────────────
  const where: Prisma.PayrollPeriodWhereInput = {
    calendar: {
      isActive: true,           // ← only periods with active calendar
    },
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  // Optional: if you also want to support filtering by id when it's passed
  if (id) {
    where.id = id;
  }

  // ────────────────────────────────────────────────

  if (id && !where.id) {
    // Single item by id (with active calendar check)
    const item = await this.prisma.payrollPeriod.findFirst({
      where: {
        id,
        calendar: { isActive: true },
      },
      include: includeRelations,
    });

    if (!item) throw new NotFoundException('PayrollPeriod not found or calendar is not active');

    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  const total = await this.prisma.payrollPeriod.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: PayrollPeriod[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.payrollPeriod.findMany({
      where,
      include: includeRelations,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.payrollPeriod.findMany({
      where,
      skip,
      take: limit,
      include: includeRelations,
      orderBy: { [sortBy]: sortOrder },
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}

/*
async update(id: string, dto: UpdatePayrollPeriodDto): Promise<PayrollPeriod> {
  // Ensure the record exists
  await this.getById(id);

  // Prepare update data
  const updateData: Prisma.PayrollPeriodUncheckedUpdateInput = { ...dto };

  // Convert date strings to Date objects if they exist
  if (dto.startDate) updateData.startDate = new Date(dto.startDate);
  if (dto.endDate) updateData.endDate = new Date(dto.endDate);
  if (dto.payDate) updateData.payDate = new Date(dto.payDate);

  // Conditionally connect calendar if calendarId exists
  if (dto.calendarId) {
    updateData.calendar = { connect: { id: dto.calendarId } };
  }

  return this.prisma.payrollPeriod.update({
    where: { id },
    data: updateData,
  });
}
*/

async delete(id: string): Promise<PayrollPeriod> {
await this.getById(id);
return this.prisma.payrollPeriod.delete({ where: { id } });
}

async getById(id: string): Promise<PayrollPeriod> {
const item = await this.prisma.payrollPeriod.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}








  async generatePeriods(calendarId: string, year: number, userId?: string) {
    // Fetch calendar
    const calendar = await this.prisma.payrollCalendar.findUnique({
      where: { id: calendarId },
    });

    if (!calendar) {
      throw new BadRequestException('Payroll calendar not found');
    }

    // Fetch existing periods to avoid duplicates
    const existingPeriods = await this.prisma.payrollPeriod.findMany({
      where: {
        calendarId,
        startDate: { gte: new Date(year, 0, 1) },
        endDate: { lte: new Date(year, 11, 31) },
      },
      select: { startDate: true, endDate: true },
    });

    const periodsToInsert = [];

    const newPeriods = this.getPeriodsForYear(calendar, year);

    // Only add periods that don't exist
    for (const period of newPeriods) {
      const exists = existingPeriods.some(
        (p) =>
          p.startDate.getTime() === period.startDate.getTime() &&
          p.endDate.getTime() === period.endDate.getTime(),
      );

      if (!exists) {
        periodsToInsert.push({
          ...period,
          calendarId,
          createdById: userId,
        });
      }
    }

    if (periodsToInsert.length === 0) return { message: 'All periods already exist' };

    const created = await this.prisma.payrollPeriod.createMany({
      data: periodsToInsert,
      skipDuplicates: true,
    });

    return created;
  }

  /* ---------------- Helper: Generate periods per calendar ---------------- */
  private getPeriodsForYear(calendar: any, year: number) {
    switch (calendar.frequency) {
      case PayFrequency.MONTHLY:
        return this.generateMonthly(calendar, year);
      case PayFrequency.WEEKLY:
        return this.generateWeekly(calendar, year);
      case PayFrequency.BI_WEEKLY:
        return this.generateBiWeekly(calendar, year);
      case PayFrequency.SEMI_MONTHLY:
        return this.generateSemiMonthly(calendar, year);
      case PayFrequency.QUARTERLY:
        return this.generateQuarterly(calendar, year);
      case PayFrequency.ANNUALLY:
        return this.generateAnnual(calendar, year);
      default:
        throw new BadRequestException('Unsupported payroll frequency');
    }
  }

  private generateMonthly(calendar: any, year: number) {
    const periods: Array<{ name: string; startDate: Date; endDate: Date; payDate?: Date | null }> = [];
    for (let month = 0; month < 12; month++) {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      const payDate = calendar.payDay ? new Date(year, month, calendar.payDay) : null;
      periods.push({
        name: `${start.toLocaleString('default', { month: 'long' })} ${year}`,
        startDate: start,
        endDate: end,
        payDate,
      });
    }
    return periods;
  }

  private generateWeekly(calendar: any, year: number) {
    const periods: Array<{ name: string; startDate: Date; endDate: Date }> = [];
    let start = new Date(year, 0, 1);
    while (start.getFullYear() === year) {
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      periods.push({
        name: `Week ${periods.length + 1} ${year}`,
        startDate: new Date(start),
        endDate: end,
      });
      start.setDate(start.getDate() + 7);
    }
    return periods;
  }

  private generateBiWeekly(calendar: any, year: number) {
    const periods: Array<{ name: string; startDate: Date; endDate: Date }> = [];
    let start = new Date(year, 0, 1);
    while (start.getFullYear() === year) {
      const end = new Date(start);
      end.setDate(start.getDate() + 13);
      periods.push({
        name: `Biweekly ${periods.length + 1} ${year}`,
        startDate: new Date(start),
        endDate: end,
      });
      start.setDate(start.getDate() + 14);
    }
    return periods;
  }

  private generateSemiMonthly(calendar: any, year: number) {
    const periods: Array<{ name: string; startDate: Date; endDate: Date }> = [];
    for (let month = 0; month < 12; month++) {
      const firstStart = new Date(year, month, 1);
      const firstEnd = new Date(year, month, 15);
      const secondStart = new Date(year, month, 16);
      const secondEnd = new Date(year, month + 1, 0);
      periods.push({
        name: `${firstStart.toLocaleString('default', { month: 'short' })} 1-15 ${year}`,
        startDate: firstStart,
        endDate: firstEnd,
      });
      periods.push({
        name: `${firstStart.toLocaleString('default', { month: 'short' })} 16-${secondEnd.getDate()} ${year}`,
        startDate: secondStart,
        endDate: secondEnd,
      });
    }
    return periods;
  }

  private generateQuarterly(calendar: any, year: number) {
    const periods: Array<{ name: string; startDate: Date; endDate: Date }> = [];
    const quarters = [
      [0, 2],
      [3, 5],
      [6, 8],
      [9, 11],
    ];
    quarters.forEach((q, index) => {
      const start = new Date(year, q[0], 1);
      const end = new Date(year, q[1] + 1, 0);
      periods.push({
        name: `Q${index + 1} ${year}`,
        startDate: start,
        endDate: end,
      });
    });
    return periods;
  }

  private generateAnnual(calendar: any, year: number) {
    return [
      {
        name: `${year}`,
        startDate: new Date(year, 0, 1),
        endDate: new Date(year, 11, 31),
      },
    ];
  }





}
