import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateEmployeeDto, UpdateEmployeeDto, QueryEmployeeDto } from '../dto/dto';
import { Employee } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

type EmployeeBasicInfo = Pick<Employee, 'id' | 'fname' | 'lname' | 'empId'> & {
  status: string;
  currentRole?: string | null;
  currentDepartment?: string | null;
  currentJobLevel?: string | null;
};

type EmployeeWithHistory = {
  id: string;
  fname: string;
  lname: string;
  empId: string | null;
  status: string;
  currentSupervisorId: string | null;
  employeeEmploymentHistory: Array<{
    department: { name: string } | null;
    officeRole: { name: string } | null;
    jobLevel: { name: string } | null;
  }>;
};

@Injectable()
export class EmployeeService {
constructor(private prisma: PrismaService) {}


  async create(dto: CreateEmployeeDto, userId: string): Promise<Employee> {
    const {
      username,
      empId,
      fname,
      lname,
      mname,
      genderId,
      hireDate,
      terminationDate,
      avatar,
      url,
      originalName,
      // ... other fields you want to destructure
    } = dto;

    // ────────────────────────────────────────────────
    //  Validation
    // ────────────────────────────────────────────────

    if (!username?.trim()) {
      throw new BadRequestException('Username is required to create a login account');
    }

    if (!empId?.trim()) {
      throw new BadRequestException('Employee ID (empId) is required');
    }

    if (!hireDate) {
      throw new BadRequestException('Hire date is required');
    }

    const parsedHireDate = new Date(hireDate);
    if (isNaN(parsedHireDate.getTime())) {
      throw new BadRequestException('Invalid date format for hireDate');
    }

    let parsedTerminationDate: Date | null = null;
    if (terminationDate) {
      parsedTerminationDate = new Date(terminationDate);
      if (isNaN(parsedTerminationDate.getTime())) {
        throw new BadRequestException('Invalid date format for terminationDate');
      }
      if (parsedTerminationDate <= parsedHireDate) {
        throw new BadRequestException('Termination date must be after hire date');
      }
    }

    // Check for duplicate empId (case-insensitive)
    const existingEmployee = await this.prisma.employee.findFirst({
      where: {
        empId: {
          equals: empId,
          mode: 'insensitive',
        },
      },
    });

    if (existingEmployee) {
      throw new BadRequestException(`Employee ID "${empId}" already exists`);
    }

    // Check if username already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new BadRequestException(`Username "${username}" is already taken`);
    }

    // ────────────────────────────────────────────────
    //  Transaction – both employee + user created atomically
    // ────────────────────────────────────────────────
    return this.prisma.$transaction(async (tx) => {
      // 1. Create Employee
      const employee = await tx.employee.create({
        data: {
          empId,
          fname,
          lname,
          mname: mname || null,
          hireDate: parsedHireDate,
          terminationDate: parsedTerminationDate,
          status: 'ACTIVE',
          createdBy: {
            connect: { id: userId },
          },
          gender: {
            connect: { id: genderId },
          },
          avatar,
          url,
          originalName,
          // Add other fields from DTO here, e.g.:
          // technicalSkills: dto.technicalSkills?.join(', ') || null,
          // softSkills: dto.softSkills?.join(', ') || null,
          // ...
        },
      });

      // 2. Generate secure random password
      const plainPassword = randomBytes(10).toString('hex');
      const hashedPassword = await bcrypt.hash(plainPassword, 12);

      // 3. Create linked User
      await tx.user.create({
        data: {
          username: username.trim(),
          password: hashedPassword,
          role: 'USER', // ← adjust according to your needs (maybe from DTO?)
          status: 'ACTIVE',
          employee: {
            connect: { id: employee.id },
          },
        },
      });

      // Return the created employee (user is not returned – sensitive data)
      return employee;
    });
  }



/**
* Get items with optional pagination and search
*/
async getAll(
  params?: PaginationDto & { id?: string; name?: string },
): Promise<{ items: Employee[]; pagination: any }> {
  const {
    page = 1,
    limit,
    search,
    id,
    name,
    sortBy = 'hireDate',
    sortOrder = SortOrder.DESC,
  } = params || {};

  const includeRelations = {
    personalInfo: {
      include: {         // all fields from Gender
        marritalStatus: true,  // all fields from MarritalStatus
        nationality: true,     // all fields from Nationality
      },
    },
    gender: true, 
    projects: true,
    contactInfo: true,
    attendance: true,
    vacancy: true,
    cases: true,
    caseNotes: true,
    createdAssessments: true,
    leaveRequest: true,
    trainingEnrollment: true,
    employmentSupervisor: true,
    employeeEmploymentHistory: {  
  include: {
    location: {
      select: {
        id: true,
        name: true, // ← this is the important part
      },
    },
    position: {
      select: {
        id: true,
        name: true, // ← this is the important part
      },
    },
    supervisor: {
      select: {
        id: true,
        fname: true, 
        lname: true, 
        mname: true, 
      },
    },
  },
},

    emergencyContact: true,
    employeesShift: true,
    user: true,
    assetAssignment: true,
  //  createdBy: { select: { id: true, username: true } },
  //  deletedBy: { select: { id: true, username: true } },
    employeeDegree: true,
    employeeCertificate: true,
  };

  // Single employee by ID
  if (id) {
    const item = await this.prisma.employee.findUnique({
      where: { id },
      include: includeRelations,
    });
    if (!item) throw new NotFoundException('Employee not found');
    return {
      items: [item],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    };
  }

  // Build search filter
  const where: Prisma.EmployeeWhereInput = {};
  if (search) {
    where.OR = [
      { empId: { contains: search, mode: 'insensitive' } },
      { fname: { contains: search, mode: 'insensitive' } },
      { lname: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (name) {
    where.empId = { contains: name, mode: 'insensitive' };
  }

  const total = await this.prisma.employee.count({ where });

  const wantsAll = !limit || limit <= 0;
  let items: Employee[];
  let pagination: any;

  if (wantsAll) {
    items = await this.prisma.employee.findMany({
      where,
      include: includeRelations,
      orderBy: { [sortBy]: sortOrder },
    });
    pagination = { total, page: 1, limit: null, totalPages: 1, hasNext: false, hasPrev: false };
  } else {
    const skip = (page - 1) * limit;
    items = await this.prisma.employee.findMany({
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


/**
 * Get employees that are not yet assigned to any user
 * (i.e. employee.user is null)
 */
async getUnassignedToUser(
  params?: PaginationDto & {
    search?: string;
    status?: string;           // optional extra filter example
    includeDeleted?: boolean;
    sortBy?: string;
    sortOrder?: SortOrder;
  },
): Promise<{ items: Employee[]; pagination: any }> {
  const {
    page = 1,
    limit,
    search,
    status,
    includeDeleted = false,
    sortBy = 'updatedAt',
    sortOrder = SortOrder.DESC,
  } = params || {};

  // Build where clause
  const where: Prisma.EmployeeWhereInput = {
    user: null,                      // ← core condition: not linked to any user
  };

  // Exclude soft-deleted by default
  if (!includeDeleted) {
    where.deletedAt = null;
  }

  // Optional status filter
  if (status) {
    where.status = status as any;   // you might want to validate/enum-check this
  }

  // Search (same style as getAll)
  if (search) {
    where.OR = [
      { empId: { contains: search, mode: 'insensitive' } },
      // Add more searchable fields if needed in the future
      // { personalInfo: { some: { firstName: { contains: search, mode: 'insensitive' } } } },
      // { personalInfo: { some: { lastName:  { contains: search, mode: 'insensitive' } } } },
    ];
  }

  // Count total matching records
  const total = await this.prisma.employee.count({ where });

  let items: Employee[];
  let pagination: any;

  const wantsAll = limit === undefined || limit === null || limit <= 0;

  if (wantsAll) {
    // Return all matching items (no pagination limits)
    items = await this.prisma.employee.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      // You can add select / include here if you want to shape the response
      // include: { personalInfo: true },   ← example
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
    // Paginated result
    const skip = (page - 1) * limit;
    items = await this.prisma.employee.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      // Optional: select or include relations you commonly need
      // include: { personalInfo: true, contactInfo: { take: 1 } },
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


async update(id: string, data: UpdateEmployeeDto): Promise<Employee> {
  await this.getById(id); // or findUniqueOrThrow, etc.

  // Parse dates safely
  let hireDate: Date;
  if (!data.hireDate) {
    throw new BadRequestException('hireDate is required');
  }

  hireDate = new Date(data.hireDate);
  if (isNaN(hireDate.getTime())) {
    throw new BadRequestException('Invalid date format for hireDate');
  }

  // Optional: terminationDate
  let terminationDate: Date | undefined = undefined;

  if (data.terminationDate) {
    terminationDate = new Date(data.terminationDate);

    if (isNaN(terminationDate.getTime())) {
      throw new BadRequestException('Invalid date format for terminationDate');
    }

    if (terminationDate <= hireDate) {
      throw new BadRequestException('terminationDate must be after hireDate');
    }
  }

  // Build the clean update payload
  // We spread data but override the date fields with proper Date objects
  const updatePayload = {
    ...data,
    hireDate,                    // ← now a Date object
    terminationDate,             // ← Date or undefined
    // If you have other dates (e.g. birthDate, contractEnd), do the same
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.employee.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<Employee> {
await this.getById(id);
return this.prisma.employee.delete({ where: { id } });
}

async getById(id: string): Promise<Employee> {
const item = await this.prisma.employee.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}




/**
   * Returns the list of employees who report directly to the current user
   */
  async getMyDirectReports(currentEmployeeId: string): Promise<EmployeeBasicInfo[]> {
    const reports = await this.prisma.employee.findMany({
      where: {
        currentSupervisorId: currentEmployeeId,
        // Optional: exclude inactive employees
        status: { in: ['ACTIVE', 'PROBATION'] },
      },
      select: {
        id: true,
        fname: true,
        lname: true,
        empId: true,
        status: true,
        employeeEmploymentHistory: {
          where: { isCurrent: true },
          select: {
            department: { select: { name: true } },
            officeRole: { select: { name: true } },
            jobLevel: { select: { name: true } },
          },
          take: 1,
        },
      },
      orderBy: [
        { lname: 'asc' },
        { fname: 'asc' },
      ],
    });

    // Flatten useful fields
    return reports.map((emp) => {
      const currentHistory = emp.employeeEmploymentHistory?.[0];
      return {
        id: emp.id,
        fname: emp.fname,
        lname: emp.lname,
        empId: emp.empId,
        status: emp.status,
        currentRole: currentHistory?.officeRole?.name ?? null,
        currentDepartment: currentHistory?.department?.name ?? null,
        currentJobLevel: currentHistory?.jobLevel?.name ?? null,
      };
    });
  }

  /**
   * Returns the person the current user reports to (immediate manager)
   */
  async getMyManager(currentEmployeeId: string): Promise<EmployeeBasicInfo | null> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: currentEmployeeId },
      select: {
        currentSupervisorId: true,
      },
    });

    if (!employee?.currentSupervisorId) {
      return null; // No manager (top of chain or no data)
    }

    const manager = await this.prisma.employee.findUnique({
      where: { id: employee.currentSupervisorId },
      select: {
        id: true,
        fname: true,
        lname: true,
        empId: true,
        status: true,
        employeeEmploymentHistory: {
          where: { isCurrent: true },
          select: {
            department: { select: { name: true } },
            officeRole: { select: { name: true } },
            jobLevel: { select: { name: true } },
          },
          take: 1,
        },
      },
    });

    if (!manager) {
      return null;
    }

    const currentHistory = manager.employeeEmploymentHistory?.[0];

    return {
      id: manager.id,
      fname: manager.fname,
      lname: manager.lname,
      empId: manager.empId,
      status: manager.status,
      currentRole: currentHistory?.officeRole?.name ?? null,
      currentDepartment: currentHistory?.department?.name ?? null,
      currentJobLevel: currentHistory?.jobLevel?.name ?? null,
    };
  }

  /**
   * Returns the full upward reporting line (me → manager → manager's manager → ...)
   * Stops at the top or when max depth is reached
   */
  async getMyReportingLine(
    currentEmployeeId: string,
    options: { maxDepth?: number } = { maxDepth: 12 },
  ): Promise<EmployeeBasicInfo[]> {
    const line: EmployeeBasicInfo[] = [];
    let currentId: string | null = currentEmployeeId;

    for (let depth = 0; depth < (options.maxDepth ?? 12) && currentId; depth++) {
      const person: EmployeeWithHistory | null = await this.prisma.employee.findUnique({
        where: { id: currentId },
        select: {
          id: true,
          fname: true,
          lname: true,
          empId: true,
          status: true,
          currentSupervisorId: true,
          employeeEmploymentHistory: {
            where: { isCurrent: true },
            select: {
              department: { select: { name: true } },
              officeRole: { select: { name: true } },
              jobLevel: { select: { name: true } },
            },
            take: 1,
          },
        },
      });

      if (!person) break;

      const currentHistory = person.employeeEmploymentHistory?.[0];

      line.push({
        id: person.id,
        fname: person.fname,
        lname: person.lname,
        empId: person.empId,
        status: person.status,
        currentRole: currentHistory?.officeRole?.name ?? null,
        currentDepartment: currentHistory?.department?.name ?? null,
        currentJobLevel: currentHistory?.jobLevel?.name ?? null,
      });

      currentId = person.currentSupervisorId;
    }

    // Reverse so the result is top → bottom (CEO / top person first)
    return line.reverse();
  }

}
