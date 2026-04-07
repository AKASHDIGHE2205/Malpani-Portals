/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { BaseUrl } from "../../../constant/BaseUrl";

//get Inward/outward repoprt
export const getInOutReport = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/post/getInOutReports`, data);
    if (response.status === 200) {
      return response;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
