/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { BaseUrl } from "../../../constant/BaseUrl";
import toast from "react-hot-toast";

export const getPropertyRegister = async (data: any) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/property/property-register`,
      data
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message || "Netwoerk Error");
  }
};

export const getLocationwiseRegister = async (data: any) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/property/locationwise-register`,
      data
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message || "Netwoerk Error");
  }
};
export const getProLocSerRegister = async () => {
  try {
    const response = await axios.get(
      `${BaseUrl}/property/location-servey-register`
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message || "Netwoerk Error");
  }
};
