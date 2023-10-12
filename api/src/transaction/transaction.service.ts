import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction, User } from '@prisma/client';
import { TransactionResponseDto } from './dto/transaction.response';
import { DepositRequestDto } from './dto/deposit.request.dto';
import { BidItemRequestDto } from './dto';
import { ItemService } from '../item/item.service';
import { UserService } from '../user/user.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => ItemService))
    private readonly itemService: ItemService,
    private readonly userService: UserService,
  ) {}

  async create(
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Transaction> {
    return this.prismaService.transaction.create({ data });
  }

  async update(data: Partial<Omit<Transaction, 'id'>>, ids: number[]) {
    return this.prismaService.transaction.updateMany({
      data,
      where: { id: { in: ids } },
    });
  }

  async findAll(userId: number): Promise<TransactionResponseDto[]> {
    return this.prismaService.transaction.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async deposit(data: DepositRequestDto, user: User) {
    const updatedUser = await this.userService.updateBalance(user.id, {
      increment: data.amount,
    });
    return this.create({
      amount: data.amount,
      timestamp: new Date(),
      userId: updatedUser.id,
      type: 'DEPOSIT',
      bidId: undefined,
    });
  }

  async bidItem(data: BidItemRequestDto, user: User) {
    if (user.balance < data.bidAmount)
      throw new BadRequestException(
        `insufficient balance(your balance: ${user.balance})`,
      );
    const item = await this.itemService.findOne(data.itemId);
    if (!item) throw new NotFoundException('item not found');
    if (item.userId === user.id)
      throw new BadRequestException("you can't bid your item");
    if (item.status !== 'ONGOING')
      throw new BadRequestException(
        `item already ${item.status.toLowerCase()}`,
      );
    if (
      typeof item?.maxBid?.bidAmount == 'number' &&
      item.maxBid.bidAmount >= data.bidAmount
    )
      throw new BadRequestException(
        `bid amount must be greater than current max bid ${item.maxBid.bidAmount}`,
      );
    if (item.startingPrice >= data.bidAmount)
      throw new BadRequestException(
        `bid amount must be greater than starting price ${item.startingPrice}`,
      );

    const bid = await this.prismaService.bid.create({
      data: {
        bidAmount: data.bidAmount,
        bidTime: new Date(),
        user: { connect: { id: user.id } },
        status: 'ACTIVE',
        item: { connect: { id: data.itemId } },
      },
      select: {
        id: true,
      },
    });
    const updatedUser = await this.userService.updateBalance(user.id, {
      decrement: data.bidAmount,
    });
    return this.create({
      amount: data.bidAmount,
      timestamp: new Date(),
      userId: updatedUser.id,
      type: 'HOLD',
      bidId: bid.id,
    });
  }
}
