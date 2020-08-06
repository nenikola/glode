import { Injectable } from '@nestjs/common';
import {
 Transfer,
} from 'app-shared-library';
import { AppService } from '../app.service';
import { AccountsService } from '../accounts/accounts.service';
import { Gateway } from 'fabric-network';
@Injectable()
export class TransfersService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly appService: AppService,
  ) {}

  async getTransfer(
    bookingNumber: string,
    tspOrgID: string,
    userOrgID: string,
  ): Promise<any> {
    
    const ccp = this.appService.getConnectionProfile(userOrgID);
    const wallet = await this.appService.getWallet();
    const identity = await this.accountsService.getIdentity(
      `user1@${userOrgID}`,
      wallet,
    );
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity,
      discovery: { enabled: false, asLocalhost: true },
    });

    const network = await gateway.getNetwork('glode-channel');

    const result = await network
      .getContract('transfer')
      .evaluateTransaction('readTransfer', tspOrgID, bookingNumber);
    return JSON.parse(Buffer.from(result).toString());
  }

  async getAllOrgTransfers(orgID: string): Promise<Transfer[]> {
    const ccp = this.appService.getConnectionProfile(orgID);
    const wallet = await this.appService.getWallet();
    const identity = await this.accountsService.getIdentity(
      `user1@${orgID}`,
      wallet,
    );
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity,
      discovery: { enabled: false, asLocalhost: true },
    });

    const network = await gateway.getNetwork('glode-channel');
    const result = await network
      .getContract('transfer')
      .evaluateTransaction('readAllOrgTransfers', orgID);
    return JSON.parse(Buffer.from(result).toString());
  }
}
