import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { Wallet, Identity } from 'fabric-network';
import {
  TransferEquipmentEventDTO,
  TransferEquipment,
} from 'app-shared-library';

@Injectable()
export class TransferEquipmentService {
  constructor(
    private readonly appService: AppService,
    private readonly accountsService: AccountsService,
  ) {}

  async associateTransfer(
    associationData: {
      registrationNumber: string;
      tspID: string;
      bookingNumber: string;
    },
    userParams: {
      orgID: string;
      identityOptions: { wallet: Wallet; identity: Identity };
    },
  ) {
    const network = await this.appService.getNetworkConnection(
      userParams.orgID,
      userParams.identityOptions,
    );

    console.log(
      JSON.stringify(network.getChannel().getEndorsers(associationData.tspID)),
    );
    const resBuffer = await network
      .getContract('transferEquipment')
      .createTransaction('addAssociatedTransfer')
      .setEndorsingPeers(
        network.getChannel().getEndorsers(userParams.orgID + 'MSP'),
      )
      .submit(
        associationData.registrationNumber,
        associationData.tspID,
        associationData.bookingNumber,
      );
    const res = JSON.parse(Buffer.from(resBuffer).toString());
    return res;
  }
  async submitEvent(
    transferEquipmentEventDTO: TransferEquipmentEventDTO,
    userParams: {
      orgID: string;
      identityOptions: { wallet: Wallet; identity: Identity };
    },
  ) {
    const network = await this.appService.getNetworkConnection(
      userParams.orgID,
      userParams.identityOptions,
    );

    const data = JSON.stringify(transferEquipmentEventDTO);
    console.log(data);
    const resBuffer = await network
      .getContract('transferEquipment')
      .createTransaction('submitTransferEquipmentEvent')
      .setEndorsingPeers(
        network
          .getChannel()
          .getEndorsers(
            transferEquipmentEventDTO.associatedTransferData.tspID + 'MSP',
          ),
      )
      .submit(data);
    const res = JSON.parse(Buffer.from(resBuffer).toString());
    return res;
  }
  async save(
    transferEquipment: TransferEquipment,
    userParams: {
      orgID: string;
      identityOptions: { wallet: Wallet; identity: Identity };
    },
  ) {
    const network = await this.appService.getNetworkConnection(
      userParams.orgID,
      userParams.identityOptions,
    );

    const resBuffer = await network
      .getContract('transferEquipment')
      .submitTransaction(
        'createTransferEquipment',
        JSON.stringify(transferEquipment),
      );
    const res = JSON.parse(Buffer.from(resBuffer).toString());
    return res;
  }
  async getByID(
    transferEquipmentID: string,
    userParams: {
      orgID: string;
      identityOptions: { wallet: Wallet; identity: Identity };
    },
  ) {
    const network = await this.appService.getNetworkConnection(
      userParams.orgID,
      userParams.identityOptions,
    );

    const resBuffer = await network
      .getContract('transferEquipment')
      .evaluateTransaction('read', transferEquipmentID);
    const res = JSON.parse(Buffer.from(resBuffer).toString());
    return res;
  }
  async getTeForTransfer(
    available: boolean,
    tspID: string,
    bookingNumber: string,
    userParams: {
      orgID: string;
      identityOptions: { wallet: Wallet; identity: Identity };
    },
  ) {
    const network = await this.appService.getNetworkConnection(
      userParams.orgID,
      userParams.identityOptions,
    );

    const resBuffer = await network
      .getContract('transferEquipment')
      .evaluateTransaction(
        available ? 'getAvailableTEforTransfer' : 'getTEforTransfer',
        tspID,
        bookingNumber,
      );
    const res = JSON.parse(Buffer.from(resBuffer).toString());
    return res;
  }
}
