import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import GradientBackground from './GradientBackground';

export default function GradientLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <GradientBackground>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ marginTop: 12, color: '#fff', fontWeight: '600' }}>{text}</Text>
      </View>
    </GradientBackground>
  );
}

