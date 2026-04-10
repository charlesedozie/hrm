import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAttendanceDto, UpdateAttendanceDto, QueryAttendanceDto } from '../dto/dto';
import { Attendance } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AttendanceService {
constructor(private prisma: PrismaService) {}
// Helper: convert 'HH:mm' string + workDate into Date object
  private createAttendanceDate(workDate: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(workDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

async create(dto: CreateAttendanceDto, userId: string): Promise<Attendance> {
  // 1️⃣ Ensure clockIn exists
      if (!dto.clockIn) {
      throw new BadRequestException('clockIn time is required');
    }

    // 2️⃣ Convert clockIn and clockOut strings to Date objects
    const clockIn = this.createAttendanceDate(dto.workDate, dto.clockIn);
    const clockOut = dto.clockOut ? this.createAttendanceDate(dto.workDate, dto.clockOut) : null;

    // 3️⃣ Validate clockOut > clockIn if provided
    if (clockOut && clockOut <= clockIn) {
      throw new BadRequestException('clockOut time must be later than clockIn time');
    }
     // 4️⃣ Prepare Prisma create input
      const { employeeId, ...dtoData } = dto; // remove employeeId
    const data: Prisma.AttendanceCreateInput = {
      ...dtoData,
      clockIn,
      clockOut,
      employee: {
        connect: { id: dto.employeeId },
      },
      createdBy: {
        connect: { id: userId },
      },
    };

  // 4️⃣ Create the attendance record
  return this.prisma.attendance.create({
    data,
  });
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Attendance[]; pagination: any }> {
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
    shift: true,
  };
  
  if (id) {
    const item = await this.prisma.attendance.findUnique({
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
  const where: Prisma.AttendanceWhereInput = {};
  if (search) {
    where.OR = [
      { employeeId: { contains: search, mode: 'insensitive' } },
    ];
  }

  const total = await this.prisma.attendance.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: Attendance[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.attendance.findMany({
      where,
      include: includeRelations,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.attendance.findMany({
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


async update(id: string, data: UpdateAttendanceDto): Promise<Attendance> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.attendance.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<Attendance> {
await this.getById(id);
return this.prisma.attendance.delete({ where: { id } });
}

async getById(id: string): Promise<Attendance> {
const item = await this.prisma.attendance.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}