export * from "./types";

export { servicesApi } from "./servicesApi";
export { availabilityApi } from "./availabilityApi";
export { appointmentsApi } from "./appointmentsApi";
export { contactsApi } from "./contactsApi";
export { paymentsApi } from "./paymentsApi";
export { blocksApi } from "./blocksApi";
export { adminAuthApi } from "./adminAuthApi";

export {
  useGetServicesQuery,
  useAdminCreateServiceMutation,
  useAdminUpdateServiceMutation,
  useAdminDeleteServiceMutation,
} from "./servicesApi";

export { useGetAvailabilityQuery } from "./availabilityApi";

export {
  useCreateAppointmentMutation,
  useGetAppointmentQuery,
  useAdminListAppointmentsQuery,
  useAdminUpdateAppointmentStatusMutation,
} from "./appointmentsApi";

export { useCreateContactMutation, useAdminListContactsQuery } from "./contactsApi";

export { useCreatePaymentIntentMutation } from "./paymentsApi";

export { useAdminCreateBlockMutation, useAdminDeleteBlockMutation } from "./blocksApi";

export {
  useAdminLoginMutation,
  useAdminRefreshMutation,
  useAdminLogoutMutation,
} from "./adminAuthApi";
