export class Booking {
    bookingID: string; // bookingOrgID + tspID + uniqueAssociatedTransfersSecret
    bookingNotes: string;
    bookingOrgID: string;
    bookingStatus: BookingStatus;
    equipmentData?: BookingTransferEquipmentData;
    transferData: BookingTransferData;
    transportServiceProviderID: string
    transportServiceProviderName: string;
    uniqueAssociatedTransfersSecret: string
    constructor(params: {
        bookingNotes: string,
        bookingOrgID: string,
        bookingStatus: BookingStatus,
        equipmentData?: BookingTransferEquipmentData,
        transferData: BookingTransferDataDTO,
        transportServiceProviderID: string
        transportServiceProviderName: string,
        uniqueAssociatedTransfersSecret: string
    }) {
        console.info(JSON.stringify(params));
        params.transferData.requestedDeparture = new Date(params.transferData.requestedDeparture);
        params.transferData.requestedArrival ? params.transferData.requestedArrival = new Date(params.transferData.requestedArrival) : "";
        Object.assign(this, params);
        this.bookingID = this.bookingOrgID + this.transportServiceProviderID + this.uniqueAssociatedTransfersSecret;
    }
}


export class BookingTransferEquipmentData {
    transferEquipmentQuantity: number;
    transferEquipmentType: TransferEquipmentType;
}

export enum TransferEquipmentType {
    TWNYFTCONTAINER = "20_FEET_CONTAINER",
    FRTYFTCONTAINER = "40_FEET_CONTAINER",
}
export enum BookingStatus {
    SUBMITTED = "SUBMITTED",
    REJECTED = "REJECTED",
    APPROVED = "APPROVED",

}
export class BookingTransferDataDTO {
    originLocation: Location;
    destinationLocation: Location;
    requestedDeparture: string | Date;
    requestedArrival?: string | Date;

}
export class BookingTransferData {
    originLocation: Location;
    destinationLocation: Location;
    requestedDeparture: Date;
    requestedArrival?: Date;

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

