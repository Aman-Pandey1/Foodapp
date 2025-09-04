import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import GradientButton from '../../components/GradientButton';
import { useAuth } from '../../providers/AuthProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 8 }}>Welcome Back</Text>
        <Text style={{ color: '#ecfeff', marginBottom: 24 }}>Login to continue</Text>

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

        {error ? <Text style={{ color: '#fee2e2', marginBottom: 8 }}>{error}</Text> : null}

        <GradientButton title={loading ? 'Logging in...' : 'Login'} onPress={onSubmit} loading={loading} />

        <TouchableOpacity onPress={() => navigation.navigate('Signup' as never)} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>
            New here? <Text style={{ fontWeight: '800' }}>Create an account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}

