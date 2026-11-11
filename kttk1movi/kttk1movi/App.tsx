import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Switch, RefreshControl, Alert, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MovieCard, { Movie } from './components/MovieCard';

// Đường dẫn API MockAPI của bạn
const API_URL = 'https://6af47dc855a1de7df04266a.mockapi.io/movi';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isGrid, setIsGrid] = useState(false);

  const fetchMovies = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      // Lọc bỏ các phần tử null/undefined để tránh crash app
      const validData = Array.isArray(data) ? data.filter(item => item && item.id != null) : [];
      setMovies(validData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMovies();
  };

  const numColumns = isGrid ? 2 : 1;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Movie App</Text>
          <View style={styles.switchContainer}>
            <Text>Dạng lưới</Text>
            <Switch value={isGrid} onValueChange={setIsGrid} />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={{flex: 1}}/>
        ) : (
          <FlatList
            key={String(numColumns)} 
            data={movies}
            keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
            numColumns={numColumns}
            columnWrapperStyle={isGrid ? styles.columnWrapper : undefined}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                layout={isGrid ? 'tile' : 'row'}
                onSelect={(id) => Alert.alert("Thông báo", `Tên phim: ${item.title ?? 'Không có tên'}`)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  switchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  columnWrapper: {
    justifyContent: 'flex-start', 
    gap: 12,
    paddingHorizontal: 10,
  }
});