import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { aiService } from '../services/aiService';
import { Colors } from '../constants/Colors';
import { Send, Bot, User, Sparkles } from 'lucide-react-native';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  source?: 'GEMINI_AI' | 'FALLBACK';
}

const SAMPLE_QUESTIONS = [
  'Xi măng PCB40 là gì?',
  'Có những loại gạch xây nào?',
  'Sơn nội thất và ngoại thất khác nhau thế nào?',
  'Vật liệu chống thấm có công dụng gì?',
  'Cát vàng và cát đen khác nhau ra sao?',
];

export default function AIScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Xin chào! Tôi là trợ lý tư vấn vật liệu xây dựng của VLXD Hub. Bạn cần tìm hiểu thông số kỹ thuật hay tư vấn loại vật liệu nào cho công trình?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await aiService.chat(text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.reply,
        source: res.source,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text:
          'Xin lỗi, hiện tại không thể kết nối tới dịch vụ AI. Bạn vui lòng kiểm tra kết nối mạng và thử lại sau.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      {/* Gợi ý câu hỏi nhanh */}
      <View style={styles.suggestionsContainer}>
        <View style={styles.suggestionTitleRow}>
          <Sparkles size={14} color={Colors.primary} />
          <Text style={styles.suggestionTitle}>Gợi ý câu hỏi:</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionScroll}
        >
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.suggestionChip}
              onPress={() => handleSend(q)}
              disabled={loading}
            >
              <Text style={styles.suggestionText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Danh sách tin nhắn */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <View
              key={msg.id}
              style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}
            >
              {!isUser && (
                <View style={styles.aiAvatar}>
                  <Bot size={16} color={Colors.white} />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.userText : styles.aiText,
                  ]}
                >
                  {msg.text}
                </Text>

                {!isUser && msg.source && (
                  <View style={styles.sourceBadge}>
                    <Sparkles size={11} color={msg.source === 'GEMINI_AI' ? '#8B5CF6' : Colors.primary} />
                    <Text
                      style={[
                        styles.sourceBadgeText,
                        { color: msg.source === 'GEMINI_AI' ? '#8B5CF6' : Colors.primary },
                      ]}
                    >
                      {msg.source === 'GEMINI_AI'
                        ? '✨ Phân tích bởi Google Gemini AI'
                        : '💡 Tri thức kỹ thuật VLXD Hub'}
                    </Text>
                  </View>
                )}
              </View>
              {isUser && (
                <View style={styles.userAvatar}>
                  <User size={16} color={Colors.white} />
                </View>
              )}
            </View>
          );
        })}

        {loading && (
          <View style={[styles.messageRow, styles.aiRow]}>
            <View style={styles.aiAvatar}>
              <Bot size={16} color={Colors.white} />
            </View>
            <View style={[styles.bubble, styles.aiBubble, styles.loadingBubble]}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>AI đang phân tích câu hỏi...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Thanh nhập tin nhắn */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Nhập câu hỏi về vật liệu xây dựng..."
          placeholderTextColor={Colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!inputText.trim() || loading) && styles.disabledSendBtn]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || loading}
        >
          <Send size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  suggestionsContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  suggestionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  suggestionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  suggestionScroll: {
    paddingHorizontal: 12,
  },
  suggestionChip: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(196,81,35,0.2)',
  },
  suggestionText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  chatList: {
    padding: 16,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  sourceBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  userText: {
    color: Colors.white,
  },
  aiText: {
    color: Colors.textPrimary,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.gray100,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.textPrimary,
    marginRight: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendBtn: {
    backgroundColor: Colors.gray300,
  },
});
