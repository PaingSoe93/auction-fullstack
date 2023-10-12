import { ApiResponseProperty } from '@nestjs/swagger';

export class ApiCredentialResponse {
  @ApiResponseProperty()
  access_token: string;
}
