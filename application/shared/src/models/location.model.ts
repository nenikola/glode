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
  static getFromPlainObj(obj: {
    address: string;
    city: string;
    country: string;
    geoCoordinates: {
      lat: number;
      lon: number;
    };
  }) {
    return new Location(obj.address, obj.city, obj.country, obj.geoCoordinates);
  }
}
