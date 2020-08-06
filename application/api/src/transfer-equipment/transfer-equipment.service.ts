import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { Gateway } from 'fabric-network';
import { TransferEquipmentEventDTO, TransferEquipment } from 'app-shared-library';

@Injectable()
export class TransferEquipmentService {
    
    constructor(private readonly appService:AppService,private readonly accountsService:AccountsService){
    }
    
    async associateTransfer(associationData: { registrationNumber: string; tspID: string; bookingNumber: string; }) {
        const ccp= this.appService.getConnectionProfile(associationData.tspID);
        const wallet= await this.appService.getWallet();
        const identity = await this.accountsService.getIdentity( `user1@${associationData.tspID}`,wallet,);
        const gateway = new Gateway();
        await gateway.connect(ccp, {
          wallet,
          identity,
          discovery: { enabled: false, asLocalhost: true },
        });
        
        const network = await gateway.getNetwork('glode-channel');
        console.log(JSON.stringify(network.getChannel().getEndorsers(associationData.tspID)));
        const resBuffer=await network.getContract('transferEquipment')
        .createTransaction('addAssociatedTransfer')
        .setEndorsingPeers(network.getChannel().getEndorsers(associationData.tspID+"MSP"))
        .submit(associationData.registrationNumber,associationData.tspID,associationData.bookingNumber);
        const res=JSON.parse(Buffer.from(resBuffer).toString());
        return res;
    }
    async submitEvent(transferEquipmentEventDTO: TransferEquipmentEventDTO) {
        const ccp= this.appService.getConnectionProfile(transferEquipmentEventDTO.associatedTransferData.tspID);
        const wallet= await this.appService.getWallet();
        const identity = await this.accountsService.getIdentity( `user1@${transferEquipmentEventDTO.associatedTransferData.tspID}`,wallet,);
        const gateway = new Gateway();
        await gateway.connect(ccp, {
          wallet,
          identity,
          discovery: { enabled: false, asLocalhost: false },
        });
        const data=JSON.stringify(transferEquipmentEventDTO);
        console.log(data);
        const network = await gateway.getNetwork('glode-channel');
        const resBuffer=await network.getContract('transferEquipment')
        .createTransaction('submitTransferEquipmentEvent')
        .setEndorsingPeers(network.getChannel().getEndorsers(transferEquipmentEventDTO.associatedTransferData.tspID+"MSP"))
        .submit(data);
        const res=JSON.parse(Buffer.from(resBuffer).toString());
        return res;
    }
    async save(transferEquipment:TransferEquipment){
        const ccp= this.appService.getConnectionProfile(transferEquipment.ownerID);
        const wallet= await this.appService.getWallet();
        const identity = await this.accountsService.getIdentity( `user1@${transferEquipment.ownerID}`,wallet,);
        const gateway = new Gateway();
        await gateway.connect(ccp, {
          wallet,
          identity,
          discovery: { enabled: false, asLocalhost: true },
        });
        const network = await gateway.getNetwork('glode-channel');
        const resBuffer=await network.getContract('transferEquipment').submitTransaction('createTransferEquipment',JSON.stringify(transferEquipment));
        const res=JSON.parse(Buffer.from(resBuffer).toString());
        return res;
    }
    async getByID(transferEquipmentID:string){
        const ccp= this.appService.getConnectionProfile('ocA');
        const wallet= await this.appService.getWallet();
        const identity = await this.accountsService.getIdentity( `user1@${'ocA'}`,wallet,);
        const gateway = new Gateway();
        await gateway.connect(ccp, {
          wallet,
          identity,
          discovery: { enabled: false, asLocalhost: true },
        });
        const network = await gateway.getNetwork('glode-channel');
        const resBuffer=await network.getContract('transferEquipment').evaluateTransaction('read',transferEquipmentID);
        const res=JSON.parse(Buffer.from(resBuffer).toString());
        return res;
    }
}
