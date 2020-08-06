import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  HttpCode,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingStatus, Booking } from 'app-shared-library';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}
  @Post('updateStatus')
  @HttpCode(200)
  async updateBookingStatus(
    @Body('status') newStatus: BookingStatus,
    @Body('booking') originalBookingDTO: Booking,
  ) {
    const res = await this.bookingService.updateStatus(
      newStatus,
      originalBookingDTO,
    );
    return {
      message: `Booking status updated.`,
      res,
    };
  }
  @Post()
  @HttpCode(201)
  async createBooking(@Body() bookingDTO: Booking) {
    await this.bookingService.save(bookingDTO);
    return {
      message: `Booking created.`,
    };
  }
  @Get('/:id')
  async getBooking(@Param('id') bookingID: number) {
    console.log(`BookingID: ${bookingID}`);

    return {
      status: 200,
      message: `Booking found. Payload: ${await this.bookingService.getByID(
        bookingID,
      )}`,
    };
  }
  @Get()
  async queryBookings(@Query('tspID') tspID: string) {
    console.log(`Requested tsp ID: ${tspID}`);

    return {
      message: `Bookings queried.`,
      data: await this.bookingService.getAll(tspID),
    };
  }
}
