import { Controller, Get, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { TransferEquipmentService } from './transfer-equipment.service';
import { TransferEquipmentEventDTO, TransferEquipment } from 'app-shared-library';

@Controller('te')
export class TransferEquipmentController {
    constructor(private readonly teService:TransferEquipmentService){}

    @Post('/events')
    @HttpCode(HttpStatus.CREATED)
    async submitTeEvent(@Body() transferEquipmentEventDTO: TransferEquipmentEventDTO){
        console.log("aaa",JSON.stringify(transferEquipmentEventDTO,null,2))
        return await this.teService.submitEvent(transferEquipmentEventDTO);
        // throw new Error('Method not implemented.');
    }
    @Post('/associate')
    @HttpCode(HttpStatus.CREATED)
    async associateTransfer(@Body() associationData: {
        registrationNumber: string,
        tspID: string,
        bookingNumber: string
    }){
        console.log("bbb",JSON.stringify(associationData,null,2))
        return await this.teService.associateTransfer(associationData);
        // throw new Error('Method not implemented.');
    }
    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async createTransferEquipment(@Body() transferEquipmentDTO: TransferEquipment){
        console.log(JSON.stringify(transferEquipmentDTO,null,2))
        return await this.teService.save(transferEquipmentDTO);
        // throw new Error('Method not implemented.');
    }
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getTeByID(){
        throw new Error('Method not implemented.');

    }
    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAllTe(){
        throw new Error('Method not implemented.');

    }
}
