export class UserDoesntExistError extends Error {
  constructor(username: string) {
    super(
      `An identity for the user "${username}" does not exist in the wallet`,
    );
    this.name = 'UserDoesntExistError';
  }
}
