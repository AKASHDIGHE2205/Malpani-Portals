import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firmID: 0,
  firmName: "",
  locationID: 0,
  locationName: "",
  secID: 0,
  secName: "",
  catgID: 0,
  catgName: "",
  branchID: 0,
  branchName: "",
  depositedata: []
}

export const TransactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    handleFirm: (state, actions) => {
      const { id, name } = actions.payload;
      state.firmID = id;
      state.firmName = name;
    },
    handleLocation: (state, actions) => {
      const { id, name } = actions.payload;
      state.locationID = id;
      state.locationName = name;
    },
    handleSection: (state, actions) => {
      const { id, name } = actions.payload;
      state.secID = id;
      state.secName = name;
    },
    handleCategory: (state, actions) => {
      const { id, name } = actions.payload;
      state.catgID = id;
      state.catgName = name;
    },
    handleBranch: (state, actions) => {
      const { id, name } = actions.payload;
      state.branchID = id;
      state.branchName = name;
    },
    handleDepositeData: (state, actions) => {
      const { data } = actions.payload;
      state.depositedata = data;
    }
  }
});
export const { handleFirm, handleLocation, handleCategory, handleSection, handleDepositeData, handleBranch } = TransactionSlice.actions;
export default TransactionSlice.reducer;