import { Injectable } from '@nestjs/common';
import {
  BookingDTO,
  BookingStatus,
} from '../../../shared/dist/booking.dto.model';
import { AppService } from '../app.service';
import { Gateway } from 'fabric-network';
import { Buffer } from 'buffer';

@Injectable()
export class BookingsService {
  constructor(private readonly appService: AppService) {}

  async updateStatus(newStatus: BookingStatus, originalBookingDTO: BookingDTO) {
    const ccp = this.appService.getConnectionProfile(
      originalBookingDTO.transportServiceProviderID,
    );
    const wallet = await this.appService.getWallet();
    const identity = await this.appService.getIdentity(
      `user1@${originalBookingDTO.transportServiceProviderID}`,
      wallet,
    );
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity,
      discovery: { enabled: false, asLocalhost: true },
    });

    const network = await gateway.getNetwork('glode-channel');
    const bookingOrgEndorsers = network
      .getChannel()
      .getEndorsers(`${originalBookingDTO.bookingOrgID}MSP`);
    const tspOrgEndorsers = network
      .getChannel()
      .getEndorsers(`${originalBookingDTO.transportServiceProviderID}MSP`);
    const endorsers = [...bookingOrgEndorsers, ...tspOrgEndorsers];
    console.log(JSON.stringify(endorsers.map(end => end.name)));

    const contractResponse = await network
      .getContract('booking')
      .createTransaction('updateBookingStatus')
      .setEndorsingPeers(endorsers)
      .submit(newStatus, JSON.stringify(originalBookingDTO));
    return Buffer.from(contractResponse).toString('utf8');
  }
  async getAll() {
    throw new Error('Method not implemented.');
  }
  async getByID(bookingID: number) {
    throw new Error('Method not implemented.');
  }
  async save(booking: BookingDTO) {
    const ccp = this.appService.getConnectionProfile(booking.bookingOrgID);
    const wallet = await this.appService.getWallet();
    const identity = await this.appService.getIdentity(
      `user1@${booking.bookingOrgID}`,
      wallet,
    );
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity,
      discovery: { enabled: false, asLocalhost: true },
    });

    const network = await gateway.getNetwork('glode-channel');
    const bookingOrgEndorsers = network
      .getChannel()
      .getEndorsers(`${booking.bookingOrgID}MSP`);
    const tspOrgEndorsers = network
      .getChannel()
      .getEndorsers(`${booking.transportServiceProviderID}MSP`);

    const contractResponse = await network
      .getContract('booking')
      .createTransaction('createBooking')
      .setEndorsingPeers([...bookingOrgEndorsers, ...tspOrgEndorsers])
      .submit(JSON.stringify(booking));
    return Buffer.from(contractResponse).toString('utf8');
  }
}
