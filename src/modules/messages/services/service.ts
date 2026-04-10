import { Injectable, NotFoundException, BadRequestException, ForbiddenException  } from '@nestjs/common';
import { CreateMessageDto, UpdateMessageDto, QueryMessageDto } from '../dto/dto';
import { Message } from '@prisma/client';
import { Prisma, MessageType } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';


@Injectable()
export class MessageService {
constructor(private prisma: PrismaService) {}

async create(userId: string, dto: CreateMessageDto) {
return this.prisma.message.create({
data: {
senderId: userId,
receiverId: dto.receiverId,
content: dto.content,
type: dto.type ?? MessageType.DIRECT_MESSAGE,
},
include: {
sender: { select: { id: true, username: true } },
receiver: { select: { id: true, username: true } },
},
});
}




  async findConversation(
    currentUserId: string,
    otherUserId: string,
    take = 30,
    skip = 0,
  ) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: {
        sender: { select: { id: true, username: true } },
      },
    });
  }

  async markAsRead(userId: string, messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) throw new NotFoundException('Message not found');
    if (message.receiverId !== userId) throw new ForbiddenException();

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markMultipleAsRead(userId: string, messageIds: string[]) {
    return this.prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  

async update(id: string, data: UpdateMessageDto): Promise<Message> {
  await this.getById(id); // or findUniqueOrThrow, etc.
  const updatePayload = {
    ...data,
  };

  // Optional: remove fields you don't want to update (e.g. if DTO allows partial)
  // delete updatePayload.id; // never update id
  // delete updatePayload.createdAt; // etc.

  return this.prisma.message.update({
    where: { id },
    data: updatePayload,
  });
}



async delete(id: string): Promise<Message> {
await this.getById(id);
return this.prisma.message.delete({ where: { id } });
}

async getById(id: string): Promise<Message> {
const item = await this.prisma.message.findUnique({ where: { id } });
if (!item) throw new NotFoundException('Item not found');
return item;
}

}



