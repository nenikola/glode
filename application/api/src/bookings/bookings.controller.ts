import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  UseGuards,
  Req,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { BookingStatus, Booking, Organization } from 'app-shared-library';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('updateStatus')
  @HttpCode(200)
  async updateBookingStatus(
    @Body('status') newStatus: BookingStatus,
    @Body('booking') booking: Booking,
    @Req() request: Request,
  ) {
    console.log(
      '--------------------- UPDATE BOOKING STATUS ------------------',
      newStatus,
      JSON.stringify(booking),
    );

    if (
      (request.user as any).orgID !==
      booking.transportServiceProvider.organizationID
    ) {
      throw new BadRequestException(
        null,
        'You are not allowed to update booking status if you are not TSP!',
      );
    }
    const res = await this.bookingService.updateStatus(
      newStatus,
      booking,
      request.user as any,
    );
    return {
      message: `Booking status updated.`,
      res,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(201)
  async createBooking(@Body() booking: Booking, @Req() request: Request) {
    const res = await this.bookingService.save(booking, request.user as any);
    return {
      message: `Booking created.` + res,
    };
  }
  // @UseGuards(AuthGuard('jwt'))
  // @Get('/test')
  // async test(
  //   @Query('tspOrgID') tspID: string,
  //   @Query('bookingNumber') bookingNumber: string,
  //   @Req() request: Request,
  // ) {
  //   return {
  //     message: `Bookings queried.`,
  //     data: await this.bookingService.test(
  //       tspID,
  //       bookingNumber,
  //       request.user as any,
  //     ),
  //   };
  // }
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getBooking() {
    // @Param('id') bookingID: number, @Req() request: Request
    return {
      status: 200,
      // message: `Booking found. Payload: ${await this.bookingService.getByID(
      //   bookingID,
      //   request.user as any,
      // )}`,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async queryBookings(
    @Req() request: Request,
    @Query('bookingOrgID') bookingOrgID: string,
    @Query('transportServiceProviderID') transportServiceProviderID: string,
    @Query('bookingStatus') bookingStatus: string,
    @Query('transferEquipmentType') transferEquipmentType: string,
  ) {
    return {
      message: `Bookings queried.`,
      data: await this.bookingService.getAll(
        request.user as any,
        bookingOrgID,
        transportServiceProviderID,
        bookingStatus,
        transferEquipmentType,
      ),
    };
  }
}
