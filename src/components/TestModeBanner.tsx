import * as React from "react";
import { StyleSheet, Text, Animated, View, Dimensions } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

const duration = 500;

interface PropTypes {
  visible: boolean;
}

const TestModeBanner: React.FC<PropTypes> = ({ visible }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, visible]);

  React.useEffect(() => {
    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim]);

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              top: insets?.top ?? 44,
            },
          ]}
        >
          <View style={styles.bar} />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Test</Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width,
    position: "absolute",
    top: 44,
    left: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  bar: {
    width: "100%",
    height: 6,
    backgroundColor: "#0E64DC",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 4,
    paddingHorizontal: 24,
    backgroundColor: "#0E64DC",
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  text: {
    fontFamily: "Avenir",
    fontWeight: "bold",
    fontSize: 16,
    color: "#ffffff",
  },
});

export default React.memo(TestModeBanner);
