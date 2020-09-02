export enum BookingStatusNames {
  SUBMITTED = "SUBMITTED",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
}
export class BookingStatus {
  bookingStatusID: number;
  bookingStatusName: BookingStatusNames;

  static getFromPlainObj(obj: BookingStatus) {
    return BookingStatuses[obj.bookingStatusName];
  }
}

export class BookingStatuses {
  static SUBMITTED: BookingStatus = {
    bookingStatusID: 0,
    bookingStatusName: BookingStatusNames.SUBMITTED,
  };
  static REJECTED: BookingStatus = {
    bookingStatusID: 1,
    bookingStatusName: BookingStatusNames.REJECTED,
  };
  static APPROVED: BookingStatus = {
    bookingStatusID: 2,
    bookingStatusName: BookingStatusNames.APPROVED,
  };
}
