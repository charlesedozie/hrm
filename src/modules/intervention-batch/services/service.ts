import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateInterventionBatchDto, UpdateInterventionBatchDto, QueryInterventionBatchDto } from '../dto/dto';
import { InterventionBatch } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class InterventionBatchService {
constructor(private prisma: PrismaService) {}

async create(
  dto: CreateInterventionBatchDto,
  userId: string,
): Promise<InterventionBatch> {
  const name = dto.name?.trim();

  if (!name) {
    throw new BadRequestException('Name is required');
  }

  // Check duplicate name (case-insensitive)
  const existing = await this.prisma.interventionBatch.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
    },
  });

  if (existing) {
    throw new BadRequestException(`${name} already exists.`);
  }

  // Normalize nullable fields
  const programId = dto.programId || null;
  const stateId = dto.stateId || null;
  const lgaId = dto.lgaId || null;

 // if (dto.startDate && dto.endDate && dto.endDate < dto.startDate) { throw new BadRequestException('End date cannot be before start date'); }

 //if (dto.radiusMeters && (!dto.latitude || !dto.longitude)) { throw new BadRequestException( 'Latitude and longitude are required when radius is provided', );}

  // Build Prisma payload properly
  const data: Prisma.InterventionBatchCreateInput = {
    name,

    intervention: {
      connect: { id: dto.interventionId },
    },

    ...(programId && {
      programs: {
        connect: { id: programId },
      },
    }),

    ...(stateId && {
      state: {
        connect: { id: stateId },
      },
    }),

    ...(lgaId && {
      lga: {
        connect: { id: lgaId },
      },
    }),

    capacity: dto.capacity ?? null,
    facilitator: dto.facilitator ?? null,

    totalBudget:
      dto.totalBudget !== undefined ? new Prisma.Decimal(dto.totalBudget) : null,

    location: dto.location ?? null,

    startDate: dto.startDate ?? null,
    endDate: dto.endDate ?? null,

    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
    radiusMeters: dto.radiusMeters ?? null,

    // ✅ Always from logged-in user
    createdBy: {
      connect: { id: userId },
    },
  };

  return this.prisma.interventionBatch.create({ data });
}



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: InterventionBatch[]; pagination: any }> {
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
    const item = await this.prisma.interventionBatch.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.InterventionBatchWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.interventionBatch.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: InterventionBatch[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.interventionBatch.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.interventionBatch.findMany({
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


async update(
  id: string,
  dto: UpdateInterventionBatchDto,
): Promise<InterventionBatch> {
  await this.getById(id);

  const data: Prisma.InterventionBatchUpdateInput = {
    ...(dto.name && { name: dto.name.trim() }),

    ...(dto.interventionId && {
      intervention: {
        connect: { id: dto.interventionId },
      },
    }),

    ...(dto.programId !== undefined && {
      programs: dto.programId
        ? { connect: { id: dto.programId } }
        : { disconnect: true },
    }),

    ...(dto.stateId !== undefined && {
      state: dto.stateId
        ? { connect: { id: dto.stateId } }
        : { disconnect: true },
    }),

    ...(dto.lgaId !== undefined && {
      lga: dto.lgaId
        ? { connect: { id: dto.lgaId } }
        : { disconnect: true },
    }),

    ...(dto.capacity !== undefined && { capacity: dto.capacity }),
    ...(dto.facilitator !== undefined && { facilitator: dto.facilitator }),

    ...(dto.totalBudget !== undefined && {
      totalBudget:
        dto.totalBudget !== null
          ? new Prisma.Decimal(dto.totalBudget)
          : null,
    }),

    ...(dto.location !== undefined && { location: dto.location }),

    ...(dto.startDate !== undefined && { startDate: dto.startDate }),
    ...(dto.endDate !== undefined && { endDate: dto.endDate }),

    ...(dto.latitude !== undefined && { latitude: dto.latitude }),
    ...(dto.longitude !== undefined && { longitude: dto.longitude }),
    ...(dto.radiusMeters !== undefined && {
      radiusMeters: dto.radiusMeters,
    }),
  };

 // if (dto.startDate && dto.endDate && dto.endDate < dto.startDate) { throw new BadRequestException('End date cannot be before start date'); }
  return this.prisma.interventionBatch.update({
    where: { id },
    data,
  });
}


async delete(id: string): Promise<InterventionBatch> {
await this.getById(id);
return this.prisma.interventionBatch.delete({ where: { id } });
}

async getById(id: string): Promise<InterventionBatch> {
const item = await this.prisma.interventionBatch.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
