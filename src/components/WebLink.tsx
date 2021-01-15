import * as React from "react";
import {
  StyleSheet,
  Modal,
  View,
  ModalProps,
  Text,
  TouchableHighlight,
} from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";

interface PropTypes extends ModalProps {
  link: string | null;
  onClose: () => void;
}

const WebLink: React.FC<PropTypes> = ({ link, onClose, ...rest }) => {
  const open = link != null;

  return (
    <Modal
      animationType="slide"
      visible={open}
      onDismiss={onClose}
      onRequestClose={onClose}
      {...rest}
    >
      <SafeAreaView style={styles.modal} edges={["right", "top", "left"]}>
        <View style={styles.header}>
          <TouchableHighlight style={styles.closeButton} onPress={onClose}>
            <Text>Close</Text>
          </TouchableHighlight>
        </View>
        {open ? (
          <WebView style={styles.webview} source={{ uri: link! }} />
        ) : (
          <View style={styles.webview} />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#DDDDDD",
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 12,
    borderRadius: 4,
  },
  webview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default WebLink;
