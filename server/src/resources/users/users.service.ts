import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
