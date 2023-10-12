import { ApiProperty } from '@nestjs/swagger';
import { IsMilitaryTime, IsNumber, IsString, Min } from 'class-validator';

export class ItemCreateRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  startingPrice: number;

  @ApiProperty({ example: 'HH:MM' })
  @IsMilitaryTime({
    message: 'duration must be in HH:MM format and less than 24 hour',
  })
  duration: string;
}
