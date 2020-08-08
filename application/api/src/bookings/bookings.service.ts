import { Injectable, BadRequestException } from '@nestjs/common';
import { Booking, BookingStatus } from 'app-shared-library';
import { AppService } from '../app.service';
import { Identity, Wallet } from 'fabric-network';
import { Buffer } from 'buffer';

@Injectable()
export class BookingsService {
  constructor(private readonly appService: AppService) {}

  async updateStatus(
    newStatus: BookingStatus,
    originalBookingDTO: Booking,
    userParams: {
      orgID: string;
      identityOptions: { wallet: Wallet; identity: Identity };
    },
  ) {
    const network = await this.appService.getNetworkConnection(
      userParams.orgID,
      userParams.identityOptions,
    );
    const bookingOrgEndorsers = network
      .getChannel()
      .getEndorsers(`${userParams.orgID}MSP`);
    const tspOrgEndorsers = network
      .getChannel()
      .getEndorsers(`${originalBookingDTO.transportServiceProviderID}MSP`);
    const endorsers = [...bookingOrgEndorsers, ...tspOrgEndorsers];

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
  async getAll(userParams: {
    orgID: string;
    identityOptions: { wallet: Wallet; identity: Identity };
  }) {
    if (!userParams.orgID || userParams.orgID.length < 3) {
      throw new Error('Desired organization ID must be provided!');
    }
    const network = await this.appService.getNetworkConnection(
      userParams.orgID,
      userParams.identityOptions,
    );

    const result = await network
      .getContract('booking')
      .evaluateTransaction('queryOrganizationBookings');
    return JSON.parse(Buffer.from(result).toString());
  }
  async save(
    booking: Booking,
    userParams: {
      orgID: string;
      identityOptions: { wallet: Wallet; identity: Identity };
    },
  ) {
    const network = await this.appService.getNetworkConnection(
      userParams.orgID,
      userParams.identityOptions,
    );

    const bookingOrgEndorsers = network
      .getChannel()
      .getEndorsers(`${userParams.orgID}MSP`);
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
  async getByID() {
    // bookingID: number, identityOptions:{wallet:Wallet,identity:Identity}
    throw new Error('Method not implemented.');
  }
}
