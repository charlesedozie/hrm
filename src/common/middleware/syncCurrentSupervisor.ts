// src/common/middleware/sync-current-supervisor.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SyncCurrentSupervisorMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // We attach our custom middleware logic to Prisma client
    // (this runs for every prisma query, not express request)
    this.prisma.$use(async (params: Prisma.MiddlewareParams, nextFn) => {
      // Only act on EmploymentHistory operations
      if (params.model !== 'EmploymentHistory') {
        return nextFn(params);
      }

      // ── CREATE ────────────────────────────────────────────────
      if (params.action === 'create') {
        const result = await nextFn(params);

        if (result.isCurrent === true && result.employeeId) {
          await this.syncSupervisor(result.employeeId, result.supervisorId);
        }

        return result;
      }

      // ── UPDATE ────────────────────────────────────────────────
      if (params.action === 'update') {
        // Fetch current state before update
        const before = await this.prisma.employmentHistory.findUnique({
          where: params.args.where,
          select: { isCurrent: true, supervisorId: true, employeeId: true },
        });

        const after = await nextFn(params);

        if (
          after.employeeId &&
          (before?.isCurrent !== after.isCurrent ||
            (after.isCurrent && before?.supervisorId !== after.supervisorId))
        ) {
          const newSupervisorId = after.isCurrent ? after.supervisorId : null;
          await this.syncSupervisor(after.employeeId, newSupervisorId);
        }

        return after;
      }

      // Other actions (updateMany, delete, etc.) → pass through
      return nextFn(params);
    });

    // Continue to next middleware
    next();
  }

  private async syncSupervisor(employeeId: string, supervisorId: string | null) {
    await this.prisma.employee.update({
      where: { id: employeeId },
      data: { currentSupervisorId: supervisorId },
    });
  }
}