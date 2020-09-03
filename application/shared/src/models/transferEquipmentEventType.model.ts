export enum TransferEquipmentEventTypeNames {
  GATE_IN = "GATE_IN",
  GATE_OUT = "GATE_OUT",
  COMMODITY_LOADED = "COMMODITY_LOADED",
  COMMODITY_UNLOADED = "COMMODITY_UNLOADED",
  LOADED_ON = "LOADED_ON",
  LOADED_OFF = "LOADED_OFF",
}

export class TransferEquipmentEventType {
  teEventTypeID: number;
  teEventTypeName: string;

  constructor(teEventTypeID: number, teEventTypeName: string) {
    this.teEventTypeID = teEventTypeID;
    this.teEventTypeName = teEventTypeName;
  }

  static getFromPlainObj(obj: TransferEquipmentEventType) {
    return TransferEquipmentEventTypes[obj.teEventTypeName];
  }
}

export class TransferEquipmentEventTypes {
  static GATE_IN = {
    teEventTypeID: 0,
    teEventTypeName: "GATE_IN",
  };
  static GATE_OUT = {
    teEventTypeID: 1,
    teEventTypeName: "GATE_OUT",
  };
  static COMMODITY_LOADED = {
    teEventTypeID: 2,
    teEventTypeName: "COMMODITY_LOADED",
  };
  static COMMODITY_UNLOADED = {
    teEventTypeID: 3,
    teEventTypeName: "COMMODITY_UNLOADED",
  };
  static LOADED_ON = {
    teEventTypeID: 4,
    teEventTypeName: "LOADED_ON",
  };
  static LOADED_OFF = {
    teEventTypeID: 5,
    teEventTypeName: "LOADED_OFF",
  };
}
