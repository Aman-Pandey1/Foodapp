import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../services/firebase';
import { useAuth } from '../../providers/AuthProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

type Listing = {
  id: string;
  title: string;
  type: string;
  quantityKg: number;
  location: string;
  imageUrl?: string;
  status: 'available' | 'claimed';
  createdAt?: any;
  supplierId: string;
};

export default function SupplierHome() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data: Listing[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...(d.data() as any) }));
      setListings(data.filter((l) => l.supplierId === user?.uid));
    });
    return () => unsub();
  }, [user?.uid]);

  const createListing = async () => {
    if (!user) return;
    setCreating(true);
    try {
      let imageUrl: string | undefined;
      const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
      if (!res.didCancel && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        if (asset.uri) {
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          const storageRef = ref(storage, `listings/${user.uid}/${Date.now()}.jpg`);
          await uploadBytes(storageRef, blob);
          imageUrl = await getDownloadURL(storageRef);
        }
      }

      await addDoc(collection(db, 'listings'), {
        title: 'Food Waste',
        type: 'Mixed',
        quantityKg: Math.floor(Math.random() * 20) + 1,
        location: 'My Location',
        imageUrl,
        status: 'available',
        supplierId: user.uid,
        createdAt: serverTimestamp(),
      });
    } finally {
      setCreating(false);
    }
  };

  const toggleStatus = async (listing: Listing) => {
    await updateDoc(doc(collection(db, 'listings'), listing.id), {
      status: listing.status === 'available' ? 'claimed' : 'available',
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 20, fontWeight: '800' }}>My Waste Listings</Text>
        <TouchableOpacity onPress={createListing} style={{ backgroundColor: '#10b981', padding: 10, borderRadius: 12, opacity: creating ? 0.6 : 1 }} disabled={creating}>
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
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
            </View>
            <TouchableOpacity onPress={() => toggleStatus(item)} style={{ alignSelf: 'center', backgroundColor: item.status === 'available' ? '#d1fae5' : '#fee2e2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 }}>
              <Text style={{ color: item.status === 'available' ? '#065f46' : '#991b1b', fontWeight: '700' }}>{item.status}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6b7280' }}>No listings yet. Tap + to add.</Text>}
      />
    </View>
  );
}

