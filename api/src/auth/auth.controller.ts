import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignUpRequestDto,
  ApiCredentialResponse,
  SignInRequestDto,
} from './dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiExceptionResponse } from '../shared/dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiCreatedResponse({ type: ApiCredentialResponse })
  @ApiBadRequestResponse({ type: ApiExceptionResponse })
  signUp(@Body() data: SignUpRequestDto): Promise<ApiCredentialResponse> {
    return this.authService.signUp(data);
  }

  @Post('sign-in')
  @ApiCreatedResponse({ type: ApiCredentialResponse })
  @ApiBadRequestResponse({ type: ApiExceptionResponse })
  signIn(@Body() data: SignInRequestDto): Promise<ApiCredentialResponse> {
    return this.authService.signIn(data);
  }
}
