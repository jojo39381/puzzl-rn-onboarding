import * as React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  TextStyle,
  GestureResponderEvent,
  ActivityIndicator,
} from "react-native";

interface PropTypes extends TouchableOpacityProps {
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
}

const ActionButton: React.FC<PropTypes> = ({
  onPress,
  loading = false,
  style,
  children,
  ...rest
}) => {
  const [waiting, setWaiting] = React.useState<boolean>(false);
  const mounted = React.useRef(false);

  React.useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const handlePress = async (event: GestureResponderEvent) => {
    setWaiting(true);

    try {
      if (onPress) {
        await onPress(event);
      }

      if (mounted) {
        setWaiting(false);
      }
    } catch (error) {
      if (mounted) {
        setWaiting(false);
      }
      throw error;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      disabled={waiting || loading}
      onPress={handlePress}
      {...rest}
    >
      <ActivityIndicator
        animating={waiting || loading}
        style={styles.loader}
        size="small"
        color="#ffffff"
      />
      <Text style={styles.buttonText}>{children}</Text>
      <ActivityIndicator
        animating={false}
        style={styles.loader}
        size="small"
        color="#ffffff"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E64DC",
    borderRadius: 3,
    paddingVertical: 15,
    paddingHorizontal: 35,
  },
  loader: {
    marginRight: 4,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Avenir",
    fontSize: 22,
    textAlign: "center",
  },
});

export default ActionButton;
