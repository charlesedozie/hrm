import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';


export class UpdateUserDto extends PartialType(CreateUserDto) {}