import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { createFood } from '../services/foods';
import { launchImageLibrary } from 'react-native-image-picker';

export default function AddFoodScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [category, setCategory] = useState('general');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pickImage = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo' });
    if (res?.assets?.length) setImageUri(res.assets[0].uri);
  };

  const onCreate = async () => {
    setError('');
    setLoading(true);
    try {
      await createFood({ title, description, price: parseFloat(price), imageUri, category, quantity: parseFloat(quantity), location });
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Food</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType='decimal-pad' style={styles.input} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} />
      <TextInput placeholder="Quantity" value={quantity} onChangeText={setQuantity} keyboardType='decimal-pad' style={styles.input} />
      <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={styles.input} />
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
      <Button title="Pick Image" onPress={pickImage} />
      <View style={{ height: 12 }} />
      <Button title={loading ? 'Saving...' : 'Create'} onPress={onCreate} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 },
  image: { width: '100%', height: 180, borderRadius: 8, marginBottom: 12, backgroundColor: '#eee' },
  error: { color: 'red', marginBottom: 8 },
});

