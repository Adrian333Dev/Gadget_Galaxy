import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Test
  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(userId: number) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { userId },
    });
    return user;
  }

  async create(data: CreateUserDto) {
    const user = await this.prisma.user.create({ data });
    return user;
  }
}
