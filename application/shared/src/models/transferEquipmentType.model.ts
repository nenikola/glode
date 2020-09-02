export enum TransferEquipmentTypeNames {
  TWNYFTCONTAINER = "20_FEET_CONTAINER",
  FRTYFTCONTAINER = "40_FEET_CONTAINER",
}

export class TransferEquipmentType {
  teTypeID: number;
  teTypeName: TransferEquipmentTypeNames;

  /**
   *
   */
  constructor(teTypeID: number, teTypeName: TransferEquipmentTypeNames) {
    this.teTypeID = teTypeID;
    this.teTypeName = teTypeName;
  }

  static getFromPlainObj(obj: TransferEquipmentType): TransferEquipmentType {
    switch (obj.teTypeID) {
      case 0:
        return TransferEquipmentTypes.TWNYFTCONTAINER;
      case 1:
        return TransferEquipmentTypes.FRTYFTCONTAINER;
      default:
        throw new Error("Non existing transfer equipment type");
    }
  }
}

export class TransferEquipmentTypes {
  static TWNYFTCONTAINER = {
    teTypeID: 0,
    teTypeName: TransferEquipmentTypeNames.TWNYFTCONTAINER,
  };
  static FRTYFTCONTAINER = {
    teTypeID: 1,
    teTypeName: TransferEquipmentTypeNames.FRTYFTCONTAINER,
  };
}
