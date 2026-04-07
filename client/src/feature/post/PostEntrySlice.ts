import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Post {
  dept_id: number;
  dept_name: string;
  firm_id: number;
  firm_name: string;
  post_id: number;
  post_name: string;
  party_id: number;
  party_name: string;
  city_name: string;
  city_id: number;
}

const initialState: Post = {
  dept_id: 0,
  dept_name: "",
  firm_id: 0,
  firm_name: "",
  post_id: 0,
  post_name: "",
  party_id: 0,
  party_name: "",
  city_name: "",
  city_id: 0,
};

export const PostEntrySlice = createSlice({
  name: "PostEntry",
  initialState,
  reducers: {
    handleSelectPostType: (
      state: Post,
      action: PayloadAction<{ id: number; name: string }>
    ) => {
      const { id, name } = action.payload;
      state.post_id = id;
      state.post_name = name;
    },
    handleSelectDept: (
      state: Post,
      action: PayloadAction<{ id: number; name: string }>
    ) => {
      const { id, name } = action.payload;
      state.dept_id = id;
      state.dept_name = name;
    },
    handleSelectFirm: (
      state: Post,
      action: PayloadAction<{ id: number; name: string }>
    ) => {
      const { id, name } = action.payload;
      state.firm_id = id;
      state.firm_name = name;
    },
    handlePartyNames: (
      state: Post,
      action: PayloadAction<{
        id: number;
        name: string;
        city: string;
        party_city: number;
      }>
    ) => {
      const { id, name, city, party_city } = action.payload;

      state.party_id = id;
      state.party_name = name;
      state.city_name = city;
      state.city_id = party_city;
    },
  },
});

export const {
  handleSelectDept,
  handleSelectFirm,
  handleSelectPostType,
  handlePartyNames,
} = PostEntrySlice.actions;
export default PostEntrySlice.reducer;
