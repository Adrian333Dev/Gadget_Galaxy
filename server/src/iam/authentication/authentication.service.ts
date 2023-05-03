import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { HashingService } from '../hashing/hashing.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './auth.dto.ts';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { IActiveUser } from '../interfaces/active-user.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp({ username, email, password }: SignUpDto): Promise<User> {
    const usernameExists = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (usernameExists) throw new ConflictException('Username already exists');

    const emailExists = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (emailExists) throw new ConflictException('Email already exists');

    const hashedPassword = await this.hashingService.hash(password);
    const user = await this.prismaService.user.create({
      data: { username, email, password: hashedPassword },
    });
    return user;
  }

  async signIn({
    email,
    password,
  }: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new UnauthorizedException('Password does not match');

    const isValidPassword = await this.hashingService.compare(
      password,
      user.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException('Password does not match');
    const {
      audience,
      issuer,
      secret,
      accessTokenTtl: expiresIn,
    } = this.jwtConfiguration;
    const accessToken = await this.jwtService.signAsync(
      { sub: user.userId, email: user.email } as IActiveUser,
      { secret, audience, issuer, expiresIn },
    );

    return { accessToken };
  }
}
