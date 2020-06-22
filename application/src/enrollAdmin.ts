/*
 * SPDX-License-Identifier: Apache-2.0
 */

import * as FabricCAServices from 'fabric-ca-client';
import { Wallets, X509Identity } from 'fabric-network';
import * as path from 'path';
// import * as fs from 'fs';
// import * as yaml from 'js-yaml'
import { getConnectionProfile } from './utils/getConnectionProfile';

async function main() {
    try {
        // load the network configuration
        // const ccpPath = path.resolve(__dirname, '..', '..', 'network', 'organizations', 'fabric-ca', 'ocA', 'connection-ocA-glode-channel.yaml');
        // const ccp = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));

        const ccp = getConnectionProfile('ocA');
        console.log(JSON.stringify(ccp, null, 2));
        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca-ocA'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity: X509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'ocAMSP',
            type: 'X.509',
        };
        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

main();
