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
import {
  BookingDTO,
  BookingStatus,
} from '../../../shared/dist/booking.dto.model';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}
  @Post('updateStatus')
  @HttpCode(200)
  async updateBookingStatus(
    @Body('status') newStatus: BookingStatus,
    @Body('booking') originalBookingDTO: BookingDTO,
  ) {
    return `Booking created. Payload: ${await this.bookingService.updateStatus(
      newStatus,
      originalBookingDTO,
    )}`;
  }
  @Post()
  @HttpCode(201)
  async createBooking(@Body() bookingDTO: BookingDTO) {
    return `Booking created. Payload: ${await this.bookingService.save(
      bookingDTO,
    )}`;
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
      status: 200,
      message: `Bookings queried. Payload: ${await this.bookingService.getAll()}`,
    };
  }
}
