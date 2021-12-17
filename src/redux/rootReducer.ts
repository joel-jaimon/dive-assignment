import { generalSlice } from "./reducers/general";

export const combinedReducers = {
  generalState: generalSlice.reducer,
};
