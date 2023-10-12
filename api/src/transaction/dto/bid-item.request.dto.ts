import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class BidItemRequestDto {
  @IsNumber()
  @ApiProperty()
  itemId: number;

  @IsNumber()
  @ApiProperty()
  bidAmount: number;
}
