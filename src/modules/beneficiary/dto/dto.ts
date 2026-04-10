// create-beneficiary.dto.ts
import { PartialType, ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class CreateDto {
  @ApiProperty({
    description: 'Full name of the beneficiary (required)',
    example: 'Aisha Ibrahim',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  name!: string;

    @ApiProperty({
    description: 'Unique ID (required)',
    example: 'BEN-201, 08030000000',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  benId!: string;

  @ApiProperty({
    description: 'UUID of the gender from the Gender lookup table',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  genderId?: string;          // ← changed from gender?: Gender

  // If you also want to accept the gender name (for convenience / auto-create)
  // (not recommended for strict APIs, but useful in some admin flows)
  // @ApiProperty({ description: 'Gender name (will be looked up or created)', example: 'Female', required: false })
  // @IsString()
  // @IsOptional()
  // genderName?: string;

  @ApiProperty({
    description: 'Type/category of beneficiary. Defaults to WIDOW if omitted.',
    enum: ['WIDOW', 'ORPHAN', 'ELDERLY', /* ... other BeneficiaryType values */],
    default: 'WIDOW',
    example: 'ORPHAN',
    required: false,
  })
  @IsOptional() // assuming BeneficiaryType is still an enum
  beneficiaryType?: string; // or keep BeneficiaryType if still using enum

  @ApiProperty({
    description: 'Date of birth (ISO date string: YYYY-MM-DD)',
    type: 'string',
    format: 'date',
    example: '1995-03-15',
    required: false,
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  dob?: string;

  @ApiProperty({
    description: 'Phone number (Nigerian format recommended)',
    example: '+2348012345678',
  })
  @IsPhoneNumber('NG')
  @IsString()
  phone!: string;

  @ApiProperty({
    description: 'Full residential address',
    example: '12 Adeola Odeku Street, Victoria Island',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @Length(5, 200)
  address!: string;

  @ApiProperty({
    description: 'City or town',
    example: 'Ikeja',
    required: false,
  })
  @IsString()
  @Length(2, 100)
  @IsOptional()
  city?: string;

    @ApiProperty({
    description: 'Photo',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

      @ApiProperty({
    description: 'Photo',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

      @ApiProperty({
    description: 'Photo',
    required: false,
  })
  @IsString()
  @IsOptional()
  originalName?: string;

  @ApiProperty({
    description: 'UUID of the Nigerian state',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  stateId!: string;

    @ApiProperty({
    description: 'UUID of the LGD',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  lgaId?: string;
}

export class UpdateDto extends PartialType(CreateDto) {}