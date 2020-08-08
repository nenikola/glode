import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { MissingArgumentsException } from 'src/errors/validation.error';
import { Transfer } from 'app-shared-library';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getAllTransfers(@Req() request: Request) {
    const pTransfers = await this.transfersService.getAllOrgTransfers(
      request.user as any,
    );
    return pTransfers;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:bookingNumber')
  @HttpCode(HttpStatus.OK)
  async getTransferByID(
    @Param('bookingNumber') bookingNumber: string,
    @Query('tspOrgID') tspOrgID: string,
    @Req() request: Request,
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
      request.user as any,
    );
    return transfer;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updateTransfer() {
    // @Param('id') id: string,
    // @Body() updatedTransfer: Transfer,
    // @Req() request: Request,
    throw new Error('Method not implemented.');
  }
}
