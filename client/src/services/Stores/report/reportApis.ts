/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { BaseUrl } from "../../../constant/BaseUrl";
import toast from "react-hot-toast";

export const getEntryStatus = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/store/getEntryStatus`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};

export const brachWiseReports = async (data: any) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/store/branch-wise-report`,
      data
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};

export const firmWiseReports = async (data: any) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/store/firm-wise-report`,
      data
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};

export const yearWiseReports = async (data: any) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/store/year-wise-report`,
      data
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};

export const branchFirmWiseReports = async (data: any) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/store/firm-branch-wise-report`,
      data
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};

export const getReportData = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/store/getReportData`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};
