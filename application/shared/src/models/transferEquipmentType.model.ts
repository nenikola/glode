export enum TransferEquipmentTypeNames {
  TWNYFTCONTAINER = "20_FEET_CONTAINER",
  FRTYFTCONTAINER = "40_FEET_CONTAINER",
}

export class TransferEquipmentType {
  teTypeID: number;
  teTypeName: TransferEquipmentTypeNames;

  //   toJSON() {
  //     return JSON.stringify({
  //       teTypeID: this.teTypeID,
  //       teTypeName: this.teTypeName,
  //     });
  //   }
}
