'use-strict'

import { Contract, Context, } from 'fabric-contract-api';
import { ClientIdentity } from "fabric-shim";
import { createHash, randomBytes } from "crypto";
import { Booking, BookingStatus } from './booking.model';

export class BookingContract extends Contract {
    async createBooking(ctx: Context, bookingString: string) {
        const cliOrgID = BookingContract._getClientOrgId(ctx.clientIdentity);
        let newBooking: Booking;
        try {
            newBooking = new Booking(JSON.parse(bookingString));
        } catch (error) {
            return { status: 400, message: "Supplied booking data wrong format!" + error };
        }
        if (cliOrgID !== newBooking.bookingOrgID) {
            return { status: 401, message: "Not authorized to create booking!" }
        }
        const compositeKey: string = ctx.stub.createCompositeKey('booking', [newBooking.bookingOrgID, newBooking.transportServiceProviderID, newBooking.uniqueAssociatedTransfersSecret]);

        await ctx.stub.putPrivateData(BookingContract._getPrivateCollectionString(cliOrgID), compositeKey, Buffer.from(JSON.stringify(newBooking)));
        await ctx.stub.putPrivateData(BookingContract._getPrivateCollectionString(newBooking.transportServiceProviderID), compositeKey, Buffer.from(JSON.stringify(newBooking)));

        return { status: 201, message: "Booking created!" };
    }
    async updateBookingStatus(ctx: Context, bookingStatusString: string, currentBookingString: string) {
        const cliOrgID = BookingContract._getClientOrgId(ctx.clientIdentity);
        const bookingStatus = BookingStatus[bookingStatusString] || BookingStatus.SUBMITTED;
        // if (bookingStatus !== BookingStatus.APPROVED && bookingStatus !== BookingStatus.REJECTED) {
        //     return { status: 400, message: "Invalid status submitted!" };
        // }
        let currentBooking: Booking;
        try {
            currentBooking = new Booking(JSON.parse(currentBookingString));
        } catch (error) {
            return { status: 400, message: "Supplied booking data wrong format!" };
        }
        if (cliOrgID !== currentBooking.transportServiceProviderID) {
            return { status: 401, message: "Not authorized to update booking status!" };
        }
        if (currentBooking.bookingStatus !== BookingStatus.SUBMITTED) {
            return { status: 400, message: `Current booking status must be ${BookingStatus.SUBMITTED}!` };
        }
        const compositeKey: string = ctx.stub.createCompositeKey('booking', [currentBooking.bookingOrgID, currentBooking.transportServiceProviderID, currentBooking.uniqueAssociatedTransfersSecret]);

        const tspOrgCollectionID = BookingContract._getPrivateCollectionString(currentBooking.transportServiceProviderID);
        const bookingOrgCollectionID = BookingContract._getPrivateCollectionString(currentBooking.bookingID);

        const tspOrgExistingBookingHash: string = Buffer.from(await ctx.stub.getPrivateDataHash(tspOrgCollectionID, compositeKey)).toString('utf8');
        const bookingOrgExistingBookingHash: string = Buffer.from(await ctx.stub.getPrivateDataHash(bookingOrgCollectionID, compositeKey)).toString('utf8');
        const currentBookingHash = createHash('sha256').update(JSON.stringify(currentBooking)).digest('base64');
        console.info(`TSPH: ${tspOrgExistingBookingHash} :: BORGH: ${bookingOrgExistingBookingHash} :: CBDH: ${currentBookingHash}`);

        if (tspOrgExistingBookingHash === bookingOrgExistingBookingHash && tspOrgExistingBookingHash === currentBookingHash) {
            currentBooking.bookingStatus = bookingStatus;
            await ctx.stub.putPrivateData(tspOrgCollectionID, compositeKey, Buffer.from(JSON.stringify(currentBooking)));
            await ctx.stub.putPrivateData(bookingOrgCollectionID, compositeKey, Buffer.from(JSON.stringify(currentBooking)));
            return { status: 200, message: "Booking status updated!" };
        }
        else {
            return { status: 400, message: "Supplied current booking data doesn't exist!" };
        }

    }

    static _getPrivateCollectionString(mspID: string) {
        return mspID.endsWith("MSP") ? `_implicit_org_${mspID}` : `_implicit_org_${mspID}MSP`;
    }
    static _getClientOrgId(clientIdentity: ClientIdentity): string {
        const mspString: string = clientIdentity.getMSPID();
        return mspString.slice(0, mspString.length - 3);
    }
}