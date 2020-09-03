import { Context } from 'fabric-contract-api';
import { TransferContract } from '..';
import { Transfer } from 'app-shared-library';
export class QueryTransfers {
  static async handler(
    ctx: Context,
    transportServiceProviderID: string,
    departureBefore: string,
    arrivalBefore: string,
  ) {
    const cliOrgID = TransferContract._getClientOrgId(ctx.clientIdentity);
    console.info(`DEP STR:${departureBefore}`);
    console.info(`ARR STR:${arrivalBefore}`);
    const depDate = parseInt(departureBefore);
    const arrDate = parseInt(arrivalBefore);

    try {
      const queryObj = {
        selector: {
          $and: [
            {
              _id: {
                $gt: null,
              },
            },
          ],
        },
      };
      if (transportServiceProviderID) {
        queryObj.selector.$and.push({
          transportServiceProvider: {
            organizationID: transportServiceProviderID,
          },
        } as any);
      }
      if (depDate) {
        queryObj.selector.$and.push({
          plannedDeparture: {
            $lte: depDate,
          },
        } as any);
      }
      if (arrDate) {
        queryObj.selector.$and.push({
          plannedArrival: {
            $lte: arrDate,
          },
        } as any);
      }
      const query = JSON.stringify(queryObj);
      console.info('QUERY:', query);
      let allResults = [];
      for await (const { value } of ctx.stub.getPrivateDataQueryResult(
        TransferContract._getPrivateCollectionString(cliOrgID.cliOrgID),
        query,
      )) {
        const strValue = Buffer.from(value).toString('utf8');
        let record: Transfer = JSON.parse(strValue);
        allResults.push(record);
      }
      return JSON.stringify(allResults, null, 2);
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
