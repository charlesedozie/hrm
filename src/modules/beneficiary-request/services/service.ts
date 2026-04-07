import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateBeneficiaryRequestDto, UpdateBeneficiaryRequestDto, QueryBeneficiaryRequestDto } from '../dto/dto';
import { BeneficiaryRequest } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class BeneficiaryRequestService {
constructor(private prisma: PrismaService) {}
async create(dto: CreateBeneficiaryRequestDto, userId: string): Promise<BeneficiaryRequest> {
// 🔥 1. Get user + beneficiaryId
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { beneficiaryId: true },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (!user.beneficiaryId) {
    throw new BadRequestException('User is not linked to a beneficiary');
  }

  const { beneficiaryId, assignedToId, ...rest } = dto;

  // 🔥 2. Use beneficiaryId (NOT userId)
  const data: Prisma.BeneficiaryRequestCreateInput = {
    ...rest,

    beneficiary: {
      connect: { id: user.beneficiaryId }, // ✅ CORRECT
    },

    ...(assignedToId && {
      assignedTo: {
        connect: { id: assignedToId },
      },
    }),
  };

  return this.prisma.beneficiaryRequest.create({
    data,
  });
}



/**
* Get items with optional pagination and search
*/

async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: BeneficiaryRequest[]; pagination: any }> {
  const {
    page = 1,
    limit,
    search,
    id,
    name,
    sortBy = 'updatedAt',
    sortOrder = SortOrder.DESC,
  } = params || {};

const includes =  {
  beneficiary: true,
  assignedTo: true,
  submittedBy: true,
  };
  
  if (id) {
    const item = await this.prisma.beneficiaryRequest.findUnique({
      where: { id },
      include: includes,
    });
    if (!item) throw new NotFoundException('Item not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.BeneficiaryRequestWhereInput = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.title = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.beneficiaryRequest.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: BeneficiaryRequest[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.beneficiaryRequest.findMany({
      where,
      include: includes,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.beneficiaryRequest.findMany({
      where,
      include: includes,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
    const totalPages = Math.ceil(total / limit);
    pagination = { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  return { items, pagination };
}


async getAllMeRequest(userId: string,
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: BeneficiaryRequest[]; pagination: any }> {


  const { page = 1, limit = 10, search, name, sortBy = 'updatedAt', sortOrder = SortOrder.DESC } = params || {};

  // 1️⃣ Get the beneficiaryId linked to this user
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { beneficiaryId: true },
  });

  if (!user?.beneficiaryId) {
    throw new ForbiddenException('User is not linked to a beneficiary');
  }

  const beneficiaryId = user.beneficiaryId;
  // 2️⃣ Build where filters
const where: Prisma.BeneficiaryRequestWhereInput = {};
if (beneficiaryId) { where.beneficiaryId = beneficiaryId; }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (name) {
    where.title = { contains: name, mode: 'insensitive' };
  }

  // 3️⃣ Count total
  const total = await this.prisma.beneficiaryRequest.count({ where });

  // 4️⃣ Fetch items with pagination
  const wantsAll = !limit || limit <= 0;
  let items: BeneficiaryRequest[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.beneficiaryRequest.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.beneficiaryRequest.findMany({
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



async update(id: string, dto: UpdateBeneficiaryRequestDto, userId: string): Promise<BeneficiaryRequest> {
 // 1. Ensure record exists
  const existing = await this.prisma.beneficiaryRequest.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundException('Feedback not found');
  }

  // 2. Extract relational fields
  const {
    beneficiaryId,
    assignedToId,
    ...rest
  } = dto;

  // 3. Build update payload safely
  const data: Prisma.BeneficiaryRequestUpdateInput = {
    ...rest,

    // ✅ Update beneficiary (if provided)
    ...(beneficiaryId && {
      beneficiary: {
        connect: { id: beneficiaryId },
      },
    }),

    // ✅ Update assigned user
    ...(assignedToId && {
      assignedTo: {
        connect: { id: assignedToId },
      },
    }),

  };

  return this.prisma.beneficiaryRequest.update({
    where: { id },
    data,
  });
}



async delete(id: string): Promise<BeneficiaryRequest> {
await this.getById(id);
return this.prisma.beneficiaryRequest.delete({ where: { id } });
}

async getById(id: string): Promise<BeneficiaryRequest> {
const item = await this.prisma.beneficiaryRequest.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
