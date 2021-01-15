export type GetUserInfoResponseType = {
  data: {
    business_name: string;
    business_email: string;
    hasLogo: boolean;
    logoUrl: string | null;
  };
  testMode?: boolean;
};

export type GetWorkerInfoResponseType = {
  data: {
    first_name: string;
    last_name: string;
    email: string;
  };
  testMode?: boolean;
};

export type SubmitProfileInfoRequestType = {
  companyID: string;
  employeeID: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  ssn: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  dob: string;
};

export type SubmitProfileInfoResponseType = {
  success: boolean;
  data: SubmitProfileInfoRequestType;
};

export type SubmitAccountInfoRequestType = {
  companyID: string;
  employeeID: string;
  email: string;
  password: string;
};

export type SubmitAccountInfoResponseType = {
  success: boolean;
};

export type GetVeriffRequestType = {
  first_name: string;
  last_name: string;
  document_type: "DRIVERS_LICENSE" | "PASSPORT";
};

export type GetVeriffResponseType = {
  status: string;
  success: boolean;
  verification: {
    id: string;
    url: string;
    sessionToken: string;
    baseUrl: string;
  };
};

export type SubmitWorkerVerificationRequestType = {
  companyID: string;
  employeeID: string;
  veriff_id: string;
};

export type SubmitWorkerVerificationResponseType = {
  success: boolean;
  data: SubmitWorkerVerificationRequestType;
};

export type SubmitWorkerSSCardRequestType = {
  email: string;
  image: string;
};

export type GetSSCardPutURLResponseType = {
  success: boolean;
  data: {
    putURL: string;
  };
};

export type GetHelloSignRequestType = {
  companyID: string;
  employeeID: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  ssn: string;
  dob: string;
  email: string;
  phone_number: string;
};

export type GetHelloSignResponseType = {
  signURL: string;
  employee_sigId: string;
  company_sigId: string;
  signature_request_id: string;
  signature_id: string;
  token: string;
};

export type SubmitWorkerPaperworkRequestType = {
  companyID: string;
  employeeID: string;
  email: string;
  employee_sigId: string;
  company_sigId: string;
  signature_request_id: string;
};

export type SubmitWorkerPaperworkResponseType = {
  success: boolean;
  data: SubmitWorkerPaperworkRequestType;
};
