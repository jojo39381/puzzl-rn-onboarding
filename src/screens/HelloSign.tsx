import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../types/navigation";
import backIcon from "../assets/images/back_icon.png";

interface PropTypes {
  route: RouteProp<RootStackParamList, "HelloSign">;
  navigation: StackNavigationProp<RootStackParamList, "HelloSign">;
  setControlsHidden: (hidden: boolean) => void;
}

const HelloSign: React.FC<PropTypes> = ({
  route,
  navigation,
  setControlsHidden,
}) => {
  const { helloInfo, userInfo } = route.params;
  const { signature_id, token } = helloInfo;
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
        setModalVisible(false);
        setControlsHidden(false);

        navigation.dispatch(e.data.action);
      }),
    [navigation]
  );

  const onMessage = (event: WebViewMessageEvent) => {
    const message = event.nativeEvent.data;

    if (message === "finished") {
      navigation.navigate("ThankYou", {});
      setModalVisible(false);
    } else if (message === "cancelled" || message === "closed") {
      handleCancel();
    }
  };

  const confirmCancel = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to cancel?",
      [
        {
          text: "No",
        },
        {
          text: "Yes",
          onPress: () => handleCancel(),
        },
      ],
      { cancelable: true }
    );
  };

  const handleCancel = () => {
    setModalVisible(false);
    setControlsHidden(false);
    navigation.goBack();
  };

  const handleOpenWeb = () => {
    setControlsHidden(true);
    setModalVisible(true);
  };

  const jsCode = `
    const meta = document.createElement('meta');
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0');
    meta.setAttribute('name', 'viewport');
    document.getElementsByTagName('head')[0].appendChild(meta);
  `;

  return (
    <View style={styles.container}>
      <Modal
        animationType={"slide"}
        visible={modalVisible}
        onRequestClose={confirmCancel}
        transparent
      >
        <SafeAreaView
          style={styles.webviewContainer}
          edges={["right", "top", "left"]}
        >
          <View style={styles.topbar}>
            <TouchableOpacity style={styles.backButton} onPress={confirmCancel}>
              <Image source={backIcon} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.titleText}>Paperwork</Text>
            <View style={styles.titleSpacer} />
          </View>
          <WebView
            source={{
              uri: `https://app.joinpuzzl.com/mobile/hellosign/?signature_id=${signature_id}&token=${token}`,
            }}
            style={{ flex: 1 }}
            onMessage={onMessage}
            javaScriptEnabledAndroid={true}
            injectJavascript={jsCode}
          />
        </SafeAreaView>
      </Modal>
      <View style={styles.content}>
        {userInfo?.hasLogo && (
          <Image
            source={{
              uri: userInfo.logoUrl!,
            }}
            style={styles.logo}
          />
        )}
        <Text style={styles.paragraph_one}>You reached the last step!</Text>
        <Text style={styles.paragraph_two}>
          Click the button below to start filling out your W4 and other
          employment forms.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleOpenWeb}>
          <Text style={styles.buttonText}>Sign Documents</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.changeTypeText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#ffffff",
    paddingVertical: 32,
  },
  webviewContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  topbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  backButton: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 45,
    flexDirection: "row",
  },
  backIcon: {
    marginLeft: 10,
    resizeMode: "contain",
    width: 18,
    height: 18,
  },
  titleText: {
    color: "#000",
    textAlign: "center",
    flex: 1,
    fontWeight: "bold",
    fontFamily: "Avenir",
    fontSize: 20,
  },
  titleSpacer: {
    width: 70,
    height: 25,
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
  },
  paragraph_two: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 25,
    marginBottom: 20,
    fontFamily: "Avenir",
    lineHeight: 25,
  },
  changeTypeText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 25,
    fontFamily: "Avenir",
    lineHeight: 25,
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    paddingRight: 20,
    paddingLeft: 20,
    alignItems: "center",
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

export default HelloSign;
