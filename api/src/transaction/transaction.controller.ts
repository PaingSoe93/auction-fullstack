import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { User } from '@prisma/client';
import {
  BidItemRequestDto,
  DepositRequestDto,
  TransactionResponseDto,
} from './dto';
import { ApiExceptionResponse } from '../shared/dto';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
@ApiTags('transaction')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOkResponse({ type: [TransactionResponseDto] })
  findAll(
    @CurrentUser('id') userId: number,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionService.findAll(userId);
  }

  @Post('deposit')
  @ApiOkResponse({ type: TransactionResponseDto })
  deposit(
    @Body() data: DepositRequestDto,
    @CurrentUser() user: User,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.deposit(data, user);
  }

  @Post('bid-item')
  @ApiOkResponse({ type: TransactionResponseDto })
  @ApiNotFoundResponse({ type: ApiExceptionResponse })
  bidItem(
    @Body() data: BidItemRequestDto,
    @CurrentUser() user: User,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.bidItem(data, user);
  }
}
