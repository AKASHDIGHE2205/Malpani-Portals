import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locName: "",
  locId: "",
  consignorName: "",
  consignorId: "",
  consigneeName: "",
  consigneeId: "",
  propId: "",
  propDate: "",
  propName: "",
};

export const PTransactionSlice = createSlice({
  name: "PTransaction",
  initialState,
  reducers: {
    handlePLocation: (state, actions) => {
      const { id, name } = actions.payload;
      state.locId = id;
      state.locName = name;
    },
    handlePConsignor: (state, actions) => {
      const { id, name } = actions.payload;
      state.consignorId = id;
      state.consignorName = name;
    },
    handlePConsignee: (state, actions) => {
      const { id, name } = actions.payload;
      state.consigneeId = id;
      state.consigneeName = name;
    },
    handleSaleProperty: (state, actions) => {
      const { id, name, date } = actions.payload;
      state.propId = id;
      state.propName = name;
      state.propDate = date;
    },
  },
});
export const {
  handlePLocation,
  handlePConsignor,
  handlePConsignee,
  handleSaleProperty,
} = PTransactionSlice.actions;
export default PTransactionSlice.reducer;
