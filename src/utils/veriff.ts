import VeriffSdk from "@veriff/react-native-sdk";
import { submitWorkerVerification } from "../functions/api";
import type { GetVeriffResponseType } from "../types/api";

export const runVeriffFlow = async (
  APIKey: string,
  companyID: string,
  employeeID: string,
  veriffInfo: GetVeriffResponseType["verification"]
): Promise<void> => {
  if (VeriffSdk == null) {
    throw new Error("Veriff could not be setup at this time!");
  }

  const result = await VeriffSdk.launchVeriff({ sessionUrl: veriffInfo.url });

  switch (result.status) {
    case VeriffSdk.statusDone:
      // user submitted the images and completed the flow
      // note that this does not mean a final decision yet
      break;
    case VeriffSdk.statusCanceled:
      // user canceled the flow before completing
      throw new Error("VERIFF CANCELLED");
    case VeriffSdk.statusError:
      // the flow could not be completed due to an error
      throw new Error(result.error);
  }

  const verifyResponse = await submitWorkerVerification(APIKey, {
    companyID,
    employeeID,
    veriff_id: veriffInfo.id,
  });

  if (!verifyResponse.data.success) {
    throw new Error("Verification failed!");
  }
};
