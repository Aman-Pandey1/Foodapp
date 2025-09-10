import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { observeFoods } from '../services/foods';

export default function SupplierBrowseScreen({ navigation }) {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const unsub = observeFoods({}, setFoods);
    return unsub;
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('FoodDetail', { id: item.id })}>
      {!!item.imageURL && <Image source={{ uri: item.imageURL }} style={styles.image} />}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
        <Text style={styles.price}>₹{Number(item.price).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {foods.length === 0 ? (
        <View style={styles.empty}><Text>No listings available</Text></View>
      ) : (
        <FlatList data={foods} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={styles.list} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 12 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 8, marginBottom: 12, elevation: 2 },
  image: { width: 72, height: 72, borderRadius: 8, marginRight: 8, backgroundColor: '#eee' },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold' },
  desc: { color: '#555', marginTop: 4 },
  price: { marginTop: 6, fontWeight: 'bold' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

