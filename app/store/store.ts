import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import {
  adminAuthApi,
  appointmentsApi,
  availabilityApi,
  blocksApi,
  contactsApi,
  paymentsApi,
  servicesApi,
} from "./api";
import adminReducer from "./adminSlice";

export const store = configureStore({
  reducer: {
    [servicesApi.reducerPath]: servicesApi.reducer,
    [availabilityApi.reducerPath]: availabilityApi.reducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [blocksApi.reducerPath]: blocksApi.reducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      servicesApi.middleware,
      availabilityApi.middleware,
      appointmentsApi.middleware,
      contactsApi.middleware,
      paymentsApi.middleware,
      blocksApi.middleware,
      adminAuthApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
