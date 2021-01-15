import React from "react";
import { StyleSheet, TouchableOpacity, Image, Text, View } from "react-native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../types/navigation";

interface PropTypes {
  route: RouteProp<RootStackParamList, "ThankYou">;
  navigation: StackNavigationProp<RootStackParamList, "ThankYou">;
  onFinished: () => void | Promise<void>;
}

const ThankYou: React.FC<PropTypes> = ({ navigation, route, onFinished }) => {
  const { userInfo } = route.params;

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      }),
    [navigation]
  );

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
      <Text style={styles.paragraph_one}>
        Thank you for filling out your information!
      </Text>
      <Text style={styles.paragraph_two}>
        You are now successfully onboarded onto {userInfo!.business_name}. You
        are now able to get paid using {userInfo!.business_name}!
      </Text>
      <TouchableOpacity style={styles.button} onPress={onFinished}>
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  logo: {
    marginBottom: 10,
    resizeMode: "contain",
    width: 150,
    height: 80,
    alignSelf: "center",
  },
  paragraph_one: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Avenir",
    lineHeight: 30,
  },
  paragraph_two: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 70,
    marginBottom: 20,
    fontFamily: "Avenir",
    lineHeight: 25,
  },
  button: {
    marginTop: 100,
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
});

export default ThankYou;
