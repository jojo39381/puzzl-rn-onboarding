import * as React from "react";
import { StyleSheet, View, Text, Image, Alert } from "react-native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../types/navigation";
import Checkbox from "../components/Checkbox";
import ActionButton from "../components/ActionButton";
import SSCPhotoUpload from "../components/SSCPhotoUpload";
import { getHelloSign, getVeriff } from "../functions/api";
import { runVeriffFlow } from "../utils/veriff";

interface PropTypes {
  route: RouteProp<RootStackParamList, "Veriff">;
  navigation: StackNavigationProp<RootStackParamList, "Veriff">;
  setControlsHidden: (hidden: boolean) => void;
}

const Veriff: React.FC<PropTypes> = ({
  route,
  navigation,
  setControlsHidden,
}) => {
  const {
    APIKey,
    companyID,
    employeeID,
    userInfo,
    personalData,
    email,
  } = route.params;
  const [finishedVeriff, setFinishedVeriff] = React.useState<boolean>(false);
  const [driverSocialSelected, setDriverSelected] = React.useState<boolean>(
    true
  );
  const [takeSSC, setTakeSSC] = React.useState<boolean>(false);
  const [helloLoading, setHelloLoading] = React.useState<boolean>(false);

  const {
    first_name,
    last_name,
    middle_initial,
    address,
    city,
    state,
    zip,
    ssn,
    dob,
    phone_number,
  } = personalData;

  const goToHelloSign = async () => {
    setHelloLoading(true);

    try {
      const helloInfo = await getHelloSign(APIKey!, {
        companyID: companyID!,
        employeeID: employeeID!,
        first_name,
        last_name,
        middle_initial,
        address,
        city,
        state,
        zip,
        ssn,
        dob,
        email,
        phone_number,
      }).then(({ data }) => ({
        signURL: data["signURL"],
        employee_sigId: data["employee_sigId"],
        company_sigId: data["company_sigId"],
        signature_request_id: data["signature_request_id"],
        signature_id: data["signURL"].split("=")[1].split("&")[0],
        token: data["signURL"].split("=")[2],
      }));

      setHelloLoading(false);

      navigation.navigate("HelloSign", {
        personalData,
        helloInfo,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error.message,
        [
          {
            text: "Ok",
            onPress: () => setHelloLoading(false),
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleVeriff = async () => {
    try {
      if (finishedVeriff) {
        await goToHelloSign();
      } else {
        const veriffResponse = await getVeriff(APIKey!, {
          first_name,
          last_name,
          document_type: driverSocialSelected ? "DRIVERS_LICENSE" : "PASSPORT",
        });

        if (veriffResponse.data.status === "success") {
          await runVeriffFlow(
            APIKey!,
            companyID!,
            employeeID!,
            veriffResponse.data.verification
          );

          if (driverSocialSelected) {
            setControlsHidden(true);
            setTakeSSC(true);
          } else {
            setFinishedVeriff(true);
            await goToHelloSign();
          }
        } else {
          throw new Error("Failed to verify identity!");
        }
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
  };

  if (takeSSC) {
    return (
      <SSCPhotoUpload
        APIKey={APIKey!}
        email={email}
        onSubmit={() => {
          setFinishedVeriff(true);
          setTakeSSC(false);
          setControlsHidden(false);
          return goToHelloSign();
        }}
        onCancel={() => {
          setFinishedVeriff(false);
          setTakeSSC(false);
          setControlsHidden(false);
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {userInfo?.hasLogo && (
        <Image
          source={{
            uri: userInfo.logoUrl!,
          }}
          style={styles.logo}
        />
      )}
      <Text style={styles.header}>Identity Verification</Text>
      <Text style={styles.subheader}>
        Verify your identify by taking pictures of your documentation
      </Text>
      <View style={styles.section}>
        <Text style={styles.section_header}>Choose Documentation</Text>
        <Text style={styles.section_subheader}>
          (Please have IDs readily available)
        </Text>
        <View style={styles.checkboxContainer}>
          <Checkbox
            checked={driverSocialSelected}
            onPress={() => {
              setDriverSelected(true);
              setFinishedVeriff(false);
            }}
          />
          <Text style={styles.label}>
            Drivers License AND Social Security Card
          </Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox
            checked={!driverSocialSelected}
            onPress={() => {
              setDriverSelected(false);
              setFinishedVeriff(false);
            }}
          />
          <Text style={styles.label}>Passport</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <ActionButton onPress={handleVeriff} loading={helloLoading}>
          Begin Verification
        </ActionButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingVertical: 32,
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
    marginBottom: 32,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
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
  },
  longField: {
    width: "100%",
  },
  label: {
    margin: 8,
    fontSize: 16,
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  footer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default Veriff;
