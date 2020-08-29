export class Organization {
  organizationID: string;
  organizationName: string;
  constructor(organizationID: string, organizationName: string) {
    this.organizationID = organizationID;
    this.organizationName = organizationName;
  }

  toJSON() {
    return JSON.stringify({
      organizationID: this.organizationID,
      organizationName: this.organizationName,
    });
  }
}
