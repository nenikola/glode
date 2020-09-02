import { Context } from 'fabric-contract-api';
import { BookingContract } from '..';
import { Booking, Organization, Location } from 'app-shared-library';
export class CreateBooking {
  static async handler(ctx: Context, bookingString: string) {
    const cliOrgID = BookingContract._getClientOrgId(ctx.clientIdentity);
    let newBooking: Booking;
    try {
      let bookingObj = JSON.parse(bookingString) as Booking;
      newBooking = Booking.getFromPlainObj(bookingObj);
    } catch (error) {
      return {
        status: 400,
        message: 'Supplied booking data wrong format!' + error,
      };
    }
    if (cliOrgID !== newBooking.bookingOrg.organizationID) {
      return { status: 401, message: 'Not authorized to create booking!' };
    }
    const compositeKey: string = ctx.stub.createCompositeKey('booking', [
      newBooking.transportServiceProvider.organizationID,
      newBooking.bookingID,
    ]);

    console.info(`BOOKING:`, JSON.stringify(newBooking));
    console.info(
      `cliORG:`,
      BookingContract._getPrivateCollectionString(cliOrgID),
    );
    console.info(
      `tspORG:`,
      BookingContract._getPrivateCollectionString(
        newBooking.transportServiceProvider.organizationID,
      ),
    );

    await ctx.stub.putPrivateData(
      BookingContract._getPrivateCollectionString(cliOrgID),
      compositeKey,
      new Buffer(JSON.stringify(newBooking)),
    );
    await ctx.stub.putPrivateData(
      BookingContract._getPrivateCollectionString(
        newBooking.transportServiceProvider.organizationID,
      ),
      compositeKey,
      new Buffer(JSON.stringify(newBooking)),
    );

    return { status: 201, message: 'Booking created!' };
  }
}
