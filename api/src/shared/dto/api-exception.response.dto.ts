import { ApiResponseProperty } from '@nestjs/swagger';

export class ApiExceptionResponse {
  @ApiResponseProperty()
  statusCode: number;

  @ApiResponseProperty()
  message: string[];

  @ApiResponseProperty()
  timestamp: string;

  @ApiResponseProperty()
  path: string;

  @ApiResponseProperty()
  error: string;
}
