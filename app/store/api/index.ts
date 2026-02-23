export * from "./types";

export { servicesApi } from "./servicesApi";
export { availabilityApi } from "./availabilityApi";
export { appointmentsApi } from "./appointmentsApi";
export { contactsApi } from "./contactsApi";
export { paymentsApi } from "./paymentsApi";
export { blocksApi } from "./blocksApi";
export { adminAuthApi } from "./adminAuthApi";
export { b2bAdminApi } from "./b2bAdminApi";

export {
  useGetServicesQuery,
  useGetServiceTestimonialsQuery,
  useCreateServiceTestimonialMutation,
  useAdminCreateServiceMutation,
  useAdminUpdateServiceMutation,
  useAdminDeleteServiceMutation,
} from "./servicesApi";

export { useGetAvailabilityQuery } from "./availabilityApi";

export {
  useCreateAppointmentMutation,
  useGetAppointmentQuery,
  useLookupAppointmentMutation,
  useAdminListAppointmentsQuery,
  useAdminUpdateAppointmentStatusMutation,
} from "./appointmentsApi";

export { useCreateContactMutation, useAdminListContactsQuery } from "./contactsApi";

export { useCreatePaymentIntentMutation } from "./paymentsApi";

export { useAdminCreateBlockMutation, useAdminDeleteBlockMutation } from "./blocksApi";

export {
  useAdminRegisterMutation,
  useAdminLoginMutation,
  useAdminRefreshMutation,
  useAdminLogoutMutation,
} from "./adminAuthApi";

export {
  useAdminListRfpQuery,
  useAdminGetRfpByIdQuery,
  useAdminUpdateRfpStatusMutation,
  useAdminListB2bReferencesQuery,
  useAdminCreateB2bReferenceMutation,
  useAdminUpdateB2bReferenceMutation,
  useAdminDeleteB2bReferenceMutation,
  useAdminListB2bCaseStudiesQuery,
  useAdminCreateB2bCaseStudyMutation,
  useAdminUpdateB2bCaseStudyMutation,
  useAdminDeleteB2bCaseStudyMutation,
} from "./b2bAdminApi";
