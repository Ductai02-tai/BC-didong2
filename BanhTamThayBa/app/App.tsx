import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Index from './(tabs)/index';
import Demo from './(tabs)/demo';
import Register from './Register';
import ProductDetailScreen from './ProductDetailScreen';
import CartScreen from './CartScreen';
import ProductList from './ProductList';
import FooterApp from './FooterApp';
import MenuCate from './MenuCate';
import LoginScreen from './LoginScreen'; 
import ChangePasswordScreen from './ChangePasswordScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import Profile from './Profile';
import AddPersonalInfoScreen from './AddPersonalInfoScreen';
 
 

type CartItem = {
    id: number;
    name: string;
    price: string;
    quantity: number;
    image: string;
};

export type RootStackParamList = {
    demo: undefined;
    ChangePasswordScreen: undefined;
    Register: undefined;
    ProductDetailScreen: undefined;
    CartScreen: { cartItems: CartItem[] };
    ProductList: undefined;
    FooterApp: undefined;
    MenuCate: undefined;
    Index: undefined; 
    Login: undefined;
    Profile: { userId: string };  
    ForgotPasswordScreen: undefined;
  VerifyOtpScreen: { email: string }; 
    ResetPassword: { email: string };
    LoginScreen: undefined;
    AddPersonalInfoScreen: undefined;
    
};

 
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="demo">
                    <Stack.Screen name="demo" component={Demo} />
                    <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
                    <Stack.Screen name="CartScreen" component={CartScreen} initialParams={{ cartItems: [] }} />
                    <Stack.Screen name="ProductList" component={ProductList} />
                    <Stack.Screen name="FooterApp" component={FooterApp} />
                    <Stack.Screen name="MenuCate" component={MenuCate} />
                    <Stack.Screen name="Index" component={Index} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
                    <Stack.Screen name="Profile" component={Profile} />
                    <Stack.Screen name="AddPersonalInfoScreen" component={AddPersonalInfoScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
