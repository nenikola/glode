export class TransferEquipment {
  associatedTransferIdHashs?: string[];
  currentLocation: Location;
  events: TransferEquipmentEvent[];
  ownerID: string;
  registrationNumber: string;
  transferEquipmentType: TransferEquipmentType;
  transferStatus: TransferEquipmentStatus;
  uniqueTransfersEquipmentIDHash?: string;
}

export enum TransferEquipmentType {
  TWNYFTCONTAINER = "20_FEET_CONTAINER",
  FRTYFTCONTAINER = "40_FEET_CONTAINER",
}

export enum TransferEquipmentStatus {
  IN_WAREHOUSE = "IN_WAREHOUSE",
  GATED = "GATED",
  IN_TRANSPORTATION = "IN_TRANSPORTATION",
}
export class Location {
  address?: Address;
  geoCoordinates?: {
    lat: number;
    lon: number;
  };
  unlocode: string;
}
export class Address {
  address: string;
  city: string;
  country: string;
}

export class TransferEquipmentEventDTO {
  associatedTransferData: {
    tspID: string;
    bookingNumber: string;
  };
  eventLocation: Location;
  eventOccuranceTime: Date;
  registrationNumber: string;
  transferEquipmentEventType: TransferEquipmentEventType;
}
export class TransferEquipmentEvent {
  associatedTransferID?: string;
  eventID: number;
  transferEquipmentEventType: TransferEquipmentEventType;
  eventLocation: Location;
  eventOccuranceTime: Date;
  constructor(
    eventID: number,
    transferEquipmentEventType: TransferEquipmentEventType,
    eventLocation: Location,
    eventOccuranceTime: Date,
    associatedTransferID?: string
  ) {
    associatedTransferID
      ? (this.associatedTransferID = associatedTransferID)
      : "";
    this.eventID = eventID;
    this.transferEquipmentEventType = transferEquipmentEventType;
    this.eventLocation = eventLocation;
    this.eventOccuranceTime = eventOccuranceTime;
  }
  static getFromDTO(eventDTO: TransferEquipmentEventDTO) {
    eventDTO.eventOccuranceTime = new Date(eventDTO.eventOccuranceTime);
    return new TransferEquipmentEvent(
      eventDTO.eventOccuranceTime.getTime(),
      eventDTO.transferEquipmentEventType,
      eventDTO.eventLocation,
      eventDTO.eventOccuranceTime
    );
  }
}

export enum TransferEquipmentEventType {
  GATE_IN = "GATE_IN",
  GATE_OUT = "GATE_OUT",
  COMMODITY_LOADED = "COMMODITY_LOADED",
  COMMODITY_UNLOADED = "COMMODITY_UNLOADED",
  LOADED_ON = "LOADED_ON",
  LOADED_OFF = "LOADED_OFF",
}
