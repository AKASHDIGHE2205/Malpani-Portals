import axios from "axios";
import toast from "react-hot-toast";
import { BaseUrl } from "../../constant/BaseUrl";

const getToken = () => {
  return sessionStorage.getItem("token");
};

export const AddPlotProperty = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/plot/AddPlotProperty`, data);
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

export const getAllProjects = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/plot/getAllProjects`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    return response.data;

  } catch (error: any) {
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};

export const getProjectDeatils = async (id: number) => {
  try {
    const response = await axios.get(`${BaseUrl}/plot/getProjectDetails/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

export const getProjectPlotById = async (project_id: number, plot_sr: number) => {
  try {
    const response = await axios.get(`${BaseUrl}/plot/project/${project_id}/plot/${plot_sr}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

export const UpdatePlotProperty = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/plot/UpdatePlotProperty`, data);
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

export const updatePlotMaster = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/plot/updatePlotMaster`, data);
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};


export const getPlotsFromStatus = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/plot/getPlotsFromStatus`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
}