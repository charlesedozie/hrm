import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVacancyDto, UpdateVacancyDto } from '../dto/dto';
import { Vacancy, Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class VacancyService {
  constructor(private prisma: PrismaService) {}
async create(dto: CreateVacancyDto, userId: string): Promise<Vacancy> {
  // 1. Check if name already exists (case-insensitive is often better)

  const name = (dto.name ?? '').trim();
  if (!name) {
    throw new BadRequestException('Vacancy name is required');
  }

  const existing = await this.prisma.vacancy.findFirst({
    where: {
      name: {
        equals: dto.name,
        mode: 'insensitive',   // optional: ignore case (e.g. "Job A" vs "job a")
      },
    },
  });

  if (existing) {
    throw new BadRequestException(
      `A vacancy with the name "${dto.name}" already exists.`,
    );
  }

  // 2. Create if no conflict
  const startDate = new Date(dto.startDate);
  const endDate   = new Date(dto.endDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new BadRequestException('Invalid date format for startDate or endDate');
  }

  if (startDate > endDate) {
    throw new BadRequestException('startDate cannot be later than endDate');
  }


  return this.prisma.vacancy.create({
    data: {
      name:        name,
      requirements: dto.requirements?.trim() ?? '',
      startDate:   startDate,
      endDate:     endDate,
      assignedToId: dto.assignedToId ?? null,
      createdById:      userId,           // ← this is the correct scalar field
      // Alternative (equivalent but more verbose):
      //createdBy: { connect: { id: userId } },
    },
    // Optional: return the creator info immediately
   
  });
}



  /**
   * Get vacancies with optional pagination and search
   */
  async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Vacancy[]; pagination: any }> {
  const {
    page = 1,
    limit,                    // no default here
    search,
    id,
    name,
    sortBy = 'startDate',
    sortOrder = SortOrder.DESC,
  } = params || {};

  // Handle single item by ID
  if (id) {
    const vacancy = await this.prisma.vacancy.findUnique({ 
    where: { id },
    include: {
    assignedTo: {
      select: {
        fname: true,
        lname: true,
      },
    },
    
  _count: {
        select: {
          applicationForm: true,   // ← this gives { applicationForm: number }
        },
      },
  },
 });
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return {
      items: [vacancy],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build where clause
  const where: Prisma.VacancyWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { requirements: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.vacancy.count({ where });

  let items: Vacancy[];
  let pagination: any;

  const wantsAll = limit === undefined || limit === null || limit <= 0;

  if (wantsAll) {
    // Return ALL items — no pagination applied
    items = await this.prisma.vacancy.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      // IMPORTANT: no skip, no take
      include: {
    assignedTo: {
      select: {
        fname: true,
        lname: true,
      },
    },
    
  _count: {
        select: {
          applicationForm: true,   // ← this gives { applicationForm: number }
        },
      },
  },
  
    });

    pagination = {
      total,
      page: 1,
      limit: null,           // or total, or undefined — null is clearest
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
  } else {
    // Normal pagination
    const skip = (page - 1) * limit;
    items = await this.prisma.vacancy.findMany({
      where,
      skip,
      take: limit,           // now safe — limit is a positive number
      orderBy: {
        [sortBy]: sortOrder,
      },
       include: {
    assignedTo: {
      select: {
        id: true,
        fname: true,
        lname: true,
      },
    },
    
  _count: {
        select: {
          applicationForm: true,   // ← this gives { applicationForm: number }
        },
      },
  },
    });

    const totalPages = Math.ceil(total / limit);

    pagination = {
      total,
      page,
      limit,                 // the actual value sent by client
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  return { items, pagination };
}


 async update(id: string, data: UpdateVacancyDto): Promise<Vacancy> {
  // Make sure the vacancy exists
  await this.getById(id);

  // Convert date strings to Date objects if they exist
  const updateData: any = { ...data };

  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);

  return this.prisma.vacancy.update({
    where: { id },
    data: updateData,
  });
}


  async delete(id: string): Promise<Vacancy> {
    await this.getById(id);
    return this.prisma.vacancy.delete({ where: { id } });
  }

  async getById(id: string): Promise<Vacancy> {
    const item = await this.prisma.vacancy.findUnique({ where: { id },
     include: {
    assignedTo: {
      select: {
        fname: true,
        lname: true,
      },
    },
    
  _count: {
        select: {
          applicationForm: true,   // ← this gives { applicationForm: number }
        },
      },
  }, });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

}
