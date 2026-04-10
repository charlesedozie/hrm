import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrgDocsDto, UpdateOrgDocsDto, QueryOrgDocsDto } from '../dto/dto';
import { OrgDocs, DocGroup } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class OrgDocsService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateOrgDocsDto, userId: string): Promise<OrgDocs> {
  const {
    programId,
    employeeId,
    organizationId,
    beneficiaryId,
    leaveRequestId,
    meFieldMonitorId,
  } = dto;

  const data: Prisma.OrgDocsCreateInput = {
    name: dto.name,
    originalName: dto.originalName,
    description: dto.description,
    url: dto.url,
    docGroup: dto.docGroup,

    ...(programId && {
      program: { connect: { id: programId } },
    }),

    ...(employeeId && {
      employee: { connect: { id: employeeId } },
    }),

    ...(organizationId && {
      organization: { connect: { id: organizationId } },
    }),

    ...(beneficiaryId && {
      beneficiary: { connect: { id: beneficiaryId } },
    }),

    ...(leaveRequestId && {
      leaveRequest: { connect: { id: leaveRequestId } },
    }),

    ...(meFieldMonitorId && {
      meFieldMonitor: { connect: { id: meFieldMonitorId } },
    }),

    createdBy: {
      connect: { id: userId },
    },
  };

  return this.prisma.orgDocs.create({ data });
}

/**
* Get items with optional pagination and search
*/
async getAll(
  params?: QueryOrgDocsDto,
): Promise<{ items: OrgDocs[]; pagination: any }> {
  const {
  page = 1,
  limit,
  search,
  id,
  name,
  programId,
  docGroup, // ✅ NEW
  sortBy = 'updatedAt',
  sortOrder = SortOrder.DESC,
} = params || {};

  if (id) {
    const item = await this.prisma.orgDocs.findUnique({
      where: { id },
    });

    if (!item) throw new NotFoundException('Item not found');

    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  const where: Prisma.OrgDocsWhereInput = {};

  // 🔎 Search filter
  if (search) {
    const enumValues = Object.values(DocGroup);

    const filters: Prisma.OrgDocsWhereInput[] = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];

    if (enumValues.includes(search as DocGroup)) {
      filters.push({ docGroup: search as DocGroup });
    }

    where.OR = filters;
  }

  // 🔎 Name filter
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  // ✅ Program filter (RELATION SAFE)
  if (programId) {
    where.program = {
      is: { id: programId },
    };
  }

  // ✅ Direct docGroup filter
if (docGroup) {
  where.docGroup = docGroup;
}
  const total = await this.prisma.orgDocs.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: OrgDocs[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.orgDocs.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });

    pagination = {
      total,
      page: 1,
      limit: null,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
  } else {
    const skip = (page - 1) * limit;

    items = await this.prisma.orgDocs.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    const totalPages = Math.ceil(total / limit);

    pagination = {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  return { items, pagination };
}




async update(id: string, data: UpdateOrgDocsDto): Promise<OrgDocs> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.orgDocs.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<OrgDocs> {
await this.getById(id);
return this.prisma.orgDocs.delete({ where: { id } });
}

async getById(id: string): Promise<OrgDocs> {
const item = await this.prisma.orgDocs.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
