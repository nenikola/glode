'use-strict';

import { Contract, Context } from 'fabric-contract-api';
import { ClientIdentity } from 'fabric-shim';
import { createHash } from 'crypto';
import {
  Transfer,
  TransferStatus,
  TransferRole,
  Booking,
  BookingStatus,
} from 'app-shared-library';

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
  async queryOrganizationBookings(ctx: Context) {
    const cliOrgID = BookingContract._getClientOrgId(ctx.clientIdentity);
    let allResults = [];
    try {
      const query = `{
        "selector": {
           "_id": {
              "$gt": null
           },
           "$or": [
              {
                 "bookingOrgID": "${cliOrgID}"
              },
              {
                 "transportServiceProviderID": "${cliOrgID}"
              }
           ]
        }
     }`;
      console.info(query);
      // for await (const { key, value } of ctx.stub.getStateByPartialCompositeKey('transfer', [transportServiceProviderID])) {
      for await (const { key, value } of ctx.stub.getPrivateDataQueryResult(
        `_implicit_org_${ctx.clientIdentity.getMSPID()}`,
        query,
      )) {
        const strValue = Buffer.from(value).toString('utf8');
        console.info('Found <-->', key, ' : ', strValue);
        let record: Booking = JSON.parse(strValue);
        allResults.push(record);
      }
      return JSON.stringify(allResults, null, 2);
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async createBooking(ctx: Context, bookingString: string) {
    const cliOrgID = BookingContract._getClientOrgId(ctx.clientIdentity);
    let newBooking: Booking;
    try {
      newBooking = JSON.parse(bookingString) as Booking;
    } catch (error) {
      return {
        status: 400,
        message: 'Supplied booking data wrong format!' + error,
      };
    }
    if (cliOrgID !== newBooking.bookingOrgID) {
      return { status: 401, message: 'Not authorized to create booking!' };
    }
    const compositeKey: string = ctx.stub.createCompositeKey('booking', [
      newBooking.transportServiceProviderID,
      newBooking.uniqueAssociatedTransfersSecret,
    ]);

    await ctx.stub.putPrivateData(
      BookingContract._getPrivateCollectionString(cliOrgID),
      compositeKey,
      new Buffer(bookingString),
    );
    await ctx.stub.putPrivateData(
      BookingContract._getPrivateCollectionString(
        newBooking.transportServiceProviderID,
      ),
      compositeKey,
      Buffer.from(bookingString),
    );

    return { status: 201, message: 'Booking created!' };
  }
  async updateBookingStatus(
    ctx: Context,
    bookingStatusString: string,
    currentBookingString: string,
  ) {
    const cliOrgID = BookingContract._getClientOrgId(ctx.clientIdentity);
    const bookingStatus =
      BookingStatus[bookingStatusString] || BookingStatus.SUBMITTED;
    if (
      bookingStatus !== BookingStatus.APPROVED &&
      bookingStatus !== BookingStatus.REJECTED
    ) {
      return { status: 400, message: 'Invalid status submitted!' };
    }
    let currentBooking: Booking;
    try {
      currentBooking = JSON.parse(currentBookingString);
    } catch (error) {
      return { status: 400, message: 'Supplied booking data wrong format!' };
    }
    if (cliOrgID !== currentBooking.transportServiceProviderID) {
      return {
        status: 401,
        message: 'Not authorized to update booking status!',
      };
    }
    if (currentBooking.bookingStatus !== BookingStatus.SUBMITTED) {
      return {
        status: 400,
        message: `Current booking status must be ${BookingStatus.SUBMITTED}!`,
      };
    }
    const compositeKey: string = ctx.stub.createCompositeKey('booking', [
      currentBooking.transportServiceProviderID,
      currentBooking.uniqueAssociatedTransfersSecret,
    ]);

    const tspOrgCollectionID = BookingContract._getPrivateCollectionString(
      currentBooking.transportServiceProviderID,
    );
    const bookingOrgCollectionID = BookingContract._getPrivateCollectionString(
      currentBooking.bookingOrgID,
    );

    const tspOrgExistingBookingHash: string = Buffer.from(
      await ctx.stub.getPrivateDataHash(tspOrgCollectionID, compositeKey),
    ).toString('base64');
    const bookingOrgExistingBookingHash: string = Buffer.from(
      await ctx.stub.getPrivateDataHash(bookingOrgCollectionID, compositeKey),
    ).toString('base64');
    const currentBookingHash = createHash('sha256')
      .update(new Buffer(currentBookingString))
      .digest('base64');
    console.info(
      `TSPH: ${tspOrgExistingBookingHash} :: BORGH: ${bookingOrgExistingBookingHash} :: CBDH: ${currentBookingHash}`,
    );

    if (
      tspOrgExistingBookingHash === bookingOrgExistingBookingHash &&
      tspOrgExistingBookingHash === currentBookingHash
    ) {
      currentBooking.bookingStatus = bookingStatus;
      await ctx.stub.putPrivateData(
        tspOrgCollectionID,
        compositeKey,
        Buffer.from(JSON.stringify(currentBooking)),
      );
      await ctx.stub.putPrivateData(
        bookingOrgCollectionID,
        compositeKey,
        Buffer.from(JSON.stringify(currentBooking)),
      );
      if (bookingStatus === BookingStatus.APPROVED) {
        const transfer: Transfer = {
          bookingNumber: currentBooking.bookingID,
          participants: [
            {
              role: TransferRole.TRANSPORT_SERVICE_BUYER,
              participantID: currentBooking.bookingOrgID,
              participantName: currentBooking.bookingOrgID,
            },
          ],
          transferData: {
            destinationLocation:
              currentBooking.transferData.destinationLocation,
            originLocation: currentBooking.transferData.originLocation,
            plannedArrival: currentBooking.transferData.requestedArrival
              ? (new Date(
                  currentBooking.transferData.requestedArrival,
                ).toISOString() as any)
              : undefined,
            plannedDeparture: currentBooking.transferData.requestedDeparture
              ? (new Date(
                  currentBooking.transferData.requestedDeparture,
                ).toISOString() as any)
              : undefined,
          },
          transferSecret: currentBooking.uniqueAssociatedTransfersSecret,
          transferStatus: TransferStatus.WAITING,
          transportServiceProviderID: currentBooking.transportServiceProviderID,
          transportServiceProviderName:
            currentBooking.transportServiceProviderName,
        };

        console.log(`PASSED: ${JSON.stringify(transfer)}`);

        const transferCreationResults = await ctx.stub.invokeChaincode(
          'transfer',
          ['createTransfer', JSON.stringify(transfer)],
          'glode-channel',
        );
        console.info(JSON.stringify(transferCreationResults));
      }
      return { status: 200, message: 'Booking status updated!' };
    } else {
      return {
        status: 400,
        message: "Supplied current booking data doesn't exist!",
      };
    }
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
