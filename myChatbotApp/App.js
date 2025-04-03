import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/login"; // Ensure correct path
import SignupScreen from "./screens/signup"; // Placeholder
import HomeScreen from "./screens/Home"; // Placeholder
import Chatbot from "./screens/Chatbot"; // Placeholder
const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  return (
    <>
    <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="login">
        {props => <LoginScreen {...props} setUserId={setUserId} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="Chatbot">
        {props => <Chatbot {...props} userId={userId} />}
      </Stack.Screen>
    </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}
