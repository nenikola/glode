import { SystemOperationImpl } from './abstract.so';
import { TransfersService } from './transfers.service';
import { MissingArgumentsException } from 'src/errors/validation.error';

export class GetTransferSO extends SystemOperationImpl {
  constructor(
    private readonly bookingNumber: string,
    private readonly tspOrgID: string,
    private readonly transferService: TransfersService,
  ) {
    super();
    this.bookingNumber = bookingNumber;
    this.tspOrgID = tspOrgID;
  }
  validate() {
    if (!this.bookingNumber)
      throw new MissingArgumentsException('Booking number');
    if (!this.tspOrgID) throw new MissingArgumentsException('tspOrg ID');
  }
  execute() {
    this.results = this.transferService.getTransfer(
      this.bookingNumber,
      this.tspOrgID,
      '',
    );
  }
  getResults() {
    return this.results;
  }
}
