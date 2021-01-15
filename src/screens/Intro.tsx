import * as React from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import WebLink from "../components/WebLink";
import type { RootStackParamList } from "../types/navigation";

interface PropTypes {
  route: RouteProp<RootStackParamList, "Intro">;
  navigation: StackNavigationProp<RootStackParamList, "Intro">;
}

const Intro: React.FC<PropTypes> = ({ navigation, route }) => {
  const { userInfo } = route.params;
  const { business_name } = userInfo!;
  const [viewingLink, setLink] = React.useState<string | null>(null);

  const goToNextScreen = () => {
    navigation.navigate("ProfileInfo", {});
  };

  return (
    <View style={styles.container}>
      <WebLink link={viewingLink} onClose={() => setLink(null)} />
      <View style={styles.content}>
        {userInfo?.hasLogo && (
          <Image
            source={{
              uri: userInfo.logoUrl!,
            }}
            style={styles.logo}
          />
        )}
        <Text style={styles.header}>
          Welcome to {business_name}'s payroll onboarding process.
        </Text>
        <Text style={styles.intro_text}>
          This process should only take 2 minutes.
        </Text>
        <Text style={styles.instruction_header}>Steps:</Text>
        <Text style={styles.list}>
          1. Fill in profile information{"\n"}
          2. Verify your ID{"\n"}
          3. Fill in remaining fields of paperwork
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={goToNextScreen}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          {"By clicking 'Start', you agree to our "}
          <Text
            style={styles.link}
            onPress={() =>
              setLink("https://www.joinpuzzl.com/legal/privacy-policy/")
            }
          >
            Privacy Policy
          </Text>
          {" and "}
          <Text
            style={styles.link}
            onPress={() =>
              setLink("https://www.joinpuzzl.com/legal/terms-of-service/")
            }
          >
            Terms of Service
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingVertical: 32,
  },
  content: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  logo: {
    marginBottom: 10,
    resizeMode: "contain",
    width: 150,
    height: 80,
    alignSelf: "center",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 32,
    fontFamily: "Avenir",
    lineHeight: 30,
  },
  intro_text: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Avenir",
    lineHeight: 30,
  },
  instruction_header: {
    width: "100%",
    fontSize: 22,
    textAlign: "left",
    marginTop: 50,
    marginBottom: 15,
    fontFamily: "Avenir",
  },
  list: {
    fontSize: 20,
    textAlign: "left",
    fontFamily: "Avenir",
    lineHeight: 30,
  },
  button: {
    marginTop: 70,
    backgroundColor: "#0E64DC",
    borderRadius: 5,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 45,
    paddingLeft: 45,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Avenir",
  },
  footer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 45,
    paddingLeft: 45,
  },
  footerText: {
    color: "#979797",
    fontFamily: "Avenir",
    lineHeight: 20,
    marginTop: 45,
    textAlign: "center",
    maxWidth: 250,
  },
  link: {
    textDecorationLine: "underline",
  },
});

export default Intro;
