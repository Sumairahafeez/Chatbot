import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Assuming you have icons in your assets folder
import BotIllustration from '../assets/bot.png'; // Bot illustration
import ChatIcon from '../assets/chat.png';
import AIIcon from '../assets/ai.png';
import HistoryIcon from '../assets/history.png';
import RecommendationsIcon from '../assets/recommendations.png';
import FeedbackIcon from '../assets/feedback.png'; // Assuming you have a feedback icon
import LogoutIcon from '../assets/logout.png'; // Assuming you have a logout icon
export default function HomePage({setIsLoggedIn}) {
  const navigation = useNavigation();
  const handlelogout = () => {
    setIsLoggedIn(false) // Navigate to login screen
    };
  const handleChat = () => {
    navigation.navigate('Chatbot'); // Navigate to chatbot screen
  };

  const handleChatWithAI = () => {
    navigation.navigate('AskAI'); // Navigate to AI screen or similar
  };

  const handleHistory = () => {
    navigation.navigate('History'); // Navigate to history screen
  };

  const handleRecommendations = () => {
    navigation.navigate('Recommendations'); // Navigate to recommendations screen
  };
  const handlefeedback = () => {
    navigation.navigate('Feedback'); // Navigate to feedback screen
  }

  return (
    <View style={styles.container}>
      {/* Bot Illustration at the top */}
      <View style={styles.botContainer}>
        <Text style={{ fontSize: 24,
    fontWeight: 'bold',
    color: '#3D8D7A',
    textAlign: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20, }}>Welcome to Chatbot</Text>
        <Image source={BotIllustration} style={styles.botImage} />
      </View>

      {/* Centered buttons */}
      <View style={styles.buttonContainer}>
        {/* Chat button */}
        <TouchableOpacity style={styles.button} onPress={handleChat}>
          <Image source={ChatIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>

        {/* Chat with AI button */}
        <TouchableOpacity style={styles.button} onPress={handleChatWithAI}>
          <Image source={AIIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Chat with AI</Text>
        </TouchableOpacity>

        {/* View History button */}
        <TouchableOpacity style={styles.button} onPress={handleHistory}>
          <Image source={HistoryIcon} style={styles.icon} />
          <Text style={styles.buttonText}>History</Text>
        </TouchableOpacity>

        {/* View Recommendations button */}
        <TouchableOpacity style={styles.button} onPress={handleRecommendations}>
          <Image source={RecommendationsIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Recomend</Text>
        </TouchableOpacity>
        {/* Log out button */}
        <TouchableOpacity style={styles.button} onPress={handlelogout}>
          <Image source={LogoutIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        {/* feedbacks and review button */}
        <TouchableOpacity style={styles.button} onPress={handlefeedback}>
          <Image source={FeedbackIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Feedbacks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'f9f9f9', // Deep green background
    justifyContent: 'center', // Center everything vertically
    alignItems: 'center', // Center everything horizontally
    padding: 20,
  },
  botContainer: {
    marginBottom: 30, // Space between bot image and buttons
    alignItems: 'center', // Center the bot illustration horizontally
  },
  botImage: {
    width: 200, // Set width of the bot illustration
    height: 200, // Set height of the bot illustration
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'white', // Green color for buttons
    padding: 15,
    borderRadius: 15,
    borderColor: '#3D8D7A',
    borderWidth: 2,
    width: 120,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#27445D',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  icon: {
    width: 50,
    height: 50,
  },
});
