import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { ItemStatus } from '@prisma/client';

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
};
const user = {
  id: 1,
  email: 'test1@email.com',
  password: 'salted_password',
  username: 'Testing 1',
  balance: 0,
};
describe('ItemController', () => {
  let controller: ItemController;
  let service: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: {
            create: jest.fn().mockResolvedValue(item),
            findAll: jest.fn().mockResolvedValue([item]),
            findOne: jest.fn().mockResolvedValue(item),
          },
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('[Normal] should create item', async () => {
      expect(
        await service.create(
          {
            duration: '01:36',
            name: 'test',
            startingPrice: 100,
          },
          user,
        ),
      ).toEqual(item);
    });
  });

  describe('findOne', () => {
    it('[Normal] should return item with id', async () => {
      expect(await service.findOne(1)).toEqual(item);
    });
  });

  describe('findAll', () => {
    it('[Normal] should return items', async () => {
      expect(await service.findAll('COMPLETED')).toEqual([item]);
    });
  });
});
