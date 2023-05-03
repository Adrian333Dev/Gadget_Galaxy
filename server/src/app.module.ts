import { Module } from '@nestjs/common';
import { UsersModule } from './resources/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, IamModule],
})
export class AppModule {}
