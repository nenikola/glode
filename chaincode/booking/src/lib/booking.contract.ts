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



    // async _updateTransfer(ctx: Context, updatedTransfer: Transfer) {
    //     const tspIDString = updatedTransfer.transportServiceProviderID;
    //     const compositeKey: string = ctx.stub.createCompositeKey('transfer', [tspIDString, updatedTransfer.bookingNumber]);
    //     await ctx.stub.putPrivateData(BookingContract._getPrivateCollectionString(tspIDString), compositeKey, Buffer.from(JSON.stringify(updatedTransfer)));
    // }

    // async validateTransferParticipant(ctx: Context, tspID: string, bookingNumber: string, digestToMatch: string) {
    //     const cliOrgCollectionID = BookingContract._getPrivateCollectionString(ctx.clientIdentity.getMSPID());
    //     const tspOrgCollectionID = BookingContract._getPrivateCollectionString(tspID);

    //     const compositeKey = ctx.stub.createCompositeKey('transferSecret', [tspID, bookingNumber]);

    //     const cliPvt: ParticipantTransfer = JSON.parse(Buffer.from(await ctx.stub.getPrivateData(cliOrgCollectionID, compositeKey)).toString('utf8'));
    //     const cliPvtData: ParticipantTransfer = new ParticipantTransfer(cliPvt.bookingNumber, cliPvt.transportServiceProviderID, cliPvt.transferSecret);
    //     const cliPvtHashStr = createHash('sha256').update(JSON.stringify(cliPvtData)).digest('base64');
    //     const tspPvtHashStr = Buffer.from(await ctx.stub.getPrivateDataHash(tspOrgCollectionID, compositeKey)).toString('base64');

    //     const secretHash = createHash('sha256').update(cliPvtData.transferSecret).digest('base64');
    //     console.info(`${cliPvtHashStr} :::: ${tspPvtHashStr}`);
    //     console.info(`DIGEST: ${digestToMatch} :: SECRETDIGEST: ${createHash('sha256').update(cliPvtData.transferSecret).digest('base64')} :: SECRET: ${cliPvtData.transferSecret} `);
    //     return {
    //         digestToMatch: digestToMatch || secretHash,
    //         transferIDHash: createHash('sha256').update(tspID + bookingNumber + cliPvtData.transferSecret).digest('base64'),
    //         validated: (cliPvtHashStr === tspPvtHashStr) && ((digestToMatch) ? digestToMatch === secretHash : true),
    //     }
    // }

    // async validateExistingTransfer(ctx: Context, transferString: string) {
    //     const transferObj: Transfer = JSON.parse(transferString);

    //     const hashStr = createHash('sha256').update(transferString).digest('base64');
    //     console.info(`MY HASH STR: ${hashStr}`);

    //     const compositeKey: string = ctx.stub.createCompositeKey('transfer', [transferObj.transportServiceProviderID, transferObj.bookingNumber]);

    //     const collectionId = BookingContract._getPrivateCollectionString(transferObj.transportServiceProviderID);

    //     const pvtHash = await ctx.stub.getPrivateDataHash(collectionId, compositeKey);

    //     const pvtHashStr = Buffer.from(pvtHash).toString('base64');
    //     console.info(`COLL DATA  HASH STR: ${pvtHashStr}`);

    //     return JSON.stringify({
    //         hashStr,
    //         pvtHashStr,
    //         validated: hashStr === pvtHashStr

    //     })

    // }

    // async readTransfer(ctx: Context, tspID: string, bookingNumber: string) {
    //     // const cliID = ctx.clientIdentity.getID();
    //     // const funAndParams = ctx.stub.getFunctionAndParameters();
    //     // console.info(JSON.stringify(cliID, null, 2), JSON.stringify(funAndParams, null, 2));
    //     const mspString: string = ctx.clientIdentity.getMSPID();
    //     const cliOrg = mspString.slice(0, mspString.length - 3);

    //     const compositeKey = ctx.stub.createCompositeKey('transfer', [tspID, bookingNumber]);

    //     const transferStr: string = Buffer.from(await ctx.stub.getPrivateData(BookingContract._getPrivateCollectionString(tspID), compositeKey)).toString('utf8');
    //     if (transferStr && transferStr.length > 0) {
    //         const transfer: Transfer = JSON.parse(transferStr);
    //         if (cliOrg === transfer.transportServiceProviderID || (transfer.participants && transfer.participants.find(participant => participant.participantID === cliOrg))) {
    //             return JSON.stringify(transfer, null, 2);
    //         } else {
    //             return JSON.stringify({ status: 403, message: "You are not authorized to read this transfer!" }, null, 2);
    //         }
    //     }
    //     return JSON.stringify({ status: 404, message: "Transfer not found" });
    // }
    // async readAllOrgTransfers(ctx: Context, tspIDstring: string) {
    //     const mspString: string = ctx.clientIdentity.getMSPID();
    //     const cliOrg = mspString.slice(0, mspString.length - 3);

    //     let allResults = [];
    //     try {
    //         // for await (const { key, value } of ctx.stub.getStateByPartialCompositeKey('transfer', [transportServiceProviderID])) {
    //         for await (const { key, value } of ctx.stub.getPrivateDataQueryResult(BookingContract._getPrivateCollectionString(tspIDstring),
    //             `{
    //          "selector": {
    //             "participants": {
    //                "$elemMatch": {
    //                   "participantID": "${cliOrg}"
    //                }
    //             }
    //          }
    //       }`)) {
    //             const strValue = Buffer.from(value).toString('utf8');
    //             console.info('Found <-->', key, ' : ', strValue);
    //             let record: Transfer = JSON.parse(strValue);
    //             allResults.push({ Key: key, Record: record })
    //         }
    //         return JSON.stringify(allResults, null, 2);

    //     } catch (error) {
    //         return JSON.stringify({ message: error }, null, 2);

    //     }
    // }
    // async createTransfer(ctx: Context, transferString: string, transferSecret: string) {
    //     const mspString: string = ctx.clientIdentity.getMSPID();
    //     const newTransfer: Transfer = JSON.parse(transferString);

    //     console.info(`MSP: ${mspString} | Creator: ${ctx.stub.getCreator().mspid} `);
    //     if (mspString !== `${newTransfer.transportServiceProviderID}MSP`) {
    //         throw new Error('Not authorized to perform Transfer creation for different organization');
    //     }

    //     const compositeKey: string = ctx.stub.createCompositeKey('transfer', [newTransfer.transportServiceProviderID, newTransfer.bookingNumber]);

    //     const hash = Buffer.from(await ctx.stub.getPrivateDataHash(BookingContract._getPrivateCollectionString(newTransfer.transportServiceProviderID), compositeKey)).toString('utf8');
    //     console.info(`PRIVATE DATA HASH: ${hash}`);
    //     if (hash && hash.length > 0) {
    //         throw new Error(JSON.stringify({ status: 406, message: `${newTransfer.transportServiceProviderID} transfer with booking number [${newTransfer.bookingNumber}] already exists!` }));
    //     }
    //     const pTransfer = new ParticipantTransfer(newTransfer.bookingNumber, newTransfer.transportServiceProviderID, transferSecret);

    //     console.info(`P-TRANSFER: ${JSON.stringify(pTransfer)}`);

    //     const secretsCompositeKey: string = ctx.stub.createCompositeKey('transferSecret', [newTransfer.transportServiceProviderID, newTransfer.bookingNumber]);

    //     try {

    //         await ctx.stub.putPrivateData(BookingContract._getPrivateCollectionString(mspString), compositeKey, Buffer.from(JSON.stringify(newTransfer)));
    //         await ctx.stub.putPrivateData(BookingContract._getPrivateCollectionString(mspString), secretsCompositeKey, Buffer.from(JSON.stringify(pTransfer)));

    //         if (newTransfer.participants && newTransfer.participants.length > 0) {
    //             await Promise.all(newTransfer.participants.map(async participant => {
    //                 await ctx.stub.putPrivateData(`_implicit_org_${participant.participantID}MSP`, secretsCompositeKey, Buffer.from(JSON.stringify(pTransfer)));
    //                 console.info(`Participant ${participant.participantID}MSP added`);

    //             }));
    //         }
    //     } catch (error) {
    //         console.info(`ERROR: ${error}`);
    //         throw error;
    //     }
    // }
    // async addTransferParticipant(ctx: Context, transferKey: string, participantID: string, participantName: string, role: string,) {
    //     const mspString: string = ctx.clientIdentity.getMSPID();
    //     const compositeKey = ctx.stub.createCompositeKey('transfer', [mspString.slice(0, mspString.length - 3), transferKey]);

    //     const newParticipant: TransferParticipant = {
    //         participantID,
    //         participantName,
    //         role: parseInt(role)
    //     }
    //     const transferStr = await ctx.stub.getPrivateData(BookingContract._getPrivateCollectionString(mspString), compositeKey);
    //     const strValue = Buffer.from(transferStr).toString('utf8');
    //     let transfer: Transfer = JSON.parse(strValue);

    //     if (transfer.participants?.find(participant => participantID === newParticipant.participantID)) {
    //         throw Error("Participant already added!");
    //     }
    //     else {
    //         if (transfer.participants) {
    //             transfer.participants.push(newParticipant);
    //         } else {
    //             transfer.participants = [newParticipant];
    //         }
    //     }
    //     const newParticipantTransfer: ParticipantTransfer = {
    //         bookingNumber: transfer.bookingNumber,
    //         transportServiceProviderID: transfer.transportServiceProviderID,
    //         equipmentData: transfer.equipmentData
    //     }

    //     // await ctx.stub.invokeChaincode("transfer", ["updateNewParticipant", newParticipant.participantID, JSON.stringify(newParticipantTransfer)], "glode-channel");
    //     await ctx.stub.putPrivateData(BookingContract._getPrivateCollectionString(transfer.transportServiceProviderID), compositeKey, Buffer.from(JSON.stringify(transfer)));

    // }


    // async queryAllTransfersByTSP(ctx: Context, transportServiceProviderID: string): Promise<string> {
    //     let allResults = [];
    //     try {
    //         // for await (const { key, value } of ctx.stub.getStateByPartialCompositeKey('transfer', [transportServiceProviderID])) {
    //         for await (const { key, value } of ctx.stub.getPrivateDataByPartialCompositeKey(`_implicit_org_${ctx.clientIdentity.getMSPID()} `, 'transfer', [])) {
    //             const strValue = Buffer.from(value).toString('utf8');
    //             console.info('Found <-->', key, ' : ', strValue);
    //             let record: Transfer = JSON.parse(strValue);
    //             allResults.push({ Key: key, Record: record })
    //         }
    //         return JSON.stringify(allResults, null, 2);
    //     } catch (error) {
    //         return error
    //     }
    // }

    static _getPrivateCollectionString(mspID: string) {
        return mspID.endsWith("MSP") ? `_implicit_org_${mspID}` : `_implicit_org_${mspID}MSP`;
    }
    static _getClientOrgId(clientIdentity: ClientIdentity): string {
        const mspString: string = clientIdentity.getMSPID();
        return mspString.slice(0, mspString.length - 3);
    }
}