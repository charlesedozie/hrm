import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto'; // adjust import path
import {
IsOptional, IsUUID,
IsString,
IsEnum,
IsNotEmpty, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayFrequency, IndicatorType } from '@prisma/client';
import { MessageType } from '@prisma/client';
import { IsArray, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

// ------------------------------------------------------------------------
// Create DTO - for POST /master-indicators
// ------------------------------------------------------------------------
// src/messages/dto/create-message.dto.ts

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  receiverId!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType; // defaults to DIRECT_MESSAGE in service if omitted
}

// ------------------------------------------------------------------------
// Update DTO - for PATCH /master-indicators/:id
// All fields optional
// ------------------------------------------------------------------------
export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  // You can add extra rules or override examples if needed
}

export class QueryMessageDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fetch a specific vacancy by ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter vacancies by name' })
  @IsOptional()
  @IsString()
  name?: string;
}



export class MarkMessagesReadDto {
  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  messageIds!: string[];
}

// Alternative (single message)
export class MarkMessageReadDto {
  @IsUUID()
  @IsNotEmpty()
  messageId!: string;
}


export class GetConversationQueryDto {
  @IsUUID()
  @IsNotEmpty()
  otherUserId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 30;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;
}