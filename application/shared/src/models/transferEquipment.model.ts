import { Location } from "./location.model";
import { TransferEquipmentEvent } from "./transferEquipmentEvent.model";
import {
  TransferEquipmentType,
  TransferEquipmentTypes,
} from "./transferEquipmentType.model";
import { Organization } from "./organization.model";

export class TransferEquipment {
  associatedTransfersIdHashes: string[];
  currentLocation: Location;
  events: TransferEquipmentEvent[];
  owner: Organization;
  registrationNumber: string;
  transferEquipmentType: TransferEquipmentType;
  uniqueTransfersEquipmentIDHash: string;
  /**
   *
   */
  constructor(
    associatedTransfersIdHashes: string[],
    currentLocation: Location,
    events: TransferEquipmentEvent[],
    owner: Organization,
    registrationNumber: string,
    transferEquipmentType: TransferEquipmentType,
    uniqueTransfersEquipmentIDHash: string
  ) {
    this.associatedTransfersIdHashes = associatedTransfersIdHashes;
    this.currentLocation = currentLocation;
    this.events = events;
    this.owner = owner;
    this.registrationNumber = registrationNumber;
    this.transferEquipmentType = transferEquipmentType;
    this.uniqueTransfersEquipmentIDHash = uniqueTransfersEquipmentIDHash;
  }
  static getFromPlainObj(obj: TransferEquipment) {
    return new TransferEquipment(
      obj.associatedTransfersIdHashes,
      Location.getFromPlainObj(obj.currentLocation),
      obj.events.map((event) => TransferEquipmentEvent.getFromPlainObj(event)),
      Organization.getFromPlainObj(obj.owner),
      obj.registrationNumber,
      TransferEquipmentType.getFromPlainObj(obj.transferEquipmentType),
      obj.uniqueTransfersEquipmentIDHash
    );
  }
}
