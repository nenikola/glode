export class Location {
  address: string;
  city: string;
  country: string;
  geoCoordinates: {
    lat: number;
    lon: number;
  };
  constructor(
    address: string,
    city: string,
    country: string,
    geoCoordinates: {
      lat: number;
      lon: number;
    }
  ) {
    this.address = address;
    this.city = city;
    this.country = country;
    this.geoCoordinates = {
      lat: geoCoordinates.lat,
      lon: geoCoordinates.lon,
    };
  }
  //   toJSON() {
  //     return JSON.stringify({
  //       address: this.address,
  //       city: this.city,
  //       country: this.country,
  //       geoCoordinates: {
  //         lat: this.geoCoordinates.lat,
  //         lon: this.geoCoordinates.lon,
  //       },
  //     });
  //   }
}
