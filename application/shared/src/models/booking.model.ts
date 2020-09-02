import { BookingStatus } from "./bookingStatus.model";
import { Organization } from "./organization.model";
import { TransferEquipmentType } from "./transferEquipmentType.model";
import { Location } from "./location.model";

export class Booking {
  associationID: string;
  bookingID: string; // bookingOrgID + tspID + uniqueAssociatedTransfersSecret
  bookingOrg: Organization;
  bookingStatus: BookingStatus;
  destinationLocation: Location;
  originLocation: Location;
  requestedArrival: Date;
  requestedDeparture: Date;
  transferEquipmentQuantity: number;
  transferEquipmentType: TransferEquipmentType;
  transportServiceProvider: Organization;

  constructor(
    associationID: string,
    bookingID: string,
    bookingOrg: Organization,
    bookingStatus: BookingStatus,
    destinationLocation: Location,
    originLocation: Location,
    requestedArrival: string | Date,
    requestedDeparture: string | Date,
    transferEquipmentQuantity: number,
    transferEquipmentType: TransferEquipmentType,
    transportServiceProvider: Organization
  ) {
    this.associationID = associationID;
    this.bookingID = bookingID;
    this.bookingOrg = bookingOrg;
    this.bookingStatus = bookingStatus;
    this.destinationLocation = destinationLocation;
    this.originLocation = originLocation;
    this.requestedArrival =
      typeof requestedArrival === "string"
        ? new Date(requestedArrival)
        : requestedArrival;
    this.requestedDeparture =
      typeof requestedDeparture === "string"
        ? new Date(requestedDeparture)
        : requestedDeparture;
    this.transferEquipmentQuantity = transferEquipmentQuantity;
    this.transferEquipmentType = transferEquipmentType;
    this.transportServiceProvider = transportServiceProvider;
  }
  static getFromPlainObj(obj: {
    associationID: string;
    bookingID: string;
    bookingOrg: Organization;
    bookingStatus: BookingStatus;
    destinationLocation: Location;
    originLocation: Location;
    requestedArrival: string | Date;
    requestedDeparture: string | Date;
    transferEquipmentQuantity: number;
    transferEquipmentType: TransferEquipmentType;
    transportServiceProvider: Organization;
  }) {
    return new Booking(
      obj.associationID,
      obj.bookingID,
      Organization.getFromPlainObj(obj.bookingOrg),
      BookingStatus.getFromPlainObj(obj.bookingStatus),
      Location.getFromPlainObj(obj.destinationLocation),
      Location.getFromPlainObj(obj.originLocation),
      new Date(obj.requestedArrival),
      new Date(obj.requestedDeparture),
      obj.transferEquipmentQuantity,
      obj.transferEquipmentType,
      Organization.getFromPlainObj(obj.transportServiceProvider)
    );
  }
  //   toJSON() {
  //     return JSON.stringify({
  //       associationID: this.associationID,
  //       bookingID: this.bookingID,
  //       bookingOrg: this.bookingOrg.toJSON(),
  //       bookingStatus: this.bookingStatus.toJSON(),
  //       destinationLocation: this.destinationLocation,
  //       originLocation: this.originLocation,
  //       requestedArrival: this.requestedArrival.toISOString(),
  //       requestedDeparture: this.requestedDeparture.toISOString(),
  //       transferEquipmentQuantity: this.transferEquipmentQuantity,
  //       transferEquipmentType: this.transferEquipmentType.toJSON(),
  //       transportServiceProvider: this.transportServiceProvider.toJSON(),
  //     });
  //   }
}
