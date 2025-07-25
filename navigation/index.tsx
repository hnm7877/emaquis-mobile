import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/Register";
import StockListScreen from "../screens/StockList";
import ProductFormScreen from "../screens/ProductForm";
import ProfileScreen from "../screens/Profile";
import { useAuthStore } from "../utils/authStore";

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FF6B00", // Couleur d'accent principale
    background: "#FFF8F0", // Couleur de fond douce
    card: "#FFFFFF",
    text: "#222",
    border: "#FF6B00",
    notification: "#FF6B00",
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "ellipse";
          if (route.name === "StockList") iconName = "list";
          if (route.name === "ProductForm") iconName = "add-circle";
          if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF6B00",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#FFF8F0",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 64,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
        },
        headerStyle: {
          backgroundColor: "#FF6B00",
          shadowColor: "transparent",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 22,
        },
      })}
    >
      <Tab.Screen
        name="StockList"
        component={StockListScreen}
        options={{ title: "Stock" }}
      />
      <Tab.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={{ title: "Ajouter" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <NavigationContainer theme={MyTheme}>
      {isAuthenticated ? (
        <MainTabs />
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#FF6B00" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
          }}
        >
          <AuthStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Connexion" }}
          />
          <AuthStack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "S'inscrire" }}
          />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
