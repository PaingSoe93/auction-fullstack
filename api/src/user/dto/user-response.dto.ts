import { ApiResponseProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  username: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  balance: number;
}
