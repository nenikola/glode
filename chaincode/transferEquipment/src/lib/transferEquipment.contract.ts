'use-strict';

import { Contract, Context } from 'fabric-contract-api';
import { ClientIdentity, ChaincodeResponse } from 'fabric-shim';
import {
  TransferEquipment,
  TransferEquipmentEventDTO,
  TransferEquipmentEvent,
  TransferEquipmentEventType,
  Location,
} from 'app-shared-library';
import { GetTEforTransfer } from './getTeForTransfer';
import { GetAvailableTEforTransfer } from './getAvailableTeForTransfer';

export class TransferEquipmentContract extends Contract {
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

    if (!te.associatedTransfersIdHashes) {
      te.associatedTransfersIdHashes = new Array<string>();
    }

    if (!participantAuthResult.validated) {
      return {
        status: 400,
        message:
          'You are not participant of transfer this TE should be assigned!',
      };
    }
    if (
      te.associatedTransfersIdHashes.find(
        idHash => idHash === participantAuthResult.transferIDHash,
      )
    ) {
      return {
        status: 400,
        message: 'Specified transfer already assigned to specified TE!',
      };
    }
    te.associatedTransfersIdHashes.push(participantAuthResult.transferIDHash);

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
    let eventDTO;
    let event: TransferEquipmentEvent;
    try {
      eventDTO = JSON.parse(eventString) as any;
      eventDTO.eventOccuranceTime = new Date(eventDTO.eventOccuranceTime);
      event = new TransferEquipmentEvent(
        eventDTO.registrationNumber + eventDTO.eventOccuranceTime.getTime(),
        TransferEquipmentEventType.getFromPlainObj(
          eventDTO.transferEquipmentEventType,
        ),
        Location.getFromPlainObj(eventDTO.eventLocation),
        eventDTO.eventOccuranceTime,
      );
    } catch (error) {
      console.info(error);
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

    const participantAuthResult = await TransferEquipmentContract._isAuthorizedTransferParticipant(
      ctx,
      eventDTO.associatedTransferData.tspID,
      eventDTO.associatedTransferData.bookingNumber,
      te.uniqueTransfersEquipmentIDHash,
    );
    if (
      !participantAuthResult.validated ||
      !te.associatedTransfersIdHashes.find(
        idHash => idHash === participantAuthResult.transferIDHash,
      )
    ) {
      return {
        status: 401,
        message: `You are not authorized to submit events for specified TE!`,
      };
    }

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
      newTransferEquipment.owner.organizationID,
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
          message: `${newTransferEquipment.owner.organizationID} transfer equipment with registration number [${newTransferEquipment.registrationNumber}] already exists!`,
        }),
      );
    }

    try {
      await ctx.stub.putState(
        compositeKey,
        Buffer.from(JSON.stringify(newTransferEquipment)),
      );

      return { status: 201, message: `Successfully created` };
    } catch (error) {
      console.info(`ERROR: ${error}`);
      throw error;
    }
  }
  async getTEforTransfer(ctx: Context, tspID: string, bookingNumber: string) {
    if (!tspID || !bookingNumber) {
      throw new Error('ArgumentMissingError');
    }
    return await GetTEforTransfer.handler(ctx, tspID, bookingNumber);
  }

  async getAvailableTEforTransfer(
    ctx: Context,
    tspID: string,
    bookingNumber: string,
  ) {
    if (!tspID || !bookingNumber) {
      throw new Error('ArgumentMissingError');
    }
    return await GetAvailableTEforTransfer.handler(ctx, tspID, bookingNumber);
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
