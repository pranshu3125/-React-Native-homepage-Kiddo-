import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

interface ScreenTransitionProps {
  screenKey: string;
  children: React.ReactNode;
}

export const ScreenTransition: React.FC<ScreenTransitionProps> = ({ screenKey, children }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const keyRef = useRef(screenKey);
  const childrenRef = useRef(children);
  childrenRef.current = children;

  useEffect(() => {
    if (screenKey === keyRef.current) return;
    keyRef.current = screenKey;

    setDisplayedChildren(childrenRef.current);
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [screenKey, opacity]);

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      {displayedChildren}
    </Animated.View>
  );
};
