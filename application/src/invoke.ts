/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gateway, Wallets } from 'fabric-network';
import * as path from 'path';
import { getConnectionProfile } from './utils/getConnectionProfile';

async function main() {
    try {
        const ccp = getConnectionProfile('ocA');


        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('user1');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the enrolUser.ts application before retrying');
            return;
        }



        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await (await gateway.getNetwork('glode-channel'));


        network.getChannel().getEndorsers("itAMSP").forEach(end => console.log(end.name));
        // Get the contract from the network.

        const contract = network.getContract('transfer');

        await contract.createTransaction("createTransfer").submit(JSON.stringify({
            bookingNumber: '3456',
            transportServiceProviderID: 'ocA',
            transportServiceProviderName: 'Ocean Carrier A',
            transferStatus: 1,
            transferData: {
                originLocation: {
                    address: {
                        address: "Koper Street 111",
                        city: "Koper",
                        country: "Slovenia"
                    },
                    unlocode: "KPSLO"
                },
                destinationLocation: {
                    address: {
                        address: "Nantong Street 222",
                        city: "Nantong",
                        country: "China"
                    },
                    unlocode: "NTCHN"
                }
            },
            participants: [
                {
                    participantID: "itA",
                    participantName: "Inland Transporter A",
                    role: 1
                }
            ]
        }));
        // Submit the specified transaction.
        // createTransfer transaction - requires 2 argument, ex: ('createCar', 'transferString')
        // await contract.submitTransaction('createTransfer', JSON.stringify({
        //     bookingNumber: '2345',
        //     transportServiceProviderID: 'ocA',
        //     transportServiceProviderName: 'Ocean Carrier A',
        //     transferStatus: 1,
        //     transferData: {
        //         originLocation: {
        //             address: {
        //                 address: "Koper Street 111",
        //                 city: "Koper",
        //                 country: "Slovenia"
        //             },
        //             unlocode: "KPSLO"
        //         },
        //         destinationLocation: {
        //             address: {
        //                 address: "Nantong Street 222",
        //                 city: "Nantong",
        //                 country: "China"
        //             },
        //             unlocode: "NTCHN"
        //         }
        //     },
        //     participants: [
        //         {
        //             participantID: "itA",
        //             participantName: "Inland Transporter A",
        //             role: 1
        //         }
        //     ]
        // }));
        console.log(`Transaction has been submitted`);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${JSON.stringify(error)}`);
        process.exit(1);
    }
}

main();
