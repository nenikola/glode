export class TransferEquipment {
    registrationNumber: string;
    ownerID: string
    transferEquipmentType: TransferEquipmentType;
    transferStatus: TransferEquipmentStatus;
    currentLocation: Location
    associatedTransferIDs?: string[];
}

export enum TransferEquipmentType {
    TWNYFTCONTAINER = "20_FEET_CONTAINER",
    FRTYFTCONTAINER = "40_FEET_CONTAINER",
}

export enum TransferEquipmentStatus {
    IN_WAREHOUSE = "IN_WAREHOUSE",
    GATED = "GATED",
    IN_TRANSPORTATION = "IN_TRANSPORTATION"
}
export class Location {
    address?: Address;
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
