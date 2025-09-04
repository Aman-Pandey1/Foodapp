import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Linking } from 'react-native';
import { collection, onSnapshot, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import Icon from 'react-native-vector-icons/Ionicons';

type Listing = {
  id: string;
  title: string;
  type: string;
  quantityKg: number;
  location: string;
  imageUrl?: string;
  status: 'available' | 'claimed';
  supplierId: string;
};

export default function ProducerHome() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [supplierMap, setSupplierMap] = useState<Record<string, { displayName?: string; email?: string }>>({});

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, async (snap) => {
      const data: Listing[] = [];
      const supplierIds = new Set<string>();
      snap.forEach((d) => {
        const item = { id: d.id, ...(d.data() as any) } as Listing;
        if (item.status === 'available') {
          data.push(item);
          supplierIds.add(item.supplierId);
        }
      });
      setListings(data);
      const map: Record<string, { displayName?: string; email?: string }> = {};
      await Promise.all(
        Array.from(supplierIds).map(async (uid) => {
          const d = await getDoc(doc(collection(db, 'users'), uid));
          if (d.exists()) map[uid] = d.data() as any;
        })
      );
      setSupplierMap(map);
    });
    return () => unsub();
  }, []);

  const contactSupplier = (email?: string) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}?subject=Interest%20in%20your%20waste%20listing`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 20, fontWeight: '800' }}>Available Waste</Text>
      </View>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const supplier = supplierMap[item.supplierId];
          return (
            <View style={{ backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row' }}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={{ width: 72, height: 72, borderRadius: 10, marginRight: 12 }} />
              ) : (
                <View style={{ width: 72, height: 72, borderRadius: 10, marginRight: 12, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="image" size={24} color="#9ca3af" />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700' }}>{item.title}</Text>
                <Text style={{ color: '#6b7280' }}>{item.type} • {item.quantityKg} kg</Text>
                <Text style={{ color: '#6b7280' }}>{item.location}</Text>
                <Text style={{ color: '#6b7280' }}>Supplier: {supplier?.displayName || 'N/A'}</Text>
              </View>
              <TouchableOpacity onPress={() => contactSupplier(supplier?.email)} style={{ alignSelf: 'center', backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Contact</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6b7280' }}>No listings yet.</Text>}
      />
    </View>
  );
}

