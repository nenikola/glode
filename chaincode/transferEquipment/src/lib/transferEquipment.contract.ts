'use-strict'

import { Contract, Context, } from 'fabric-contract-api';
import { KeyEndorsementPolicy, ClientIdentity, ChaincodeResponse } from "fabric-shim";
import { TransferEquipment } from './transferEquipment.model';
import { Transfer } from './transfer.model';

export class TransferEquipmentContract extends Contract {
    async updateCurrentLocation(ctx: Context,) {

    }

    async addAssociatedTransfer(ctx: Context, registrationNumber: string, transferStr: string) {

        console.info(transferStr);
        const cliOrg = TransferEquipmentContract._getClientOrgId(ctx.clientIdentity);

        const transfer: Transfer = JSON.parse(transferStr);

        const compositeKey: string = ctx.stub.createCompositeKey('te', [registrationNumber]);


        const transferCompositeKey = ctx.stub.createCompositeKey('transfer', [transfer.transportServiceProviderID, transfer.bookingNumber]);
        console.info(`TSPID: ${transfer.transportServiceProviderID} | BOOKINGNUM: ${transfer.bookingNumber}`);

        try {
            const response: ChaincodeResponse = await ctx.stub.invokeChaincode("transfer", ["validateExistingTransfer", transferStr], "glode-channel");
            const validationResults = JSON.parse(Buffer.from(response.payload).toString('utf8'));
            console.info(validationResults);
            if (!validationResults.validated) {
                return { message: `Sent transfer not validated | h1: ${validationResults.hashStr} ::: h2: ${validationResults.pvtHashStr} ||| transferSTR: ${transferStr}` }
            }

        } catch (error) {
            console.info(error);
        }

        let te: TransferEquipment;
        try {
            te = JSON.parse(Buffer.from(await ctx.stub.getState(compositeKey)).toString('utf8'));
        } catch (error) {
            return { status: 400, message: `Could not find ${cliOrg}'s transferEquipment with reg. number [${registrationNumber}]` };
        }

        TransferEquipmentContract._isAuthorized(cliOrg, transfer.transportServiceProviderID, "transfer asignment");



        if (!te.associatedTransferIDs) {
            te.associatedTransferIDs = new Array<string>();
        }
        te.associatedTransferIDs.push(transferCompositeKey);

        await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(te)));

        const message = `Successfully associated transfer [${ctx.stub.splitCompositeKey(transferCompositeKey).attributes.reduce((all, part) => all + part)}] to TE [${cliOrg + registrationNumber}]`;
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

            const ep = new KeyEndorsementPolicy();
            ep.addOrgs("PEER", ctx.clientIdentity.getMSPID());
            await ctx.stub.setStateValidationParameter(compositeKey, ep.getPolicy());

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