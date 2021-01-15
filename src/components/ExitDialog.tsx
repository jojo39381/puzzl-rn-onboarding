import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { GetUserInfoResponseType } from "../types/api";

interface PropTypes {
  visible: boolean;
  userInfo: GetUserInfoResponseType["data"] | null;
  handleHide: () => void;
  handleExit: () => void;
}

const ExitDialog: React.FC<PropTypes> = ({
  visible,
  userInfo,
  handleHide,
  handleExit,
}) => (
  <Modal visible={visible} animationType="slide" onRequestClose={handleHide}>
    <SafeAreaView style={styles.container}>
      {userInfo?.hasLogo && (
        <Image
          source={{
            uri: userInfo.logoUrl!,
          }}
          style={styles.logo}
        />
      )}
      <View style={styles.content}>
        <Text style={styles.text}>Are you sure you want to exit?</Text>
        <Text style={styles.text}>All information will be lost.</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableWithoutFeedback onPress={handleHide}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>No</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={handleExit}>
          <View style={[styles.button, styles.outlinedButton]}>
            <Text style={[styles.buttonText, styles.outlinedText]}>Yes</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  logo: {
    marginTop: 16,
    marginBottom: 16,
    resizeMode: "contain",
    width: 150,
    height: 120,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Avenir",
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Avenir",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    width: 150,
    maxWidth: "40%",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#0E64DC",
    padding: 12,
    borderColor: "#0E64DC",
    borderWidth: 1,
    borderRadius: 5,
  },
  outlinedButton: {
    backgroundColor: "#ffffff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  outlinedText: {
    color: "#0E64DC",
  },
});

export default ExitDialog;
