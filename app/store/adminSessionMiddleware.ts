import { isAnyOf, type Middleware, type UnknownAction } from "@reduxjs/toolkit";

import {
  adminAuthApi,
  appointmentsApi,
  blocksApi,
  contactsApi,
  servicesApi,
} from "./api";
import { setAdminAuthenticated, setAdminSearch } from "./adminSlice";

const isAdminAuthSuccess = isAnyOf(
  adminAuthApi.endpoints.adminLogin.matchFulfilled,
  adminAuthApi.endpoints.adminRegister.matchFulfilled,
  adminAuthApi.endpoints.adminRefresh.matchFulfilled,
);

const isAdminLogoutAction = isAnyOf(
  adminAuthApi.endpoints.adminLogout.matchFulfilled,
  adminAuthApi.endpoints.adminLogout.matchRejected,
);

const isAdminProtectedRejected = isAnyOf(
  adminAuthApi.endpoints.adminLogin.matchRejected,
  adminAuthApi.endpoints.adminRegister.matchRejected,
  adminAuthApi.endpoints.adminRefresh.matchRejected,
  servicesApi.endpoints.adminCreateService.matchRejected,
  servicesApi.endpoints.adminUpdateService.matchRejected,
  servicesApi.endpoints.adminDeleteService.matchRejected,
  appointmentsApi.endpoints.adminListAppointments.matchRejected,
  appointmentsApi.endpoints.adminUpdateAppointmentStatus.matchRejected,
  contactsApi.endpoints.adminListContacts.matchRejected,
  blocksApi.endpoints.adminCreateBlock.matchRejected,
  blocksApi.endpoints.adminDeleteBlock.matchRejected,
);

const getStatusCodeFromRejectedAction = (action: UnknownAction): number | null => {
  if (!("payload" in action)) return null;

  const payload = action.payload;
  if (!payload || typeof payload !== "object") return null;

  const error = payload as { status?: unknown; originalStatus?: unknown };
  if (typeof error.status === "number") {
    return error.status;
  }
  if (typeof error.originalStatus === "number") {
    return error.originalStatus;
  }

  return null;
};

const isAuthStatus = (statusCode: number | null) =>
  statusCode === 401 || statusCode === 403;

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

    if (isAdminProtectedRejected(action)) {
      const statusCode = getStatusCodeFromRejectedAction(action);
      if (isAuthStatus(statusCode)) {
        dispatch(setAdminAuthenticated(false));
        dispatch(setAdminSearch(""));
      }
    }

    return result;
  };
