'use-strict'

import { Contract, Context, } from 'fabric-contract-api';
import { ClientIdentity, ChaincodeResponse, Shim } from "fabric-shim";
import { TransferEquipment, Location } from './transferEquipment.model';

export class TransferEquipmentContract extends Contract {
    async updateCurrentLocation(ctx: Context, registrationNumber: string, tspID: string, bookingNumber: string, locationString: string) {
        let location: Location;
        try {
            location = JSON.parse(locationString);
            if (!location || !location.unlocode) {
                throw new Error("Location UNLOCODE must be specified!")
            }
        } catch (error) {
            return { status: 400, message: `Bad location format :: ${error}` };
        }

        const compositeKey = ctx.stub.createCompositeKey('te', [registrationNumber]);
        let transferEquipment: TransferEquipment;
        try {
            transferEquipment = JSON.parse(Buffer.from(await ctx.stub.getState(compositeKey)).toString('utf8'));
        } catch (error) {
            return { status: 400, message: `Could not find and read TE[${registrationNumber}]` }
        }

        if (!transferEquipment.associatedTransferIDs.find((id) => id === ctx.stub.createCompositeKey('transfer', [tspID, bookingNumber]))) {
            return { status: 400, message: `Specified transfer is not assigned to TE[${registrationNumber}]!` }
        }

        if (!(await TransferEquipmentContract._isAuthorizedTransferParticipant(ctx, tspID, bookingNumber))) {
            return { status: 400, message: "You are not participant of specified transfer!" }
        }

        transferEquipment.currentLocation = location;

        await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(transferEquipment)));
        return { status: 200, message: `Successfully updated TE[${transferEquipment.registrationNumber}] location to Location[${JSON.stringify(location, null, 2)}]` };

    }
    static async _isAuthorizedTransferParticipant(ctx: Context, transferTspID: string, transferBookingNumber: string): Promise<boolean> {
        const response: ChaincodeResponse = await ctx.stub.invokeChaincode("transfer", ["validateTransferParticipant", transferTspID, transferBookingNumber], "glode-channel");
        const validationResults = JSON.parse(Buffer.from(response.payload).toString('utf8'));

        console.info(validationResults);

        return validationResults.validated;

    }

    async addAssociatedTransfer(ctx: Context, registrationNumber: string, tspID: string, bookingNumber: string) {
        console.info(`TSPID: ${tspID} | BOOKING_NUMBER: ${bookingNumber}`);

        const cliOrg = TransferEquipmentContract._getClientOrgId(ctx.clientIdentity);

        TransferEquipmentContract._isAuthorized(cliOrg, tspID, "transfer asignment");

        if (!(await TransferEquipmentContract._isAuthorizedTransferParticipant(ctx, tspID, bookingNumber))) {
            return { status: 400, message: "You are not participant of transfer this TE should be assigned!" }
        }

        const compositeKey: string = ctx.stub.createCompositeKey('te', [registrationNumber]);
        let te: TransferEquipment;
        try {
            te = JSON.parse(Buffer.from(await ctx.stub.getState(compositeKey)).toString('utf8'));
        } catch (error) {
            return { status: 400, message: `Could not find transferEquipment with reg. number [${registrationNumber}]` };
        }

        if (!te.associatedTransferIDs) {
            te.associatedTransferIDs = new Array<string>();
        }
        te.associatedTransferIDs.push(ctx.stub.createCompositeKey('transfer', [tspID, bookingNumber]));

        await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(te)));

        const message = `Successfully associated transfer [${tspID}${bookingNumber}] to TE [${registrationNumber}]`;
        console.info(message);
        return message;
    }

    async createTransferEquipment(ctx: Context, transferEqString: string) {
        const cliOrg = TransferEquipmentContract._getClientOrgId(ctx.clientIdentity);
        const newTransferEquipment: TransferEquipment = JSON.parse(transferEqString);

        TransferEquipmentContract._isAuthorized(cliOrg, newTransferEquipment.ownerID, "TE creation");

        const compositeKey: string = ctx.stub.createCompositeKey('te', [newTransferEquipment.registrationNumber]);

        const existingTE = Buffer.from(await ctx.stub.getState(compositeKey)).toString('utf8');
        if (existingTE && existingTE.length > 0) {
            throw new Error(JSON.stringify({ status: 406, message: `${newTransferEquipment.ownerID} transfer equipment with registration number [${newTransferEquipment.registrationNumber}] already exists!` }));
        }

        try {
            await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(newTransferEquipment)));

            // const ep = new KeyEndorsementPolicy();
            // ep.addOrgs("PEER", ctx.clientIdentity.getMSPID());
            // await ctx.stub.setStateValidationParameter(compositeKey, ep.getPolicy());

            return { status: 201, message: `Successfully created` }
        } catch (error) {
            console.info(`ERROR: ${error}`);
            throw error;
        }

    }

    static _isAuthorized(orgId: string, authorizedOrgId: string, operation?: string): boolean {
        if (orgId !== authorizedOrgId)
            throw new Error(`Not authorized to perform ${(operation && operation.length > 0) ? operation : 'this smart contract'}.`);
        return true;
    }
    static _getClientOrgId(clientIdentity: ClientIdentity): string {
        const mspString: string = clientIdentity.getMSPID();
        return mspString.slice(0, mspString.length - 3);
    }

}