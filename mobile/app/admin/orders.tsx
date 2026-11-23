import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';
import { Loading } from '../../components/Loading';
import { Colors } from '../../constants/Colors';
import { Order, OrderStatus } from '../../types';
import { Clock, MapPin, Phone, User, Check, Truck, CheckCheck, XCircle } from 'lucide-react-native';

export default function AdminOrdersScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: orders = [], isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['admin_orders'],
    queryFn: orderService.getAllOrdersAdmin,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      orderService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn hàng');
    },
    onError: (err: any) => {
      Alert.alert('Lỗi', err.response?.data?.message || 'Không thể cập nhật trạng thái');
    },
  });

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

  if (isLoading) {
    return <Loading message="Đang tải danh sách đơn hàng toàn hệ thống..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Tổng số đơn: {orders.length}</Text>
        <Text style={styles.headerSubtitle}>Vuốt xuống để làm mới danh sách</Text>
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
        {orders.map((order) => {
          const badge = getStatusBadge(order.status);

          return (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</Text>
                  <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <User size={14} color={Colors.textSecondary} />
                  <Text style={styles.infoText}>Khách: {order.customerName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Phone size={14} color={Colors.textSecondary} />
                  <Text style={styles.infoText}>{order.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MapPin size={14} color={Colors.textSecondary} />
                  <Text style={styles.infoText} numberOfLines={2}>{order.address}</Text>
                </View>
              </View>

              <View style={styles.itemsBox}>
                {order.items.map((item, idx) => (
                  <Text key={idx} style={styles.itemLine}>
                    • {item.productName} ({item.quantity} {item.unit})
                  </Text>
                ))}
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng tiền COD:</Text>
                <Text style={styles.totalValue}>{formatPrice(order.totalPrice)}</Text>
              </View>

              {/* Thanh thao tác đổi trạng thái của Admin */}
              <View style={styles.actionRow}>
                {order.status === 'PENDING' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#3B82F6' }]}
                    onPress={() =>
                      updateStatusMutation.mutate({ orderId: order._id, status: 'CONFIRMED' })
                    }
                  >
                    <Check size={14} color={Colors.white} />
                    <Text style={styles.actionBtnText}>Duyệt đơn</Text>
                  </TouchableOpacity>
                )}

                {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#6366F1' }]}
                    onPress={() =>
                      updateStatusMutation.mutate({ orderId: order._id, status: 'SHIPPING' })
                    }
                  >
                    <Truck size={14} color={Colors.white} />
                    <Text style={styles.actionBtnText}>Giao hàng</Text>
                  </TouchableOpacity>
                )}

                {order.status === 'SHIPPING' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#10B981' }]}
                    onPress={() =>
                      updateStatusMutation.mutate({ orderId: order._id, status: 'COMPLETED' })
                    }
                  >
                    <CheckCheck size={14} color={Colors.white} />
                    <Text style={styles.actionBtnText}>Hoàn thành</Text>
                  </TouchableOpacity>
                )}

                {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: Colors.error }]}
                    onPress={() =>
                      updateStatusMutation.mutate({ orderId: order._id, status: 'CANCELLED' })
                    }
                  >
                    <XCircle size={14} color={Colors.white} />
                    <Text style={styles.actionBtnText}>Hủy</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: 14,
    paddingBottom: 24,
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
    paddingBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  orderDate: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  infoSection: {
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textPrimary,
    marginLeft: 6,
    flex: 1,
  },
  itemsBox: {
    backgroundColor: Colors.gray100,
    borderRadius: 4,
    padding: 8,
    marginVertical: 4,
  },
  itemLine: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
