import { TransferEquipmentEventType } from "./transferEquipmentEventType.model";

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
}
