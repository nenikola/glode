import { Test, TestingModule } from '@nestjs/testing';
import { TransferEquipmentController } from './transfer-equipment.controller';

describe('TransferEquipment Controller', () => {
  let controller: TransferEquipmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferEquipmentController],
    }).compile();

    controller = module.get<TransferEquipmentController>(TransferEquipmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
