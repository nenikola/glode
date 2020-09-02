import { Context } from 'fabric-contract-api';
import { BookingContract } from '..';
import { Booking, Organization, Location } from 'app-shared-library';
export class QueryBookings {
  static async handler(
    ctx: Context,
    bookingOrgID: string,
    transportServiceProviderID: string,
    bookingStatus: string,
    transferEquipmentType: string,
  ) {
    const cliOrgID = BookingContract._getClientOrgId(ctx.clientIdentity);
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
      if (bookingOrgID) {
        queryObj.selector.$and.push({
          bookingOrg: {
            organizationID: bookingOrgID,
          },
        } as any);
      }
      if (transportServiceProviderID) {
        queryObj.selector.$and.push({
          transportServiceProvider: {
            organizationID: transportServiceProviderID,
          },
        } as any);
      }
      if (bookingStatus) {
        queryObj.selector.$and.push({ bookingStatus } as any);
      }
      if (transferEquipmentType) {
        queryObj.selector.$and.push({
          equipmentData: {
            transferEquipmentType,
          },
        } as any);
      }
      const query = JSON.stringify(queryObj);

      let allResults = [];
      for await (const { value } of ctx.stub.getPrivateDataQueryResult(
        BookingContract._getPrivateCollectionString(cliOrgID),
        query,
      )) {
        const strValue = Buffer.from(value).toString('utf8');
        let record: Booking = JSON.parse(strValue);
        allResults.push(record);
      }
      return JSON.stringify(allResults, null, 2);
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
