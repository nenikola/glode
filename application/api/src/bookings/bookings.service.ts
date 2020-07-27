import { Injectable, BadRequestException } from '@nestjs/common';
import {
  BookingDTO,
  BookingStatus,
} from 'app-shared-library/dist/booking.dto.model';
import { AppService } from '../app.service';
import { Gateway } from 'fabric-network';
import { Buffer } from 'buffer';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class BookingsService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly appService: AppService,
  ) {}

  async updateStatus(newStatus: BookingStatus, originalBookingDTO: BookingDTO) {
    const ccp = this.appService.getConnectionProfile(
      originalBookingDTO.transportServiceProviderID,
    );
    const wallet = await this.appService.getWallet();
    const identity = await this.accountsService.getIdentity(
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

    const contractResponseRaw = await network
      .getContract('booking')
      .createTransaction('updateBookingStatus')
      .setEndorsingPeers(endorsers)
      .submit(newStatus, JSON.stringify(originalBookingDTO));
    const contractResponse = JSON.parse(
      Buffer.from(contractResponseRaw).toString('utf8'),
    );
    if (contractResponse.status !== 200) {
      throw new BadRequestException('', contractResponse.message);
    }
    return contractResponse.message;
  }
  async getAll(partyID: string) {
    if (!partyID || partyID.length < 3) {
      throw new Error('Desired organization ID must be provided!');
    }
    const ccp = this.appService.getConnectionProfile(partyID);
    const wallet = await this.appService.getWallet();
    const identity = await this.accountsService.getIdentity(
      `user1@${partyID}`,
      wallet,
    );
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity,
      discovery: { enabled: false, asLocalhost: true },
    });

    const network = await gateway.getNetwork('glode-channel');
    const result = await network
      .getContract('booking')
      .evaluateTransaction('queryOrganizationBookings');
    return JSON.parse(Buffer.from(result).toString());
  }
  async getByID(bookingID: number) {
    throw new Error('Method not implemented.');
  }
  async save(booking: BookingDTO) {
    const ccp = this.appService.getConnectionProfile(booking.bookingOrgID);
    const wallet = await this.appService.getWallet();
    const identity = await this.accountsService.getIdentity(
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
