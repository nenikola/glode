import { Injectable } from '@nestjs/common';
import { AppService } from './../app.service';
import * as FabricCAServices from 'fabric-ca-client';
import { X509Identity } from 'fabric-network';
import * as path from 'path';

@Injectable()
export class AccountsService {
  constructor(private readonly appService: AppService) {}

  async login(username: string, password: string, orgID: string) {
    const ccp = this.appService.getConnectionProfile(orgID);

    // Create a new CA client for interacting with the CA.
    const caURL = ccp['certificateAuthorities'][`ca-${orgID}`].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const wallet = await this.appService.getWallet();
    // Check to see if we've already enrolled the user.
    try {
      const userIdentity = await this.appService.getIdentity(
        `${username}@${orgID}`,
        wallet,
      );
      if (userIdentity) {
        console.log(
          `An identity for the user "${username}" exists in the wallet`,
        );
        return;
      }
    } catch (error) {}

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
      `Successfully registered and enrolled admin user "${username}" and imported it into the wallet`,
    );
  }
}
