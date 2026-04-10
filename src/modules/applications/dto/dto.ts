import { PartialType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmploymentStatus } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto'; // your global one

import {
  IsString,
  IsOptional,
  IsDateString,
  IsUUID,
  IsNotEmpty, 
  IsBoolean,
  IsNumber,
  IsEnum,
  IsArray,
  IsObject,
  ValidateNested,
  IsEmail,
  IsPhoneNumber,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

enum WillingToRelocate {
  YES = 'Yes',
  NO = 'No',
  DEPENDS = 'Depends',
}


// Example structure for repeatable sections (you can refine this)
class EducationEntryDto {
  @ApiProperty({ example: 'B.Sc Computer Science' })
  @IsString()
  degree!: string;

  @ApiProperty({ example: 'University of Lagos' })
  @IsString()
  institution!: string;

  @ApiProperty({ example: '2018-2022' })
  @IsString()
  year!: string;
}

class LanguageEntryDto {
  @ApiProperty({ example: 'English' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Fluent' })
  @IsString()
  proficiency!: string;
}

class ReferenceDto {
  @ApiProperty({ example: 'English' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Fluent' })
  @IsString()
  email!: string;
  
  @ApiProperty({ example: 'Fluent' })
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Fluent' })
  @IsString()
  organization?: string;

}

class WorkExperienceDto {
  @ApiProperty({ example: 'Frontend Developer' })
  @IsString()
  position!: string;

  @ApiProperty({ example: 'TechCorp Ltd' })
  @IsString()
  company!: string;

  @ApiProperty({ example: '2022-01-01' })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

// ──────────────────────────────────────────────────────────────
// Main DTO for creating an Application Form
// ──────────────────────────────────────────────────────────────

export class CreateApplicationformDto {
 
  // ── Personal Information ─────────────────────────────────────
  @ApiProperty({ example: 'John' })
  @IsString()
  fname!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lname!: string;

  @ApiPropertyOptional({ example: 'Michael' })
  @IsOptional()
  @IsString()
  mname?: string;

  @ApiPropertyOptional({ example: 'Mr' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: '1995-05-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth!: string;

  @ApiPropertyOptional({ example: 'Nigerian' })
  @IsOptional()
  @IsString()
  nationality!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsPhoneNumber('NG') // or remove constraint if international
  phoneNumber!: string;

  @ApiPropertyOptional({ example: '+2348098765432' })
  @IsOptional()
  @IsPhoneNumber('NG')
  alternatePhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address!: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  @IsOptional()
  @IsString()
  city!: string;

  @ApiPropertyOptional({ example: 'Nigeria' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: '100001' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: '12345678901' })
  @IsOptional()
  @IsString()
  nin?: string;

  @ApiPropertyOptional({ example: 'A12345678' })
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  hasDisability!: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  disabilityDetails?: string;

  @ApiProperty({ example: 'Frontend Developer' })
  @IsString()
  positionApplied?: string;

  @ApiPropertyOptional({ example: '2025-03-01' })
  @IsOptional()
  @IsDateString()
  availableStartDate?: string;

  @ApiPropertyOptional({ example: 350000 })
  @IsOptional()
  @IsNumber()
  expectedSalary?: number;

  @ApiPropertyOptional({ enum: WillingToRelocate })
  @IsOptional()
  @IsEnum(WillingToRelocate)
  willingToRelocate?: WillingToRelocate;

  // ── Skills ───────────────────────────────────────────────────
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  technicalSkills?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  softSkills?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  computerSkills?: string;

  // ── Relations (IDs) ──────────────────────────────────────────
  @ApiProperty({ example: 'uuid-of-vacancy' })
  @IsString()
  vacancyId!: string;

  @ApiPropertyOptional({ example: 'uuid-of-gender' })
  @IsOptional()
  @IsString()
  genderId!: string;

  @ApiPropertyOptional({ example: 'uuid-of-marital-status' })
  @IsOptional()
  @IsString()
  marritalStatusId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-state' })
  @IsOptional()
  @IsString()
  stateId?: string;

  // ── Documents (usually URLs after upload) ───────────────────
  @ApiPropertyOptional({ example: 'https://storage.../cv.pdf' })
  @IsOptional()
  @IsUrl()
  cvUrl!: string;

  @ApiPropertyOptional({ example: 'https://storage.../cover.pdf' })
  @IsOptional()
  @IsUrl()
  coverLetterUrl?: string;

  @ApiPropertyOptional({ type: [String], example: ['url1', 'url2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certificatesUrls?: string[];

  @ApiPropertyOptional({ example: 'https://storage.../id.pdf' })
  @IsOptional()
  @IsUrl()
  idDocumentUrl?: string;

  // ── Repeatable sections as JSON ──────────────────────────────
  @ApiPropertyOptional({
    type: [EducationEntryDto],
    example: [{ degree: 'B.Sc', institution: 'UNILAG', year: '2018-2022' }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationEntryDto)
  education?: EducationEntryDto[];

  @ApiPropertyOptional({ type: [Object] })
  @IsOptional()
  @IsArray()
  certifications?: any[]; // Json in Prisma → any[]

  @ApiPropertyOptional({ type: [WorkExperienceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkExperienceDto)
  workExperience?: WorkExperienceDto[];

  @ApiPropertyOptional({
  type: [LanguageEntryDto],
  example: [
    { name: 'English', proficiency: 'Fluent' },
    { name: 'Yoruba', proficiency: 'Native' }
  ]
})
@IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => LanguageEntryDto)
languages?: LanguageEntryDto[];

  @ApiPropertyOptional({
  type: [ReferenceDto],
  example: [
    { name: 'ref full name', email: 'ref email', phone: 'phone', organization: 'Organization' }
  ]
})
@IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => ReferenceDto)
references?: ReferenceDto[];





  // ── Declarations ─────────────────────────────────────────────
  @ApiProperty({ example: true })
  @IsBoolean()
  confirmAccuracy!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  consentDataProcessing!: boolean;

  // Status is usually set by backend
  // @ApiProperty({ enum: EmploymentStatus, default: 'JOB_APPLICANT' })
  // status?: EmploymentStatus;
}



export class UpdateApplicationformDto extends PartialType(CreateApplicationformDto) {
  @IsOptional()
  fname?: string;
  // ... all other fields @IsOptional()
  @IsOptional()
  @IsEnum(EmploymentStatus)
  status?: EmploymentStatus;
}



export class QueryApplicationformDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by fname, lname or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by vacancy ID' })
  @IsOptional()
  @IsString()
  vacancyId?: string;

  @ApiPropertyOptional({ enum: EmploymentStatus })
  @IsOptional()
  @IsEnum(EmploymentStatus)
  status?: EmploymentStatus;

  // Restrict sortBy to actual fields you allow sorting on
  @ApiPropertyOptional({
    enum: [
      'fname',
      'lname',
      'mname',
      'email',
      'phoneNumber',
      'positionApplied',
      'createdAt',
      'updatedAt',
      'status',
      // add any other fields you want to allow
    ] as const,
  })
  @IsOptional()
  @IsString()
  sortBy?:
    | 'fname'
    | 'lname'
    | 'mname'
    | 'email'
    | 'phoneNumber'
    | 'positionApplied'
    | 'createdAt'
    | 'updatedAt'
    | 'status'; // ← union of literals

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}

