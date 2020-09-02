import {
  TransferEquipmentEventType,
  TransferEquipmentEventTypes,
} from "./transferEquipmentEventType.model";
import { Location } from "./location.model";
import { TransferEquipmentTypes } from "./transferEquipmentType.model";

export class TransferEquipmentEvent {
  eventID: string;
  eventLocation: Location;
  eventOccuranceTime: Date;
  transferEquipmentEventType: TransferEquipmentEventType;
  constructor(
    eventID: string,
    transferEquipmentEventType: TransferEquipmentEventType,
    eventLocation: Location,
    eventOccuranceTime: Date
  ) {
    this.eventID = eventID;
    this.eventLocation = eventLocation;
    this.eventOccuranceTime = eventOccuranceTime;
    this.transferEquipmentEventType = transferEquipmentEventType;
  }
  static getFromPlainObj(obj: TransferEquipmentEvent): any {
    return new TransferEquipmentEvent(
      obj.eventID,
      TransferEquipmentEventType.getFromPlainObj(
        obj.transferEquipmentEventType
      ),
      Location.getFromPlainObj(obj.eventLocation),
      new Date(obj.eventOccuranceTime)
    );
  }
}
