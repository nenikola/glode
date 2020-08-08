import { Injectable } from '@nestjs/common';
import { Transfer } from 'app-shared-library';
import { AppService } from '../app.service';
import { AccountsService } from '../accounts/accounts.service';
import { Wallet, Identity } from 'fabric-network';
import { MissingArgumentsException } from 'src/errors/validation.error';
@Injectable()
export class TransfersService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly appService: AppService,
  ) {}

  async getTransfer(
    bookingNumber: string,
    tspOrgID: string,
    userParams: {
      orgID: string;
      identityOptions: { wallet: Wallet; identity: Identity };
    },
  ): Promise<any> {
    const network = await this.appService.getNetworkConnection(
      userParams.orgID,
      userParams.identityOptions,
    );

    const result = await network
      .getContract('transfer')
      .evaluateTransaction('readTransfer', tspOrgID, bookingNumber);
    return JSON.parse(Buffer.from(result).toString());
  }

  async getAllOrgTransfers(userParams: {
    orgID: string;
    identityOptions: { wallet: Wallet; identity: Identity };
  }): Promise<Transfer[]> {
    if ((!userParams.orgID as any) || userParams.orgID.length < 3) {
      throw new MissingArgumentsException('orgID');
    }
    const network = await this.appService.getNetworkConnection(
      userParams.orgID,
      userParams.identityOptions,
    );

    const result = await network
      .getContract('transfer')
      .evaluateTransaction('readAllOrgTransfers', userParams.orgID);
    return JSON.parse(Buffer.from(result).toString());
  }
}
