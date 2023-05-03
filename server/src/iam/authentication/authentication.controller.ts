import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { AuthenticationService } from './authentication.service';
import { SignInDto, SignUpDto } from './auth.dto.ts';

@Auth(AuthType.None)
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK) // by default @Post does 201, we wanted 200 - hence using @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    // ! Safer approach is to use a cookie instead of sending the token in the response body
    // @Res({ passthrough: true }) res: Response,
    // const accessToken = await this.authService.signIn(signInDto);
    // res.cookie('accessToken', accessToken, {
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: true,
    // });
    return this.authService.signIn(signInDto);
  }

  // @HttpCode(HttpStatus.OK) // changed since the default is 201
  // @Post('refresh-tokens')
  // refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
  //   return this.authService.refreshTokens(refreshTokenDto);
  // }

  // @Auth(AuthType.Bearer) // 👈 Apply decorator to individual routes
  // @Get('me')
  // async getMe(@Request() req) {
  //   return req.user;
  // }
}
