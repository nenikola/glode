import { Organization } from "./organization.model";
import { Location } from "./location.model";

export class Transfer {
  associationID: string;
  bookingNumber: string;
  destinationLocation: Location;
  originLocation: Location;
  participants: Organization[];
  plannedArrival: Date;
  plannedDeparture: Date;
  transferEquipmentQuantity: number;
  transportServiceProvider: Organization;

  constructor(
    associationID: string,
    bookingNumber: string,
    destinationLocation: Location,
    originLocation: Location,
    participants: Organization[],
    plannedArrival: string | Date,
    plannedDeparture: string | Date,
    transferEquipmentQuantity: number,
    transportServiceProvider: Organization
  ) {
    this.associationID = associationID;
    this.bookingNumber = bookingNumber;
    this.destinationLocation = destinationLocation;
    this.originLocation = originLocation;
    this.participants = participants;
    this.plannedArrival =
      typeof plannedArrival === "string"
        ? new Date(plannedArrival)
        : plannedArrival;
    this.plannedDeparture =
      typeof plannedDeparture === "string"
        ? new Date(plannedDeparture)
        : plannedDeparture;
    this.transferEquipmentQuantity = transferEquipmentQuantity;
    this.transportServiceProvider = transportServiceProvider;
  }

  //   toJSON() {
  //     return JSON.stringify({
  //       associationID: this.associationID,
  //       bookingNumber: this.bookingNumber,
  //       destinationLocation: this.destinationLocation,
  //       originLocation: this.originLocation,
  //       plannedArrival: this.plannedArrival.toISOString(),
  //       plannedDeparture: this.plannedDeparture.toISOString(),
  //       transferEquipmentQuantity: this.transferEquipmentQuantity,
  //       transportServiceProvider: this.transportServiceProvider.toJSON(),
  //     });
  //   }
}
