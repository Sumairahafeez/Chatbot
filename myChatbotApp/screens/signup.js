import React, { useState } from 'react';
import { TextInput, Button, Text, View, TouchableOpacity, Alert } from 'react-native';
import { StyleSheet } from 'react-native';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (password === confirmPassword) {
      setLoading(true);
      let username = email;  
      try {
        // Send data to backend API
        const response = await fetch('http://localhost:3000/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // Handle successful sign-up (e.g., navigate to a different screen)
          console.log('Sign-Up Successful:', result);
          Alert.alert('Sign-Up Success');
        } else {
          // Handle errors from the backend
          console.log('Error:', result.message);
            Alert.alert('Sign-Up Failed', result.error || 'Something went wrong!');
        }
      } catch (error) {
        console.log('Error during sign-up:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Passwords do not match');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Signing Up...' : 'Sign Up'}
        onPress={handleSignUp}
        disabled={loading}
        style={styles.button}
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>Or Sign Up with</Text>
        <View style={styles.socialButtons}>
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

      <TouchableOpacity>
        <Text style={styles.agreement}>Learn user license agreement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
    padding: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1089D3',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    marginTop: 15,
    borderColor: '#12B1D1',
    borderWidth: 2,
  },
  button: {
    height: 50,
    width: 120,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#404c5d',
    shadowColor: '#41465b',
    shadowOffset: { width: -1, height: -5 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 5,
    backgroundColor: '#3674B5',
  },
  buttonText: {
    fontFamily: 'Courier New',
    fontSize: 16,
    color: 'rgb(161, 161, 161)',
  },
  forgotPassword: {
    color: '#0099FF',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
  },
  socialContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  socialText: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
  },
  socialButton: {
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    color: 'white',
    fontWeight: 'bold',
  },
  agreement: {
    fontSize: 9,
    color: '#0099FF',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default SignUpScreen;
