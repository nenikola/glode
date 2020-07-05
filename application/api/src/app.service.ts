import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Identity, Wallets, Wallet } from 'fabric-network';

@Injectable()
export class AppService {
  public getConnectionProfile(orgID) {
    const ccpPath = path.resolve(
      __dirname,
      '..',
      'resources',
      `connection-${orgID}-glode-channel.yaml`,
    );
    const ccp = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));
    return ccp as object;
  }
  public async getWallet(): Promise<Wallet> {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    return wallet;
  }

  public async getIdentity(
    username: string,
    wallet: Wallet,
  ): Promise<Identity> {
    if (!username || !(username.length > 0)) {
      throw new Error('Username not provided!');
    }
    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(username);
    if (!identity) {
      console.log(
        `An identity for the user "${username}" does not exist in the wallet`,
      );
      throw new Error(
        `An identity for the user "${username}" does not exist in the wallet`,
      );
    }
    return identity;
  }
}
