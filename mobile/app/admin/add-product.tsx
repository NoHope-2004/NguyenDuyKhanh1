import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { productService } from '../../services/productService';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { Colors } from '../../constants/Colors';
import { Category } from '../../types';
import { ImagePlus, RefreshCw } from 'lucide-react-native';

export default function AdminAddProductScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('Bao (50kg)');
  const [stock, setStock] = useState('100');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80');
  const [description, setDescription] = useState('');

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền truy cập ảnh trên thiết bị');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const dataUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        setImage(dataUri);
      }
    } catch (e: any) {
      Alert.alert('Lỗi chọn ảnh', e.message);
    }
  };

  // Lấy danh mục để chọn
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      Alert.alert('Thành công', 'Đã thêm vật liệu mới vào cơ sở dữ liệu!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Không thể thêm sản phẩm';
      Alert.alert('Lỗi', msg);
    },
  });

  const handleSave = () => {
    if (!name.trim() || !brand.trim() || !price || !unit.trim() || !image.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền các trường thông tin bắt buộc');
      return;
    }

    const catId = selectedCatId || (categories.length > 0 ? categories[0]._id : '');
    if (!catId) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục cho sản phẩm');
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      categoryId: catId,
      brand: brand.trim(),
      price: Number(price),
      unit: unit.trim(),
      stock: Number(stock) || 100,
      image: image.trim(),
      description: description.trim() || 'Sản phẩm vật liệu xây dựng chính hãng chất lượng cao tại VLXD Hub.',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>Thông tin vật liệu xây dựng mới</Text>

          <AppInput
            label="Tên sản phẩm vật liệu *"
            placeholder="Ví dụ: Xi măng Vicem Hà Tiên PCB40"
            value={name}
            onChangeText={setName}
          />

          {/* Chọn danh mục */}
          <Text style={styles.label}>Chọn danh mục *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catScroll}
          >
            {categories.map((c) => {
              const isSelected = selectedCatId === c._id || (!selectedCatId && categories[0]?._id === c._id);
              return (
                <TouchableOpacity
                  key={c._id}
                  style={[styles.catChip, isSelected && styles.selectedCatChip]}
                  onPress={() => setSelectedCatId(c._id)}
                >
                  <Text style={[styles.catText, isSelected && styles.selectedCatText]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <AppInput
            label="Thương hiệu / Nhà sản xuất *"
            placeholder="Ví dụ: Hà Tiên, Hòa Phát, Viglacera..."
            value={brand}
            onChangeText={setBrand}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <AppInput
                label="Đơn giá (VNĐ) *"
                placeholder="Ví dụ: 95000"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <AppInput
                label="Đơn vị tính *"
                placeholder="Bao, Viên, Thanh, Kg..."
                value={unit}
                onChangeText={setUnit}
              />
            </View>
          </View>

          <AppInput
            label="Số lượng tồn kho *"
            placeholder="Ví dụ: 500"
            keyboardType="numeric"
            value={stock}
            onChangeText={setStock}
          />

          {/* Phần Upload Hình ảnh */}
          <Text style={styles.label}>Hình ảnh sản phẩm *</Text>
          <View style={styles.imagePickerBox}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.noImageBox}>
                <ImagePlus size={32} color={Colors.textSecondary} />
                <Text style={styles.noImageText}>Chưa chọn ảnh</Text>
              </View>
            )}

            <View style={{ flex: 1, marginLeft: 12 }}>
              <TouchableOpacity style={styles.uploadBtn} onPress={pickImage} activeOpacity={0.8}>
                <ImagePlus size={16} color={Colors.white} />
                <Text style={styles.uploadBtnText}>Tải ảnh từ điện thoại</Text>
              </TouchableOpacity>
              <Text style={styles.uploadHint}>Hỗ trợ ảnh chụp, thư viện ảnh (JPG, PNG)</Text>
            </View>
          </View>

          <AppInput
            label="Hoặc dán Link URL ảnh trực tiếp"
            placeholder="https://..."
            value={image.startsWith('data:') ? '[Đã chọn ảnh từ thiết bị]' : image}
            onChangeText={(txt) => setImage(txt)}
            editable={!image.startsWith('data:')}
          />

          <AppInput
            label="Mô tả kỹ thuật sản phẩm"
            placeholder="Mô tả mác xi măng, tiêu chuẩn chịu lực, công dụng..."
            multiline
            numberOfLines={3}
            style={{ height: 70, textAlignVertical: 'top' }}
            value={description}
            onChangeText={setDescription}
          />

          <AppButton
            title="Lưu vật liệu vào MongoDB"
            onPress={handleSave}
            loading={createMutation.isPending}
            style={{ marginTop: 10 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  catScroll: {
    marginBottom: 14,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    marginRight: 6,
  },
  selectedCatChip: {
    backgroundColor: Colors.primary,
  },
  catText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  selectedCatText: {
    color: Colors.white,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
  },
  imagePickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: Colors.surface,
  },
  noImageBox: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
    borderStyle: 'dashed',
  },
  noImageText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  uploadBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  uploadBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  uploadHint: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
  },
});
