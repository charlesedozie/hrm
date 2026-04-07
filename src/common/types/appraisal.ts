// types/appraisal.ts
import { Prisma } from '@prisma/client';

export type AppraisalWithDetails = Prisma.PerformanceAppraisalGetPayload<{
  include: {
    employee: { select: { fname: true, lname: true, empId: true } }
    manager: { select: { fname: true, lname: true } }
    cycle: true
    ratings: { include: { goal: true } }
    performanceDevelopmentPlan: true
  }
}>