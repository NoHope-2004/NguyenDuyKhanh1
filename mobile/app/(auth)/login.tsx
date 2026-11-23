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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { Colors } from '../../constants/Colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      Alert.alert('Thành công', 'Đăng nhập thành công!', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Đăng nhập thất bại',
        error.response?.data?.message || 'Email hoặc mật khẩu không chính xác'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('demo@vlxdhub.vn');
    setPassword('123456');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ĐĂNG NHẬP</Text>
          <Text style={styles.subtitle}>Chào mừng bạn quay trở lại với VLXD Hub</Text>
        </View>

        <View style={styles.card}>
          <AppInput
            label="Địa chỉ Email"
            placeholder="example@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <AppInput
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <AppButton
            title="Đăng nhập"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: 8 }}
          />

          {/* Nút đăng nhập nhanh bằng tài khoản Demo để demo bảo vệ đồ án */}
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={handleQuickDemo}
            activeOpacity={0.8}
          >
            <Text style={styles.demoBtnText}>
              👤 Điền tài khoản Khách hàng (demo@vlxdhub.vn)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoBtn, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B', borderWidth: 1 }]}
            onPress={() => {
              setEmail('admin@vlxdhub.vn');
              setPassword('123456');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.demoBtnText, { color: '#B45309' }]}>
              👑 Điền tài khoản Quản trị Admin (admin@vlxdhub.vn)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>Đăng ký ngay</Text>
          </TouchableOpacity>
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
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: 20,
  },
  demoBtn: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 6,
  },
  demoBtnText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});
