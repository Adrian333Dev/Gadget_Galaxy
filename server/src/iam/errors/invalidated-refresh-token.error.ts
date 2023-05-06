// invalidated-refresh-token.error.ts

import { UnauthorizedException } from '@nestjs/common';

export class InvalidatedRefreshTokenError extends UnauthorizedException {
  constructor() {
    super('Invalidated refresh token');
  }
}
