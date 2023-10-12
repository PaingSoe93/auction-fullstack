import { Module, forwardRef } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ItemModule } from '../item/item.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => ItemModule), UserModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
