import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { useNavigation } from '@react-navigation/native';

const ChatbotPage = ({ userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [cache, setCache] = useState([]);
  const navigation = useNavigation();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return Alert.alert('Error', 'Please type a message');
    }

    // Add user message to chat
    const userMessage = { query: message };
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
          user_id: userId, // Assuming a static user ID for simplicity
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
    navigation.navigate('DeleteHistory'); // Navigate to delete cache screen
  };

  const handleShowHistory = () => {
    Alert.alert('Chat History', history.map(msg => `${msg.sender}: ${msg.text}`).join('\n'));
    navigation.navigate('History'); // Navigate to history screen
  };

  const handleRecommendations = () => {
    const recommendations = [
      '1. Try asking about the weather.',
      '2. Ask for advice on a topic you are interested in.',
      '3. Ask for a joke or a fun fact!',
      '4. Get assistance with any technical questions.',
    ];

    Alert.alert('Chatbot Recommendations', recommendations.join('\n'));
    navigation.navigate('Recommendations'); // Navigate to recommendations screen
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
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleShowHistory}>
            <Icon name="history" size={24} color="#27445D" />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={handleClearCache}>
            <Icon name="trash" size={24} color="#27445D" />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={handleRecommendations}>
            <Icon name="star" size={24} color="#27445D" />
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#27391C',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 40,
    border:1,
    borderColor: '#27445D',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    color: '#FFEDFA',
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
    position: 'relative',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 7,
    marginLeft: 10,
    position: 'absolute',
    right: 90, // Adjust this to make space for the buttons
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
});

export default ChatbotPage;
