export class Organization {
  organizationID: string;
  organizationName: string;
  constructor(organizationID: string, organizationName: string) {
    this.organizationID = organizationID;
    this.organizationName = organizationName;
  }

  static getFromPlainObj(obj: Organization) {
    const eo: Organization =
      ExistingOrganizations[obj.organizationID.toUpperCase()];
    if (
      eo.organizationID === obj.organizationID &&
      eo.organizationName === obj.organizationName
    ) {
      return eo;
    } else {
      throw new Error("Invalid organization format");
    }
  }
}

export class ExistingOrganizations {
  static OCA: Organization = {
    organizationID: "ocA",
    organizationName: "Ocean Carrier A",
  };
  static OCB: Organization = {
    organizationID: "ocB",
    organizationName: "Ocean Carrier B",
  };
  static ITA: Organization = {
    organizationID: "itA",
    organizationName: "Inland Transporter A",
  };
  static ITB: Organization = {
    organizationID: "itB",
    organizationName: "Inland Transporter B",
  };
  static FFA: Organization = {
    organizationID: "ffA",
    organizationName: "Fright Forwarder A",
  };
}
