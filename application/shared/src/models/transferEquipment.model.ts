import { Location } from "./location.model";
import { TransferEquipmentEvent } from "./transferEquipmentEvent.model";
import { TransferEquipmentType } from "./transferEquipmentType.model";

export class TransferEquipment {
  associatedTransfersIdHashes?: string[];
  currentLocation: Location;
  events: TransferEquipmentEvent[];
  ownerID: string;
  registrationNumber: string;
  transferEquipmentType: TransferEquipmentType;
  uniqueTransfersEquipmentIDHash: string;
}
