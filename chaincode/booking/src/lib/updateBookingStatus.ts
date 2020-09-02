import { Context } from 'fabric-contract-api';
import { BookingContract } from '..';
import {
  Booking,
  BookingStatus,
  BookingStatusNames,
  Transfer,
} from 'app-shared-library';
import { createHash } from 'crypto';

export class UpdateBookingStatus {
  static async handler(
    ctx: Context,
    bookingStatusString: string,
    currentBookingString: string,
  ) {
    const cliOrgID = BookingContract._getClientOrgId(ctx.clientIdentity);
    const bookingStatus = JSON.parse(bookingStatusString) as BookingStatus;

    if (
      bookingStatus.bookingStatusName !== BookingStatusNames.APPROVED &&
      bookingStatus.bookingStatusName !== BookingStatusNames.REJECTED
    ) {
      return { status: 400, message: 'Invalid status submitted!' };
    }

    let currentBooking: Booking;
    try {
      let bookingObj = JSON.parse(currentBookingString) as Booking;
      currentBooking = Booking.getFromPlainObj(bookingObj);
    } catch (error) {
      return { status: 400, message: 'Supplied booking data wrong format!' };
    }

    if (cliOrgID !== currentBooking.transportServiceProvider.organizationID) {
      return {
        status: 401,
        message: 'Not authorized to update booking status!',
      };
    }
    if (
      currentBooking.bookingStatus.bookingStatusName !==
      BookingStatusNames.SUBMITTED
    ) {
      return {
        status: 400,
        message: `Current booking status must be ${BookingStatusNames.SUBMITTED}!`,
      };
    }
    const compositeKey: string = ctx.stub.createCompositeKey('booking', [
      currentBooking.transportServiceProvider.organizationID,
      currentBooking.bookingID,
    ]);

    const tspOrgCollectionID = BookingContract._getPrivateCollectionString(
      currentBooking.transportServiceProvider.organizationID,
    );
    const bookingOrgCollectionID = BookingContract._getPrivateCollectionString(
      currentBooking.bookingOrg.organizationID,
    );

    const tspOrgExistingBookingHash: string = Buffer.from(
      await ctx.stub.getPrivateDataHash(tspOrgCollectionID, compositeKey),
    ).toString('base64');
    const bookingOrgExistingBookingHash: string = Buffer.from(
      await ctx.stub.getPrivateDataHash(bookingOrgCollectionID, compositeKey),
    ).toString('base64');
    const currentBookingHash = createHash('sha256')
      .update(JSON.stringify(currentBooking))
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
      if (bookingStatus.bookingStatusName === BookingStatusNames.APPROVED) {
        const transfer: Transfer = new Transfer(
          currentBooking.associationID,
          currentBooking.bookingID,
          currentBooking.destinationLocation,
          currentBooking.originLocation,
          [currentBooking.bookingOrg],
          currentBooking.requestedArrival,
          currentBooking.requestedDeparture,
          currentBooking.transferEquipmentQuantity,
          currentBooking.transportServiceProvider,
        );
        // {
        //   bookingNumber: currentBooking.bookingID,
        //   participants: [
        //     {
        //       participantID: currentBooking.bookingOrgID,
        //       participantName: currentBooking.bookingOrgID,
        //     },
        //   ],
        //   transferData: {
        //     destinationLocation:
        //       currentBooking.transferData.destinationLocation,
        //     originLocation: currentBooking.transferData.originLocation,
        //     plannedArrival: currentBooking.transferData.requestedArrival
        //       ? (new Date(
        //           currentBooking.transferData.requestedArrival,
        //         ).toISOString() as any)
        //       : undefined,
        //     plannedDeparture: currentBooking.transferData.requestedDeparture
        //       ? (new Date(
        //           currentBooking.transferData.requestedDeparture,
        //         ).toISOString() as any)
        //       : undefined,
        //   },
        //   transferSecret: currentBooking.uniqueAssociatedTransfersSecret,
        //   transferStatus: TransferStatus.WAITING,
        //   transportServiceProviderID: currentBooking.transportServiceProviderID,
        //   transportServiceProviderName:
        //     currentBooking.transportServiceProviderName,
        // };

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
}
