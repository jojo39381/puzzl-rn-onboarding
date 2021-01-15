import * as React from "react";
import { StyleSheet, View, Text, TextInput, Image, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../types/navigation";
import ActionButton from "../components/ActionButton";
import { submitAccountInfo } from "../functions/api";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface PropTypes {
  route: RouteProp<RootStackParamList, "CreateAccount">;
  navigation: StackNavigationProp<RootStackParamList, "CreateAccount">;
}

const CreateAccount: React.FC<PropTypes> = ({ route, navigation }) => {
  const {
    APIKey,
    companyID,
    employeeID,
    userInfo,
    workerInfo,
    personalData,
    testMode,
  } = route.params;
  const [email, setEmail] = React.useState<string>(workerInfo?.email || "");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      Alert.alert(
        "Error",
        "Passwords do not match",
        [
          {
            text: "Ok",
          },
        ],
        { cancelable: false }
      );

      return false;
    } else if (password.length < 8) {
      Alert.alert(
        "Error",
        "Passwords must be over 8 characters long",
        [
          {
            text: "Ok",
          },
        ],
        { cancelable: false }
      );

      return false;
    } else {
      return true;
    }
  };

  const validateEmail = () => {
    if (emailRegex.test(email.toLowerCase())) {
      return true;
    } else {
      Alert.alert(
        "Error",
        "Please enter a valid email address",
        [
          {
            text: "Ok",
          },
        ],
        { cancelable: false }
      );

      return false;
    }
  };

  const validateFields = () => {
    if (email === "" || password === "" || confirmPassword === "") {
      Alert.alert(
        "Error",
        "Please fill in all required fields",
        [
          {
            text: "Ok",
          },
        ],
        { cancelable: false }
      );

      return false;
    }

    return validatePasswords() && validateEmail();
  };

  const goToNextScreen = async () => {
    if (testMode) {
      navigation.navigate("Veriff", {
        personalData,
        email,
      });
      return;
    }

    if (validateFields()) {
      try {
        const response = await submitAccountInfo(APIKey!, {
          companyID: companyID!,
          employeeID: employeeID!,
          email,
          password,
        });

        if (response.data.success) {
          navigation.navigate("Veriff", {
            personalData,
            email,
          });
        } else {
          throw new Error("Failed to verify identity!");
        }
      } catch (error) {
        if (error.message !== "VERIFF CANCELLED") {
          Alert.alert(
            "Error",
            error.message,
            [
              {
                text: "Ok",
              },
            ],
            { cancelable: false }
          );
        }
      }
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.scroll}>
      <View style={styles.scrollContainer}>
        {userInfo?.hasLogo && (
          <Image
            source={{
              uri: userInfo.logoUrl!,
            }}
            style={styles.logo}
          />
        )}
        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.subheader}>
          Enter account information to access your e-paystubs
        </Text>
        {testMode && (
          <Text style={styles.subheader}>
            (Input disabled during test mode)
          </Text>
        )}
        <View style={styles.section}>
          <TextInput
            editable={!testMode}
            style={[
              styles.inputField,
              styles.longField,
              testMode && styles.disabledInput,
            ]}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            editable={!testMode}
            style={[
              styles.inputField,
              styles.longField,
              testMode && styles.disabledInput,
            ]}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            editable={!testMode}
            style={[
              styles.inputField,
              styles.longField,
              testMode && styles.disabledInput,
            ]}
            value={confirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>
        <View style={styles.footer}>
          <ActionButton onPress={goToNextScreen}>Create Account</ActionButton>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 20,
    marginVertical: 32,
    backgroundColor: "#ffffff",
  },
  logo: {
    marginBottom: 0,
    resizeMode: "contain",
    width: 150,
    height: 80,
    alignSelf: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Avenir",
  },
  subheader: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Avenir",
    marginBottom: 4,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 48,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  section_header: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 20,
  },
  section_subheader: {
    marginBottom: 10,
    fontSize: 13,
    color: "#979797",
  },
  inputField: {
    borderRadius: 5,
    borderColor: "#DADADA",
    borderWidth: 2,
    paddingHorizontal: 4,
    paddingVertical: 8,
    color: "#000000",
    marginTop: 10,
    marginBottom: 10,
    marginRight: 5,
    fontFamily: "Avenir",
    fontSize: 20,
    backgroundColor: "#ffffff",
  },
  longField: {
    width: "100%",
  },
  label: {
    margin: 8,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#dedede",
  },
  footer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default CreateAccount;
