import { ApiProperty } from '@nestjs/swagger';
import { ItemStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ItemFindAllRequestDto {
  @IsEnum(ItemStatus)
  @ApiProperty({ type: String, enum: ItemStatus, default: ItemStatus.ONGOING })
  status: ItemStatus;
}
