'use-strict';

import { Contract, Context } from 'fabric-contract-api';
import { ClientIdentity, ChaincodeResponse } from 'fabric-shim';
import {
  TransferEquipment,
  TransferEquipmentEventDTO,
  TransferEquipmentEvent,
} from 'app-shared-library';

export class TransferEquipmentContract extends Contract {
  // async updateCurrentLocation(ctx: Context, registrationNumber: string, tspID: string, bookingNumber: string, locationString: string) {
  //     let location: Location;
  //     try {
  //         location = JSON.parse(locationString);
  //         if (!location || !location.unlocode) {
  //             throw new Error("Location UNLOCODE must be specified!")
  //         }
  //     } catch (error) {
  //         return { status: 400, message: `Bad location format :: ${error}` };
  //     }

  //     const compositeKey = ctx.stub.createCompositeKey('te', [registrationNumber]);
  //     let transferEquipment: TransferEquipment;
  //     try {
  //         transferEquipment = JSON.parse(Buffer.from(await ctx.stub.getState(compositeKey)).toString('utf8'));
  //     } catch (error) {
  //         return { status: 400, message: `Could not find and read TE[${registrationNumber}]` }
  //     }

  //     if (!transferEquipment.associatedTransferIDs.find((id) => id === ctx.stub.createCompositeKey('transfer', [tspID, bookingNumber]))) {
  //         return { status: 400, message: `Specified transfer is not assigned to TE[${registrationNumber}]!` }
  //     }

  //     if (!(await TransferEquipmentContract._isAuthorizedTransferParticipant(ctx, tspID, bookingNumber))) {
  //         return { status: 400, message: "You are not participant of specified transfer!" }
  //     }

  //     transferEquipment.currentLocation = location;

  //     await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(transferEquipment)));
  //     return { status: 200, message: `Successfully updated TE[${transferEquipment.registrationNumber}] location to Location[${JSON.stringify(location, null, 2)}]` };

  // }

  async addAssociatedTransfer(
    ctx: Context,
    registrationNumber: string,
    tspID: string,
    bookingNumber: string,
  ) {
    console.info(`TSPID: ${tspID} | BOOKING_NUMBER: ${bookingNumber}`);

    const cliOrg = TransferEquipmentContract._getClientOrgId(
      ctx.clientIdentity,
    );

    TransferEquipmentContract._isAuthorized(
      cliOrg,
      tspID,
      'transfer asignment',
    );

    const compositeKey: string = ctx.stub.createCompositeKey('te', [
      registrationNumber,
    ]);
    let te: TransferEquipment;
    try {
      te = JSON.parse(
        Buffer.from(await ctx.stub.getState(compositeKey)).toString('utf8'),
      );
    } catch (error) {
      return {
        status: 400,
        message: `Could not find transferEquipment with reg. number [${registrationNumber}]`,
      };
    }

    const participantAuthResult: {
      digestToMatch: string;
      transferIDHash: string;
      validated: boolean;
    } = await TransferEquipmentContract._isAuthorizedTransferParticipant(
      ctx,
      tspID,
      bookingNumber,
      te.uniqueTransfersEquipmentIDHash
        ? te.uniqueTransfersEquipmentIDHash
        : '',
    );

    if (!te.associatedTransferIdHashs) {
      te.associatedTransferIdHashs = new Array<string>();
    }

    if (!participantAuthResult.validated) {
      return {
        status: 400,
        message:
          'You are not participant of transfer this TE should be assigned!',
      };
    }
    if (
      te.associatedTransferIdHashs.find(
        idHash => idHash === participantAuthResult.transferIDHash,
      )
    ) {
      return {
        status: 400,
        message: 'Specified transfer already assigned to specified TE!',
      };
    }
    te.associatedTransferIdHashs.push(participantAuthResult.transferIDHash);

    if (
      !te.uniqueTransfersEquipmentIDHash ||
      te.uniqueTransfersEquipmentIDHash.length === 0
    ) {
      te.uniqueTransfersEquipmentIDHash = participantAuthResult.digestToMatch;
    }

    await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(te)));

    const message = `Successfully associated transfer [${tspID}${bookingNumber}] to TE [${registrationNumber}]`;
    return {
      status: 200,
      message,
    };
  }
  async submitTransferEquipmentEvent(ctx: Context, eventString: string) {
    let eventDTO: TransferEquipmentEventDTO;
    try {
      eventDTO = JSON.parse(eventString);
    } catch (error) {
      return { status: 400, message: `Submitted event data wrong format` };
    }
    let te: TransferEquipment;
    let teCompositeKey = ctx.stub.createCompositeKey('te', [
      eventDTO.registrationNumber,
    ]);
    try {
      te = JSON.parse(
        Buffer.from(await ctx.stub.getState(teCompositeKey)).toString('utf8'),
      );
    } catch (error) {
      return { status: 404, message: `Could not find specified TE!` };
    }
    // const dtoTransferIdHash = createHash("sha256")
    //   .update(
    //     eventDTO.associatedTransferData.tspID +
    //       eventDTO.associatedTransferData.bookingNumber
    //   )
    //   .digest("base64");
    // if (
    //   !te.associatedTransferIdHashs ||
    //   !te.associatedTransferIdHashs.find(
    //     (transferIDHash) => transferIDHash === dtoTransferIdHash
    //   )
    // ) {
    //   return {
    //     status: 400,
    //     message: `Specified associated transfer not associated with specified TE!`,
    //   };
    // }
    const participantAuthResult = await TransferEquipmentContract._isAuthorizedTransferParticipant(
      ctx,
      eventDTO.associatedTransferData.tspID,
      eventDTO.associatedTransferData.bookingNumber,
      te.uniqueTransfersEquipmentIDHash,
      // ? te.uniqueTransfersEquipmentIDHash
      // : te.uniqueTransfersEquipmentIDHash
    );
    if (
      !participantAuthResult.validated ||
      !te.associatedTransferIdHashs.find(
        idHash => idHash === participantAuthResult.transferIDHash,
      )
    ) {
      return {
        status: 401,
        message: `You are not authorized to submit events for specified TE!`,
      };
    }
    const event: TransferEquipmentEvent = TransferEquipmentEvent.getFromDTO(
      eventDTO,
    );
    if (!te.events) {
      te.events = new Array<TransferEquipmentEvent>();
    }
    te.events.push(event);
    te.currentLocation = event.eventLocation;
    await ctx.stub.putState(teCompositeKey, Buffer.from(JSON.stringify(te)));
    return { status: 200, message: `Succesfully submited TE Event!` };
  }
  async createTransferEquipment(ctx: Context, transferEqString: string) {
    const cliOrg = TransferEquipmentContract._getClientOrgId(
      ctx.clientIdentity,
    );
    const newTransferEquipment: TransferEquipment = JSON.parse(
      transferEqString,
    );

    TransferEquipmentContract._isAuthorized(
      cliOrg,
      newTransferEquipment.ownerID,
      'TE creation',
    );

    const compositeKey: string = ctx.stub.createCompositeKey('te', [
      newTransferEquipment.registrationNumber,
    ]);

    const existingTE = Buffer.from(
      await ctx.stub.getState(compositeKey),
    ).toString('utf8');
    if (existingTE && existingTE.length > 0) {
      throw new Error(
        JSON.stringify({
          status: 406,
          message: `${newTransferEquipment.ownerID} transfer equipment with registration number [${newTransferEquipment.registrationNumber}] already exists!`,
        }),
      );
    }

    try {
      await ctx.stub.putState(
        compositeKey,
        Buffer.from(JSON.stringify(newTransferEquipment)),
      );

      // const ep = new KeyEndorsementPolicy();
      // ep.addOrgs("PEER", ctx.clientIdentity.getMSPID());
      // await ctx.stub.setStateValidationParameter(compositeKey, ep.getPolicy());

      return { status: 201, message: `Successfully created` };
    } catch (error) {
      console.info(`ERROR: ${error}`);
      throw error;
    }
  }
  async getTEforTransfer(ctx: Context, tspID: string, bookingNumber: string) {
    const participantAuthResult = await TransferEquipmentContract._isAuthorizedTransferParticipant(
      ctx,
      tspID,
      bookingNumber,
      '',
    );
    if (!participantAuthResult.validated) {
      return {
        status: 401,
        message: `You are not authorized to read this Transfer's TEs!`,
      };
    }
    let allResults = [];
    try {
      const query = `{
        "selector": {
           "associatedTransferIdHashs": {
              "$elemMatch": {
                 "$eq": "${participantAuthResult.transferIDHash}"
              }
           }
        }
     }`;
      console.info(query);
      // for await (const { key, value } of ctx.stub.getStateByPartialCompositeKey('transfer', [transportServiceProviderID])) {
      for await (const { key, value } of ctx.stub.getQueryResult(query)) {
        const strValue = Buffer.from(value).toString('utf8');
        console.info('Found <-->', key, ' : ', strValue);
        let record: TransferEquipment = JSON.parse(strValue);
        allResults.push(record);
      }
      return JSON.stringify(allResults, null, 2);
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  async getAvailableTEforTransfer(
    ctx: Context,
    tspID: string,
    bookingNumber: string,
  ) {
    const participantAuthResult = await TransferEquipmentContract._isAuthorizedTransferParticipant(
      ctx,
      tspID,
      bookingNumber,
      '',
    );
    if (!participantAuthResult.validated) {
      return {
        status: 401,
        message: `You are not authorized to read this Transfer's TEs!`,
      };
    }
    let allResults = [];
    try {
      const query = `{
        "selector": {
           "$or": [
              {
                "$and":[
                  {
                    "uniqueTransfersEquipmentIDHash": {
                      "$eq": "${participantAuthResult.digestToMatch}"
                    }
                  },
                  {
                    "associatedTransferIdHashs": {
                       "$allMatch": {
                          "$ne": "${participantAuthResult.transferIDHash}"
                       }
                    }
                  }
                ]
              },
              {
                 "uniqueTransfersEquipmentIDHash": {
                    "$exists": false
                 }
              }
           ]
        }
     }`;
      console.info(query);
      // for await (const { key, value } of ctx.stub.getStateByPartialCompositeKey('transfer', [transportServiceProviderID])) {
      for await (const { key, value } of ctx.stub.getQueryResult(query)) {
        const strValue = Buffer.from(value).toString('utf8');
        console.info('Found <-->', key, ' : ', strValue);
        let record: TransferEquipment = JSON.parse(strValue);
        allResults.push(record);
      }
      return JSON.stringify(allResults, null, 2);
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  static async _isAuthorizedTransferParticipant(
    ctx: Context,
    transferTspID: string,
    transferBookingNumber: string,
    digestToMatch: string,
  ): Promise<{
    digestToMatch: string;
    transferIDHash: string;
    validated: boolean;
  }> {
    const response: ChaincodeResponse = await ctx.stub.invokeChaincode(
      'transfer',
      [
        'validateTransferParticipant',
        transferTspID,
        transferBookingNumber,
        digestToMatch,
      ],
      'glode-channel',
    );
    console.info(Buffer.from(response.payload).toString('utf8'));
    let validationResults = JSON.parse(
      Buffer.from(response.payload).toString('utf8'),
    );
    console.info(validationResults);
    return validationResults;
  }

  static _isAuthorized(
    orgId: string,
    authorizedOrgId: string,
    operation?: string,
  ): boolean {
    if (orgId !== authorizedOrgId)
      throw new Error(
        `Not authorized to perform ${
          operation && operation.length > 0 ? operation : 'this smart contract'
        }.`,
      );
    return true;
  }
  static _getClientOrgId(clientIdentity: ClientIdentity): string {
    const mspString: string = clientIdentity.getMSPID();
    return mspString.slice(0, mspString.length - 3);
  }
}
