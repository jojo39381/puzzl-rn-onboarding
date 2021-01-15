import "react-native-gesture-handler";
import * as React from "react";
import { Alert, StyleSheet, Image, TouchableOpacity, View } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  SafeAreaInsetsContext,
} from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Intro from "./screens/Intro";
import ProfileInfo from "./screens/ProfileInfo";
import CreateAccount from "./screens/CreateAccount";
import Veriff from "./screens/Veriff";
import HelloSign from "./screens/HelloSign";
import ThankYou from "./screens/ThankYou";
import LoadingScreen from "./components/Loading";
import ExitDialog from "./components/ExitDialog";
import TestModeBanner from "./components/TestModeBanner";
import { getUserInfo, getWorkerInfo } from "./functions/api";
import type {
  GetUserInfoResponseType,
  GetWorkerInfoResponseType,
} from "./types/api";
import type { RootStackParamList } from "./types/navigation";
import close_icon from "./assets/images/close_icon.png";

const isEmpty = (str: string): boolean => str == null || str.length === 0;

const Stack = createStackNavigator<RootStackParamList>();

interface OnboardingProps {
  APIKey: string;
  companyID: string;
  employeeID: string;
  onCancel: () => void | Promise<void>;
  onFinished: () => void | Promise<void>;
  onError?: () => void | Promise<void>;
  showError?: boolean;
  errorMessage?: string;
}

const PuzzlOnboarding: React.FC<OnboardingProps> = ({
  APIKey,
  companyID,
  employeeID,
  onCancel,
  onFinished,
  onError,
  showError = true,
  errorMessage = "An error occurred, please try again later.",
}) => {
  const [loading, setLoading] = React.useState(true);
  const [confirmExit, showConfirmExit] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<
    GetUserInfoResponseType["data"] | null
  >(null);
  const [workerInfo, setWorkerInfo] = React.useState<
    GetWorkerInfoResponseType["data"] | null
  >(null);
  const [testMode, setTestMode] = React.useState<boolean>(false);
  const [controlsHidden, setControlsHidden] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      try {
        if (isEmpty(APIKey)) {
          throw new Error("The APIKey prop is not set!");
        } else if (isEmpty(companyID)) {
          throw new Error("The companyID prop is not set!");
        } else if (isEmpty(employeeID)) {
          throw new Error("The employeeID prop is not set!");
        }

        const userResp = await getUserInfo(APIKey, companyID);
        setUserInfo(userResp.data.data);
        if (userResp.data.testMode != null) {
          setTestMode(userResp.data.testMode === true);
        }

        const workerResp = await getWorkerInfo(APIKey, companyID, employeeID);
        setWorkerInfo(workerResp.data.data);
        if (workerResp.data.testMode != null) {
          setTestMode(workerResp.data.testMode === true);
        }

        setLoading(false);
      } catch (error) {
        /* eslint-disable no-console */
        console.log("PuzzlOnboarding Setup Error:", error.message);

        if (error.response) {
          if (error.response.data && error.response.data.message) {
            console.log(`Puzzl Request Error: ${error.response.data.message}`);
          } else {
            console.log(`Puzzl Request Error: ${error.response.statusText}`);
          }
        }
        /* eslint-enable no-console */

        if (showError) {
          Alert.alert(
            "Error",
            errorMessage,
            [
              {
                text: "OK",
                onPress: () => (onError ? onError() : onCancel()),
              },
            ],
            { cancelable: false }
          );
        } else if (onError) {
          await onError();
        } else {
          await onCancel();
        }
      }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["right", "top", "left"]}>
        <LoadingScreen visible={loading} />
        {!loading && (
          <>
            <ExitDialog
              visible={confirmExit}
              userInfo={userInfo}
              handleHide={() => showConfirmExit(false)}
              handleExit={onCancel}
            />
            {!controlsHidden && (
              <>
                <TestModeBanner visible={testMode} />
                <SafeAreaInsetsContext.Consumer>
                  {(insets) => (
                    <TouchableOpacity
                      onPress={() => showConfirmExit(true)}
                      style={[
                        styles.closeTouch,
                        {
                          top: (insets?.top ?? 44) + 8,
                        },
                      ]}
                    >
                      <View style={styles.closeContainer}>
                        <Image style={styles.closeIcon} source={close_icon} />
                      </View>
                    </TouchableOpacity>
                  )}
                </SafeAreaInsetsContext.Consumer>
              </>
            )}
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Intro" headerMode="none">
                <Stack.Screen
                  name="Intro"
                  component={Intro}
                  initialParams={{
                    userInfo: userInfo!,
                  }}
                  options={{
                    gestureEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="ProfileInfo"
                  component={ProfileInfo}
                  initialParams={{
                    APIKey,
                    companyID,
                    employeeID,
                    userInfo: userInfo!,
                    workerInfo: workerInfo!,
                  }}
                />
                <Stack.Screen
                  name="CreateAccount"
                  component={CreateAccount}
                  initialParams={{
                    APIKey,
                    companyID,
                    employeeID,
                    userInfo: userInfo!,
                    workerInfo: workerInfo!,
                    testMode,
                  }}
                />
                <Stack.Screen
                  name="Veriff"
                  initialParams={{
                    APIKey,
                    companyID,
                    employeeID,
                    userInfo: userInfo!,
                  }}
                >
                  {(props) => (
                    <Veriff {...props} setControlsHidden={setControlsHidden} />
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="HelloSign"
                  initialParams={{
                    APIKey,
                    companyID,
                    userInfo: userInfo!,
                    workerInfo: workerInfo!,
                  }}
                  options={{
                    gestureEnabled: false,
                  }}
                >
                  {(props) => (
                    <HelloSign
                      {...props}
                      setControlsHidden={setControlsHidden}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="ThankYou"
                  initialParams={{
                    userInfo: userInfo!,
                  }}
                  options={{
                    gestureEnabled: false,
                  }}
                >
                  {(props) => <ThankYou {...props} onFinished={onFinished} />}
                </Stack.Screen>
              </Stack.Navigator>
            </NavigationContainer>
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  closeTouch: {
    position: "absolute",
    top: 52,
    right: 8,
    zIndex: 4,
  },
  closeContainer: {
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#cccccc",
    borderRadius: 20,
  },
  closeIcon: {
    resizeMode: "contain",
    width: 18,
    height: 18,
  },
});

export default PuzzlOnboarding;
