export enum BookingStatusNames {
  SUBMITTED = "SUBMITTED",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
}
export class BookingStatus {
  bookingStatusID: number;
  bookingStatusName: BookingStatusNames;

  // toJSON() {
  //   return JSON.stringify({
  //     bookingStatusID: this.bookingStatusID,
  //     bookingStatusName: this.bookingStatusName,
  //   });
  // }
}
