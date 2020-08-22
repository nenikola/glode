import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TransferEquipmentService } from './transfer-equipment.service';
import {
  TransferEquipmentEventDTO,
  TransferEquipment,
} from 'app-shared-library';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('te')
export class TransferEquipmentController {
  constructor(private readonly teService: TransferEquipmentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/events')
  @HttpCode(HttpStatus.CREATED)
  async submitTeEvent(
    @Body() transferEquipmentEventDTO: TransferEquipmentEventDTO,
    @Req() request: Request,
  ) {
    return await this.teService.submitEvent(
      transferEquipmentEventDTO,
      request.user as any,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/associate')
  @HttpCode(HttpStatus.CREATED)
  async associateTransfer(
    @Body()
    associationData: {
      registrationNumber: string;
      tspID: string;
      bookingNumber: string;
    },
    @Req() request: Request,
  ) {
    console.log('bbb', JSON.stringify(associationData, null, 2));
    return await this.teService.associateTransfer(
      associationData,
      request.user as any,
    );
    // throw new Error('Method not implemented.');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createTransferEquipment(
    @Body() transferEquipmentDTO: TransferEquipment,
    @Req() request: Request,
  ) {
    console.log(JSON.stringify(transferEquipmentDTO, null, 2));
    return await this.teService.save(transferEquipmentDTO, request.user as any);
    // throw new Error('Method not implemented.');
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('/:id')
  // @HttpCode(HttpStatus.OK)
  // async getTeByID() {
  //   // @Req() request: Request
  //   throw new Error('Method not implemented.');
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getTeForTransfer(
    // @Query('tspID') tspID: string,
    @Query('bookingNumber') bookingNumber: string,
    @Req() request: Request,
  ) {
    console.log(bookingNumber);

    return await this.teService.getTeForTransfer(
      undefined,
      bookingNumber,
      request.user as any,
    );
    // throw new Error('Method not implemented.');
  }
}
