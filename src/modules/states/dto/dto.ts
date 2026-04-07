// create-beneficiary.dto.ts
import { PartialType, ApiProperty } from '@nestjs/swagger';
import {
  IsString,
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

}

export class UpdateDto extends PartialType(CreateDto) {}