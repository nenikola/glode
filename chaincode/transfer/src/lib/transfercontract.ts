'use-strict'

import { Contract, Context } from 'fabric-contract-api';
import { Shim, Iterators } from 'fabric-shim'
import { Transfer } from './transfer.model';

export class TransferContract extends Contract {
    async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const transfer: Transfer[] = [
            {
                bookingNumber: '1234',
                owner: 'ocA',
            },
            {
                bookingNumber: '5678',
                owner: 'ocA',
            },
        ];

        for (let i = 0; i < transfer.length; i++) {
            const compositeKey: string = ctx.stub.createCompositeKey("transfer", [transfer[i].owner, transfer[i].bookingNumber]);
            await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(transfer[i])));
            console.info('Added <--> ', compositeKey, " : ", transfer[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }
    async queryTransfer(ctx: Context, bookingNumber: string): Promise<string> {
        let allResults = [];
        try {
            for await (const { key, value } of ctx.stub.getStateByPartialCompositeKey("transfer", [bookingNumber])) {
                const strValue = Buffer.from(value).toString('utf8');
                console.info("Found <-->", key, " : ", strValue);
                let record: Transfer = JSON.parse(strValue);
                allResults.push({ Key: key, Record: record })
            }
            return JSON.stringify(allResults)
        } catch (error) {
            return error
        }
    }
    // async queryTransferByOwner(ctx, bookingNumber) {

    //     const transferAsBytes = await ctx.stub.getStateByPartialCompositeKey(bookingNumber); // get the transfer from chaincode state
    //     if (!transferAsBytes || transferAsBytes.length === 0) {
    //         throw new Error(`${bookingNumber} does not exist`);
    //     }
    //     console.log(transferAsBytes.toString());
    //     return transferAsBytes.toString();
    // }
}
