import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Test
  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOneByField(filter: Partial<Omit<User, 'password'>>): Promise<User> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { ...filter },
    });
    return user;
  }

  async create({ username, email, password }: SignUpDto): Promise<User> {
    const usernameExists = await this.prisma.user.findUnique({
      where: { username },
    });
    if (usernameExists) throw new ConflictException('Username already exists');

    const emailExists = await this.prisma.user.findUnique({
      where: { email },
    });
    if (emailExists) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    return user;
  }
}
