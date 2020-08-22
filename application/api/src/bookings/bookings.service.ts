import { Injectable, BadRequestException } from '@nestjs/common';
import { Booking, BookingStatus } from 'app-shared-library';
import { AppService } from '../app.service';
import { Identity, Wallet } from 'fabric-network';
import { Buffer } from 'buffer';
@Injectable()
export class BookingsService {
  async test(
    tspOrgID: string,
    bookingNumber: string,
    userParams: {
      orgID: string;
      identityOptions: { wallet: Wallet; identity: Identity };
    },
  ) {
    const network = await this.appService.getNetworkConnection(
      userParams.orgID,
      userParams.identityOptions,
    );
    const cliOrgEndorsers = network
      .getChannel()
      .getEndorsers(`${userParams.orgID}MSP`);
    const contractResponse = await network
      .getContract('booking')
      .createTransaction('testContractMethod')
      .setEndorsingPeers([...cliOrgEndorsers])
      .submit(userParams.orgID, tspOrgID, bookingNumber);
    return Buffer.from(contractResponse).toString('utf8');
  }
  constructor(private readonly appService: AppService) {}

  async updateStatus(
    newStatus: BookingStatus,
    originalBookingDTO: Booking,
    userParams: {
      orgID: string;
      identityOptions: { wallet: Wallet; identity: Identity };
    },
  ) {
    console.info(newStatus);
    const network = await this.appService.getNetworkConnection(
      userParams.orgID,
      userParams.identityOptions,
    );

    //NOTE: NEEDS REFINEMENT

    const bookingOrgEndorsers = network
      .getChannel()
      .getEndorsers(`${originalBookingDTO.bookingOrgID}MSP`);

    const tspOrgEndorsers = network
      .getChannel()
      .getEndorsers(`${userParams.orgID}MSP`);
    console.info(tspOrgEndorsers.map(e => e.name));
    const endorsers = [...bookingOrgEndorsers, ...tspOrgEndorsers];
    // console.info(
    //   JSON.stringify(originalBookingDTO),
    //   '\n-------------------------------------------',
    // );
    // console.info(
    //   `{"bookingID":"9b262306-e1e5-4ec2-ae0c-a655d1746a8a","bookingOrgID":"ffA","bookingStatus":"SUBMITTED","equipmentData":{"transferEquipmentQuantity":"","transferEquipmentType":"20_FEET_CONTAINER"},"transferData":{"destinationLocation":{"address":{"address":"llll","city":"lllll","country":"llll"},"unlocode":"llll","geoCoordinates":{"lat":0,"lon":0}},"originLocation":{"address":{"address":"lll","city":"llll","country":"llll"},"unlocode":"llll","geoCoordinates":{"lat":0,"lon":0}},"requestedDeparture":""},"transportServiceProviderID":"ocA","transportServiceProviderName":"OCA","uniqueAssociatedTransfersSecret":"9b262306-e1e5-4ec2-ae0c-a655d1746a8a"}`,
    // );

    // console.info(
    //   createHash('sha256')
    //     .update(JSON.stringify(originalBookingDTO))
    //     .digest('base64'),
    //   '\n-------------------------------------------\n',
    //   createHash('sha256')
    //     .update(
    //       `{"bookingID":"9b262306-e1e5-4ec2-ae0c-a655d1746a8a","bookingOrgID":"ffA","bookingStatus":"SUBMITTED","equipmentData":{"transferEquipmentQuantity":"","transferEquipmentType":"20_FEET_CONTAINER"},"transferData":{"destinationLocation":{"address":{"address":"llll","city":"lllll","country":"llll"},"unlocode":"llll","geoCoordinates":{"lat":0,"lon":0}},"originLocation":{"address":{"address":"lll","city":"llll","country":"llll"},"unlocode":"llll","geoCoordinates":{"lat":0,"lon":0}},"requestedDeparture":""},"transportServiceProviderID":"ocA","transportServiceProviderName":"OCA","uniqueAssociatedTransfersSecret":"9b262306-e1e5-4ec2-ae0c-a655d1746a8a"}`,
    //     )
    //     .digest('base64'),
    // );
    // console.info(
    //   `${JSON.stringify(originalBookingDTO)}` ==
    //     `{"bookingID":"9b262306-e1e5-4ec2-ae0c-a655d1746a8a","bookingOrgID":"ffA","bookingStatus":"SUBMITTED","equipmentData":{"transferEquipmentQuantity":"","transferEquipmentType":"20_FEET_CONTAINER"},"transferData":{"destinationLocation":{"address":{"address":"llll","city":"lllll","country":"llll"},"unlocode":"llll","geoCoordinates":{"lat":0,"lon":0}},"originLocation":{"address":{"address":"lll","city":"llll","country":"llll"},"unlocode":"llll","geoCoordinates":{"lat":0,"lon":0}},"requestedDeparture":""},"transportServiceProviderID":"ocA","transportServiceProviderName":"OCA","uniqueAssociatedTransfersSecret":"9b262306-e1e5-4ec2-ae0c-a655d1746a8a"}`,
    // );
    // console.info(
    //   `${JSON.stringify(originalBookingDTO)}`.length,
    //   `{"bookingID":"9b262306-e1e5-4ec2-ae0c-a655d1746a8a","bookingOrgID":"ffA","bookingStatus":"SUBMITTED","equipmentData":{"transferEquipmentQuantity":"","transferEquipmentType":"20_FEET_CONTAINER"},"transferData":{"destinationLocation":{"address":{"address":"llll","city":"lllll","country":"llll"},"unlocode":"llll","geoCoordinates":{"lat":0,"lon":0}},"originLocation":{"address":{"address":"lll","city":"llll","country":"llll"},"unlocode":"llll","geoCoordinates":{"lat":0,"lon":0}},"requestedDeparture":""},"transportServiceProviderID":"ocA","transportServiceProviderName":"OCA","uniqueAssociatedTransfersSecret":"9b262306-e1e5-4ec2-ae0c-a655d1746a8a"}`
    //     .length,
    // );
    // originalBookingDTO = {
    //   ...originalBookingDTO,
    //   transferData: {
    //     originLocation: originalBookingDTO.transferData.originLocation,
    //     destinationLocation:
    //       originalBookingDTO.transferData.destinationLocation,
    //     requestedDeparture: originalBookingDTO.transferData.requestedDeparture,
    //   },
    // };
    const tx = await network
      .getContract('booking')
      .createTransaction('updateBookingStatus')
      .setEndorsingPeers(endorsers);
    const contractResponseRaw = await tx.submit(
      newStatus,
      JSON.stringify(originalBookingDTO),
    );

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
    console.info(JSON.stringify(booking));

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
    console.info(Object.values(booking));

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
