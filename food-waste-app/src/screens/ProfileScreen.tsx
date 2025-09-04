import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function ProfileScreen() {
  const { user, userProfile, refreshProfile, logout } = useAuth();
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [location, setLocation] = useState(userProfile?.location || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(userProfile?.displayName || '');
    setPhone(userProfile?.phone || '');
    setLocation(userProfile?.location || '');
  }, [userProfile]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const ref = doc(collection(db, 'users'), user.uid);
      const prev = await getDoc(ref);
      await setDoc(ref, { ...prev.data(), displayName, phone, location }, { merge: true });
      await refreshProfile();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '800', marginBottom: 16 }}>Profile</Text>
      <Text style={{ marginBottom: 6, color: '#6b7280' }}>Email</Text>
      <Text style={{ backgroundColor: '#f3f4f6', padding: 12, borderRadius: 10, marginBottom: 12 }}>{user?.email}</Text>

      <Text style={{ marginBottom: 6, color: '#6b7280' }}>Name</Text>
      <TextInput value={displayName} onChangeText={setDisplayName} style={{ backgroundColor: '#f9fafb', padding: 12, borderRadius: 10, marginBottom: 12 }} placeholder="Your name" />

      <Text style={{ marginBottom: 6, color: '#6b7280' }}>Phone</Text>
      <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ backgroundColor: '#f9fafb', padding: 12, borderRadius: 10, marginBottom: 12 }} placeholder="Contact number" />

      <Text style={{ marginBottom: 6, color: '#6b7280' }}>Location</Text>
      <TextInput value={location} onChangeText={setLocation} style={{ backgroundColor: '#f9fafb', padding: 12, borderRadius: 10, marginBottom: 12 }} placeholder="City, Area" />

      <TouchableOpacity onPress={save} disabled={saving} style={{ backgroundColor: '#10b981', padding: 14, borderRadius: 12, alignItems: 'center', opacity: saving ? 0.6 : 1 }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>{saving ? 'Saving...' : 'Save changes'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout} style={{ marginTop: 16, padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#fee2e2' }}>
        <Text style={{ color: '#991b1b', fontWeight: '700' }}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

