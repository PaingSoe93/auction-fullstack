import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { ItemService } from '../item/item.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ItemStatus, TransactionType } from '@prisma/client';

const transaction = {
  amount: 100,
  timestamp: new Date(),
  userId: 1,
  type: TransactionType.HOLD,
  bidId: 1,
};
const user = {
  id: 1,
  email: 'test1@email.com',
  password: 'salted_password',
  username: 'Testing 1',
  balance: 0,
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
  user: user,
};

const mockItemService = {
  findOne: jest.fn(),
};
const mockUserService = {
  updateBalance: jest.fn(),
};
const mockPrismaService = {
  transaction: {
    create: jest.fn(),
    updateMany: jest.fn(),
    findMany: jest.fn(),
  },
  bid: {
    create: jest.fn().mockResolvedValue({ id: 1 }),
  },
};

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let itemService: ItemService;
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: ItemService,
          useValue: mockItemService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
    itemService = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  describe('create', () => {
    it('[Normal] should create transaction', async () => {
      const exp = {
        id: 1,
        ...transaction,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(prismaService.transaction, 'create')
        .mockResolvedValueOnce(exp);

      expect(await transactionService.create(transaction)).toEqual(exp);
    });
  });

  describe('update', () => {
    it('[Normal] should update transactions with ids', async () => {
      const exp = {
        count: 1,
      };
      jest
        .spyOn(prismaService.transaction, 'updateMany')
        .mockResolvedValueOnce(exp);

      expect(await transactionService.update(transaction, [1])).toEqual(exp);
    });
  });

  describe('findAll', () => {
    it('[Normal] should find all user transactions', async () => {
      const exp = [
        { ...transaction, id: 1, createdAt: new Date(), updatedAt: new Date() },
      ];
      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValueOnce(exp);

      expect(await transactionService.findAll(1)).toEqual(exp);
    });
  });

  describe('deposit', () => {
    it('[Normal] should deposit to user balance', async () => {
      const exp = {
        ...transaction,
        id: 1,
        type: TransactionType.DEPOSIT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(prismaService.transaction, 'create')
        .mockResolvedValueOnce(exp);
      jest.spyOn(userService, 'updateBalance').mockResolvedValueOnce({ id: 1 });

      expect(await transactionService.deposit({ amount: 100 }, user)).toEqual(
        exp,
      );
      expect(userService.updateBalance).toHaveBeenCalled();
    });
  });

  describe('bidItem', () => {
    it('[Normal] should bid item with id 1', async () => {
      const exp = {
        id: 1,
        ...transaction,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(itemService, 'findOne').mockResolvedValueOnce(item);
      jest.spyOn(userService, 'updateBalance').mockResolvedValueOnce({ id: 1 });
      jest.spyOn(transactionService, 'create').mockResolvedValueOnce(exp);

      expect(
        await transactionService.bidItem(
          { bidAmount: 110, itemId: 1 },
          { ...user, id: 2, balance: 111 },
        ),
      ).toEqual(exp);
      expect(userService.updateBalance).toHaveBeenCalled();
      expect(transactionService.create).toHaveBeenCalled();
      expect(itemService.findOne).toHaveBeenCalled();
    });

    it('[Error] should throw error for insufficient user balance', async () => {
      expect(
        transactionService.bidItem(
          { bidAmount: 110, itemId: 1 },
          { ...user, id: 2, balance: 100 },
        ),
      ).rejects.toThrow('insufficient balance(your balance: 100');
    });

    it('[Error] should throw error for item not found', async () => {
      jest.spyOn(itemService, 'findOne').mockResolvedValueOnce(null);
      expect(
        transactionService.bidItem(
          { bidAmount: 110, itemId: 1 },
          { ...user, id: 2, balance: 111 },
        ),
      ).rejects.toThrow('item not found');
    });

    it('[Error] should throw error for user self item', async () => {
      jest.spyOn(itemService, 'findOne').mockResolvedValueOnce(item);
      expect(
        transactionService.bidItem(
          { bidAmount: 110, itemId: 1 },
          { ...user, id: 1, balance: 111 },
        ),
      ).rejects.toThrow("you can't bid your item");
    });

    it('[Error] should throw error for not ONGOING status item', async () => {
      jest
        .spyOn(itemService, 'findOne')
        .mockResolvedValueOnce({ ...item, status: ItemStatus.COMPLETED });
      expect(
        transactionService.bidItem(
          { bidAmount: 110, itemId: 1 },
          { ...user, id: 2, balance: 111 },
        ),
      ).rejects.toThrow('item already completed');
    });

    it('[Error] should throw error for bidAmount less than current max bid', () => {
      jest.spyOn(itemService, 'findOne').mockResolvedValueOnce({
        ...item,
        maxBid: {
          bidAmount: 1000,
          bidTime: new Date(),
          id: 1,
          itemId: 1,
          status: 'ACTIVE',
          userId: 10,
        },
      });
      expect(
        transactionService.bidItem(
          { bidAmount: 110, itemId: 1 },
          { ...user, id: 2, balance: 111 },
        ),
      ).rejects.toThrow('bid amount must be greater than current max bid 1000');
    });

    it('[Error] should throw error for less than item starting price and no bid existed on that item', async () => {
      jest.spyOn(itemService, 'findOne').mockResolvedValueOnce({
        ...item,
        startingPrice: 100,
      });
      expect(
        transactionService.bidItem(
          { bidAmount: 10, itemId: 1 },
          { ...user, id: 2, balance: 111 },
        ),
      ).rejects.toThrow('bid amount must be greater than starting price 100');
    });
  });
});
