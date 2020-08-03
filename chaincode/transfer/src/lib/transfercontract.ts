"use-strict";

import { Contract, Context } from "fabric-contract-api";
import { Transfer } from "./transfer.model";
import { createHash } from "crypto";

export class TransferContract extends Contract {
  async validateTransferParticipant(
    ctx: Context,
    tspID: string,
    bookingNumber: string,
    digestToMatch: string
  ) {
    const cliOrgCollectionID = TransferContract._getPrivateCollectionString(
      ctx.clientIdentity.getMSPID()
    );
    const tspOrgCollectionID = TransferContract._getPrivateCollectionString(
      tspID
    );

    const compositeKey = ctx.stub.createCompositeKey("transfer", [
      tspID,
      bookingNumber,
    ]);

    const cliPvtData: Transfer = JSON.parse(
      Buffer.from(
        await ctx.stub.getPrivateData(cliOrgCollectionID, compositeKey)
      ).toString("utf8")
    );

    console.info(JSON.stringify(cliPvtData));
    const cliPvtDataHashOrg = Buffer.from(
      await ctx.stub.getPrivateDataHash(cliOrgCollectionID, compositeKey)
    ).toString("base64");
    // const cliPvtData: ParticipantTransfer = new ParticipantTransfer(
    //   cliPvt.bookingNumber,
    //   cliPvt.transportServiceProviderID,
    //   cliPvt.transferSecret
    // );
    const cliPvtHashStr = createHash("sha256")
      .update(JSON.stringify(cliPvtData))
      .digest("base64");
    const tspPvtHashStr = Buffer.from(
      await ctx.stub.getPrivateDataHash(tspOrgCollectionID, compositeKey)
    ).toString("base64");

    const secretHash = createHash("sha256")
      .update(cliPvtData.transferSecret)
      .digest("base64");

    console.info(
      `${cliPvtHashStr} :::: ${tspPvtHashStr} :::: ${cliPvtDataHashOrg}`
    );
    console.info(
      `DIGEST: ${digestToMatch} :: SECRETDIGEST: ${secretHash} :: SECRET: ${cliPvtData.transferSecret} `
    );
    return {
      digestToMatch: digestToMatch || secretHash,
      transferIDHash: createHash("sha256")
        .update(tspID + bookingNumber + cliPvtData.transferSecret)
        .digest("base64"),
      validated:
        //NEEDS UPDATE......
        (cliPvtHashStr === tspPvtHashStr ||
          cliPvtDataHashOrg === tspPvtHashStr) &&
        (digestToMatch ? digestToMatch === secretHash : true),
    };
  }

  // async validateExistingTransfer(ctx: Context, transferString: string) {
  //   const transferObj: Transfer = JSON.parse(transferString);

  //   const hashStr = createHash("sha256")
  //     .update(transferString)
  //     .digest("base64");
  //   console.info(`MY HASH STR: ${hashStr}`);

  //   const compositeKey: string = ctx.stub.createCompositeKey("transfer", [
  //     transferObj.transportServiceProviderID,
  //     transferObj.bookingNumber,
  //   ]);

  //   const collectionId = TransferContract._getPrivateCollectionString(
  //     transferObj.transportServiceProviderID
  //   );

  //   const pvtHash = await ctx.stub.getPrivateDataHash(
  //     collectionId,
  //     compositeKey
  //   );

  //   const pvtHashStr = Buffer.from(pvtHash).toString("base64");
  //   console.info(`COLL DATA  HASH STR: ${pvtHashStr}`);

  //   return JSON.stringify({
  //     hashStr,
  //     pvtHashStr,
  //     validated: hashStr === pvtHashStr,
  //   });
  // }

  async readTransfer(ctx: Context, tspID: string, bookingNumber: string) {
    const mspString: string = ctx.clientIdentity.getMSPID();
    const cliOrg = mspString.slice(0, mspString.length - 3);

    const compositeKey = ctx.stub.createCompositeKey("transfer", [
      tspID,
      bookingNumber,
    ]);

    const transferStr: string = Buffer.from(
      await ctx.stub.getPrivateData(
        TransferContract._getPrivateCollectionString(mspString),
        compositeKey
      )
    ).toString("utf8");
    if (transferStr && transferStr.length > 0) {
      const transfer: Transfer = JSON.parse(transferStr);
      if (
        cliOrg === transfer.transportServiceProviderID ||
        (transfer.participants &&
          transfer.participants.find(
            (participant) => participant.participantID === cliOrg
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
    }
    return JSON.stringify({ status: 404, message: "Transfer not found" });
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
}
