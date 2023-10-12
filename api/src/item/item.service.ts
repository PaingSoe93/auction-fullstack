import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common';
import { ItemCreateRequestDto, ItemResponseDto } from './dto';
import {
  Bid,
  BidStatus,
  Item,
  ItemStatus,
  TransactionType,
  User,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ItemService implements OnModuleInit {
  private readonly logger = new Logger(ItemService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    const items = await this.prismaService.item.findMany({
      where: { status: ItemStatus.ONGOING },
    });
    for (const item of items) {
      if (item.endTime.getTime() > Date.now()) this.scheduleCompleteItem(item);
      else await this.completeItem(item);
    }
  }

  async create(
    data: ItemCreateRequestDto,
    user: User,
  ): Promise<ItemResponseDto> {
    const startTime = new Date();
    const [hour, minute] = data.duration.split(':').map((v) => +v);
    if (!hour && !minute) throw new BadRequestException('invalid duration');
    const endTime = new Date(
      startTime.getTime() + (hour * 60 + minute) * 60 * 1000,
    );
    const item = await this.prismaService.item.create({
      data: {
        startTime,
        endTime,
        duration: data.duration,
        name: data.name,
        startingPrice: data.startingPrice,
        user: { connect: { id: user.id } },
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
    });
    this.scheduleCompleteItem(item);
    return item as ItemResponseDto;
  }

  async scheduleCompleteItem(item: Item) {
    const job = new CronJob(item.endTime, async () => {
      await this.completeItem(item);

      if (this.schedulerRegistry.doesExist('cron', item.id.toString()))
        this.schedulerRegistry.deleteCronJob(item.id.toString());
    });
    this.schedulerRegistry.addCronJob(item.id.toString(), job);
    this.logger.log(`item id: ${item.id} added scheduler`);
    job.start();
  }

  async completeItem(item: Item) {
    const bids = await this.prismaService.bid.findMany({
      where: { itemId: item.id },
      orderBy: {
        bidAmount: 'desc',
      },
      include: {
        transactions: true,
      },
    });
    const refundTransactionIds: number[] = [];
    const failedBidIds: number[] = [];
    for (const [index, bid] of bids.entries()) {
      if (index == 0) {
        // max amount bid win user and payout to item owner
        await this.userService.updateBalance(item.userId, {
          increment: bid.bidAmount,
        });
        await this.transactionService.update(
          { type: TransactionType.PAYOUT, timestamp: new Date() },
          bid.transactions.map((v) => v.id),
        );
        await this.prismaService.bid.update({
          where: { id: bid.id },
          data: { status: BidStatus.SUCCESS },
        });
      } else {
        // failed bids refund to users
        await this.userService.updateBalance(bid.userId, {
          increment: bid.bidAmount,
        });
        refundTransactionIds.push(...bid.transactions.map((v) => v.id));
        failedBidIds.push(bid.id);
      }
    }
    if (refundTransactionIds.length) {
      await this.transactionService.update(
        { type: TransactionType.REFUND, timestamp: new Date() },
        refundTransactionIds,
      );
    }
    if (failedBidIds.length) {
      await this.prismaService.bid.updateMany({
        where: { id: { in: failedBidIds } },
        data: { status: BidStatus.FAILED },
      });
    }
    await this.prismaService.item.update({
      where: { id: item.id },
      data: { status: ItemStatus.COMPLETED },
    });
    this.logger.log(`item id: ${item.id} completed`);
  }

  async findAll(status: ItemStatus): Promise<ItemResponseDto[]> {
    const res = await this.prismaService.item.findMany({
      where: {
        status: status || undefined,
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
        bids: {
          orderBy: { bidAmount: 'desc' },
          take: 1,
        },
        _count: {
          select: { bids: true },
        },
      },
    });
    return res.map((item) => this.mapToResponseDto(item));
  }

  async findOne(id: number): Promise<ItemResponseDto> {
    const item = await this.prismaService.item.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, email: true } },
        bids: { orderBy: { bidAmount: 'desc' }, take: 1 },
        _count: {
          select: { bids: true },
        },
      },
    });
    if (!item) throw new NotFoundException('item not found');
    return this.mapToResponseDto(item);
  }

  mapToResponseDto(
    item: Item & {
      user: Pick<User, 'id' | 'username' | 'email'>;
      bids: Bid[];
      _count: {
        bids: number;
      };
    },
  ): ItemResponseDto {
    const {
      bids,
      _count: { bids: bidCount },
      ...rest
    } = item;
    return {
      ...rest,
      maxBid: bids[0] || null,
      bidCount,
    };
  }
}
