import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, FlatList } from "react-native";

const API_URL = "http://localhost:3000";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(1); // Temporary user ID for testing
  const [recommendations, setRecommendations] = useState(["What are your services?", "Pricing details", "Contact support"]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history/${userId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages([...messages, { text, sender: "user" }]);
    setInput("");
    
    try {
      const response = await fetch(`${API_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, query: text }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chatbot</Text>
      <ScrollView style={styles.chatArea}>
        {messages.map((msg, index) => (
          <View key={index} style={[styles.message, msg.sender === "user" ? styles.userMsg : styles.botMsg]}>
            <Text style={styles.text}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.recommendationContainer}>
        <FlatList
          horizontal
          data={recommendations}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.recommendation} onPress={() => sendMessage(item)}>
              <Text style={styles.recommendationText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(input)}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 10 },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  chatArea: { flex: 1, marginBottom: 10 },
  message: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: "80%" },
  userMsg: { alignSelf: "flex-end", backgroundColor: "#0078FF", color: "#fff" },
  botMsg: { alignSelf: "flex-start", backgroundColor: "#EAEAEA" },
  text: { fontSize: 16 },
  recommendationContainer: { flexDirection: "row", marginBottom: 10 },
  recommendation: { backgroundColor: "#ddd", padding: 8, borderRadius: 5, marginRight: 5 },
  recommendationText: { color: "#333" },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#fff" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
  sendButton: { backgroundColor: "#0078FF", padding: 10, borderRadius: 5, marginLeft: 10 },
  sendText: { color: "#fff", fontWeight: "bold" },
});
