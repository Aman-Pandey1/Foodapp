import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import GradientButton from '../../components/GradientButton';
import { useAuth } from '../../providers/AuthProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const { register } = useAuth();
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'supplier' | 'producer'>('supplier');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await register({ email: email.trim(), password, displayName, role });
    } catch (e: any) {
      setError(e?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const RoleOption = ({ value, label }: { value: 'supplier' | 'producer'; label: string }) => (
    <TouchableOpacity
      onPress={() => setRole(value)}
      style={{
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: role === value ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        borderWidth: role === value ? 1.5 : 0,
        borderColor: 'rgba(255,255,255,0.7)'
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 8 }}>Create Account</Text>
        <Text style={{ color: '#ecfeff', marginBottom: 24 }}>Join as Supplier or Producer</Text>

        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="person" size={18} color="#fff" />
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Full name"
              placeholderTextColor="#e5e7eb"
              style={{ marginLeft: 8, color: '#fff', flex: 1 }}
            />
          </View>
        </View>

        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="mail" size={18} color="#fff" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#e5e7eb"
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ marginLeft: 8, color: '#fff', flex: 1 }}
            />
          </View>
        </View>

        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="lock-closed" size={18} color="#fff" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#e5e7eb"
              secureTextEntry
              style={{ marginLeft: 8, color: '#fff', flex: 1 }}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <RoleOption value="supplier" label="Waste Supplier" />
          <RoleOption value="producer" label="Compost Producer" />
        </View>

        {error ? <Text style={{ color: '#fee2e2', marginBottom: 8 }}>{error}</Text> : null}

        <GradientButton title={loading ? 'Creating...' : 'Sign up'} onPress={onSubmit} loading={loading} />

        <TouchableOpacity onPress={() => navigation.navigate('Login' as never)} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>
            Already have an account? <Text style={{ fontWeight: '800' }}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}

