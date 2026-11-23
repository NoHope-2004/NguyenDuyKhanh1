import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { Loading } from '../../components/Loading';
import { SearchBar } from '../../components/SearchBar';
import { Colors } from '../../constants/Colors';
import { Product } from '../../types';
import { Plus, Edit3, Trash2, X, Package, Check, ImagePlus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AdminProductsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [keyword, setKeyword] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // State cho Modal Chỉnh sửa sản phẩm
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editUnit, setEditUnit] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const pickEditImage = async () => {
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
        setEditImage(dataUri);
      }
    } catch (e: any) {
      Alert.alert('Lỗi chọn ảnh', e.message);
    }
  };

  const { data: products = [], isLoading, refetch } = useQuery<Product[]>({
    queryKey: ['products', keyword],
    queryFn: () => productService.getProducts({ search: keyword }),
  });

  // Mutation cập nhật sản phẩm
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
      Alert.alert('Thành công', 'Đã cập nhật thông tin sản phẩm!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Không thể cập nhật sản phẩm';
      Alert.alert('Lỗi', msg);
    },
  });

  // Mutation xóa sản phẩm
  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      Alert.alert('Thành công', 'Đã xóa sản phẩm khỏi cơ sở dữ liệu!');
    },
    onError: (err: any) => {
      Alert.alert('Lỗi', err.response?.data?.message || 'Không thể xóa sản phẩm');
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditPrice(p.price.toString());
    setEditStock(p.stock.toString());
    setEditUnit(p.unit);
    setEditImage(p.image);
    setEditDesc(p.description || '');
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    if (!editName.trim() || !editPrice || !editUnit.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền các trường bắt buộc');
      return;
    }

    updateMutation.mutate({
      id: editingProduct._id,
      data: {
        name: editName.trim(),
        price: Number(editPrice),
        stock: Number(editStock) || 0,
        unit: editUnit.trim(),
        image: editImage.trim() || editingProduct.image,
        description: editDesc.trim(),
      },
    });
  };

  const handleDelete = (p: Product) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa sản phẩm "${p.name}" khỏi hệ thống không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa vĩnh viễn',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(p._id),
        },
      ]
    );
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  if (isLoading) {
    return <Loading message="Đang tải danh sách kho sản phẩm..." />;
  }

  return (
    <View style={styles.container}>
      {/* Thanh công cụ trên */}
      <View style={styles.topBar}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <SearchBar
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Tìm theo tên vật liệu..."
          />
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/admin/add-product' as any)}
          activeOpacity={0.85}
        >
          <Plus size={18} color={Colors.white} />
          <Text style={styles.addBtnText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>Kho hàng hiện có: {products.length} sản phẩm</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {products.map((p) => (
          <View key={p._id} style={styles.productCard}>
            <Image source={{ uri: p.image }} style={styles.productImg} resizeMode="cover" />

            <View style={styles.cardInfo}>
              <Text style={styles.brandText}>{p.brand}</Text>
              <Text style={styles.nameText} numberOfLines={2}>
                {p.name}
              </Text>
              <Text style={styles.priceText}>
                {formatPrice(p.price)} <Text style={styles.unitText}>/{p.unit}</Text>
              </Text>
              <View style={styles.stockBadge}>
                <Package size={12} color={Colors.textSecondary} />
                <Text style={styles.stockText}>Tồn kho: {p.stock} {p.unit}</Text>
              </View>

              {/* Nút Sửa & Xóa */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.btnAction, styles.editBtn]}
                  onPress={() => handleOpenEdit(p)}
                >
                  <Edit3 size={14} color="#2563EB" />
                  <Text style={styles.editBtnText}>Sửa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnAction, styles.deleteBtn]}
                  onPress={() => handleDelete(p)}
                >
                  <Trash2 size={14} color={Colors.error} />
                  <Text style={styles.deleteBtnText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal chỉnh sửa sản phẩm */}
      <Modal
        visible={!!editingProduct}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingProduct(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa sản phẩm</Text>
              <TouchableOpacity onPress={() => setEditingProduct(null)}>
                <X size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              <AppInput
                label="Tên sản phẩm *"
                value={editName}
                onChangeText={setEditName}
              />

              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <AppInput
                    label="Đơn giá (VNĐ) *"
                    keyboardType="numeric"
                    value={editPrice}
                    onChangeText={setEditPrice}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <AppInput
                    label="Đơn vị tính *"
                    value={editUnit}
                    onChangeText={setEditUnit}
                  />
                </View>
              </View>

              <AppInput
                label="Tồn kho *"
                keyboardType="numeric"
                value={editStock}
                onChangeText={setEditStock}
              />

              {/* Upload ảnh trong Modal Sửa */}
              <Text style={{ fontSize: 13, fontWeight: '500', color: Colors.textPrimary, marginBottom: 6 }}>
                Hình ảnh sản phẩm
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray100, padding: 8, borderRadius: 6, marginBottom: 12 }}>
                {editImage ? (
                  <Image source={{ uri: editImage }} style={{ width: 60, height: 60, borderRadius: 4 }} />
                ) : null}
                <TouchableOpacity
                  style={{ backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, marginLeft: 10 }}
                  onPress={pickEditImage}
                >
                  <ImagePlus size={15} color={Colors.white} />
                  <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '700', marginLeft: 4 }}>
                    Đổi ảnh từ máy
                  </Text>
                </TouchableOpacity>
              </View>

              <AppInput
                label="Mô tả kỹ thuật"
                multiline
                numberOfLines={3}
                style={{ height: 65, textAlignVertical: 'top' }}
                value={editDesc}
                onChangeText={setEditDesc}
              />

              <AppButton
                title="Lưu thay đổi"
                icon={<Check size={16} color={Colors.white} />}
                onPress={handleSaveEdit}
                loading={updateMutation.isPending}
                style={{ marginTop: 8 }}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 6,
  },
  addBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 4,
  },
  summaryRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  summaryText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  productCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
  },
  productImg: {
    width: 84,
    height: 84,
    borderRadius: 6,
    backgroundColor: Colors.gray100,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  brandText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  nameText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  unitText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  stockText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
  },
  btnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  editBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  editBtnText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteBtnText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalBody: {
    padding: 16,
    paddingBottom: 24,
  },
});
