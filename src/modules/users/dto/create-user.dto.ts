import { ApiProperty } from '@nestjs/swagger';
import { Role, UserStatus } from '@prisma/client';

export class CreateUserDto {
@ApiProperty()
username!: string;

@ApiProperty()
password!: string;

@ApiProperty({ enum: Role })
role?: Role;

@ApiProperty({
enum: UserStatus,
default: UserStatus.ACTIVE,
})
status?: UserStatus = UserStatus.ACTIVE;

employeeId?: string; // optional
staffId?: string;    // optional
}
