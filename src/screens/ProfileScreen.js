import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getCurrentUser } from '../firebase';
import { updateProfile, getUserProfile, logout } from '../services/auth';

export default function ProfileScreen() {
  const user = getCurrentUser();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      if (user?.uid) {
        const p = await getUserProfile(user.uid);
        setProfile(p);
      }
    })();
  }, [user?.uid]);

  const onSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ displayName });
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput placeholder="Display Name" value={displayName} onChangeText={setDisplayName} style={styles.input} />
      <TextInput placeholder="Email" value={email} editable={false} style={styles.input} />
      <Button title={loading ? 'Saving...' : 'Save'} onPress={onSave} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Logout" color="#cc0000" onPress={logout} />
      {profile ? (
        <View style={{ marginTop: 16 }}>
          <Text>User ID: {profile.uid}</Text>
          <Text>Favorites: {Array.isArray(profile.favorites) ? profile.favorites.length : 0}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 },
});

