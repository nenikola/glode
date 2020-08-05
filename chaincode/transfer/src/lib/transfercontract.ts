"use-strict";

import { Contract, Context } from "fabric-contract-api";
import { ClientIdentity } from "fabric-shim";
import { Transfer } from "./transfer.model";
import { createHash } from "crypto";

export class TransferContract extends Contract {
  async validateTransferParticipant(
    ctx: Context,
    tspID: string,
    bookingNumber: string,
    digestToMatch: string
  ) {
    const { cliOrgID } = TransferContract._getClientOrgId(ctx.clientIdentity);

    const cliOrgCollectionID = TransferContract._getPrivateCollectionString(
      cliOrgID
    );
    const tspOrgCollectionID = TransferContract._getPrivateCollectionString(
      tspID
    );

    const compositeKey = ctx.stub.createCompositeKey("transfer", [
      tspID,
      bookingNumber,
    ]);

    const cliPvtDataObj: Transfer = JSON.parse(
      Buffer.from(
        await ctx.stub.getPrivateData(cliOrgCollectionID, compositeKey)
      ).toString()
    );

    const cliPvtDataHashStr = Buffer.from(
      await ctx.stub.getPrivateDataHash(cliOrgCollectionID, compositeKey)
    ).toString("base64");

    const tspPvtDataHashStr = Buffer.from(
      await ctx.stub.getPrivateDataHash(tspOrgCollectionID, compositeKey)
    ).toString("base64");

    const secretHash = createHash("sha256")
      .update(cliPvtDataObj.transferSecret)
      .digest("base64");

    return {
      digestToMatch: digestToMatch || secretHash,
      transferIDHash: createHash("sha256")
        .update(tspID + bookingNumber + cliPvtDataObj.transferSecret)
        .digest("base64"),
      validated:
        cliPvtDataHashStr === tspPvtDataHashStr &&
        (cliPvtDataObj.transportServiceProviderID === cliOrgID ||
          cliPvtDataObj.participants.find(
            (participant) => participant.participantID === cliOrgID
          )) &&
        (digestToMatch ? digestToMatch === secretHash : true),
    };
  }

  async readTransfer(ctx: Context, tspID: string, bookingNumber: string) {
    const { cliOrgID } = TransferContract._getClientOrgId(ctx.clientIdentity);

    const cliOrgPvtCollectionString = TransferContract._getPrivateCollectionString(
      cliOrgID
    );

    const compositeKey = ctx.stub.createCompositeKey("transfer", [
      tspID,
      bookingNumber,
    ]);

    const transferStr: string = Buffer.from(
      await ctx.stub.getPrivateData(cliOrgPvtCollectionString, compositeKey)
    ).toString();

    try {
      const transfer: Transfer = JSON.parse(transferStr);
      if (
        cliOrgID === transfer.transportServiceProviderID ||
        (transfer.participants &&
          transfer.participants.find(
            (participant) => participant.participantID === cliOrgID
          ))
      ) {
        return JSON.stringify(transfer, null, 2);
      } else {
        return JSON.stringify(
          {
            status: 403,
            message: "You are not authorized to read this transfer!",
          },
          null,
          2
        );
      }
    } catch (error) {
      if (error.name === SyntaxError.name) {
        return JSON.stringify({ status: 404, message: "Transfer not found" });
      }
    }
  }
  async readAllOrgTransfers(ctx: Context) {
    const mspString: string = ctx.clientIdentity.getMSPID();
    const cliOrg = mspString.slice(0, mspString.length - 3);

    let allResults = [];
    try {
      for await (const { key, value } of ctx.stub.getPrivateDataQueryResult(
        TransferContract._getPrivateCollectionString(cliOrg),
        `{
             "selector": {
                "participants": {
                   "$elemMatch": {
                      "participantID": "${cliOrg}"
                   }
                }
             }
          }`
      )) {
        const strValue = Buffer.from(value).toString("utf8");
        console.info("Found <-->", key, " : ", strValue);
        let record: Transfer = JSON.parse(strValue);
        allResults.push(record);
      }
      return JSON.stringify(allResults, null, 2);
    } catch (error) {
      return JSON.stringify({ message: error }, null, 2);
    }
  }

  async createTransfer(
    ctx: Context,
    transferString: string,
    transferSecret: string
  ) {
    const mspString: string = ctx.clientIdentity.getMSPID();
    const newTransfer: Transfer = JSON.parse(transferString);
    newTransfer.transferSecret = transferSecret;

    console.info(
      `MSP: ${mspString} | Creator: ${ctx.stub.getCreator().mspid} `
    );
    if (mspString !== `${newTransfer.transportServiceProviderID}MSP`) {
      throw new Error(
        "Not authorized to perform Transfer creation for different organization"
      );
    }

    const compositeKey: string = ctx.stub.createCompositeKey("transfer", [
      newTransfer.transportServiceProviderID,
      newTransfer.bookingNumber,
    ]);

    const hash = Buffer.from(
      await ctx.stub.getPrivateDataHash(
        TransferContract._getPrivateCollectionString(
          newTransfer.transportServiceProviderID
        ),
        compositeKey
      )
    ).toString("utf8");

    if (hash && hash.length > 0) {
      throw new Error(
        JSON.stringify({
          status: 406,
          message: `${newTransfer.transportServiceProviderID} transfer with booking number [${newTransfer.bookingNumber}] already exists!`,
        })
      );
    }
    try {
      await ctx.stub.putPrivateData(
        TransferContract._getPrivateCollectionString(mspString),
        compositeKey,
        Buffer.from(JSON.stringify(newTransfer))
      );
      if (newTransfer.participants && newTransfer.participants.length > 0) {
        await Promise.all(
          newTransfer.participants.map(async (participant) => {
            await ctx.stub.putPrivateData(
              `_implicit_org_${participant.participantID}MSP`,
              // secretsCompositeKey,
              // Buffer.from(JSON.stringify(pTransfer))
              compositeKey,
              Buffer.from(JSON.stringify(newTransfer))
            );
            console.info(`Participant ${participant.participantID}MSP added`);
          })
        );
      }
    } catch (error) {
      console.info(`ERROR: ${error}`);
      throw error;
    }
  }

  static _getPrivateCollectionString(mspID: string) {
    return mspID.endsWith("MSP")
      ? `_implicit_org_${mspID}`
      : `_implicit_org_${mspID}MSP`;
  }
  static _getClientOrgId(
    clientIdentity: ClientIdentity
  ): { cliOrgID: string; cliMspID: string } {
    const cliMspID: string = clientIdentity.getMSPID();
    const cliOrgID = cliMspID.slice(0, cliMspID.length - 3);
    return {
      cliOrgID,
      cliMspID,
    };
  }
}
