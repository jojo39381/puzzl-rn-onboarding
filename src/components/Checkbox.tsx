import * as React from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from "react-native";

interface PropTypes extends TouchableWithoutFeedbackProps {
  checked: boolean;
}

const Checkbox: React.FC<PropTypes> = ({ checked, ...rest }) => (
  <TouchableWithoutFeedback style={styles.container} {...rest}>
    <View style={styles.outerCircle}>
      {checked && <View style={styles.innerCircle} />}
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  outerCircle: {
    width: 25,
    height: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#858585",
    borderRadius: 15,
    borderWidth: 3,
  },
  innerCircle: {
    width: 15,
    height: 15,
    margin: 5,
    backgroundColor: "#0E64DC",
    borderRadius: 10,
  },
});

export default Checkbox;
