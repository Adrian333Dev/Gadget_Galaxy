import { Module } from '@nestjs/common';
import { UsersModule } from './resources/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, PrismaModule],
})
export class AppModule {}
