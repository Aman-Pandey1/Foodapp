import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RoleSelectScreen() {
  const { updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  const choose = async (role) => {
    setSaving(true);
    try {
      await updateProfile({ role });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your role</Text>
      <View style={{ height: 16 }} />
      <Button title={saving ? '...' : 'I am a Waste Supplier'} onPress={() => choose('supplier')} disabled={saving} />
      <View style={{ height: 12 }} />
      <Button title={saving ? '...' : 'I am a Compost Producer'} onPress={() => choose('producer')} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
});

