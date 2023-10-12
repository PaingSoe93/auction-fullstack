import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from './item.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { TransactionService } from '../transaction/transaction.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { BidStatus, Item, ItemStatus, TransactionType } from '@prisma/client';
import { CronJob } from 'cron';

const user = {
  id: 1,
  email: 'test1@email.com',
  password: 'salted_password',
  username: 'Testing 1',
  balance: 0,
};

const bid = {
  id: 1,
  bidAmount: 10,
  bidTime: new Date(),
  status: BidStatus.ACTIVE,
  itemId: 1,
  userId: 1,
  transactions: [
    {
      amount: 100,
      timestamp: new Date(),
      userId: 1,
      type: TransactionType.HOLD,
      bidId: 1,
    },
  ],
};
const item = {
  id: 1,
  name: 'test item',
  startingPrice: 100,
  startTime: new Date(),
  endTime: new Date(Date.now() + 60 * 60 * 10000),
  duration: '2:00',
  status: ItemStatus.ONGOING,
  userId: 1,
  bidCount: 0,
  maxBid: null,
  user,
};

const mockPrismaService = {
  item: {
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  bid: {
    findMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
};
const mockTransactionService = {
  update: jest.fn(),
};
const mockUserService = {
  updateBalance: jest.fn(),
};
const mockSchedulerRegistry = { addCronJob: jest.fn() };

describe('ItemService', () => {
  let itemService: ItemService;
  let prismaService: PrismaService;
  let userService: UserService;
  let transactionService: TransactionService;

  let schedulerRegistry: SchedulerRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        { provide: SchedulerRegistry, useValue: mockSchedulerRegistry },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    itemService = module.get<ItemService>(ItemService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
    transactionService = module.get<TransactionService>(TransactionService);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
  });

  it('should be defined', () => {
    expect(itemService).toBeDefined();
  });

  describe('create', () => {
    it('[Normal] should create item with duration input and schedule for the item completion', async () => {
      const startTime = new Date('2023-10-11T00:00:00.000Z');
      jest.useFakeTimers().setSystemTime(startTime);
      const endTime = new Date('2023-10-11T01:36:00.000Z');
      const itemCreateSpy = jest
        .spyOn(prismaService.item, 'create')
        .mockResolvedValue(item);
      await itemService.create(
        {
          duration: '01:36',
          name: 'test',
          startingPrice: 100,
        },
        user,
      );
      const data = itemCreateSpy.mock.calls[0][0];
      expect(data.data.startTime).toEqual(startTime);
      expect(data.data.endTime).toEqual(endTime);
      expect(data.data.duration).toEqual('01:36');
      expect(schedulerRegistry.addCronJob).toHaveBeenCalled();
      jest.useRealTimers();
    });
  });

  describe('scheduleCompleteItem', () => {
    it('[Normal] should schedule for item completion', async () => {
      await itemService.scheduleCompleteItem(item);
      expect(schedulerRegistry.addCronJob).toHaveBeenCalled();
    });
  });

  describe('completeItem', () => {
    it('[Normal] should complete item', async () => {
      jest
        .spyOn(prismaService.bid, 'findMany')
        .mockResolvedValueOnce([bid, bid, bid]);
      await itemService.completeItem(item);
      expect(prismaService.bid.findMany).toHaveBeenCalled();
      expect(userService.updateBalance).toHaveBeenCalled();
      expect(transactionService.update).toHaveBeenCalled();
      expect(prismaService.bid.update).toHaveBeenCalled();
      expect(prismaService.bid.updateMany).toHaveBeenCalled();
      expect(prismaService.item.update).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('[Normal] should return items', async () => {
      jest
        .spyOn(prismaService.item, 'findMany')
        .mockResolvedValueOnce([
          { ...item, _count: { bids: 0 }, bids: [], user },
        ] as unknown as Item[]);
      jest.spyOn(itemService, 'mapToResponseDto');
      expect(await itemService.findAll('ONGOING')).toEqual([item]);
      expect(prismaService.item.findMany).toHaveBeenCalled();
      expect(itemService.mapToResponseDto).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('[Normal] should return item with request id', async () => {
      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue({
        ...item,
        _count: { bids: 0 },
        bids: [],
        user,
      } as Item);
      jest.spyOn(itemService, 'mapToResponseDto');
      expect(await itemService.findOne(1)).toEqual(item);
      expect(prismaService.item.findUnique).toHaveBeenCalled();
      expect(itemService.mapToResponseDto).toHaveBeenCalled();
    });

    it('[Error] should return error with non existing id', async () => {
      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(null);
      jest.spyOn(itemService, 'mapToResponseDto');
      expect(itemService.findOne(1)).rejects.toThrow('item not found');
      expect(prismaService.item.findUnique).toHaveBeenCalled();
    });
  });

  describe('mapToResponseDto', () => {
    it('[Normal] should map item to response dto', async () => {
      expect(
        itemService.mapToResponseDto({
          ...item,
          _count: { bids: 0 },
          bids: [],
        }),
      ).toEqual(item);
    });
  });
});
