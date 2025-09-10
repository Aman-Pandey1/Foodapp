import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddFoodScreen from './screens/AddFoodScreen';
import FoodDetailScreen from './screens/FoodDetailScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import RoleSelectScreen from './screens/RoleSelectScreen';
import MyPostsScreen from './screens/MyPostsScreen';
import SupplierBrowseScreen from './screens/SupplierBrowseScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SupplierTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyPosts" component={MyPostsScreen} options={{ title: 'My Posts' }} />
      <Tab.Screen name="AddFood" component={AddFoodScreen} options={{ title: 'Post Waste' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function ProducerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Browse" component={SupplierBrowseScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, role, loading } = useAuth();
  const colorScheme = useColorScheme();

  if (loading) return null;

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : !role ? (
          <>
            <Stack.Screen name="SelectRole" component={RoleSelectScreen} options={{ title: 'Choose Account Type' }} />
          </>
        ) : role === 'supplier' ? (
          <>
            <Stack.Screen name="Supplier" component={SupplierTabs} options={{ headerShown: false }} />
            <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Producer" component={ProducerTabs} options={{ headerShown: false }} />
            <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

