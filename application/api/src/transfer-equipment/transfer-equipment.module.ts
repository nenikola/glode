import { Module } from '@nestjs/common';
import { TransferEquipmentService } from './transfer-equipment.service';
import { TransferEquipmentController } from './transfer-equipment.controller';

@Module({
  providers: [TransferEquipmentService],
  controllers: [TransferEquipmentController],
})
export class TransferEquipmentModule {}
