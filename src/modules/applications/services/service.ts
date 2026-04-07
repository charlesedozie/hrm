// src/applicationform/applicationform.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service'; // adjust path
import { Prisma, Applicationform, EmploymentStatus } from '@prisma/client';
import { CreateApplicationformDto, UpdateApplicationformDto, QueryApplicationformDto } from '../dto/dto';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';

@Injectable()
export class ApplicationformService {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────────────────────
  // CREATE - Submit new application form
  // ──────────────────────────────────────────────────────────────
  async create(
    dto: CreateApplicationformDto,
    // optional: createdById?: string  (if you track who submitted / admin)
  ): Promise<Applicationform> {
    // Optional: basic business rules
    if (!dto.vacancyId) {
      throw new BadRequestException('Vacancy ID is required');
    }

    // Check if vacancy exists
    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id: dto.vacancyId },
    });

    if (!vacancy) {
      throw new NotFoundException(`Vacancy with ID ${dto.vacancyId} not found`);
    }

    // Optional: prevent duplicate applications (e.g. same email + vacancy)
    const existing = await this.prisma.applicationform.findFirst({
      where: {
        vacancyId: dto.vacancyId,
        email: dto.email.toLowerCase().trim(),
      },
    });

    if (existing) {
      throw new ConflictException(
        'You have already applied for this position with this email',
      );
    }

    const data: Prisma.ApplicationformCreateInput = {
      fname: dto.fname.trim(),
      lname: dto.lname.trim(),
      mname: dto.mname?.trim(),
      title: dto.title?.trim(),
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      nationality: dto.nationality?.trim(),
      email: dto.email.trim().toLowerCase(),
      phoneNumber: dto.phoneNumber.trim(),
      alternatePhone: dto.alternatePhone?.trim(),
      address: dto.address?.trim(),
      city: dto.city?.trim(),
      country: dto.country?.trim(),
      postalCode: dto.postalCode?.trim(),
      nin: dto.nin?.trim(),
      passportNumber: dto.passportNumber?.trim(),
      hasDisability: dto.hasDisability ?? false,
      disabilityDetails: dto.disabilityDetails?.trim(),
      positionApplied: dto.positionApplied?.trim(),
      availableStartDate: dto.availableStartDate
        ? new Date(dto.availableStartDate)
        : undefined,
      expectedSalary: dto.expectedSalary,
      willingToRelocate: dto.willingToRelocate,
      technicalSkills: dto.technicalSkills?.trim(),
      softSkills: dto.softSkills?.trim(),
      computerSkills: dto.computerSkills?.trim(),
      gender: dto.genderId
  ? { connect: { id: dto.genderId } }
  : undefined,
  marritalStatus: dto.genderId
  ? { connect: { id: dto.marritalStatusId } }
  : undefined,
  
  state: dto.genderId
  ? { connect: { id: dto.stateId } }
  : undefined,
  
      cvUrl: dto.cvUrl,
      coverLetterUrl: dto.coverLetterUrl,
      certificatesUrls: dto.certificatesUrls ?? [],
      idDocumentUrl: dto.idDocumentUrl,
      education: dto.education?.map(edu => ({ ...edu })) ?? undefined,
  workExperience: dto.workExperience?.map(exp => ({ ...exp })) ?? undefined,
  certifications: dto.certifications?.map(cert => ({ ...cert })) ?? undefined,
  languages: dto.languages?.map(lang => ({ ...lang })) ?? undefined,

 
      references: dto.references?.map(ref => ({ ...ref })) ?? undefined,
      confirmAccuracy: dto.confirmAccuracy,
      consentDataProcessing: dto.consentDataProcessing,
      vacancy: {
        connect: { id: dto.vacancyId },
      },
      // status: EmploymentStatus.JOB_APPLICANT, // default in schema
    };

    return this.prisma.applicationform.create({ data });
  }

  // ──────────────────────────────────────────────────────────────
  // READ - Get all applications (paginated + filters)
  // ──────────────────────────────────────────────────────────────
  async findAll(
    params?: QueryApplicationformDto & {
      vacancyId?: string;
      status?: EmploymentStatus;
      search?: string; // search fname, lname, email
      sortBy?: keyof Applicationform;
      sortOrder?: SortOrder;
    },
  ) {
    const {
      page = 1,
      limit,
      vacancyId,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = params || {};

    const where: Prisma.ApplicationformWhereInput = {
      deletedAt: null, // soft delete filter
    };

    if (vacancyId) where.vacancyId = vacancyId;
    if (status) where.status = status;

    if (search?.trim()) {
      where.OR = [
        { fname: { contains: search.trim(), mode: 'insensitive' } },
        { lname: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.applicationform.count({ where });

    let items: Applicationform[];
    const wantsAll = !limit || limit <= 0;

    if (wantsAll) {
      items = await this.prisma.applicationform.findMany({
        where,
          orderBy: { [sortBy]: sortOrder },
        include: {
        vacancy: true, // optional
        },
      });
    } else {
      const skip = (page - 1) * limit;
      items = await this.prisma.applicationform.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          vacancy: true,
          gender: { select: { name: true, id: true, } },
          marritalStatus: { select: { name: true, id: true, } },
        },
      });
    }

    const pagination = wantsAll
      ? { total, page: 1, limit: null, totalPages: 1 }
      : {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };

    return { items, pagination };
  }

  // ──────────────────────────────────────────────────────────────
  // READ - Get single application by ID
  // ──────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<Applicationform> {
    const application = await this.prisma.applicationform.findFirst({
      where: { id, deletedAt: null },
      include: {
        vacancy: { select: { id: true, name: true } },
        gender: { select: { name: true } },
        marritalStatus: { select: { name: true } },
        state: { select: { name: true } },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return application;
  }

  // ──────────────────────────────────────────────────────────────
  // UPDATE
  // ──────────────────────────────────────────────────────────────
  async update(
    id: string,
    dto: UpdateApplicationformDto,
  ): Promise<Applicationform> {
    await this.findOne(id); // throws if not found

    // Optional: prevent changing vacancy after submission
    if (dto.vacancyId) {
      throw new BadRequestException('Cannot change vacancy after submission');
    }

    const data: Prisma.ApplicationformUpdateInput = {
      fname: dto.fname ? dto.fname.trim() : undefined,
      lname: dto.lname ? dto.lname.trim() : undefined,
      mname: dto.mname !== undefined ? dto.mname?.trim() : undefined,
      // ... map other scalar fields similarly
      //education: dto.education !== undefined ? dto.education : undefined,
      //workExperience: dto.workExperience !== undefined ? dto.workExperience : undefined,
      // ... other JSON fields
      status: dto.status, // allow admin to update status
      // cvUrl, coverLetterUrl, etc. — usually updated via separate upload endpoint
    };

    return this.prisma.applicationform.update({
      where: { id },
      data,
    });
  }

  // ──────────────────────────────────────────────────────────────
  // DELETE (soft delete)
  // ──────────────────────────────────────────────────────────────
  async remove(id: string, deletedById?: string): Promise<Applicationform> {
    await this.findOne(id); // throws if not found

    return this.prisma.applicationform.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById: deletedById || null,
      },
    });
  }

  // Optional: Hard delete (use with caution)
  async hardDelete(id: string): Promise<Applicationform> {
    await this.findOne(id);
    return this.prisma.applicationform.delete({ where: { id } });
  }
}