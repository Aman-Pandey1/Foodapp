import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export default function GradientBackground({ children, style }: Props) {
  return (
    <LinearGradient
      colors={["#34d399", "#10b981", "#059669"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ flex: 1 }, style as any]}
    >
      {children}
    </LinearGradient>
  );
}

