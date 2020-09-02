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

  static getFromPlainObj(obj: {
    associationID: string;
    bookingNumber: string;
    destinationLocation: Location;
    originLocation: Location;
    participants: Organization[];
    plannedArrival: string | Date;
    plannedDeparture: string | Date;
    transferEquipmentQuantity: number;
    transportServiceProvider: Organization;
  }) {
    return new Transfer(
      obj.associationID,
      obj.bookingNumber,
      Location.getFromPlainObj(obj.destinationLocation),
      Location.getFromPlainObj(obj.originLocation),
      obj.participants.map((participant) =>
        Organization.getFromPlainObj(participant)
      ),
      new Date(obj.plannedArrival),
      new Date(obj.plannedDeparture),
      obj.transferEquipmentQuantity,
      Organization.getFromPlainObj(obj.transportServiceProvider)
    );
  }
}
