import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionType } from '@prisma/client';

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
describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([transaction]),
            deposit: jest.fn().mockResolvedValue(transaction),
            bidItem: jest.fn().mockResolvedValue(transaction),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('[Normal] should return transactions', async () => {
      expect(await controller.findAll(1)).toEqual([transaction]);
    });
  });

  describe('deposit', () => {
    it('[Normal] should deposit user balance', async () => {
      expect(await controller.deposit({ amount: 111 }, user)).toEqual(
        transaction,
      );
    });
  });

  describe('bidItem', () => {
    it('[Normal] should bid item', async () => {
      expect(
        await controller.bidItem({ bidAmount: 111, itemId: 1 }, user),
      ).toEqual(transaction);
    });
  });
});
