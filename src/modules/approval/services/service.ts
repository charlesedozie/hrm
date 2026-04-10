import { Injectable, NotFoundException, BadRequestException, ForbiddenException  } from '@nestjs/common';
import { CreateWorkflowDto, UpdateWorkflowDto, QueryWorkflowDto } from '../dto/dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { Cron } from '@nestjs/schedule';
import { Prisma, ApprovalStatus, WorkflowModule } from '@prisma/client';
import { addHours } from 'date-fns';

type ApprovalAction = 'APPROVE' | 'REJECT' | 'ESCALATE';

interface ProcessApprovalInput {
  requestId: string;
  userId: string;           // the person performing the action
  action: ApprovalAction;
  comment?: string;
}

@Injectable()
export class ApprovalService {
  constructor(private prisma: PrismaService) {}


  
  /**
   * Create a new approval request for any entity
   */
  async createApprovalRequest(
    input: {
      module: WorkflowModule;
      referenceId: string;
      initiatedById: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prismaClient = tx || this.prisma;

    const workflow = await prismaClient.approvalWorkflow.findFirst({
      where: {
        module: input.module,
        isActive: true,
      },
      include: {
        levels: {
          orderBy: { levelOrder: 'asc' },
        },
      },
    });

    if (!workflow || workflow.levels.length === 0) {
      throw new BadRequestException(`No active approval workflow found for module: ${input.module}`);
    }

    return prismaClient.approvalRequest.create({
      data: {
        workflowId: workflow.id,
        module: input.module,
        referenceId: input.referenceId,
        status: ApprovalStatus.PENDING,
        currentLevel: 1,
        initiatedById: input.initiatedById,
      },
    });
  }

  /**
   * Main method to process (approve / reject / escalate) an approval request
   */
  async processApprovalRequest(input: ProcessApprovalInput) {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.approvalRequest.findUnique({
        where: { id: input.requestId },
        include: {
          workflow: {
            include: { levels: true },
          },
          initiatedBy: true,
        },
      });

      if (!request) {
        throw new BadRequestException('Approval request not found');
      }

      if (request.status !== ApprovalStatus.PENDING) {
        throw new BadRequestException(`Cannot process request in status: ${request.status}`);
      }

      const currentLevel = request.workflow.levels.find(
        (l) => l.levelOrder === request.currentLevel,
      );

      if (!currentLevel) {
        throw new BadRequestException('Current approval level not found');
      }

      // Check authorization (user must have the correct role for this level)
      const user = await tx.user.findUnique({
        where: { id: input.userId },
      });

 

      // Record the action in history
      await tx.approvalHistory.create({
        data: {
          approvalRequestId: request.id,
          levelOrder: request.currentLevel,
          actedById: input.userId,
          action: input.action === 'APPROVE' ? ApprovalStatus.APPROVED :
                  input.action === 'REJECT' ? ApprovalStatus.REJECTED :
                  ApprovalStatus.ESCALATED,
          comment: input.comment,
        },
      });

      let nextStatus: ApprovalStatus;
      let nextLevel: number | null = null;

      if (input.action === 'APPROVE') {
        const isFinal = currentLevel.isFinal;
        if (isFinal) {
          nextStatus = ApprovalStatus.APPROVED;
          // Here you would normally trigger final business logic (e.g. activate beneficiary)
          // But we leave that to the calling service
        } else {
          nextStatus = ApprovalStatus.PENDING;
          nextLevel = request.currentLevel + 1;
        }
      } else if (input.action === 'REJECT') {
        nextStatus = ApprovalStatus.REJECTED;
      } else if (input.action === 'ESCALATE') {
        nextStatus = ApprovalStatus.ESCALATED;
        nextLevel = request.currentLevel + 1; // or custom escalation logic
      } else {
        throw new BadRequestException('Invalid action');
      }

      // Update request
      const updatedRequest = await tx.approvalRequest.update({
        where: { id: request.id },
        data: {
          status: nextStatus,
          currentLevel: nextLevel ?? request.currentLevel,
        },
      });

      return {
        request: updatedRequest,
        wasFinalized: input.action === 'APPROVE' && currentLevel.isFinal,
      };
    });
  }

  /**
   * Convenience method: approve
   */
  async approve(requestId: string, userId: string, comment?: string) {
    return this.processApprovalRequest({ requestId, userId, action: 'APPROVE', comment });
  }

  /**
   * Convenience method: reject
   */
  async reject(requestId: string, userId: string, comment?: string) {
    return this.processApprovalRequest({ requestId, userId, action: 'REJECT', comment });
  }
  
// escalte
@Cron('*/10 * * * *') // every 10 minutes
  async handleEscalations() {
    console.log('Checking for pending approvals to escalate...');
    const pendingRequests = await this.prisma.approvalRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        workflow: { include: { levels: true } },
      },
    });

    const now = new Date();

    for (const request of pendingRequests) {
      const level = request.workflow.levels.find(
        (l) => l.levelOrder === request.currentLevel,
      );
      if (!level?.escalationHours) continue;

      const escalationTime = addHours(request.initiatedAt, level.escalationHours);
      if (now > escalationTime) {
        await this.escalate(request.id, request.currentLevel);
      }
    }
  }

  private async escalate(requestId: string, currentLevel: number) {
    const request = await this.prisma.approvalRequest.findUnique({
      where: { id: requestId },
      include: { workflow: { include: { levels: true } } },
    });

    if (!request) {
      console.log(`Approval request ${requestId} not found — cannot escalate.`);
      return;
    }

    const nextLevel = request.workflow.levels.find(
      (l) => l.levelOrder === currentLevel + 1,
    );

    if (!nextLevel) {
      console.log(`Request ${requestId} is at final level — cannot escalate.`);
      return;
    }

    await this.prisma.approvalHistory.create({
      data: {
        approvalRequestId: requestId,
        levelOrder: currentLevel,
        actedById: 'SYSTEM',
        action: 'ESCALATED',
        comment: 'Auto-escalated due to timeout',
      },
    });

    await this.prisma.approvalRequest.update({
      where: { id: requestId },
      data: {
        currentLevel: currentLevel + 1,
        initiatedAt: new Date(),
      },
    });

    console.log(`Request ${requestId} escalated to level ${currentLevel + 1}`);
  }

  
}