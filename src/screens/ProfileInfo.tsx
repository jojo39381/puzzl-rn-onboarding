import * as React from "react";
import { StyleSheet, View, Text, TextInput, Image, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import ActionButton from "../components/ActionButton";
import { submitProfileInfo } from "../functions/api";
import type { RootStackParamList } from "../types/navigation";
import { getFormattedDate } from "../utils/date";

const ssnPattern = /^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/;

type PersonalDataStateType = {
  first_name: string;
  last_name: string;
  middle_initial: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone_number: string;
};

interface PropTypes {
  route: RouteProp<RootStackParamList, "ProfileInfo">;
  navigation: StackNavigationProp<RootStackParamList, "ProfileInfo">;
}

const ProfileInfo: React.FC<PropTypes> = ({ route, navigation }) => {
  const { APIKey, companyID, employeeID, userInfo, workerInfo } = route.params;
  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
  const [ssnParts, setSSNParts] = React.useState<string[]>(["", "", ""]);
  const [dob, setDOB] = React.useState<Date | null>(null);
  const [personalData, setPersonalData] = React.useState<PersonalDataStateType>(
    {
      first_name: workerInfo?.first_name || "",
      last_name: workerInfo?.last_name || "",
      middle_initial: "",
      address: "",
      city: "",
      phone_number: "",
      state: "",
      zip: "",
    }
  );
  const ssnTwo = React.useRef<TextInput>(null);
  const ssnThree = React.useRef<TextInput>(null);

  const {
    first_name,
    last_name,
    middle_initial,
    address,
    city,
    state,
    zip,
    phone_number,
  } = personalData;

  const handleConfirmDate = (date: Date) => {
    setDOB(date);
    setShowDatePicker(false);
  };

  const updateSSN = (index: number, value: string) => {
    setSSNParts((prevData) => {
      const ssnCopy = [...prevData];
      ssnCopy[index] = value;
      return ssnCopy;
    });

    if (index === 0 && value.length === 3) {
      ssnTwo.current?.focus();
    } else if (index === 1 && value.length === 2) {
      ssnThree.current?.focus();
    }
  };

  const updateField = (fieldName: string, fieldValue: string) =>
    setPersonalData((prevData) => ({
      ...prevData,
      [fieldName]: fieldValue,
    }));

  const validateFields = () => {
    if (
      first_name === "" ||
      last_name === "" ||
      address === "" ||
      city === "" ||
      state === "" ||
      zip === "" ||
      dob == null ||
      phone_number === ""
    ) {
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

    if (!ssnPattern.test(ssnParts.join(""))) {
      Alert.alert(
        "Error",
        "SSN format is invalid, please try again",
        [
          {
            text: "Ok",
          },
        ],
        { cancelable: false }
      );

      return false;
    }

    return true;
  };

  const goToNextScreen = async () => {
    if (validateFields()) {
      try {
        const response = await submitProfileInfo(APIKey!, {
          companyID: companyID!,
          employeeID: employeeID!,
          address,
          city,
          state,
          zip,
          ssn: ssnParts.join(""),
          phone_number: `+1${phone_number}`,
          first_name,
          last_name,
          middle_initial,
          dob: getFormattedDate(dob!),
        });

        if (response.data.success) {
          navigation.navigate("CreateAccount", {
            personalData: {
              ...personalData,
              dob: getFormattedDate(dob!),
              ssn: ssnParts.join(""),
            },
          });
        } else {
          throw new Error("Failed to set profile information!");
        }
      } catch (error) {
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

  return (
    <KeyboardAwareScrollView style={styles.scroll}>
      <View style={styles.scrollContainer}>
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setShowDatePicker(false)}
          date={dob ?? new Date()}
        />
        {userInfo?.hasLogo && (
          <Image
            source={{
              uri: userInfo.logoUrl!,
            }}
            style={styles.logo}
          />
        )}
        <Text style={styles.header}>Profile Information</Text>
        <View style={styles.section}>
          <View style={styles.singleRow}>
            <TextInput
              style={[styles.inputField, styles.longField]}
              placeholder="First Name"
              value={first_name}
              onChangeText={(text) => updateField("first_name", text)}
            />
            <TextInput
              autoCapitalize="characters"
              style={[styles.inputField, styles.shortField]}
              placeholder="MI"
              maxLength={1}
              value={middle_initial}
              onChangeText={(text) => updateField("middle_initial", text)}
            />
          </View>
          <TextInput
            style={[styles.inputField, styles.longField]}
            placeholder="Last Name"
            value={last_name}
            onChangeText={(text) => updateField("last_name", text)}
          />
          <TextInput
            keyboardType="phone-pad"
            style={[styles.inputField, styles.longField]}
            placeholder="Phone Number"
            value={phone_number}
            onChangeText={(text) => updateField("phone_number", text)}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.section_header}>Date of Birth</Text>
          <View style={styles.singleRow}>
            <Text
              style={[styles.inputField, styles.longField]}
              onPress={() => setShowDatePicker(true)}
            >
              {dob ? getFormattedDate(dob) : "mm/dd/yyyy"}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.section_header}>Social Security Number</Text>
          <View style={styles.singleRow}>
            <TextInput
              keyboardType="number-pad"
              style={[styles.inputField, styles.shortField]}
              value={ssnParts[0]}
              maxLength={3}
              onChangeText={(text) => updateSSN(0, text)}
            />
            <TextInput
              ref={ssnTwo}
              keyboardType="number-pad"
              style={[styles.inputField, styles.shortField]}
              value={ssnParts[1]}
              maxLength={2}
              onChangeText={(text) => updateSSN(1, text)}
            />
            <TextInput
              ref={ssnThree}
              keyboardType="number-pad"
              style={[styles.inputField, styles.shortField]}
              value={ssnParts[2]}
              maxLength={4}
              onChangeText={(text) => updateSSN(2, text)}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.section_header}>Address</Text>
          <TextInput
            style={[styles.inputField, styles.longField]}
            placeholder="Address"
            value={address}
            onChangeText={(text) => updateField("address", text)}
          />
          <View style={styles.singleRow}>
            <TextInput
              style={[styles.inputField, styles.longField]}
              value={city}
              placeholder="City"
              onChangeText={(text) => updateField("city", text)}
            />
            <TextInput
              style={[styles.inputField, styles.shortField]}
              value={state}
              placeholder="State"
              maxLength={2}
              autoCapitalize="characters"
              numberOfLines={1}
              onChangeText={(text) => updateField("state", text)}
            />
            <TextInput
              keyboardType="number-pad"
              style={[styles.inputField, styles.mediumField]}
              value={zip}
              placeholder="Zip"
              maxLength={5}
              onChangeText={(text) => updateField("zip", text)}
            />
          </View>
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
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  section_header: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Avenir",
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
    width: 180,
  },
  mediumField: {
    width: 110,
  },
  shortField: {
    width: 60,
  },
  ssn: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  datepicker: {
    padding: 5,
    width: 30,
  },
  calendar_icon: {
    padding: 10,
  },
  singleRow: {
    flexDirection: "row",
  },
  footer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default ProfileInfo;
