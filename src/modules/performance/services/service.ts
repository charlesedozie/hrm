import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, AppraisalStatus } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { CreatePerformanceDevelopmentPlanDto, CreatePerformanceRatingScaleDto, CreatePerformanceFeedbackDto, CreatePerformanceAppraisalRatingDto, CreatePerformanceGoalDto, CreatePerformanceCycleDto, CreatePerformanceAppraisalDto, UpdatePerformanceDevelopmentPlanDto, UpdatePerformanceRatingScaleDto, UpdatePerformanceFeedbackDto, UpdatePerformanceAppraisalRatingDto, UpdatePerformanceGoalDto, UpdatePerformanceCycleDto, UpdatePerformanceAppraisalDto } from '../dto/dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class PerformanceService {
constructor(private prisma: PrismaService) {}


async getAppraisal(id: string) {
  return this.prisma.performanceAppraisal.findUnique({
    where: { id },
    include: {
      employee: true,
      manager: true,
      cycle: true,

      ratings: {
        include: {
          goal: true,
        },
      },

      performanceDevelopmentPlan: true,
    },
  });
}
  // Cycles
  async createCycle(data: Prisma.PerformanceCycleCreateInput) {
    return this.prisma.performanceCycle.create({ data });
  }

  async findAllCycles() {
    return this.prisma.performanceCycle.findMany({
      include: { goals: true, appraisals: true },
      orderBy: { startDate: 'desc' },
    });
  }

  // Goals
async createGoal(dto: CreatePerformanceGoalDto) {
  const { employeeId, cycleId, title, description, weight, targetValue } = dto;

  // Optional but strongly recommended: existence check
  const [employee, cycle] = await Promise.all([
    this.prisma.employee.findUnique({ where: { id: employeeId } }),
    this.prisma.performanceCycle.findUnique({ where: { id: cycleId } }),
  ]);

  if (!employee) {
    throw new NotFoundException(`Employee with ID ${employeeId} not found`);
  }
  if (!cycle) {
    throw new NotFoundException(`Performance cycle with ID ${cycleId} not found`);
  }

  return this.prisma.performanceGoal.create({
    data: {
      title,
      description,
      weight,
      targetValue,
      // ── Here is the important part ──
      employee: { connect: { id: employeeId } },
      cycle:    { connect: { id: cycleId } },
    },
    include: {
      employee: { select: { fname: true, lname: true, empId: true } },
      cycle:    { select: { name: true } },
    },
  });
}

  async findGoalsByCycle(cycleId: string) {
    return this.prisma.performanceGoal.findMany({
      where: { cycleId },
      include: { employee: { select: { fname: true, lname: true } } },
    });
  }


  // performance.service.ts

async startAppraisal(dto: CreatePerformanceDevelopmentPlanDto) {
  const { employeeId, managerId, cycleId } = dto;

  // Optional: validate that these IDs exist (recommended in production)
  const [employee, manager, cycle] = await Promise.all([
    this.prisma.employee.findUnique({ where: { id: employeeId } }),
    this.prisma.employee.findUnique({ where: { id: managerId } }),
    this.prisma.performanceCycle.findUnique({ where: { id: cycleId } }),
  ]);

  if (!employee) throw new NotFoundException(`Employee with ID ${employeeId} not found`);
  if (!manager)  throw new NotFoundException(`Manager with ID ${managerId} not found`);
  if (!cycle)    throw new NotFoundException(`Cycle with ID ${cycleId} not found`);

  return this.prisma.performanceAppraisal.create({
    data: {
      employee: { connect: { id: employeeId } },
      manager:  { connect: { id: managerId } },
      cycle:    { connect: { id: cycleId } },
      status:   'SELF_REVIEW',           // ← default value
      // selfComment: null,              // optional – Prisma sets to null by default
      // managerComment: null,
      // finalScore: null,
    },
    include: {
      employee: { select: { fname: true, lname: true, empId: true } },
      manager:  { select: { fname: true, lname: true } },
      cycle:    true,
    },
  });
}

  async findMyAppraisals(userId: string) {
    return this.prisma.performanceAppraisal.findMany({
      where: { employeeId: userId },
      include: { cycle: true, ratings: { include: { goal: true } } },
    });
  }

  async findAppraisalById(id: string) {
    const appraisal = await this.prisma.performanceAppraisal.findUnique({
      where: { id },
      include: {
        employee: true,
        manager: true,
        cycle: true,
        // In performance.service.ts → inside include for ratings
ratings: {
  include: {
    goal: {
      select: {
        id: true,           // ← add this
        title: true,
        weight: true,
        // ... other fields you need
      }
    }
  }
},
        performanceDevelopmentPlan: true,
      },
    });
    if (!appraisal) throw new NotFoundException('Appraisal not found');
    return appraisal;
  }

  async submitSelfReview(appraisalId: string, data: any) {
    return this.prisma.$transaction([
      this.prisma.performanceAppraisal.update({
        where: { id: appraisalId },
        data: { selfComment: data.selfComment, status: 'MANAGER_REVIEW' },
      }),
      ...data.ratings.map((r: any) =>
        this.prisma.performanceAppraisalRating.upsert({
          where: { appraisalId_goalId: { appraisalId, goalId: r.goalId } },
          update: { score: r.score, comment: r.comment },
          create: { appraisalId, goalId: r.goalId, score: r.score, comment: r.comment },
        })
      ),
    ]);
  }

  async submitManagerReview(appraisalId: string, data: any) {
    return this.prisma.performanceAppraisal.update({
      where: { id: appraisalId },
      data: {
        managerComment: data.managerComment,
        finalScore: data.finalScore,
        status: 'HR_REVIEW',
      },
    });
  }

  async createDevelopmentPlan(appraisalId: string, data: any) {
    const appraisal = await this.findAppraisalById(appraisalId);
    return this.prisma.performanceDevelopmentPlan.create({
      data: {
        appraisalId,
        employeeId: appraisal.employeeId,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        actionPlan: data.actionPlan,
      },
    });
  }

async createFeedback(dto: CreatePerformanceFeedbackDto) {
  const { employeeId, reviewerId, cycleId, comment, rating } = dto;

  // Optional but very valuable: existence validation
  const [employee, reviewer, cycle] = await Promise.all([
    this.prisma.employee.findUnique({ where: { id: employeeId } }),
    this.prisma.employee.findUnique({ where: { id: reviewerId } }), // reviewer is also an Employee
    this.prisma.performanceCycle.findUnique({ where: { id: cycleId } }),
  ]);

  if (!employee) {
    throw new NotFoundException(`Employee (recipient) with ID ${employeeId} not found`);
  }
  if (!reviewer) {
    throw new NotFoundException(`Reviewer with ID ${reviewerId} not found`);
  }
  if (!cycle) {
    throw new NotFoundException(`Performance cycle with ID ${cycleId} not found`);
  }

  return this.prisma.performanceFeedback.create({
    data: {
      comment,
      rating,
      // ── This is the fix ──
      employee: { connect: { id: employeeId } },
      reviewer: { connect: { id: reviewerId } },
      cycleId:  cycleId,
    },
    include: {
      employee: { select: { fname: true, lname: true, empId: true } },
      reviewer: { select: { fname: true, lname: true } },
    },
  });
}


  // performance.service.ts

/**
 * Get all performance appraisals with useful filtering & relations
 */
async getAllAppraisals(query: {
  status?: AppraisalStatus;
  cycleId?: string;
  employeeId?: string;
  managerId?: string;
  take?: number;
  skip?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'finalScore';
  order?: 'asc' | 'desc';
} = {}) {
  const {
    status,
    cycleId,
    employeeId,
    managerId,
    take = 20,
    skip = 0,
    orderBy = 'createdAt',
    order = 'desc',
  } = query;

  return this.prisma.performanceAppraisal.findMany({
    where: {
      ...(status && { status }),
      ...(cycleId && { cycleId }),
      ...(employeeId && { employeeId }),
      ...(managerId && { managerId }),
      // You can add more filters like:
      // deletedAt: null,   // if you have soft-delete
    },
    include: {
      employee: {
        select: {
          id: true,
          fname: true,
          lname: true,
          empId: true,
          status: true,
        },
      },
      manager: {
        select: {
          id: true,
          fname: true,
          lname: true,
        },
      },
      cycle: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          status: true,
        },
      },
      ratings: {
        include: {
          goal: {
            select: {
              id: true,
              title: true,
              weight: true,
              targetValue: true,
            },
          },
        },
      },
      performanceDevelopmentPlan: true,
    },
    orderBy: {
      [orderBy]: order,
    },
    take,
    skip,
  });
}

/**
* Get items with optional pagination and search


async update(id: string, data: UpdatePerformanceDto): Promise<MasterIndicator> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.masterIndicator.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<MasterIndicator> {
await this.getById(id);
return this.prisma.masterIndicator.delete({ where: { id } });
}

async getById(id: string): Promise<MasterIndicator> {
const item = await this.prisma.masterIndicator.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}
*/



}
