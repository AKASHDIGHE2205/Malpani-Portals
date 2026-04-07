/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import toast from "react-hot-toast";
import { BaseUrl } from "../../constant/BaseUrl";

export const GetFilledChecklist = async (data: any) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/checklist/get-transactions`,
      data
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

//get membersall
export const GetAllMembers = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/checklist/get-Users`);
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

//get the questions
export const GetAllQuestions = async (data: any) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/checklist/all-questions`,
      data
    );
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

//edit member
export const EditMember = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/checklist/update-users`, data);
    if (response.status === 200) {
      toast.success(response.data.message || "Member updated successfully");
      return response;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

export const EditFaq = async (data: any) => {
  try {
    const response = await axios.put(
      `${BaseUrl}/checklist/update-questions`,
      data
    );
    if (response.status === 200) {
      toast.success(response.data.message);
      return response;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

export const getShopeeLocatioon = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/checklist/locations`);
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};
