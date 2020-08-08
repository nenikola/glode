import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Identity, Wallet, Gateway, Network } from 'fabric-network';
import * as FabricCAServices from 'fabric-ca-client';

@Injectable()
export class AppService {
  private _getConnectionProfile(orgID) {
    const ccpPath = path.resolve(
      __dirname,
      '..',
      'resources',
      `connection-${orgID}-glode-channel.yaml`,
    );
    const ccp = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));
    return ccp as any;
  }

  public getCAConnection(orgID: string) {
    const ccp = this._getConnectionProfile(orgID);
    const caURL = ccp['certificateAuthorities'][`ca-${orgID}`].url;
    const ca = new FabricCAServices(caURL);
    return ca;
  }
  public async getNetworkConnection(
    orgID: string,
    identityOptions: { wallet: Wallet; identity: Identity },
  ): Promise<Network> {
    const ccp = this._getConnectionProfile(orgID);
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      ...identityOptions,
      discovery: { enabled: false, asLocalhost: true },
    });

    const network = await gateway.getNetwork('glode-channel');
    return network;
  }
}
