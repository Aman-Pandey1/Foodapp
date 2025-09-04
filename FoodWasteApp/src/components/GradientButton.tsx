import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export default function GradientButton({ title, onPress, loading, style }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={loading} style={style as any}>
      <LinearGradient colors={["#06b6d4", "#22c55e"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{title}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

