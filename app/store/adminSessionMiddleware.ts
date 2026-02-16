import { isAnyOf, type Middleware } from "@reduxjs/toolkit";

import {
  adminAuthApi,
} from "./api";
import { setAdminAuthenticated, setAdminSearch } from "./adminSlice";

const isAdminAuthSuccess = isAnyOf(
  adminAuthApi.endpoints.adminLogin.matchFulfilled,
  adminAuthApi.endpoints.adminRegister.matchFulfilled,
);

const isAdminLogoutAction = isAnyOf(
  adminAuthApi.endpoints.adminLogout.matchFulfilled,
  adminAuthApi.endpoints.adminLogout.matchRejected,
);

export const adminSessionMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    const result = next(action);

    if (isAdminAuthSuccess(action)) {
      dispatch(setAdminAuthenticated(true));
      return result;
    }

    if (isAdminLogoutAction(action)) {
      dispatch(setAdminAuthenticated(false));
      dispatch(setAdminSearch(""));
      return result;
    }

    return result;
  };
