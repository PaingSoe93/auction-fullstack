import { ApiResponseProperty, OmitType } from '@nestjs/swagger';
import { ItemCreateRequestDto } from './item-create.request.dto';
import { BidStatus, ItemStatus } from '@prisma/client';
import { UserResponseDto } from '../../user/dto';

export class BidResponseDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  bidAmount: number;

  @ApiResponseProperty()
  bidTime: Date;

  @ApiResponseProperty({ enum: BidStatus })
  status: BidStatus;

  @ApiResponseProperty()
  itemId: number;

  @ApiResponseProperty()
  userId: number;
}

export class ItemResponseDto extends ItemCreateRequestDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty({ enum: ItemStatus })
  status: ItemStatus;

  @ApiResponseProperty()
  userId: number;

  @ApiResponseProperty()
  startTime: Date;

  @ApiResponseProperty()
  endTime: Date;

  @ApiResponseProperty({ type: OmitType(UserResponseDto, ['balance']) })
  user: Omit<UserResponseDto, 'balance'>;

  @ApiResponseProperty({ type: BidResponseDto })
  maxBid?: BidResponseDto;

  @ApiResponseProperty()
  bidCount: number;
}
