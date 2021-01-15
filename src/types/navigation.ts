import type {
  GetHelloSignResponseType,
  GetUserInfoResponseType,
  GetWorkerInfoResponseType,
} from "./api";

type PersonalDataType = {
  first_name: string;
  last_name: string;
  middle_initial: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  ssn: string;
  dob: string;
  phone_number: string;
};

export type RootStackParamList = {
  Intro: {
    userInfo?: GetUserInfoResponseType["data"];
  };
  ProfileInfo: {
    APIKey?: string;
    companyID?: string;
    employeeID?: string;
    userInfo?: GetUserInfoResponseType["data"];
    workerInfo?: GetWorkerInfoResponseType["data"];
  };
  CreateAccount: {
    APIKey?: string;
    companyID?: string;
    employeeID?: string;
    userInfo?: GetUserInfoResponseType["data"];
    workerInfo?: GetWorkerInfoResponseType["data"];
    testMode?: boolean;
    personalData: PersonalDataType;
  };
  Veriff: {
    APIKey?: string;
    companyID?: string;
    employeeID?: string;
    userInfo?: GetUserInfoResponseType["data"];
    personalData: PersonalDataType;
    email: string;
  };
  HelloSign: {
    APIKey?: string;
    companyID?: string;
    employeeID?: string;
    userInfo?: GetUserInfoResponseType["data"];
    workerInfo?: GetWorkerInfoResponseType["data"];
    personalData: PersonalDataType;
    helloInfo: GetHelloSignResponseType;
  };
  ThankYou: {
    userInfo?: GetUserInfoResponseType["data"];
  };
};
