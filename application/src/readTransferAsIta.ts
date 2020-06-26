/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gateway, Wallets, DefaultEventHandlerStrategies } from 'fabric-network';
import * as path from 'path';
import { getConnectionProfile } from './utils/getConnectionProfile';

async function main() {
    try {
        const ccp = getConnectionProfile('itA');

        console.log(JSON.stringify(ccp['certificateAuthorities']));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('user1itA');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the enrolUser.ts application before retrying');
            return;
        }



        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet, eventHandlerOptions: {
                strategy: DefaultEventHandlerStrategies.NONE
            }, identity: 'user1itA', discovery: { enabled: false, asLocalhost: true }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await (await gateway.getNetwork('glode-channel'));


        const endorsers = network.getChannel().getEndorsers("itAMSP");
        // Get the contract from the network.
        // console.log(JSON.stringify(endorsers.map(end => end.name)));


        const contract = network.getContract('transfer');


        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.createTransaction('readTransfer').setEndorsingPeers(endorsers).submit("itA", "1234");
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        console.log(`Transaction has been submitted`);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${JSON.stringify(error)}`);
        process.exit(1);
    }
}

main();
