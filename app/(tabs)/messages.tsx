import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// NOTE: This is a placeholder ID. In a real app, you would get this 
// from your authentication context after the user logs in.
const MOCK_USER_ID = "user_1a2b3c_placeholder"; // Replace with a real user ID from your DB for testing

export default function MessagesScreen() {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const listRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      _id: Date.now().toString(),
      senderId: MOCK_USER_ID,
      content: newMessage,
      createdAt: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, newMsg]);

    setNewMessage('');

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const renderMessage = ({ item }: { item: any }) => {
    const isMyMessage = item.senderId === MOCK_USER_ID;
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.supportMessageContainer,
      ]}>
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Support</Text>
          <Text style={styles.headerSubtitle}>Nous répondons au plus vite</Text>
        </View>

        {messages.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#E5E5E5" />
            <Text style={styles.emptyText}>Aucun message</Text>
            <Text style={styles.emptySubtext}>Envoyez-nous votre première question.</Text>
          </View>
        )}

        {messages.length > 0 && (
          <FlatList
            ref={listRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => listRef.current?.scrollToEnd({ animated: true })}
          />
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Écrivez votre message..."
            placeholderTextColor="#999999"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="arrow-up-circle" size={36} color="#FF3D00" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageListContent: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF3D00',
  },
  supportMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF'
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 