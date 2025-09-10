import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { updateProfile, getUserProfile, logout } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    (async () => {
      if (user?.uid) {
        const p = await getUserProfile(user.uid);
        setProfile(p);
        setRole(p?.role || '');
      }
    })();
  }, [user?.uid]);

  const onSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ displayName, role: role || undefined });
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
      <TextInput placeholder="Role (supplier or producer)" value={role} onChangeText={setRole} style={styles.input} />
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

