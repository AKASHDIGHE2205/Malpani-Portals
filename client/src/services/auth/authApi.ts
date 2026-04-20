/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import toast from "react-hot-toast";
import { BaseUrl } from "../../constant/BaseUrl";

interface RegisterData {
  f_name: string;
  l_name: string;
  password: string;
  email: string;
  mobile: string;
}

export const registerApi = async (data: RegisterData) => {
  try {
    const response = await axios.post(`${BaseUrl}/auth/register`, data);
    if (response?.status === 201) {
      toast.success(response?.data?.message || "Registration successful!");
      return response?.data;
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    const errorMessage = error?.response?.data?.message || "Network error.";
    toast.error(errorMessage);
  }
};

export const LoginApi = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/auth/login`, data);
    if (response?.status === 200) {
      toast.success(response?.data?.message);
      return response?.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network error!");
  }
};

export const sendOtp = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/auth/sendotp`, data);
    if (response.status === 200) {
      toast.success(response.data.message || "OTP send successfully!");
      return response;
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "failed to send OTP. Please try again."
    );
    throw error;
  }
};

export const ValidateOtp = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/auth/validateotp`, data);
    if (response.status === 200) {
      toast.success(response.data.message || "OTP send successfully!");
      return response;
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "failed to send OTP. Please try again."
    );
    throw error;
  }
};

export const UpdateOtp = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/auth/updateotp`, data);
    if (response.status === 200) {
      toast.success(response.data.message || "Password reset successfully!");
      return response;
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.message ||
        "failed to reset password. Please try again."
    );
    throw error;
  }
};


// -------------------  Master User  ------------------------------- 
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/auth/getAllUsers`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Network Error.");
    return null;
  }
};

export const editUser = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/auth/editUser`, data);
    if (response.status === 200) {
      toast.success(response.data.message || "User updated successfully.");
      return response.data;
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error updating user.");
  }
};