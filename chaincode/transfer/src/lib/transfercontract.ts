'use-strict';

import { Contract, Context } from 'fabric-contract-api';
import { ClientIdentity } from 'fabric-shim';
import { Transfer } from 'app-shared-library';
import { createHash } from 'crypto';
import { QueryTransfers } from './queryTransfers';

export class TransferContract extends Contract {
  async validateTransferParticipant(
    ctx: Context,
    tspID: string,
    bookingNumber: string,
    digestToMatch: string,
  ) {
    console.info(`RECIEVED: ,${tspID},${bookingNumber},${digestToMatch}`);
    const { cliOrgID } = TransferContract._getClientOrgId(ctx.clientIdentity);

    const cliOrgCollectionID = TransferContract._getPrivateCollectionString(
      cliOrgID,
    );
    const tspOrgCollectionID = TransferContract._getPrivateCollectionString(
      tspID,
    );

    const compositeKey = ctx.stub.createCompositeKey('transfer', [
      tspID,
      bookingNumber,
    ]);

    const transfer = Buffer.from(
      await ctx.stub.getPrivateData(cliOrgCollectionID, compositeKey),
    ).toString();
    if (!transfer) {
      return {
        digestToMatch: digestToMatch,
        transferIDHash: '',
        validated: false,
      };
    }
    const cliPvtDataObj: Transfer = Transfer.getFromPlainObj(
      JSON.parse(transfer),
    );

    const cliPvtDataHashStr = Buffer.from(
      await ctx.stub.getPrivateDataHash(cliOrgCollectionID, compositeKey),
    ).toString('base64');

    const tspPvtDataHashStr = Buffer.from(
      await ctx.stub.getPrivateDataHash(tspOrgCollectionID, compositeKey),
    ).toString('base64');

    const secretHash = createHash('sha256')
      .update(cliPvtDataObj.associationID)
      .digest('base64');

    console.info(cliPvtDataObj.associationID + ' ' + secretHash);
    return {
      digestToMatch: digestToMatch || secretHash,
      transferIDHash: createHash('sha256')
        .update(tspID + bookingNumber + cliPvtDataObj.associationID)
        .digest('hex'),
      validated:
        cliPvtDataHashStr === tspPvtDataHashStr &&
        (cliPvtDataObj.transportServiceProvider.organizationID === cliOrgID ||
          cliPvtDataObj.participants.find(
            participant => participant.organizationID === cliOrgID,
          )) &&
        (digestToMatch ? digestToMatch === secretHash : true),
    };
  }
  async readTransfer(ctx: Context, tspID: string, bookingNumber: string) {
    const { cliOrgID } = TransferContract._getClientOrgId(ctx.clientIdentity);

    const cliOrgPvtCollectionString = TransferContract._getPrivateCollectionString(
      cliOrgID,
    );

    const compositeKey = ctx.stub.createCompositeKey('transfer', [
      tspID,
      bookingNumber,
    ]);

    const transferStr: string = Buffer.from(
      await ctx.stub.getPrivateData(cliOrgPvtCollectionString, compositeKey),
    ).toString();
    console.log(`READ_TRANSFER_CONTRACT: |${transferStr}|`);

    try {
      const transfer: Transfer = JSON.parse(transferStr);
      if (
        cliOrgID === transfer.transportServiceProvider.organizationID ||
        (transfer.participants &&
          transfer.participants.find(
            participant => participant.organizationID === cliOrgID,
          ))
      ) {
        return JSON.stringify(transfer, null, 2);
      } else {
        console.error(`READ_TRANSFER_CONTRACT: |NotAuthorized|`);
        return JSON.stringify(
          {
            status: 403,
            message: 'You are not authorized to read this transfer!',
          },
          null,
          2,
        );
      }
    } catch (error) {
      if (error.name === SyntaxError.name) {
        console.error(
          `READ_TRANSFER_CONTRACT: |${JSON.stringify(error, null, 2)}|`,
        );
        return JSON.stringify({ status: 404, message: 'Transfer not found' });
      }
    }
  }
  async readAllOrgTransfers(ctx: Context) {
    const { cliOrgID } = TransferContract._getClientOrgId(ctx.clientIdentity);

    let allResults = [];
    try {
      for await (const { value } of ctx.stub.getPrivateDataQueryResult(
        TransferContract._getPrivateCollectionString(cliOrgID),
        `{
          "selector": {
             "bookingNumber": {
                "$ne": null
             }
          }
       }`,
      )) {
        const strValue = Buffer.from(value).toString();
        let record: Transfer = JSON.parse(strValue);
        allResults.push(record);
      }
      return JSON.stringify(allResults, null, 2);
    } catch (error) {
      return JSON.stringify({ status: 404, message: error }, null, 2);
    }
  }
  async queryTransfers(
    ctx: Context,
    transportServiceProviderID: string,
    deparureBefore: string,
    arrivalBefore: string,
  ) {
    return await QueryTransfers.handler(
      ctx,
      transportServiceProviderID,
      deparureBefore,
      arrivalBefore,
    );
  }
  async createTransfer(ctx: Context, transferString: string) {
    const { cliOrgID } = TransferContract._getClientOrgId(ctx.clientIdentity);
    const cliOrgPvtCollectionString = TransferContract._getPrivateCollectionString(
      cliOrgID,
    );

    let newTransfer: Transfer;
    try {
      newTransfer = Transfer.getFromPlainObj(
        JSON.parse(transferString) as Transfer,
      );
    } catch (error) {
      return TransferContract.getReturnMessage(
        400,
        'Bad supplied transfer format.',
      );
    }
    if (cliOrgID !== newTransfer.transportServiceProvider.organizationID) {
      return TransferContract.getReturnMessage(
        403,
        'You are not authorized to read this transfer!',
      );
    }

    const compositeKey: string = ctx.stub.createCompositeKey('transfer', [
      newTransfer.transportServiceProvider.organizationID,
      newTransfer.bookingNumber,
    ]);

    if (
      await this._transferExists(ctx, compositeKey, cliOrgPvtCollectionString)
    ) {
      return TransferContract.getReturnMessage(
        406,
        `Transfer with booking number [${newTransfer.bookingNumber}] already exists!`,
      );
    }

    newTransfer.plannedDeparture = newTransfer.plannedDeparture.getTime() as any;
    newTransfer.plannedArrival = newTransfer.plannedArrival.getTime() as any;
    try {
      await ctx.stub.putPrivateData(
        cliOrgPvtCollectionString,
        compositeKey,
        new Buffer(JSON.stringify(newTransfer)),
      );
      if (newTransfer.participants && newTransfer.participants.length > 0) {
        await this._putTransferToCollections(
          ctx,
          compositeKey,
          newTransfer,
          ...newTransfer.participants.map(participant =>
            TransferContract._getPrivateCollectionString(
              participant.organizationID,
            ),
          ),
        );
      }
    } catch (error) {
      return TransferContract.getReturnMessage(
        500,
        'Internal server error' + JSON.stringify(error, null, 2),
      );
    }
  }

  private async _transferExists(
    ctx: Context,
    compositeKey: string,
    collectionString,
  ) {
    const hash = Buffer.from(
      await ctx.stub.getPrivateDataHash(collectionString, compositeKey),
    ).toString('utf8');
    return hash && hash.length > 0;
  }
  private async _putTransferToCollections(
    ctx: Context,
    compositeKey: string,
    transfer: Transfer,
    ...collections: string[]
  ): Promise<void> {
    await Promise.all(
      collections.map(async collectionString => {
        await ctx.stub.putPrivateData(
          collectionString,
          compositeKey,
          new Buffer(JSON.stringify(transfer)),
        );
      }),
    );
    return;
  }

  static _getPrivateCollectionString(mspID: string) {
    return mspID.endsWith('MSP')
      ? `_implicit_org_${mspID}`
      : `_implicit_org_${mspID}MSP`;
  }
  static _getClientOrgId(
    clientIdentity: ClientIdentity,
  ): { cliOrgID: string; cliMspID: string } {
    const cliMspID: string = clientIdentity.getMSPID();
    const cliOrgID = cliMspID.slice(0, cliMspID.length - 3);
    return {
      cliOrgID,
      cliMspID,
    };
  }
  static getReturnMessage(status: number, message: string): string {
    return JSON.stringify(
      {
        status,
        message,
      },
      null,
      2,
    );
  }
}
