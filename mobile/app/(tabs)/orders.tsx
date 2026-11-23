import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { AppButton } from '../../components/AppButton';
import { Loading } from '../../components/Loading';
import { Colors } from '../../constants/Colors';
import { Order, OrderStatus } from '../../types';
import { ClipboardList, ChevronRight, X, Clock, MapPin, Phone, User } from 'lucide-react-native';

export default function OrdersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
    enabled: !!user,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Chờ xác nhận', bg: '#FEF3C7', text: '#92400E' };
      case 'CONFIRMED':
        return { label: 'Đã xác nhận', bg: '#DBEAFE', text: '#1E40AF' };
      case 'SHIPPING':
        return { label: 'Đang giao hàng', bg: '#E0E7FF', text: '#3730A3' };
      case 'COMPLETED':
        return { label: 'Đã hoàn thành', bg: '#D1FAE5', text: '#065F46' };
      case 'CANCELLED':
        return { label: 'Đã hủy', bg: '#FEE2E2', text: '#991B1B' };
      default:
        return { label: status, bg: Colors.gray100, text: Colors.textSecondary };
    }
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <ClipboardList size={56} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>Bạn chưa đăng nhập</Text>
        <Text style={styles.emptySub}>Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn</Text>
        <AppButton
          title="Đăng nhập ngay"
          onPress={() => router.push('/(auth)/login')}
          style={{ marginTop: 16, width: 200 }}
        />
      </View>
    );
  }

  if (isLoading) {
    return <Loading message="Đang tải lịch sử đơn hàng..." />;
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ClipboardList size={56} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
        <Text style={styles.emptySub}>Bạn chưa thực hiện đơn đặt mua vật liệu xây dựng nào</Text>
        <AppButton
          title="Đặt hàng ngay"
          onPress={() => router.push('/')}
          style={{ marginTop: 16, width: 180 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        {orders.map((order) => {
          const badge = getStatusBadge(order.status);
          const firstItem = order.items[0];
          const extraCount = order.items.length - 1;

          return (
            <TouchableOpacity
              key={order._id}
              style={styles.orderCard}
              onPress={() => setSelectedOrder(order)}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>Mã đơn: #{order._id.slice(-6).toUpperCase()}</Text>
                  <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
                </View>
              </View>

              <View style={styles.itemSummary}>
                {firstItem?.image ? (
                  <Image source={{ uri: firstItem.image }} style={styles.thumbImage} />
                ) : null}
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {firstItem?.productName}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    Số lượng: {firstItem?.quantity} {firstItem?.unit}
                    {extraCount > 0 ? ` (và ${extraCount} sản phẩm khác)` : ''}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.totalLabel}>Tổng tiền: </Text>
                  <Text style={styles.totalValue}>{formatPrice(order.totalPrice)}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.detailBtnText}>Chi tiết</Text>
                  <ChevronRight size={16} color={Colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        visible={!!selectedOrder}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Chi tiết đơn #{selectedOrder?._id.slice(-6).toUpperCase()}
              </Text>
              <TouchableOpacity onPress={() => setSelectedOrder(null)} style={styles.closeBtn}>
                <X size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              {selectedOrder && (
                <>
                  {/* Trạng thái */}
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionLabel}>Trạng thái đơn:</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusBadge(selectedOrder.status).bg,
                          alignSelf: 'flex-start',
                          marginTop: 4,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusBadge(selectedOrder.status).text },
                        ]}
                      >
                        {getStatusBadge(selectedOrder.status).label}
                      </Text>
                    </View>
                  </View>

                  {/* Thông tin giao hàng */}
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionLabel}>Thông tin nhận hàng:</Text>
                    <View style={styles.infoRow}>
                      <User size={15} color={Colors.textSecondary} />
                      <Text style={styles.infoText}>{selectedOrder.customerName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Phone size={15} color={Colors.textSecondary} />
                      <Text style={styles.infoText}>{selectedOrder.phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <MapPin size={15} color={Colors.textSecondary} />
                      <Text style={styles.infoText}>{selectedOrder.address}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Clock size={15} color={Colors.textSecondary} />
                      <Text style={styles.infoText}>{formatDate(selectedOrder.createdAt)}</Text>
                    </View>
                  </View>

                  {/* Danh sách sản phẩm trong đơn */}
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionLabel}>Sản phẩm đã đặt:</Text>
                    {selectedOrder.items.map((item, idx) => (
                      <View key={idx} style={styles.modalItemRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.modalItemName}>{item.productName}</Text>
                          <Text style={styles.modalItemMeta}>
                            {item.quantity} {item.unit} x {formatPrice(item.price)}
                          </Text>
                        </View>
                        <Text style={styles.modalItemTotal}>
                          {formatPrice(item.price * item.quantity)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Tổng tiền và thanh toán */}
                  <View style={styles.modalTotalBox}>
                    <Text style={styles.modalTotalLabel}>Hình thức: COD (Thanh toán khi nhận hàng)</Text>
                    <View style={styles.modalTotalRow}>
                      <Text style={styles.modalTotalHeading}>Tổng thanh toán:</Text>
                      <Text style={styles.modalTotalNumber}>
                        {formatPrice(selectedOrder.totalPrice)}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 280,
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingBottom: 10,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  orderDate: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  itemSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  thumbImage: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: Colors.gray100,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  itemQuantity: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  detailBtnText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginRight: 2,
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
    maxHeight: '85%',
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
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modalItemMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  modalItemTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalTotalBox: {
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  modalTotalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTotalHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalTotalNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
});
