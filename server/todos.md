# TODOs

- [ ] add password confirm to dto.
- [ ] add strong password and password confirm validation to dto.
- [ ] add more details to user dto like first name, last name, email, phone number, etc. (Optional)
- [ ] check for custom validators in nestjs docs.
- [ ] Use `HTTPOnly cookie` approach for authentication.

    ```ts
    import { Response } from 'express';
    
    // ...
    @Post('sign-in')
    async signIn(
      @Body() signInDto: SignInDto,
      @Res() response: Response,
    ) {
    const accessToken = await this.authService.signIn(signInDto);
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    }
    // ...
    ```

    **Note**: checkout `access-token.guard.ts:27`, `authenticaion.controller.ts:20` for necessary changes.
- [ ] complete `auth.controller.ts` and `auth.service.ts`.
