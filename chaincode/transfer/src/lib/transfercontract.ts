'use-strict'

import { Contract, Context, Info } from 'fabric-contract-api';
import { Transfer, TransferStatus, TransferParticipant, ParticipantTransfer, TransferEquipmentData } from './transfer.model';
import { createHash, randomBytes } from "crypto";

export class TransferContract extends Contract {

    // async _updateTransfer(ctx: Context, updatedTransfer: Transfer) {
    //     const tspIDString = updatedTransfer.transportServiceProviderID;
    //     const compositeKey: string = ctx.stub.createCompositeKey('transfer', [tspIDString, updatedTransfer.bookingNumber]);
    //     await ctx.stub.putPrivateData(TransferContract._getPrivateCollectionString(tspIDString), compositeKey, Buffer.from(JSON.stringify(updatedTransfer)));
    // }

    async validateTransferParticipant(ctx: Context, tspID: string, bookingNumber) {
        const cliOrgCollectionID = TransferContract._getPrivateCollectionString(ctx.clientIdentity.getMSPID());
        const tspOrgCollectionID = TransferContract._getPrivateCollectionString(tspID);

        const compositeKey = ctx.stub.createCompositeKey('transferSecret', [tspID, bookingNumber]);

        const cliPvt: ParticipantTransfer = JSON.parse(Buffer.from(await ctx.stub.getPrivateData(cliOrgCollectionID, compositeKey)).toString('utf8'));
        const cliPvtData: ParticipantTransfer = new ParticipantTransfer(cliPvt.bookingNumber, cliPvt.transportServiceProviderID, cliPvt.transferSecret);
        const cliPvtHashStr = createHash('sha256').update(JSON.stringify(cliPvtData)).digest('base64');
        const tspPvtHashStr = Buffer.from(await ctx.stub.getPrivateDataHash(tspOrgCollectionID, compositeKey)).toString('base64');

        return JSON.stringify({
            cliHash: cliPvtHashStr,
            tspHash: tspPvtHashStr,
            validated: cliPvtHashStr === tspPvtHashStr
        })
    }

    async validateExistingTransfer(ctx: Context, transferString: string) {
        const transferObj: Transfer = JSON.parse(transferString);

        const hashStr = createHash('sha256').update(transferString).digest('base64');
        console.info(`MY HASH STR: ${hashStr}`);

        const compositeKey: string = ctx.stub.createCompositeKey('transfer', [transferObj.transportServiceProviderID, transferObj.bookingNumber]);

        const collectionId = TransferContract._getPrivateCollectionString(transferObj.transportServiceProviderID);

        const pvtHash = await ctx.stub.getPrivateDataHash(collectionId, compositeKey);

        const pvtHashStr = Buffer.from(pvtHash).toString('base64');
        console.info(`COLL DATA  HASH STR: ${pvtHashStr}`);

        return JSON.stringify({
            hashStr,
            pvtHashStr,
            validated: hashStr === pvtHashStr

        })




        // collectionSeller := "_implicit_org_" + clientOrgID
        // immutablePropertiesOnChainHash, err := ctx.GetStub().GetPrivateDataHash(collectionSeller, marble.ID)
        // if err != nil {
        //     return fmt.Errorf("failed to read marble private properties hash from seller's collection: %s", err.Error())
        // }
        // if immutablePropertiesOnChainHash == nil {
        //     return fmt.Errorf("marble private properties hash does not exist: %s", marble.ID)
        // }

        // // get sha256 hash of passed immutable properties
        // hash := sha256.New()
        // hash.Write(immutablePropertiesJSON)
        // calculatedPropertiesHash := hash.Sum(nil)

        // // verify that the hash of the passed immutable properties matches the on-chain hash
        // if !bytes.Equal(immutablePropertiesOnChainHash, calculatedPropertiesHash) {
        //     re
    }

    async readTransfer(ctx: Context, tspID: string, bookingNumber: string) {
        // const cliID = ctx.clientIdentity.getID();
        // const funAndParams = ctx.stub.getFunctionAndParameters();
        // console.info(JSON.stringify(cliID, null, 2), JSON.stringify(funAndParams, null, 2));
        const mspString: string = ctx.clientIdentity.getMSPID();
        const cliOrg = mspString.slice(0, mspString.length - 3);

        const compositeKey = ctx.stub.createCompositeKey('transfer', [tspID, bookingNumber]);

        const transferStr: string = Buffer.from(await ctx.stub.getPrivateData(TransferContract._getPrivateCollectionString(tspID), compositeKey)).toString('utf8');
        if (transferStr && transferStr.length > 0) {
            const transfer: Transfer = JSON.parse(transferStr);
            if (cliOrg === transfer.transportServiceProviderID || (transfer.participants && transfer.participants.find(participant => participant.participantID === cliOrg))) {
                return JSON.stringify(transfer, null, 2);
            } else {
                return JSON.stringify({ status: 403, message: "You are not authorized to read this transfer!" }, null, 2);
            }
        }
        return JSON.stringify({ status: 404, message: "Transfer not found" });
    }
    async readAllOrgTransfers(ctx: Context, tspIDstring: string) {
        const mspString: string = ctx.clientIdentity.getMSPID();
        const cliOrg = mspString.slice(0, mspString.length - 3);

        let allResults = [];
        try {
            // for await (const { key, value } of ctx.stub.getStateByPartialCompositeKey('transfer', [transportServiceProviderID])) {
            for await (const { key, value } of ctx.stub.getPrivateDataQueryResult(TransferContract._getPrivateCollectionString(tspIDstring),
                `{
             "selector": {
                "participants": {
                   "$elemMatch": {
                      "participantID": "${cliOrg}"
                   }
                }
             }
          }`)) {
                const strValue = Buffer.from(value).toString('utf8');
                console.info('Found <-->', key, ' : ', strValue);
                let record: Transfer = JSON.parse(strValue);
                allResults.push({ Key: key, Record: record })
            }
            return JSON.stringify(allResults, null, 2);

        } catch (error) {
            return JSON.stringify({ message: error }, null, 2);

        }
    }
    async createTransfer(ctx: Context, transferString: string, transferSecret: string) {
        const mspString: string = ctx.clientIdentity.getMSPID();
        const newTransfer: Transfer = JSON.parse(transferString);

        console.info(`MSP: ${mspString} | Creator: ${ctx.stub.getCreator().mspid} `);
        if (mspString !== `${newTransfer.transportServiceProviderID}MSP`) {
            throw new Error('Not authorized to perform Transfer creation for different organization');
        }

        const compositeKey: string = ctx.stub.createCompositeKey('transfer', [newTransfer.transportServiceProviderID, newTransfer.bookingNumber]);



        const hash = Buffer.from(await ctx.stub.getPrivateDataHash(TransferContract._getPrivateCollectionString(newTransfer.transportServiceProviderID), compositeKey)).toString('utf8');
        console.info(`PRIVATE DATA HASH: ${hash}`);
        if (hash && hash.length > 0) {
            throw new Error(JSON.stringify({ status: 406, message: `${newTransfer.transportServiceProviderID} transfer with booking number [${newTransfer.bookingNumber}] already exists!` }));
        }
        const pTransfer = new ParticipantTransfer(newTransfer.bookingNumber, newTransfer.transportServiceProviderID, transferSecret);

        console.info(`P-TRANSFER: ${JSON.stringify(pTransfer)}`);

        const secretsCompositeKey: string = ctx.stub.createCompositeKey('transferSecret', [newTransfer.transportServiceProviderID, newTransfer.bookingNumber]);

        try {

            await ctx.stub.putPrivateData(TransferContract._getPrivateCollectionString(mspString), compositeKey, Buffer.from(JSON.stringify(newTransfer)));
            await ctx.stub.putPrivateData(TransferContract._getPrivateCollectionString(mspString), secretsCompositeKey, Buffer.from(JSON.stringify(pTransfer)));

            if (newTransfer.participants && newTransfer.participants.length > 0) {


                await Promise.all(newTransfer.participants.map(async participant => {
                    await ctx.stub.putPrivateData(`_implicit_org_${participant.participantID}MSP`, secretsCompositeKey, Buffer.from(JSON.stringify(pTransfer)));
                    console.info(`Participant ${participant.participantID}MSP added`);

                }));
            }
        } catch (error) {
            console.info(`ERROR: ${error}`);
            throw error;
        }
    }
    // async addTransferParticipant(ctx: Context, transferKey: string, participantID: string, participantName: string, role: string,) {
    //     const mspString: string = ctx.clientIdentity.getMSPID();
    //     const compositeKey = ctx.stub.createCompositeKey('transfer', [mspString.slice(0, mspString.length - 3), transferKey]);

    //     const newParticipant: TransferParticipant = {
    //         participantID,
    //         participantName,
    //         role: parseInt(role)
    //     }
    //     const transferStr = await ctx.stub.getPrivateData(TransferContract._getPrivateCollectionString(mspString), compositeKey);
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
    //     await ctx.stub.putPrivateData(TransferContract._getPrivateCollectionString(transfer.transportServiceProviderID), compositeKey, Buffer.from(JSON.stringify(transfer)));

    // }


    async queryAllTransfersByTSP(ctx: Context, transportServiceProviderID: string): Promise<string> {
        let allResults = [];
        try {
            // for await (const { key, value } of ctx.stub.getStateByPartialCompositeKey('transfer', [transportServiceProviderID])) {
            for await (const { key, value } of ctx.stub.getPrivateDataByPartialCompositeKey(`_implicit_org_${ctx.clientIdentity.getMSPID()} `, 'transfer', [])) {
                const strValue = Buffer.from(value).toString('utf8');
                console.info('Found <-->', key, ' : ', strValue);
                let record: Transfer = JSON.parse(strValue);
                allResults.push({ Key: key, Record: record })
            }
            return JSON.stringify(allResults, null, 2);
        } catch (error) {
            return error
        }
    }

    static _getPrivateCollectionString(mspID: string) {
        return mspID.endsWith("MSP") ? `_implicit_org_${mspID}` : `_implicit_org_${mspID}MSP`;
    }

}