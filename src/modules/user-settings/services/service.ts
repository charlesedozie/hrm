import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateUserSettingsDto } from '../dto/dto';
import { MasterIndicator } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PaginationDto, SortOrder } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class UserSettingsService {

constructor(private prisma: PrismaService) {}

async getUserSettings(userId: string) {

const settings = await this.prisma.userSettings.findUnique({
where: { userId }
});

if (!settings) {

return await this.prisma.userSettings.create({
data: { userId }
});

}

return settings;

}

async updateSettings(userId: string, dto: UpdateUserSettingsDto) {

const existing = await this.prisma.userSettings.findUnique({
where: { userId }
});

if (existing) {

return this.prisma.userSettings.update({
where: { userId },
data: dto
});

}

return this.prisma.userSettings.create({
data: {
userId,
...dto
}
});

}

}