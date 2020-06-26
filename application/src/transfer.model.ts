export class Transfer {
    bookingNumber: string;
    transportServiceProviderID: string
    transportServiceProviderName: string;
    transferData: TransferData;
    transferStatus: TransferStatus;
    participants?: TransferParticipant[];
    equipmentData?: TransferEquipmentData;

    fromParsedJSON(transfer: Transfer) {
        this.bookingNumber = transfer.bookingNumber;
        this.transportServiceProviderID = transfer.transportServiceProviderID;
        this.transportServiceProviderName = transfer.transportServiceProviderName;
        this.transferData = new TransferData().fromParsedJSON(transfer.transferData);
        this.transferStatus = transfer.transferStatus;
        this.participants = transfer.participants ? transfer.participants.map(participant => {
            return new TransferParticipant().fromParsedJSON(participant);
        }) : undefined
        return this;
    }

    toJSONString() {
        return `{"bookingNumber":"${this.bookingNumber}","transportServiceProviderID":"${this.transportServiceProviderID}","transportServiceProviderName":"${this.transportServiceProviderName}","transferStatus":${this.transferStatus}${this.transferData ? `,"transferData":${this.transferData.toJSONString()}` : ""}${this.participants ? `,"participants":[${this.participants.map((participant, index) => participant.toJSONString() + ((index === this.participants.length - 1) ? "" : ","))}]` : ""}}`;


    }
}

export class ParticipantTransfer {
    bookingNumber: string;
    transportServiceProviderID: string
    equipmentData?: TransferEquipmentData;

    constructor(bookingNumber: string, transportServiceProviderID: string, equipmentData?: TransferEquipmentData) {
        this.bookingNumber = bookingNumber;
        this; transportServiceProviderID = transportServiceProviderID;
        this.equipmentData = equipmentData;
    }
    static getFromTransfer(original: Transfer): ParticipantTransfer {
        const pTransfer = new ParticipantTransfer(original.bookingNumber, original.transportServiceProviderID, original.equipmentData);
        return pTransfer;
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
    toJSONString() {
        return `{"participantID":"${this.participantID}","participantName":"${this.participantName}","role":${this.role}}`;
    }
    fromParsedJSON(participant: TransferParticipant): TransferParticipant {
        this.participantID = participant.participantID;
        this.participantName = participant.participantName;
        this.role = participant.role;
        return this;
    }
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
    plannedDeparture?: Date;
    plannedArrival?: Date;
    fromParsedJSON(transferData: TransferData): TransferData {
        this.originLocation = new Location().fromParsedJSON(transferData.originLocation);
        this.destinationLocation = new Location().fromParsedJSON(transferData.destinationLocation);
        return this;
    }
    toJSONString() {
        return `{"originLocation":${this.originLocation.toJSONString()},"destinationLocation":${this.destinationLocation.toJSONString()}}`
    }

}

export class Location {
    address: Address;
    unlocode: string;
    geoCoordinates?: {
        lat: number
        lon: number
    }
    fromParsedJSON(location: Location): Location {
        this.address = new Address().fromParsedJSON(location.address);
        this.unlocode = location.unlocode;
        return this;
    }
    toJSONString() {
        return `{"address":${this.address.toJSONString()},"unlocode":"${this.unlocode}"}`;
    }
}

export class Address {
    address: string;
    city: string;
    country: string
    fromParsedJSON(address: Address): Address {
        this.address = address.address;
        this.city = address.city;
        this.country = address.country;
        return this;
    }
    toJSONString() {
        return `{"address":"${this.address}","city":"${this.city}","country":"${this.country}"}`;
    }
}

