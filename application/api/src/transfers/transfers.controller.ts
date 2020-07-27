import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { Transfer } from 'app-shared-library/dist/transfer.dto.model';
import { MissingArgumentsException } from 'src/errors/validation.error';
// import { GetTransferSO } from './getTransfer.so';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get('/')
  async getAllTransfers(@Query('orgID') orgID: string) {
    if (!orgID || orgID.length < 3) {
      throw new MissingArgumentsException('orgID');
    }
    const pTransfers = await this.transfersService.getAllOrgTransfers(orgID);
    return pTransfers;
  }

  @Get('/:bookingNumber')
  @HttpCode(HttpStatus.OK)
  async getTransferByID(
    @Param('bookingNumber') bookingNumber: string,
    @Query('tspOrgID') tspOrgID: string,
  ) {
    if (!bookingNumber) {
      throw new MissingArgumentsException('booking number');
    }
    if (!tspOrgID) {
      throw new MissingArgumentsException('tspOrg ID');
    }

    const transfer: Transfer = await this.transfersService.getTransfer(
      bookingNumber,
      tspOrgID,
      'ffA',
    );
    return transfer;

    // return new GetTransferSO(
    //   bookingNumber,
    //   tspOrgID,
    //   this.transfersService,
    // ).getResults();
  }

  @Put('/:id')
  async updateTransfer(
    @Param('id') id: string,
    @Body() updatedTransfer: Transfer,
  ) {}
}
