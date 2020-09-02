'use-strict';

import { Contract, Context } from 'fabric-contract-api';
import { ClientIdentity } from 'fabric-shim';
import { Booking } from 'app-shared-library';
import { CreateBooking } from './createBooking';
import { UpdateBookingStatus } from './updateBookingStatus';
import { QueryBookings } from './queryBookings';

export class BookingContract extends Contract {
  async testContractMethod(
    ctx: Context,
    someOrgID: string,
    tspOrgID: string,
    bookingNumber: string,
  ) {
    const cliOrgID = BookingContract._getClientOrgId(ctx.clientIdentity);
    let newBooking: Booking;
    const compositeKey: string = ctx.stub.createCompositeKey('booking', [
      tspOrgID,
      bookingNumber,
    ]);

    const res = Buffer.from(
      await ctx.stub.getPrivateDataHash(
        BookingContract._getPrivateCollectionString(cliOrgID),
        compositeKey,
      ),
    ).toString('base64');
    return JSON.stringify(res);
  }
  async queryOrganizationBookings(
    ctx: Context,
    bookingOrgID: string,
    transportServiceProviderID: string,
    bookingStatus: string,
    transferEquipmentType: string,
  ) {
    return await QueryBookings.handler(
      ctx,
      bookingOrgID,
      transportServiceProviderID,
      bookingStatus,
      transferEquipmentType,
    );
  }

  async createBooking(ctx: Context, bookingString: string) {
    return await CreateBooking.handler(ctx, bookingString);
  }
  async updateBookingStatus(
    ctx: Context,
    bookingStatusString: string,
    currentBookingString: string,
  ) {
    return await UpdateBookingStatus.handler(
      ctx,
      bookingStatusString,
      currentBookingString,
    );
  }

  static _getPrivateCollectionString(mspID: string) {
    return mspID.endsWith('MSP')
      ? `_implicit_org_${mspID}`
      : `_implicit_org_${mspID}MSP`;
  }
  static _getClientOrgId(clientIdentity: ClientIdentity): string {
    const mspString: string = clientIdentity.getMSPID();
    return mspString.slice(0, mspString.length - 3);
  }
}
