import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateWorkScheduleDto, UpdateWorkScheduleDto, QueryWorkScheduleDto } from '../dto/dto';
import { WorkSchedule } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class WorkScheduleService {
constructor(private prisma: PrismaService) {}


async create(dto: CreateWorkScheduleDto, userId: string) {
// 1️⃣ Validate startTime and endTime
const start = new Date(dto.startTime);
const end = new Date(dto.endTime);

// Convert start and end to hours+minutes
const startHours = start.getHours() + start.getMinutes() / 60;
const endHours = end.getHours() + end.getMinutes() / 60;
// Calculate raw hours
let hours = endHours - startHours;

// Subtract break duration in hours
if (dto.breakDurationMinutes) { hours -= dto.breakDurationMinutes / 60; }
// Validate positive hours
if (hours <= 0) {
throw new BadRequestException(
'Invalid schedule: daily working hours must be positive after subtracting break time.'
);}


if (end <= start) {
throw new BadRequestException('End time must be after start time.');
}



if (dto.breakDurationMinutes) {
hours -= dto.breakDurationMinutes / 60;
}

// 3️⃣ Validate that the working hours is positive
if (hours <= 0) {
throw new BadRequestException(
'Invalid schedule: daily working hours must be positive after subtracting break time.',
);
}
// Round to 2 decimal places
const dailyWorkingHours = Math.round(hours * 100) / 100;
console.log('dailyWorkingHours', dailyWorkingHours)

// 4️⃣ Prepare data for Prisma
const data = {
...dto,
dailyWorkingHours,
createdById: userId,
};

// 5️⃣ Create WorkSchedule
const schedule = await this.prisma.workSchedule.create({ data });

return schedule;
}




/**
* Get items with optional pagination and search
*/
async getAll(
params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: WorkSchedule[]; pagination: any }> {
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
const item = await this.prisma.workSchedule.findUnique({
where: { id },
});
if (!item) throw new NotFoundException('Item not found');
return {
items: [item],
pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
};
}

// Build search filter
const where: Prisma.WorkScheduleWhereInput = {};
if (search) {
where.OR = [
{ name: { contains: search, mode: 'insensitive' } },
];
}
if (name) {
where.name = { contains: name, mode: 'insensitive' };
}

const total = await this.prisma.workSchedule.count({ where });

const wantsAll = !limit || limit <= 0;
let items: WorkSchedule[];
let pagination: any;

if (wantsAll) {
items = await this.prisma.workSchedule.findMany({
where,
orderBy: { [sortBy]: sortOrder },
});
pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
} else {
const skip = (page - 1) * limit;
items = await this.prisma.workSchedule.findMany({
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


async update(id: string, data: UpdateWorkScheduleDto): Promise<WorkSchedule> {
  // 1️⃣ Fetch existing schedule
  const existing = await this.prisma.workSchedule.findUnique({
    where: { id },
  });
  if (!existing) throw new NotFoundException('Work schedule not found');

  // 2️⃣ Determine effective values
  const startTime = data.startTime ? new Date(data.startTime) : new Date(existing.startTime);
  const endTime = data.endTime ? new Date(data.endTime) : new Date(existing.endTime);
  const breakMinutes = data.breakDurationMinutes ?? existing.breakDurationMinutes ?? 0;

  // 1️⃣ Calculate total milliseconds
let diffMs = endTime.getTime() - startTime.getTime();

// Handle night shift (end < start)
if (diffMs < 0) {
  diffMs += 24 * 60 * 60 * 1000; // add 24 hours in ms
}

// 2️⃣ Convert milliseconds → hours
let hours = diffMs / (1000 * 60 * 60);

// 3️⃣ Subtract break duration
if (breakMinutes) {
  hours -= breakMinutes / 60;
}

// 4️⃣ Validate positive hours
if (hours <= 0) {
  throw new BadRequestException(
    'Invalid schedule: daily working hours must be positive after subtracting break time.'
  );
}

// 5️⃣ Round to 2 decimals
const dailyWorkingHours = Math.round(hours * 100) / 100;


  // 5️⃣ Prepare payload
  const updatePayload = {
    ...data,
    dailyWorkingHours,
  };

  // 6️⃣ Update record
  return this.prisma.workSchedule.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<WorkSchedule> {
await this.getById(id);
return this.prisma.workSchedule.delete({ where: { id } });
}

async getById(id: string): Promise<WorkSchedule> {
const item = await this.prisma.workSchedule.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
