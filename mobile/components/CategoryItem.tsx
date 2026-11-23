import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import { Category } from '../types';
import { Colors } from '../constants/Colors';

interface CategoryItemProps {
  category: Category;
  isSelected?: boolean;
  onPress: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageWrapper, isSelected && styles.selectedImageWrapper]}>
        <Image source={{ uri: category.image }} style={styles.image} resizeMode="cover" />
      </View>
      <Text
        style={[styles.name, isSelected && styles.selectedName]}
        numberOfLines={2}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 76,
    marginHorizontal: 6,
    marginVertical: 4,
  },
  selectedContainer: {
    opacity: 1,
  },
  imageWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: Colors.divider,
    overflow: 'hidden',
    backgroundColor: Colors.gray100,
  },
  selectedImageWrapper: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 15,
  },
  selectedName: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
