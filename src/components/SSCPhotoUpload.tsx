import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { RNCamera } from "react-native-camera";
import ActionButton from "./ActionButton";
import BlurView from "./BlurView";
import { submitWorkerSSCard } from "../functions/api";
import backArrow from "../assets/images/back_icon.png";

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "lightgreen",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text>Waiting</Text>
  </View>
);

interface PropTypes {
  APIKey: string;
  email: string;
  onSubmit: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
}

const SSCPhotoUpload: React.FC<PropTypes> = ({
  APIKey,
  email,
  onSubmit,
  onCancel,
}) => {
  const [modalVisible, setModalVisible] = React.useState<boolean>(true);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [confirming, setConfirming] = React.useState<string | null>(null);

  const takePicture = async (camera: RNCamera) => {
    setConfirming(null);
    setLoading(true);
    setModalVisible(true);

    const data = await camera.takePictureAsync({
      quality: 1,
      base64: true,
      doNotSave: true,
      pauseAfterCapture: true,
    });

    try {
      if (!data.base64) {
        throw new Error("Failed to take picture, please try again!");
      }

      setModalVisible(false);
      setLoading(false);
      setConfirming(data.base64);
      camera.resumePreview();
    } catch (error) {
      setModalVisible(false);
      setLoading(false);
      setConfirming(null);

      Alert.alert(
        "Error",
        error.message,
        [
          {
            text: "Ok",
            onPress: () => camera.resumePreview(),
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleSubmit = async () => {
    if (confirming != null) {
      try {
        const image = `${confirming}`;
        setConfirming(null);
        setSubmitting(true);
        setModalVisible(true);

        await submitWorkerSSCard(APIKey, {
          email,
          image,
        });

        setSubmitting(false);
        setSuccess(true);
      } catch (error) {
        setSubmitting(false);
        setSuccess(false);

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

  const handleModalPress = async () => {
    if (!loading) {
      setModalVisible(false);

      if (success) {
        await onSubmit();
      }
    }
  };

  let modalMessage =
    "In order to verify your identity, please take a picture of your Social Security Card.";
  if (loading) modalMessage = "Loading";
  if (submitting) modalMessage = "Submitting";
  if (success) modalMessage = "Successfully submitted Social Security Card.";

  return (
    <View style={styles.container}>
      <BlurView
        visible={modalVisible || confirming != null}
        duration={250}
        style={styles.alertBackground}
        maxOpacity={0.5}
        pointerEvents="none"
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleModalPress}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.alertContainer}>
            <Text style={styles.alertText}>{modalMessage}</Text>
            {loading || submitting ? (
              <ActivityIndicator
                style={styles.loader}
                size="small"
                color="#0E64DC"
              />
            ) : (
              <ActionButton
                style={styles.actionButton}
                onPress={handleModalPress}
              >
                Ok
              </ActionButton>
            )}
          </View>
        </View>
      </Modal>
      <View style={styles.topbar}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <Image source={backArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Social Security Card</Text>
        <View style={styles.titleSpacer} />
      </View>
      <RNCamera
        style={styles.cameraView}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        captureAudio={false}
        useNativeZoom
        androidCameraPermissionOptions={{
          title: "Permission to use camera",
          message: "We need your permission to use your camera",
          buttonPositive: "Ok",
          buttonNegative: "Cancel",
        }}
      >
        {({ camera, status }) => {
          if (status !== "READY") {
            return <PendingView />;
          }

          return (
            <View
              style={{
                flex: 0,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => takePicture(camera)}
                style={styles.captureButton}
              >
                <View style={styles.captureOuterCircle}>
                  <View style={styles.captureInnerCircle} />
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>
      <Modal
        visible={confirming != null}
        animationType="slide"
        transparent
        onRequestClose={handleModalPress}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.confirmContainer}>
            <Text style={styles.alertText}>Submit this picture?</Text>
            <Image
              style={styles.confirmPhoto}
              source={{ uri: `data:image/png;base64,${confirming}` }}
            />
            <View style={styles.confirmActions}>
              <ActionButton onPress={() => setConfirming(null)}>
                No
              </ActionButton>
              <ActionButton onPress={handleSubmit}>Yes</ActionButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
  },
  cameraView: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  captureButton: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 36,
  },
  captureOuterCircle: {
    width: 80,
    height: 80,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "#ffffff",
    borderRadius: 40,
  },
  captureInnerCircle: {
    width: 40,
    height: 40,
    margin: 5,
    backgroundColor: "#ffffff",
    borderRadius: 20,
  },
  modalWrapper: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBackground: {
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "#2b2b2b",
    zIndex: 3,
  },
  alertContainer: {
    width: 300,
    maxWidth: "75%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  alertText: {
    textAlign: "center",
    fontSize: 18,
  },
  actionButton: {
    marginTop: 32,
  },
  topbar: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    zIndex: 3,
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
  loader: {
    marginTop: 8,
  },
  confirmContainer: {
    width: 600,
    maxWidth: Dimensions.get("screen").width * 0.9,
    height: 800,
    maxHeight: Dimensions.get("screen").height * 0.75,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  confirmPhoto: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginVertical: 12,
  },
  confirmActions: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});

export default SSCPhotoUpload;
