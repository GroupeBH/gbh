import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AdminState = {
  search: string;
  isAuthenticated: boolean;
};

const initialState: AdminState = {
  search: "",
  isAuthenticated: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setAdminAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setAdminSearch, setAdminAuthenticated } = adminSlice.actions;
export default adminSlice.reducer;
