declare module "@veriff/react-native-sdk" {
  export const statusDone = "STATUS_DONE";
  export const statusCanceled = "STATUS_CANCELED";
  export const statusError = "STATUS_ERROR";

  export interface LaunchVeriff {
    sessionUrl: string;
    branding?: {
      themeColor?: string;
      logo?: string;
      androidNotificationIcon?: string;
    };
  }

  export interface LaunchVeriffResult {
    status: string;
    error?: string;
  }

  export function launchVeriff(args: LaunchVeriff): Promise<LaunchVeriffResult>;
}
