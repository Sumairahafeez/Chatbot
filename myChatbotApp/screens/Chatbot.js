import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const ChatbotPage = ({user_id}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [cache, setCache] = useState([]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return Alert.alert('Error', 'Please type a message');
    }

    // Add user message to chat
    const userMessage = {query: message};
    const userMessage2 = { sender: 'user', text: message };
    setMessages((prevMessages) => [...prevMessages, userMessage2]);

    // Save user message to history
    setHistory((prevHistory) => [...prevHistory, { sender: 'user', text: message }]);

    try {
      // Send user message to the backend (chatbot API)
      const response = await fetch('http://192.168.100.61:3000/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user_id, // Assuming a static user ID for simplicity
            query: userMessage.query, // Send user message to backend
        }),  // Send user message to backend
      });

      const data = await response.json();
      if (data.response) {
        // Add bot response to chat
        const botMessage = { sender: 'bot', text: data.response };
        console.log('Bot reply:', data.response); // Log bot reply for debugging
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        // Save bot reply to history
        setHistory((prevHistory) => [...prevHistory, { sender: 'bot', text: data.response }]);

        // Cache the bot's reply for future use
        setCache((prevCache) => [...prevCache, data.response]);
      } else {
        console.error('Unexpected response format:', data.response);
        Alert.alert('Error', 'Bot didn’t respond correctly');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'There was an error communicating with the bot');
    }
    setMessage(''); // Reset the input field
  };

  const handleClearCache = () => {
    setCache([]);  // Clear cache
    Alert.alert('Cache Cleared', 'Chat history cache has been cleared.');
  };

  const handleShowHistory = () => {
    Alert.alert('Chat History', history.map(msg => `${msg.sender}: ${msg.text}`).join('\n'));
  };

  const handleRecommendations = () => {
    const recommendations = [
      '1. Try asking about the weather.',
      '2. Ask for advice on a topic you are interested in.',
      '3. Ask for a joke or a fun fact!',
      '4. Get assistance with any technical questions.',
    ];

    Alert.alert('Chatbot Recommendations', recommendations.join('\n'));
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chat with the Bot</Text>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleShowHistory} style={styles.actionButton}>
          <Icon name="history" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClearCache} style={styles.actionButton}>
          <Icon name="trash" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRecommendations} style={styles.actionButton}>
          <Icon name="star" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 40,
    color: '#27445D',
  },
  chatList: {
    flex: 1,
    marginBottom: 20,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '100%',
  },
  userMessage: {
    backgroundColor: '#27445D',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#71BBB2',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFEDFA',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#27445D',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#27445D',
    marginBottom: 20,
    position: 'absolute',
    top: 5,
    width: '115%',
    zIndex: 1, // Ensure buttons are on top
  },
  actionButton: {
    backgroundColor: '#27445D',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatbotPage;
