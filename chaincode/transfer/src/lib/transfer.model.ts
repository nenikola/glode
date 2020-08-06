export class Transfer {
  bookingNumber: string;
  equipmentData?: TransferEquipmentData;
  participants?: TransferParticipant[];
  transferData: TransferData;
  transferSecret?: string;
  transferStatus: TransferStatus;
  transportServiceProviderID: string;
  transportServiceProviderName: string;
}

export class ParticipantTransfer {
  bookingNumber: string;
  transferSecret: string;
  transportServiceProviderID: string;

  constructor(
    bookingNumber: string,
    transportServiceProviderID: string,
    transferSecret: string,
  ) {
    this.bookingNumber = bookingNumber;
    this.transferSecret = transferSecret;
    this.transportServiceProviderID = transportServiceProviderID;
  }
}

export class TransferEquipmentData {
  transferEquipmentDescription: string;
  transferEquipmentID: string;
}
export class TransferParticipant {
  participantID: string;
  participantName: string;
  role: TransferRole;
}

export enum TransferRole {
  TRANSPORT_SERVICE_BUYER,
  PORT,
}

export enum TransferStatus {
  WAITING,
  IN_TRANSPORTATION,
}
export class TransferData {
  destinationLocation: Location;
  originLocation: Location;
  plannedArrival?: Date;
  plannedDeparture?: Date;
  transferVehicleID?: string;
  transferVehicleType?: string;
}

export class Location {
  address: Address;
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
