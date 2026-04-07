/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { toast } from "react-hot-toast";
import { BaseUrl } from "../../../constant/BaseUrl";

//create new group
export const createNewGroup = async (data: any) => {
  try {
    const response = await axios.post(`${BaseUrl}/post/newGroup`, data);
    if (response.status === 200) {
      toast.success("New Group Added Successfully");
    }
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};
