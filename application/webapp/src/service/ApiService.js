import { post, get } from "axios";
export default class ApiService {
  static URLS = {
    CREATE_TRANSFER_EQUIPMENT: "http://localhost:5000/te/",
    AVAILABLE_TRANSFER_EQUIPMENT: "http://localhost:5000/te/available/",
    SUBMIT_TRANSFER_EQUIPMENT_EVENT: "http://localhost:5000/te/events/",
  };

  static async createTransferEquipment(transferEquipment) {
    try {
      const response = await post(
        ApiService.URLS.CREATE_TRANSFER_EQUIPMENT,
        transferEquipment,
        {
          headers: {
            "Allow-Cross-Origin-Access": "*",
            Authorization: "Bearer " + localStorage.getItem("auth"),
          },
        }
      );
      console.log(JSON.stringify(response, null, 2));
      return {
        status: response.status,
        message: "Transfer Equipment Event successfully submitted",
      };
    } catch (error) {
      return {
        status: error.status,
        message: "Transfer Equipment Event could not be submitted",
      };
    }
  }
  static async submitTransferEquipmentEvent(transferEquipmentEventDto) {
    try {
      const response = await post(
        ApiService.URLS.SUBMIT_TRANSFER_EQUIPMENT_EVENT,
        transferEquipmentEventDto,
        {
          headers: {
            "Allow-Cross-Origin-Access": "*",
            Authorization: "Bearer " + localStorage.getItem("auth"),
          },
        }
      );
      console.log(JSON.stringify(response, null, 2));
      return {
        status: response.status,
        message: "Transfer Equipment Event successfully submitted",
      };
    } catch (error) {
      return {
        status: error.status,
        message: "Transfer Equipment Event could not be submitted",
      };
    }
  }
  static async assignTeToTransfer(params) {
    // try {
    //   const response = await post(
    //     ApiService.URLS.CREATE_TRANSFER_EQUIPMENT,
    //     transferEquipment,
    //     {
    //       headers: {
    //         "Allow-Cross-Origin-Access": "*",
    //         Authorization: "Bearer " + localStorage.getItem("auth"),
    //       },
    //     }
    //   );
    //   console.log(JSON.stringify(response, null, 2));
    //   return {
    //     status: response.status,
    //     message: "Transfer Equipment successfully created",
    //   };
    // } catch (error) {
    //   return {
    //     status: error.status,
    //     message: "Transfer Equipment could not be created",
    //   };
    // }
  }
  static async getAvailableTEforTransfer(tspID, bookingNumber) {
    try {
      const response = await get(ApiService.URLS.AVAILABLE_TRANSFER_EQUIPMENT, {
        params: { tspID, bookingNumber },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      });
      console.log(JSON.stringify(response, null, 2));
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      return {
        status: error.status,
        message: "Transfer Equipment could not be created",
      };
    }
  }
}
