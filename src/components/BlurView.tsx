import * as React from "react";
import { Animated, ViewProps } from "react-native";

interface PropTypes extends ViewProps {
  visible: boolean;
  duration?: number;
  maxOpacity?: number;
  fadeOut?: boolean;
}

const BlurView: React.FC<PropTypes> = ({
  visible,
  duration = 250,
  maxOpacity = 1,
  fadeOut = true,
  style,
  children,
  ...props
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? maxOpacity : 0,
      duration,
      useNativeDriver: true,
    }).start();

    return () => {
      if (fadeOut) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }).start();
      }
    };
  }, [visible, fadeAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

export default BlurView;
