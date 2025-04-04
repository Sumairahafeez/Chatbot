import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const SignInScreen = ({setUserId,setIsLoggedIn}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Use navigation prop to navigate between screens

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    let username = email
    try {
      const response = await fetch('http://192.168.100.61:3000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Sign-In Successful:', data);
        Alert.alert('Sign In Success', data.message);
        setUserId(data.user_id); // Set user ID in state
        setIsLoggedIn(true); // Set logged-in state to true
      } else {
        Alert.alert('Error', data.error || 'Something went wrong!');
      }
    } catch (error) {
      Alert.alert('Error', 'Network or server error');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset link sent!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign In</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          required
        />
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password ?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.socialAccountContainer}>
        <Text style={styles.socialAccountTitle}>Or Sign in with</Text>
        <View style={styles.socialAccounts}>
          <TouchableOpacity style={styles.socialButton}>
            
            <Text style={styles.socialIcon}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            
            <Text style={styles.socialIcon}>A</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            
            <Text style={styles.socialIcon}>T</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.agreement}>Dont have an account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D8D7A',
    padding: 25,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#fff',
    shadowColor: 'rgba(133, 189, 215, 0.878)',
    shadowOffset: { width: 0, height: 30 },
    shadowRadius: 30,
    shadowOpacity: 1,
  },
  heading: {
    fontWeight: '900',
    fontSize: 30,
    color: '#B3D8A8',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
    shadowColor: '#cff0ff',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },
  forgotPassword: {
    fontSize: 11,
    color: '#B3D8A8',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#B3D8A8',
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  socialAccountContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  socialAccountTitle: {
    fontSize: 10,
    color: '#B3D8A8',
  },
  socialAccounts: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 5,
  },
  socialButton: {
    backgroundColor: '#B3D8A8',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  socialIcon: {
    color: 'white',
    fontSize: 18,
  },
  agreement: {
    fontSize: 9,
    color: '#B3D8A8',
    textDecorationLine: 'underline',
    marginTop: 15,
  },
});

export default SignInScreen;
