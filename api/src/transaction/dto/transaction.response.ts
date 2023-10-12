import { ApiResponseProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class TransactionResponseDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiResponseProperty()
  amount: number;

  @ApiResponseProperty()
  timestamp: Date;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}
