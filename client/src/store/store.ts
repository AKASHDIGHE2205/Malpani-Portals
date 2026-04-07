import { configureStore } from "@reduxjs/toolkit";
import TransactionSlice from "../feature/Stores/transaction/TransactionSlice";
import AuthSlice from "../feature/auth/authSlice";
import PTransactionSlice from "../feature/Preperties/ptransaction/PTransactionSlice";
import postSlice from "../feature/post/PostEntrySlice";

export const store = configureStore({
  reducer: {
    transaction: TransactionSlice,
    auth: AuthSlice,
    ptansaction: PTransactionSlice,
    postentry: postSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
