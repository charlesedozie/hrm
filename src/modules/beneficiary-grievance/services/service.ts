import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateGrievanceDto, UpdateGrievanceDto, QueryGrievanceDto } from '../dto/dto';
import { Grievance } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { GrievanceType } from '@prisma/client';

@Injectable()
export class GrievanceService {
constructor(private prisma: PrismaService) {}

async create(
  dto: CreateGrievanceDto,
  userId: string
): Promise<Grievance> {

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

  const { assignedToId, employeeId, ...rest } = dto;

  // 🔥 2. Use beneficiaryId (NOT userId)
  const data: Prisma.GrievanceCreateInput = {
    ...rest,

    beneficiary: {
      connect: { id: user.beneficiaryId }, // ✅ CORRECT
    },

     createdBy: {
      connect: { id: userId }, // ✅ CORRECT
    },

    ...(assignedToId && {
      assignedTo: {
        connect: { id: assignedToId },
      },
    }),
  };

  return this.prisma.grievance.create({
    data,
  });
}


async createComplaint(
  dto: CreateGrievanceDto,
  userId: string
): Promise<Grievance> {

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

  const { assignedToId, employeeId, ...rest } = dto;

  // 🔥 2. Use beneficiaryId (NOT userId)
  const data: Prisma.GrievanceCreateInput = {
  ...rest,

  type: GrievanceType.COMPLAINT, // ✅ FORCE COMPLAINT

  beneficiary: {
    connect: { id: user.beneficiaryId },
  },

  createdBy: {
    connect: { id: userId },
  },

  ...(assignedToId && {
    assignedTo: {
      connect: { id: assignedToId },
    },
  }),
};

  return this.prisma.grievance.create({
    data,
  });
}


async getAllMe(
  userId: string,
  params?: QueryGrievanceDto & { id?: string; name?: string },
): Promise<{ items: Grievance[]; pagination: any }> {
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
const where: Prisma.GrievanceWhereInput = {
  type: 'GRIEVANCE', // always enforced
};
if (beneficiaryId) { where.beneficiaryId = beneficiaryId; }

  if (search) {
    where.OR = [
      { subject: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (name) {
    where.subject = { contains: name, mode: 'insensitive' };
  }

  // 3️⃣ Count total
  const total = await this.prisma.grievance.count({ where });

  // 4️⃣ Fetch items with pagination
  const wantsAll = !limit || limit <= 0;
  let items: Grievance[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.grievance.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.grievance.findMany({
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



async getAllMeComplaint(
  userId: string,
  params?: QueryGrievanceDto & { id?: string; name?: string },
): Promise<{ items: Grievance[]; pagination: any }> {
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
const where: Prisma.GrievanceWhereInput = {
  type: 'COMPLAINT', // always enforced
};
if (beneficiaryId) { where.beneficiaryId = beneficiaryId; }

  if (search) {
    where.OR = [
      { subject: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (name) {
    where.subject = { contains: name, mode: 'insensitive' };
  }

  // 3️⃣ Count total
  const total = await this.prisma.grievance.count({ where });

  // 4️⃣ Fetch items with pagination
  const wantsAll = !limit || limit <= 0;
  let items: Grievance[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.grievance.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.grievance.findMany({
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



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Grievance[]; pagination: any }> {
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
  createdBy: true,
  };
  
  if (id) {
    const item = await this.prisma.grievance.findUnique({
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
  const where: Prisma.GrievanceWhereInput = {
  type: 'GRIEVANCE', // always enforced
};
  if (search) {
    where.OR = [
      { subject: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.subject = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.grievance.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: Grievance[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.grievance.findMany({
      where,
      include: includes,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.grievance.findMany({
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



async getAllComplaint(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Grievance[]; pagination: any }> {
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
  createdBy: true,
  };
  
  if (id) {
    const item = await this.prisma.grievance.findUnique({
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
  const where: Prisma.GrievanceWhereInput = {
  type: 'COMPLAINT', // always enforced
};
  if (search) {
    where.OR = [
      { subject: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.subject = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.grievance.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: Grievance[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.grievance.findMany({
      where,
      include: includes,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.grievance.findMany({
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


async update(id: string, dto: UpdateGrievanceDto, userId: string): Promise<Grievance> {
  // 1. Ensure record exists
  const existing = await this.prisma.grievance.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundException('Feedback not found');
  }

  // 2. Extract relational fields
  const {
    assignedToId,
    ...rest
  } = dto;

  // 3. Build update payload safely
  const data: Prisma.GrievanceUpdateInput = {
    ...rest,



    // ✅ Update assigned user
    ...(assignedToId && {
      assignedTo: {
        connect: { id: assignedToId },
      },
    }),
  };

  return this.prisma.grievance.update({
    where: { id },
    data,
  });
}


async delete(id: string): Promise<Grievance> {
await this.getById(id);
return this.prisma.grievance.delete({ where: { id } });
}

async getById(id: string): Promise<Grievance> {
const item = await this.prisma.grievance.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




}
