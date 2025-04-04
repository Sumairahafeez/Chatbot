import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/login"; // Ensure correct path
import SignupScreen from "./screens/signup"; // Placeholder
import HomeScreen from "./screens/Home"; // Placeholder
import Chatbot from "./screens/Chatbot"; // Placeholder
import History from "./screens/History"; // Placeholder
import Recommendations from "./screens/Recommendations"; // Placeholder
import DeleteHistory from "./screens/DeleteCache"; // Placeholder

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chatbot">
              {(props) => <Chatbot {...props} userId={userId} />}
            </Stack.Screen>
            <Stack.Screen name="History">
              {(props) => <History {...props} userId={userId} />}
            </Stack.Screen>
            <Stack.Screen name="Recommendations">
              {(props) => <Recommendations {...props} userId={userId} />}
            </Stack.Screen>
            <Stack.Screen name="DeleteHistory">
              {(props) => <DeleteHistory {...props} userId={userId} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setUserId={setUserId} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        )}

        <Stack.Screen name="SignUp" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
