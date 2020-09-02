import { Context } from 'fabric-contract-api';
import { TransferEquipmentContract } from './transferEquipment.contract';
import { TransferEquipment } from 'app-shared-library/dto/transferEquipment.dto.model';

export class GetAvailableTEforTransfer {
  static async handler(ctx: Context, tspID: string, bookingNumber: string) {
    const participantAuthResult = await TransferEquipmentContract._isAuthorizedTransferParticipant(
      ctx,
      tspID,
      bookingNumber,
      '',
    );
    if (
      !participantAuthResult.validated &&
      !participantAuthResult.transferIDHash
    ) {
      throw new Error('NotFoundError');
    }
    let allResults = [];
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
                      "associatedTransfersIdHashes": {
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

    for await (const { value } of ctx.stub.getQueryResult(query)) {
      const strValue = Buffer.from(value).toString('utf8');
      let record: TransferEquipment = JSON.parse(strValue);
      //    TODO: this should be map from Entity to DTO
      delete record.uniqueTransfersEquipmentIDHash;
      delete record.associatedTransferIdHashs;
      allResults.push(record);
    }
    return JSON.stringify(allResults, null, 2);
  }
}
