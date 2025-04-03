import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/login"; // Ensure correct path
import SignupScreen from "./screens/signup"; // Placeholder
import HomeScreen from "./screens/Home"; // Placeholder

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Home" >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name = "login" component = {LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen}/>
        {/* <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name = "login">
        {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="Signup" component={SignupScreen} /> */}
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}
