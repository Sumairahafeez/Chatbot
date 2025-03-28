import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ChatbotUI() {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I assist you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');

    // Simulate bot response (Replace with API call)
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'This is a bot response!', sender: 'bot' }]);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }}>
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`p-3 my-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'self-end bg-blue-500 text-white' : 'self-start bg-gray-200'}`}
          >
            <Text className={msg.sender === 'user' ? 'text-white' : 'text-black'}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View className="flex-row items-center p-3 bg-white rounded-full shadow-md absolute bottom-4 left-4 right-4">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          className="flex-1 p-2 text-lg"
        />
        <TouchableOpacity onPress={sendMessage} className="p-2 bg-blue-500 rounded-full">
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
