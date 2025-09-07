import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { getFood, toggleFavorite } from '../services/foods';
import { addToCart } from '../services/cartOrders';

export default function FoodDetailScreen({ route }) {
  const { id } = route.params || {};
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const f = await getFood(id);
      if (mounted) { setFood(f); setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return null;
  if (!food) return <View style={styles.center}><Text>Not found</Text></View>;

  return (
    <View style={styles.container}>
      {!!food.imageURL && <Image source={{ uri: food.imageURL }} style={styles.image} />}
      <Text style={styles.title}>{food.title}</Text>
      <Text style={styles.category}>{food.category}</Text>
      <Text style={styles.price}>${Number(food.price).toFixed(2)}</Text>
      <Text style={styles.desc}>{food.description}</Text>
      <View style={styles.actions}>
        <Button title="Add to Cart" onPress={() => addToCart({ foodId: food.id, qty: 1, title: food.title, price: food.price, imageURL: food.imageURL })} />
        <Button title={favLoading ? '...' : 'Toggle Favorite'} onPress={async () => { setFavLoading(true); await toggleFavorite(food.id); setFavLoading(false); }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: 240, borderRadius: 8, marginBottom: 12, backgroundColor: '#eee' },
  title: { fontSize: 22, fontWeight: 'bold' },
  category: { color: '#555', marginTop: 4 },
  price: { marginTop: 6, fontWeight: 'bold' },
  desc: { marginTop: 12, color: '#333' },
  actions: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' },
});

