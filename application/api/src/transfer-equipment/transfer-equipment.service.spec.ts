import { Test, TestingModule } from '@nestjs/testing';
import { TransferEquipmentService } from './transfer-equipment.service';

describe('TransferEquipmentService', () => {
  let service: TransferEquipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferEquipmentService],
    }).compile();

    service = module.get<TransferEquipmentService>(TransferEquipmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
