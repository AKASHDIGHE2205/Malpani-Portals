/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import moment from "moment";
import { toast } from "react-hot-toast";
import { BaseUrl } from "../../../constant/BaseUrl";

interface Data {
  entry_id: number;
  entry_date: string;
  loc_id: number;
}

//inwardEntry View
export const getAllInView = async (data: any) => {
  const body = {
    entry_date: data.date,
    loc_id: data.loc_id,
  };
  try {
    const response = await axios.post(`${BaseUrl}/post/getAllInEntry`, body);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

//Outward Entry
export const getAllOutView = async (data: any) => {
  const body = {
    entry_date: data.date,
    loc_id: data.loc_id,
  };
  try {
    const response = await axios.post(`${BaseUrl}/post/getAllOutEntry`, body);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

//get department

export const getDepartment = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/post/getDepts`);

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getFirm = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/post/getFirms`);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

//edit inwardentry
export const editInwardEntry = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/post/updateInEntry`, data);
    if (response.status === 200) {
      toast.success("Inward Entry Updated Successfully");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

//edit outwardentry
export const editOutwardEntry = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/post/updateOutEntry`, data);
    if (response.status === 200) {
      toast.success(
        response.data.message || "Outward Entry Updated Successfully"
      );
    }
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};
//delete inwardOUtentry

export const EditEntry = async (item: any) => {
  const body = {
    entry_id: item.item.entry_id,
    flag: item.item.flag,
    entry_date: moment(item.item.entry_date).format("YYYY/MM/DD"),
    status: "I",
    loc_id: item.loc_id,
  };

  try {
    const response = await axios.put(`${BaseUrl}/post/delInOutEntry`, body);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

//inwardpost entry

export const postEntry = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/post/newEntry`, data);
    if (response.status === 201) {
      toast.success(response.data.message);
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
// post outward entry
export const postOutEntry = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/post/newOutEntry`, data);
    if (response.status === 201) {
      toast.success(response.data.message);
    }
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

//get post type
export const getPostType = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/post/getPTypes`);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// get names
export const getNames = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/post/getPartyNames`);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

//stamp entry view
export const getStamps = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/post/getAllStampEntry`);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

//post stmamp entry
export const postStampEntry = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/post/newStampEntry`, data);
    if (response.status === 201) {
      toast.success("Stamp Entry Added Successfully");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
//edit stamp entry
export const editStampEntry = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/post/updateStampEntry`, data);
    if (response.status === 200) {
      toast.success("Stamp Entry Updated Successfully");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const DeleteStampEntry = async (id: any) => {
  try {
    const response = await axios.delete(`${BaseUrl}/post/delStampEntry/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

//post voucher entry
export const postVoucherEntry = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/post/newVoucherEntry`, data);
    if (response.status === 201) {
      toast.success("Voucher Entry Added Successfully");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

//voucher view
export const getVoucher = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/post/getAllVoucherEntry`);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// edit voucherentry
export const editVoucherEntry = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/post/updateVEntry`, data);
    if (response.status === 200) {
      toast.success("Voucher Entry Updated Successfully");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const DeleteVoucherEntry = async (id: any) => {
  try {
    const response = await axios.delete(`${BaseUrl}/post/delVEntry/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

//outwardDetailsEntry
export const OutwardDetails = async (data: any) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/post/getAllOutwardDetails`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
// update outward details

export const updateOutwardDetails = async (data: any) => {
  try {
    const response = await axios.put(`${BaseUrl}/post/updateEntry`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

//get Edit Outward Form data
export const getEditOutFormData = async (data: Data) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/post/getEditOutFormData`,
      data
    );
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};
