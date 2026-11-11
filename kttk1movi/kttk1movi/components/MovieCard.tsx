import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export type Movie = {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  poster: string;
  isShowing: boolean;
};

export type MovieCardProps = {
  movie: Movie;
  layout?: 'row' | 'tile';
  onSelect: (id: string) => void;
};

const MovieCard = ({ movie, layout = 'row', onSelect }: MovieCardProps) => {
  const isTile = layout === 'tile';

  return (
    <TouchableOpacity 
      style={[styles.card, isTile && styles.cardTile]} 
      onPress={() => onSelect(movie.id)}
    >
      <View style={isTile ? styles.posterWrapperTile : null}>
        <Image 
          source={{ uri: movie.poster }} 
          style={isTile ? styles.posterTile : styles.posterRow} 
        />
        {isTile && (
          <Text style={styles.statusAbsolute}>
            {movie.isShowing ? '☑' : '☒'}
          </Text>
        )}
      </View>
      
      <View style={[styles.info, isTile && styles.infoTile]}>
        <Text style={styles.title} numberOfLines={isTile ? 1 : undefined}>
          {movie.title}
        </Text>
        {!isTile && <Text>{movie.genre}</Text>}
        {!isTile && <Text>{movie.year}</Text>}
        <Text>* {movie.rating.toFixed(1)}</Text>
        {!isTile && <Text>{movie.isShowing ? '☑' : '☒'}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#fff', flex: 1,
  },
  cardTile: {
    flexDirection: 'column', margin: 5, borderWidth: 1, borderRadius: 8, padding: 0, overflow: 'hidden', maxWidth: '47%',
  },
  posterRow: { width: 70, height: 100, marginRight: 10 },
  posterTile: { width: '100%', aspectRatio: 2/3 },
  posterWrapperTile: { position: 'relative' },
  statusAbsolute: {
    position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 4, borderRadius: 4, fontWeight: 'bold',
  },
  info: { flex: 1, justifyContent: 'center' },
  infoTile: { padding: 8 },
  title: { fontWeight: 'bold', fontSize: 16 }
});

export default React.memo(MovieCard);