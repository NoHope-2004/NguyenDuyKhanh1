import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDate, getSeatLabel, Tour } from '../utils/tour';

export interface TourItemProps {
  tour: Tour;
  compact?: boolean;
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
}

const TourItem: React.FC<TourItemProps> = ({
  tour,
  compact = false,
  onPress,
  onToggleFavorite,
}) => {
  const seatLabel = getSeatLabel(tour.seats);
  const isSeatRed = tour.seats <= 3;

  const formattedPrice = tour.price.toLocaleString('vi-VN') + ' ₫';

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.card, styles.compactCard]}
        onPress={() => onPress(tour)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainerCompact}>
          <Image source={{ uri: tour.image }} style={styles.imageCompact} />
          <TouchableOpacity
            testID="fav-btn"
            style={styles.favBtnCompact}
            onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}
          >
            <Text style={{ fontSize: 16 }}>{tour.isFavorite ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoCompact}>
          <Text style={styles.nameCompact} numberOfLines={1}>
            {tour.name}
          </Text>
          <Text style={styles.price}>{formattedPrice}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, styles.normalCard]}
      onPress={() => onPress(tour)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: tour.image }} style={styles.imageNormal} />
      <View style={styles.infoNormal}>
        <Text style={styles.nameNormal} numberOfLines={1}>
          {tour.name}
        </Text>
        <Text style={styles.city}>{tour.city}</Text>
        <Text style={styles.subText}>
          📅 {formatDate(tour.departure)} · {tour.days} ngày
        </Text>
        <View style={styles.footerRow}>
          <Text style={styles.price}>{formattedPrice}</Text>
          <Text style={[styles.seatLabel, isSeatRed && styles.textRed]}>
            {seatLabel}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        testID="fav-btn"
        style={styles.favBtnNormal}
        onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}
      >
        <Text style={{ fontSize: 20 }}>{tour.isFavorite ? '♥' : '♡'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default React.memo(TourItem);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  normalCard: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  imageNormal: {
    width: 90,
    height: 90,
    borderRadius: 6,
  },
  infoNormal: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  nameNormal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  city: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  subText: {
    fontSize: 13,
    color: '#555',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d9534f',
  },
  seatLabel: {
    fontSize: 12,
    color: '#333',
  },
  textRed: {
    color: 'red',
    fontWeight: 'bold',
  },
  favBtnNormal: {
    padding: 8,
  },
  compactCard: {
    width: 160,
    marginHorizontal: 6,
  },
  imageContainerCompact: {
    width: '100%',
    aspectRatio: 4 / 3,
    position: 'relative',
  },
  imageCompact: {
    width: '100%',
    height: '100%',
  },
  favBtnCompact: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 4,
  },
  infoCompact: {
    padding: 8,
  },
  nameCompact: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
});