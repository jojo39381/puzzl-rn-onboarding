import * as React from "react";
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";

interface PropTypes {
  visible: boolean;
}

const LoadingScreen: React.FC<PropTypes> = ({ visible }) => {
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const [hidden, setHidden] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!visible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setHidden(true);
      });
    }
  }, [visible]);

  if (hidden) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Text style={styles.text}>Loading</Text>
      <ActivityIndicator size="small" color="#0E64DC" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  text: {
    fontFamily: "Avenir",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
  },
});

export default React.memo(LoadingScreen);
