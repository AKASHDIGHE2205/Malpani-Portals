/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import toast from "react-hot-toast";
import { BaseUrl } from "../../../constant/BaseUrl";

// ------------ Consignor Api Functions ------------ //
export const getAllConsigners = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/property/getAllConsignor`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};
export const newConsigner = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/property/newConsigner`, data);
    if (response.status === 201) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while creating the firm."
    );
  }
};
export const editConsigner = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/property/editConsigner`, data);
    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
  }
};

// ------------ Consignee Api Functions ------------ //
export const getAllConsignees = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/property/getAllConsignee`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};
export const newConsignee = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/property/newConsignee`, data);
    if (response.status === 201) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while creating the firm."
    );
  }
};
export const editConsignee = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/property/editConsignee`, data);
    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
  }
};

// ------------ Document Api Functions ------------ //
export const getAllDocument = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/property/getAllDocument`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};
export const newDocument = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/property/newDocument`, data);
    if (response.status === 201) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while creating the firm."
    );
  }
};
export const editDocument = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/property/editDocument`, data);
    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
  }
};

// ------------ Location Api Functions ------------ //
export const getAllPLocation = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/property/getAllPLocation`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};
export const newPLocation = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/property/newPLocation`, data);
    if (response.status === 201) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while creating the firm."
    );
  }
};
export const editPLocation = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/property/editPLocation`, data);
    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
  }
};
