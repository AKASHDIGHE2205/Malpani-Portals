/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import toast from "react-hot-toast";
import { BaseUrl } from "../../../constant/BaseUrl";

export const getAllFirms = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/store/getAllFirms`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};
export const newFirm = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/store/newFirm`, data);
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
export const editFirm = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/store/editFirm`, data);
    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
  }
};

export const getAllBranches = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/store/getAllBranches`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};
export const newBranch = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/store/newBranch`, data);
    if (response.status === 201) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while creating the branch."
    );
  }
};
export const editBranch = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/store/editBranch`, data);
    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
  }
};

export const getAllCatg = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/store/getAllcatgs`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};
export const newCatg = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/store/newCatg`, data);
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
export const editCatg = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/store/editCatg`, data);
    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
  }
};

export const getAllLocation = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/store/getAllLocations`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};
export const newLocation = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/store/newLocation`, data);
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
export const editLocation = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/store/editLocation`, data);
    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
  }
};

export const getAllSection = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/store/getAllSections`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network error.");
    return null;
  }
};
export const newSection = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/store/newSection`, data);
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
export const editSection = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/store/editSection`, data);
    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
  }
};
