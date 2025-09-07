import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Image } from 'react-native';
import { observeCart, setCartItemQty, removeFromCart, checkout } from '../services/cartOrders';

export default function CartScreen() {
  const [cart, setCart] = useState({ items: [], qty: 0, subtotal: 0 });
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const unsub = observeCart(setCart);
    return unsub;
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {!!item.imageURL && <Image source={{ uri: item.imageURL }} style={styles.image} />}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>${Number(item.price).toFixed(2)}</Text>
        <View style={styles.qtyRow}>
          <Button title="-" onPress={() => setCartItemQty({ foodId: item.id, qty: Math.max(0, (item.qty || 0) - 1) })} />
          <Text style={{ marginHorizontal: 8 }}>{item.qty}</Text>
          <Button title="+" onPress={() => setCartItemQty({ foodId: item.id, qty: (item.qty || 0) + 1 })} />
          <View style={{ width: 8 }} />
          <Button title="Remove" color="#cc0000" onPress={() => removeFromCart(item.id)} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={cart.items} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>Cart is empty</Text>} />
      <View style={styles.footer}>
        <Text style={styles.total}>Subtotal: ${cart.subtotal.toFixed(2)}</Text>
        <Button title={placing ? 'Placing...' : 'Checkout'} onPress={async () => { setPlacing(true); try { await checkout({}); } finally { setPlacing(false); } }} disabled={placing || cart.items.length === 0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 12 },
  row: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 12, padding: 8, borderRadius: 8 },
  image: { width: 64, height: 64, borderRadius: 8, marginRight: 8, backgroundColor: '#eee' },
  title: { fontWeight: 'bold' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  footer: { padding: 12, borderTopWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  total: { fontWeight: 'bold', fontSize: 16 },
});

