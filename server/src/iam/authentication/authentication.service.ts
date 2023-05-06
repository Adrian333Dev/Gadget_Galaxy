import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigType } from '@nestjs/config';
import { randomUUID } from 'crypto';

import { PrismaService } from 'src/prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';
import { RefreshTokenDto, SignInDto, SignUpDto } from './auth.dto.ts';
import jwtConfig from '../config/jwt.config';
import { IActiveUser } from '../interfaces/active-user.interface';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
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

  async generateTokens({ userId, email }: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<IActiveUser>>(
        userId,
        this.jwtConfiguration.accessTokenTtl,
        { email },
      ),
      this.signToken(userId, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(userId, refreshTokenId);
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { secret, audience, issuer } = this.jwtConfiguration;
      const { sub: userId, refreshTokenId } =
        await this.jwtService.verifyAsync<IActiveUser>(
          refreshTokenDto.refreshToken,
          { secret, audience, issuer },
        );
      const user = await this.prismaService.user.findUnique({
        where: { userId },
      });
      if (!user) throw new UnauthorizedException();
      const isRefreshTokenValid = await this.refreshTokenIdsStorage.validate(
        userId,
        refreshTokenId,
      );
      if (!isRefreshTokenValid) throw new UnauthorizedException();
      else this.refreshTokenIdsStorage.invalidate(userId);

      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
