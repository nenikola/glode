export class Transfer {
    bookingNumber: string;
    transportServiceProviderID: string
    transportServiceProviderName: string;
    transferData: TransferData;
    transferStatus: TransferStatus;
    participants?: TransferParticipant[];
    equipmentData?: TransferEquipmentData;
}

export class ParticipantTransfer {
    bookingNumber: string;
    transferSecret: string;
    transportServiceProviderID: string

    constructor(bookingNumber: string, transportServiceProviderID: string, transferSecret: string) {
        this.bookingNumber = bookingNumber;
        this.transferSecret = transferSecret;
        this.transportServiceProviderID = transportServiceProviderID;
    }

}

export class TransferEquipmentData {
    transferEquipmentID: string;
    transferEquipmentDescription: string;
}
export class TransferParticipant {
    participantID: string;
    participantName: string;
    role: TransferRole;
}

export enum TransferRole {
    TRANSPORT_SERVICE_BUYER,
    PORT
}

export enum TransferStatus {
    WAITING,
    IN_TRANSPORTATION,

}
export class TransferData {
    originLocation: Location;
    destinationLocation: Location;
    transferVehicleID?: string;
    transferVehicleType?: string;
    plannedDeparture?: Date;
    plannedArrival?: Date;

}

export class Location {
    address: Address;
    unlocode: string;
    geoCoordinates?: {
        lat: number
        lon: number
    }
}

export class Address {
    address: string;
    city: string;
    country: string
}

