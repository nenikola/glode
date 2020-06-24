/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallets, X509Identity } from 'fabric-network';
import * as FabricCAServices from 'fabric-ca-client';
import * as path from 'path';
import { getConnectionProfile } from './utils/getConnectionProfile';


async function main() {
    try {
        const ccp = getConnectionProfile('itA');


        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca-itA'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get('user1itA');
        if (userIdentity) {
            console.log('An identity for the user "user1" exists in the wallet');
            return;
        }

        // Enroll the user1, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: 'user1pw' });
        const x509Identity: X509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'itAMSP',
            type: 'X.509',
        };
        await wallet.put('user1itA', x509Identity);
        console.log('Successfully registered and enrolled admin user "user1" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user "user1": ${error}`);
        process.exit(1);
    }
}

main();
