import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  StyleSheet,
} from 'react-native';

// API MockAPI
const API_URL = 'https://6abbabbeb2118ed7abb92a2f.mockapi.io/ktgk';

// Lấy tên tour
const getName = (item) =>
  item.tenTour || item.tentour || item.name || item.title || 'Tour du lịch';

// Lấy địa điểm
const getLocation = (item) =>
  item.diaDiem || item.diemDen || item.location || item.destination || 'Việt Nam';

// Lấy giá tour
const getPrice = (item) =>
  item.gia || item.price || 'Liên hệ';

// Lấy hình ảnh
const getImage = (item) =>
  item.hinhAnh || item.image || item.poster || item.anh || '';

export default function App() {
  const [tours, setTours] = useState([]);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Lấy dữ liệu từ API
  const fetchTours = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu API');
      }

      const data = await response.json();
      setTours(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('Lỗi API:', error);
      setTours([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Tìm kiếm tour theo tên
  const filteredTours = useMemo(() => {
    return tours.filter((item) =>
      getName(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [tours, search]);

  // Thêm hoặc xóa tour yêu thích
  const toggleFavorite = (id) => {
    setFavorites((old) =>
      old.includes(id)
        ? old.filter((item) => item !== id)
        : [...old, id]
    );
  };

  // Danh sách tour yêu thích
  const favoriteTours = tours.filter((item) =>
    favorites.includes(String(item.id))
  );

  // Làm mới dữ liệu
  const onRefresh = () => {
    setRefreshing(true);
    fetchTours();
  };

  // Giao diện từng tour
  const renderTour = ({ item }) => {
    const isFavorite = favorites.includes(String(item.id));
    const image = getImage(item);

    return (
      <View style={styles.card}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>Chưa có hình ảnh</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.tourName}>{getName(item)}</Text>

          <Text style={styles.detail}>
            📍 Địa điểm: {getLocation(item)}
          </Text>

          <Text style={styles.detail}>
            💰 Giá: {getPrice(item)}
          </Text>

          <Text style={styles.detail}>
            ⏰ Thời gian: {item.thoiGian || item.duration || 'Đang cập nhật'}
          </Text>

          <TouchableOpacity
            style={[
              styles.favoriteButton,
              isFavorite && styles.favoriteActive,
            ]}
            onPress={() => toggleFavorite(String(item.id))}
          >
            <Text style={styles.favoriteText}>
              {isFavorite ? '♥ Đã yêu thích' : '♡ Yêu thích'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={filteredTours}
        keyExtractor={(item, index) =>
          String(item.id || index)
        }
        renderItem={renderTour}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
          />
        }
        ListHeaderComponent={
          <View>
            {/* Tiêu đề */}
            <View style={styles.header}>
              <Text style={styles.title}>Tour Việt</Text>

              <Text style={styles.student}>
                MSSV: 22707491 – Nguyễn Duy Khanh
              </Text>

              {/* Tìm kiếm */}
              <TextInput
                style={styles.search}
                placeholder="Tìm tour theo tên..."
                placeholderTextColor="#aaaaaa"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Tour yêu thích */}
            <View style={styles.favoriteHeader}>
              <Text style={styles.sectionTitle}>
                Tour yêu thích ({favorites.length})
              </Text>

              {favoriteTours.length === 0 ? (
                <Text style={styles.emptyFavorite}>
                  Chưa có tour yêu thích
                </Text>
              ) : (
                favoriteTours.map((item) => (
                  <Text key={String(item.id)} style={styles.favoriteItem}>
                    ♥ {getName(item)}
                  </Text>
                ))
              )}
            </View>

            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>
                Danh sách tour ({filteredTours.length})
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#ffffff"
              style={{ marginTop: 50 }}
            />
          ) : (
            <Text style={styles.empty}>
              Không tìm thấy tour phù hợp
            </Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
  },

  header: {
    backgroundColor: '#111111',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#383838',
  },

  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  student: {
    color: '#aaaaaa',
    fontSize: 13,
    marginBottom: 12,
  },

  search: {
    height: 42,
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#ffffff',
    fontSize: 14,
  },

  favoriteHeader: {
    backgroundColor: '#111111',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#383838',
  },

  sectionTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  emptyFavorite: {
    color: '#999999',
    fontStyle: 'italic',
    marginTop: 8,
    fontSize: 13,
  },

  favoriteItem: {
    color: '#ff7777',
    marginTop: 8,
  },

  listHeader: {
    padding: 16,
  },

  card: {
    backgroundColor: '#303030',
    marginHorizontal: 12,
    marginBottom: 14,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#454545',
  },

  image: {
    width: '100%',
    height: 170,
  },

  noImage: {
    height: 100,
    backgroundColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noImageText: {
    color: '#aaaaaa',
  },

  info: {
    padding: 12,
  },

  tourName: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  detail: {
    color: '#cccccc',
    fontSize: 13,
    marginBottom: 7,
  },

  favoriteButton: {
    backgroundColor: '#444444',
    padding: 10,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 8,
  },

  favoriteActive: {
    backgroundColor: '#803333',
  },

  favoriteText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  empty: {
    color: '#aaaaaa',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 14,
  },
});