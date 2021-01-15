import axios from "axios";
import type {
  GetHelloSignRequestType,
  GetHelloSignResponseType,
  GetSSCardPutURLResponseType,
  GetUserInfoResponseType,
  GetVeriffRequestType,
  GetVeriffResponseType,
  GetWorkerInfoResponseType,
  SubmitAccountInfoRequestType,
  SubmitAccountInfoResponseType,
  SubmitProfileInfoRequestType,
  SubmitProfileInfoResponseType,
  SubmitWorkerPaperworkRequestType,
  SubmitWorkerPaperworkResponseType,
  SubmitWorkerSSCardRequestType,
  SubmitWorkerVerificationRequestType,
  SubmitWorkerVerificationResponseType,
} from "../types/api";

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.code === "ECONNABORTED") {
      /* eslint-disable-next-line no-console */
      console.log("PuzzlOnboarding Connection Error: ", error);

      return Promise.reject(
        new Error("Unable to onboard at this time, please try again later!")
      );
    }

    return Promise.reject(error);
  }
);

export const getUserInfo = (APIKey: string, companyID: string) =>
  axios.get<GetUserInfoResponseType>(
    "https://api.joinpuzzl.com/mobile/getUserInfo",
    {
      headers: {
        authorization: `Bearer ${APIKey}`,
      },
      timeout: 8000,
      params: {
        companyID,
      },
    }
  );

export const getWorkerInfo = (
  APIKey: string,
  companyID: string,
  employeeID: string
) =>
  axios.get<GetWorkerInfoResponseType>(
    "https://api.joinpuzzl.com/mobile/getWorkerInfo",
    {
      headers: {
        authorization: `Bearer ${APIKey}`,
      },
      timeout: 8000,
      params: {
        companyID,
        employeeID,
      },
    }
  );

export const submitProfileInfo = (
  APIKey: string,
  data: SubmitProfileInfoRequestType
) =>
  axios.post<SubmitProfileInfoResponseType>(
    "https://api.joinpuzzl.com/mobile/submitWorkerProfileInfo",
    data,
    {
      headers: {
        authorization: `Bearer ${APIKey}`,
      },
      timeout: 8000,
    }
  );

export const submitAccountInfo = (
  APIKey: string,
  data: SubmitAccountInfoRequestType
) =>
  axios.post<SubmitAccountInfoResponseType>(
    "https://api.joinpuzzl.com/mobile/submitWorkerAccountInfo",
    data,
    {
      headers: {
        authorization: `Bearer ${APIKey}`,
      },
      timeout: 8000,
    }
  );

export const getVeriff = (APIKey: string, data: GetVeriffRequestType) =>
  axios.post<GetVeriffResponseType>(
    "https://api.joinpuzzl.com/mobile/getVeriffSetup",
    data,
    {
      headers: {
        authorization: `Bearer ${APIKey}`,
      },
      timeout: 8000,
    }
  );

export const submitWorkerVerification = (
  APIKey: string,
  data: SubmitWorkerVerificationRequestType
) =>
  axios.post<SubmitWorkerVerificationResponseType>(
    "https://api.joinpuzzl.com/mobile/submitWorkerVerification",
    data,
    {
      headers: {
        authorization: `Bearer ${APIKey}`,
      },
      timeout: 8000,
    }
  );

export const submitWorkerSSCard = async (
  APIKey: string,
  data: SubmitWorkerSSCardRequestType
) => {
  const getPutUrlResp = await axios.get<GetSSCardPutURLResponseType>(
    "https://api.joinpuzzl.com/generate-sscard-put-url",
    {
      params: {
        Key: `${data.email}-sscard`,
        ContentType: "image/png",
      },
      headers: {
        authorization: `Bearer ${APIKey}`,
        "Content-Type": "image/png",
      },
      timeout: 8000,
    }
  );

  if (!getPutUrlResp.data.success) {
    throw new Error("Failed to prepare Social Security Card upload!");
  }

  return axios.put(getPutUrlResp.data.data.putURL, data.image, {
    headers: {
      "Content-Type": "image/png",
    },
    timeout: 15000,
  });
};

export const getHelloSign = (APIKey: string, data: GetHelloSignRequestType) =>
  axios.post<GetHelloSignResponseType>(
    "https://api.joinpuzzl.com/mobile/signW2",
    data,
    {
      headers: {
        authorization: `Bearer ${APIKey}`,
      },
      timeout: 8000,
    }
  );

export const submitWorkerPaperwork = (
  APIKey: string,
  data: SubmitWorkerPaperworkRequestType
) =>
  axios.post<SubmitWorkerPaperworkResponseType>(
    "https://api.joinpuzzl.com/mobile/submitWorkerPaperwork",
    data,
    {
      headers: {
        authorization: `Bearer ${APIKey}`,
      },
      timeout: 8000,
    }
  );
