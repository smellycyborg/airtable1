import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface AppState {
  search_result: any[];
  search_param: String;
}

const initialState: AppState = {
  search_result: [],
  search_param: "",
};

export const appSlice = createSlice({
  name: "app_state",
  initialState,
  reducers: {
    setSearchParam: (state, action: PayloadAction<String>) => {
      state.search_param = action.payload;
    },
    setSearchResult: (state, action: PayloadAction<any[]>) => {
      state.search_result = action.payload;
    },
  },
});

export const { setSearchParam, setSearchResult } = appSlice.actions;

export const search_result = (state: RootState) => state.app.search_result;
export const search_param = (state: RootState) => state.app.search_param;

export default appSlice.reducer;