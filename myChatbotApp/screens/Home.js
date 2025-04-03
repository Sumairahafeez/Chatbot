import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Assuming you have a bot icon image in your assets folder
import BotIcon from '../assets/bot.png'; 

export default function HomePage() {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('SignUp'); // Navigate to chatbot screen
  };

  const handleSignUp = () => {
    navigation.navigate('login'); // Navigate to sign-up screen
  };

  return (
    <View style={styles.container}>
      {/* Top buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Centered Bot Icon */}
      <View style={styles.botContainer}>
        <Image source={BotIcon} style={styles.botIcon} />
        <Text style={styles.botText}>Let's Chat with Bot</Text>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Chat!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#27445D', // Deep blue background
    justifyContent: 'center', // Center everything vertically
    alignItems: 'center', // Center everything horizontally
    padding: 20,
  },
  buttonContainer: {
    position: 'absolute',
    top: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#3D8D7A', // Yellow color for buttons
    padding: 15,
    borderRadius: 30,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'roboto', // Use a bold font style
  },
  botContainer: {
    alignItems: 'center',
  },
  botIcon: {
    width: 280,
    height: 280,
    marginBottom: 20,
  },
  botText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
