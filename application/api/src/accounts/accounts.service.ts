import { Injectable } from '@nestjs/common';
import { X509Identity, Wallet, Identity, Wallets } from 'fabric-network';
import * as path from 'path';
import { AppService } from 'src/app.service';
import { UserDoesntExistError } from 'src/errors/identity.error';

@Injectable()
export class AccountsService {
  constructor(private readonly appService: AppService) {}

  private async _getIdentity(
    username: string,
    wallet: Wallet,
  ): Promise<Identity> {
    if (!username || !(username.length > 0)) {
      throw new Error('Username not provided!');
    }
    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(username);
    if (!identity) {
      throw new UserDoesntExistError(username);
    }
    return identity;
  }
  private async _getWallet(): Promise<Wallet> {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    return wallet;
  }

  public async getUsersIdentityAndWallet(username, orgID) {
    const wallet = await this._getWallet();
    const identity = await this._getIdentity(`${username}@${orgID}`, wallet);
    return {
      wallet,
      identity,
    };
  }
  async login(username: string, password: string, orgID: string) {
    // Create a new CA client for interacting with the CA.
    const ca = this.appService.getCAConnection(orgID);

    // Create a new file system based wallet for managing identities.
    // Check to see if we've already enrolled the user.
    const wallet = await this._getWallet();

    try {
      await this._getIdentity(`${username}@${orgID}`, wallet);
      return { username, orgID };
    } catch (error) {
      if (error.name !== 'UserDoesntExistError') {
        throw error;
      }
    }

    // Enroll the user1, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID: username,
      enrollmentSecret: password,
    });
    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: `${orgID}MSP`,
      type: 'X.509',
    };
    await wallet.put(`${username}@${orgID}`, x509Identity);
    console.log(
      `Successfully registered user "${username}" and imported it into the wallet`,
    );
    return { username, orgID };
  }
}
