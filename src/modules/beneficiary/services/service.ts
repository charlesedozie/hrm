import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateDto, UpdateDto } from '../dto/dto';
import { Beneficiary, BeneficiaryType } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ApprovalService } from '@/modules/approval/services/service';
import { UsersService } from '@/modules/users/services/users.service';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class BeneficiaryService {
constructor(private prisma: PrismaService,
private approvalService: ApprovalService,
private userService: UsersService, 
) {}


async create(dto: CreateDto, userId: string): Promise<Beneficiary> {
// ── 1. Validate & normalize benId ────────────────────────────────────────
const benId = (dto.benId ?? '').trim();

if (!benId) {
throw new BadRequestException('Beneficiary ID (benId) is required');
}

// Check for duplicate benId (case-insensitive)
const existing = await this.prisma.beneficiary.findFirst({
where: {
benId: {
equals: benId,
mode: 'insensitive',
},
},
});

if (existing) {
throw new BadRequestException(`Beneficiary ID "${benId}" already exists`);
}

// ── 2. Validate DOB ──────────────────────────────────────────────────────
if (!dto.dob) {
throw new BadRequestException('Date of birth (dob) is required');
}

const dob = new Date(dto.dob);

if (isNaN(dob.getTime())) {
throw new BadRequestException('Invalid date of birth format');
}

// Optional: prevent future dates or very old dates
const now = new Date();
if (dob > now) {
throw new BadRequestException('Date of birth cannot be in the future');
}
// Example: minimum age check (adjust as needed)
// const minAgeDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
// if (dob < minAgeDate) {
//   throw new BadRequestException('Beneficiary appears to be unrealistically old');
// }

// ── 3. Validate beneficiaryType (optional field) ─────────────────────────
let beneficiaryType: BeneficiaryType | undefined = undefined;

if (dto.beneficiaryType) {
const validTypes = Object.values(BeneficiaryType);
if (!validTypes.includes(dto.beneficiaryType as BeneficiaryType)) {
throw new BadRequestException(
`Invalid beneficiaryType. Valid values: ${validTypes.join(', ')}`,
);
}
beneficiaryType = dto.beneficiaryType as BeneficiaryType;
}

// ── 4. Prepare data (use relation connect for createdBy) ─────────────────
const { beneficiaryType: _, ...rest } = dto; // remove string version if present

const data: Prisma.BeneficiaryCreateInput = {
...rest,
benId,              // normalized version
dob,
beneficiaryType,    // typed enum or undefined
// ── Use nested connect for the relation ───────────────────────────────
//createdById: userId,
createdById: userId
};

// ── 5. Create ────────────────────────────────────────────────────────────
return this.prisma.beneficiary.create({ data,  });

}



/**
* Get vacancies with optional pagination and search
*/
async getAll(
params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Beneficiary[]; pagination: any }> {
const {
page = 1,
limit,                    // no default here
search,
id,
name,
sortBy = 'updatedAt',
sortOrder = SortOrder.DESC,
} = params || {};

const includeRelations = {
gender: true,
state: true,
lga: true,
linkedEmployee: true,
};

// Handle single item by ID
if (id) {
const beneficiary = await this.prisma.beneficiary.findUnique({ where: { id },
include: includeRelations,
});
if (!beneficiary) throw new NotFoundException('Item not found');
return {
items: [beneficiary],
pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
};
}

// Build where clause
const where: Prisma.BeneficiaryWhereInput = {};

if (search) {
where.OR = [
{
name: {
contains: search,
mode: Prisma.QueryMode.insensitive,
},
},
// beneficiaryType exact match only (safe for enum)
{
beneficiaryType: search.toUpperCase() as BeneficiaryType,
},
];
}

if (name) {
where.name = { contains: name, mode: 'insensitive' };
}

const total = await this.prisma.beneficiary.count({ where });

let items: Beneficiary[];
let pagination: any;

const wantsAll = limit === undefined || limit === null || limit <= 0;

if (wantsAll) {
// Return ALL items — no pagination applied
items = await this.prisma.beneficiary.findMany({
where,
include: includeRelations,
orderBy: {
[sortBy]: sortOrder,
},
// IMPORTANT: no skip, no take
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
items = await this.prisma.beneficiary.findMany({
where,
include: includeRelations,
skip,
take: limit,           // now safe — limit is a positive number
orderBy: {
[sortBy]: sortOrder,
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


async getAllMe(
userId: string,
params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Beneficiary[]; pagination: any }> {
const {
page = 1,
limit,                    // no default here
search,
id,
name,
sortBy = 'updatedAt',
sortOrder = SortOrder.DESC,
} = params || {};

const includeRelations = {
gender: true,
state: true,
lga: true,
linkedEmployee: true,
};

  // 1️⃣ Get the beneficiaryId linked to this user
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { beneficiaryId: true },
  });

  if (!user?.beneficiaryId) {
    throw new ForbiddenException('User is not linked to a beneficiary');
  }

  const beneficiaryId = user.beneficiaryId;


// Handle single item by ID
if (id) {
const beneficiary = await this.prisma.beneficiary.findUnique({ where: { id },
include: includeRelations,
});
if (!beneficiary) throw new NotFoundException('Item not found');
return {
items: [beneficiary],
pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
};
}

  // 2️⃣ Build where filters
const where: Prisma.BeneficiaryWhereInput = {};
if (beneficiaryId) { where.id = beneficiaryId; }

if (search) {
where.OR = [
{
name: {
contains: search,
mode: Prisma.QueryMode.insensitive,
},
},
// beneficiaryType exact match only (safe for enum)
{
beneficiaryType: search.toUpperCase() as BeneficiaryType,
},
];
}

if (name) {
where.name = { contains: name, mode: 'insensitive' };
}

const total = await this.prisma.beneficiary.count({ where });

let items: Beneficiary[];
let pagination: any;

const wantsAll = limit === undefined || limit === null || limit <= 0;

if (wantsAll) {
// Return ALL items — no pagination applied
items = await this.prisma.beneficiary.findMany({
where,
include: includeRelations,
orderBy: {
[sortBy]: sortOrder,
},
// IMPORTANT: no skip, no take
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
items = await this.prisma.beneficiary.findMany({
where,
include: includeRelations,
skip,
take: limit,           // now safe — limit is a positive number
orderBy: {
[sortBy]: sortOrder,
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


async partialUpdate(id: string, data: UpdateDto): Promise<Beneficiary> {
// Make sure the vacancy exists
const user = await this.userService.getUser(id);
if (!user) {
  throw new NotFoundException('User not found');
}

console.log('user.beneficiaryId', user.beneficiaryId);
console.log('user', user);

// Make sure the user has a beneficiaryId
const beneficiaryId = user.beneficiaryId;
if (!beneficiaryId) {
  throw new BadRequestException('User does not have a beneficiaryId');
}

// Create update data without beneficiaryId (it should not be in the data object)
const updateData: any = { ...data };

// Convert date strings to Date objects if needed
if (updateData.dob) {
  updateData.dob = new Date(updateData.dob);
}

console.log('updateData', updateData);

// Use beneficiaryId as the ID for updating
return this.prisma.beneficiary.update({
  where: { id: beneficiaryId },
  data: updateData,
});

}

async update(id: string, data: UpdateDto): Promise<Beneficiary> {
// Make sure the vacancy exists
await this.getById(id);

// Convert date strings to Date objects if they exist
const updateData: any = { ...data };

if (data.dob) updateData.dob = new Date(data.dob);

return this.prisma.beneficiary.update({
where: { id },
data: updateData,
});
}


async delete(id: string): Promise<Beneficiary> {
await this.getById(id);
return this.prisma.beneficiary.delete({ where: { id } });
}


async getById(id: string): Promise<Beneficiary> { 
const beneficiary = await this.prisma.beneficiary.findUnique({
where: { id },
});
console.log('User ID:', id);
console.log('beneficiary:', beneficiary);
if (!beneficiary) throw new NotFoundException('item not found');

// ─── Add these lines for debugging ──────────────────────────────
console.log('Item ID:', id);
return beneficiary;
}


}
