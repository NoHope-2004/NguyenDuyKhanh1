import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const API = 'https://6abbabbeb2118ed7abb92a2f.mockapi.io/xedap';

export default function App() {
  const [scr, setScr] = useState('1');
  const [bike, setBike] = useState(null);
  const [cat, setCat] = useState('All');
  const [cart, setCart] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, setRef] = useState(false);

  const load = (isRef = false) => {
    isRef ? setRef(true) : setLoading(true);
    fetch(API).then(r => r.json()).then(d => { setBikes(d); setLoading(false); setRef(false); }).catch(() => { setLoading(false); setRef(false); });
  };

  useEffect(() => { load(); }, []);

  const total = cart.reduce((s, i) => s + i.finalPrice, 0);
  const favs = bikes.filter(b => b.isFavorite);
  const filtered = cat === 'All' ? bikes : bikes.filter(b => b.type === cat);
  const toggleFav = id => setBikes(bikes.map(b => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));

  return (
    <SafeAreaProvider><SafeAreaView style={scr === '1' ? s.center : s.container}>
      {scr === '1' ? (
        <> <Text style={s.title}>POWER BIKE SHOP</Text>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7' }} style={{ width: 250, height: 200, resizeMode: 'contain' }} />
          <TouchableOpacity style={s.btn} onPress={() => setScr('2')}><Text style={s.btnText}>Get Started</Text></TouchableOpacity>
        </>
      ) : scr === '3' && bike ? (
        <>
          <TouchableOpacity onPress={() => setScr('2')}><Text style={s.bold}>← Back</Text></TouchableOpacity>
          <Image source={{ uri: bike.image }} style={{ width: '100%', height: 220, resizeMode: 'contain' }} />
          <Text style={s.title}>{bike.name}</Text>
          <Text>30% OFF: ${bike.price * 0.7} <Text style={{ textDecorationLine: 'line-through' }}>${bike.price}</Text></Text>
          <TouchableOpacity style={s.btn} onPress={() => { setCart([...cart, { ...bike, cartId: Date.now().toString(), finalPrice: bike.price * 0.7 }]); setScr('2'); }}>
            <Text style={s.btnText}>Add to cart</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={s.row}>
            <Text style={s.title}>Best Bikes</Text>
            <View style={s.row}>
              <Text style={[s.bold, { color: 'red' }]}>🛒 {cart.length} | ${total.toFixed(1)}</Text>
              {cart.length > 0 && <TouchableOpacity style={s.minus} onPress={() => setCart(cart.slice(0, -1))}><Text style={s.btnText}>-</Text></TouchableOpacity>}
            </View>
          </View>

          <Text style={s.bold}>Yêu thích ({favs.length})</Text>
          {favs.length === 0 ? <Text style={s.gray}>Chưa có xe yêu thích</Text> : (
            <FlatList horizontal showsHorizontalScrollIndicator={false} data={favs} keyExtractor={i => 'f-' + i.id} style={{ maxHeight: 90, marginBottom: 5 }} renderItem={({ item }) => (
              <TouchableOpacity style={s.cCard} onPress={() => { setBike(item); setScr('3'); }}>
                <TouchableOpacity style={s.topRight} onPress={() => toggleFav(item.id)}><Text style={{ color: 'red' }}>♥</Text></TouchableOpacity>
                <Image source={{ uri: item.image }} style={{ width: '100%', height: 50, resizeMode: 'contain' }} />
                <Text numberOfLines={1} style={{ fontSize: 11, fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ fontSize: 10, color: 'red' }}>${item.price}</Text>
              </TouchableOpacity>
            )} />
          )}

          <View style={s.row}>
            {['All', 'Roadbike', 'Mountain'].map(c => (
              <TouchableOpacity key={c} onPress={() => setCat(c)}><Text style={{ color: cat === c ? 'red' : 'gray', fontWeight: 'bold' }}>{c}</Text></TouchableOpacity>
            ))}
          </View>

          {loading ? <ActivityIndicator size="large" color="red" style={{ marginTop: 20 }} /> : (
            <FlatList data={filtered} keyExtractor={i => i.id} numColumns={2} 
              refreshControl={<RefreshControl refreshing={ref} onRefresh={() => load(true)} colors={['red']} tintColor="red" />}
              renderItem={({ item }) => (
                <TouchableOpacity style={s.card} onPress={() => { setBike(item); setScr('3'); }}>
                  <TouchableOpacity style={s.topRight} onPress={() => toggleFav(item.id)}>
                    <Text style={{ fontSize: 18, color: item.isFavorite ? 'red' : 'gray' }}>{item.isFavorite ? '♥' : '♡'}</Text>
                  </TouchableOpacity>
                  <Image source={{ uri: item.image }} style={{ width: 90, height: 70, resizeMode: 'contain' }} />
                  <Text numberOfLines={1}>{item.name}</Text>
                  <Text style={s.bold}>${item.price}</Text>
                </TouchableOpacity>
              )} 
            />
          )}
        </>
      )}
    </SafeAreaView></SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 4 },
  bold: { fontWeight: 'bold' },
  gray: { color: 'gray', fontSize: 12, fontStyle: 'italic', marginBottom: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 3 },
  btn: { backgroundColor: 'red', padding: 12, borderRadius: 20, alignItems: 'center', marginTop: 15, width: '100%' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  card: { flex: 1, margin: 3, padding: 6, backgroundColor: '#f2f2f2', alignItems: 'center', borderRadius: 5 },
  cCard: { width: 85, marginRight: 6, padding: 4, backgroundColor: '#f9f9f9', borderRadius: 5, alignItems: 'center' },
  topRight: { position: 'absolute', top: 2, right: 4, zIndex: 1 },
  minus: { marginLeft: 6, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }
});