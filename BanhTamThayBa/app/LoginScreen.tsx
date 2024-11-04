import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AuthService from './AuthService';  
import { AxiosError } from 'axios'; 
interface ErrorResponse {
  message: string;
}
type RootStackParamList = {
  Register: undefined;  
  index: undefined;
  ForgotPasswordScreen: undefined; 
};
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const handleLogin = async () => {
    setMessage('');
    setLoading(true);
    try {
      const response = await AuthService.login(username, password);  
      console.log("Đăng nhập thành công", response.accessToken);  
      navigation.navigate('index');  
      setTimeout(() => {
        Alert.alert("Thông báo", "Đăng nhập thành công", [
          { text: "OK", onPress: () => setMessage('') }
        ]);
      }, 1000);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;  
      let resMessage = "Có lỗi xảy ra. Vui lòng thử lại!";

      if (axiosError.response?.status === 401) {
        resMessage = "Sai tên đăng nhập hoặc mật khẩu.";  
      } else {
        resMessage = axiosError.response?.data.message
          ? axiosError.response.data.message
          : resMessage;
      }
      setMessage(resMessage);
      console.log("Đăng nhập thất bại", resMessage);
      Alert.alert("Đăng nhập thất bại", resMessage);  
    } finally {
      setLoading(false);
    }
  };
  const navigateToRegister = () => {
    navigation.navigate('Register');  
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreen');  
  };
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        style={styles.logo}
        source={require('@/assets/images/logoba.png')}  
      />
      <Text style={styles.baseText}>Welcome to BanhTamThayBa!</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Đăng nhập</Text>
        )}
      </TouchableOpacity>
      {message ? <Text style={styles.errorText}>{message}</Text> : null}
     {/* Thay đổi ở đây để điều hướng tới màn hình quên mật khẩu */}
     <TouchableOpacity onPress={navigateToForgotPassword}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <Text style={styles.forgotPasswordText}>Bạn chưa có tài khoản?
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.textRegister}> Đăng ký</Text>
        </TouchableOpacity>
      </Text>
      <View style={styles.socialButton}>
        <Ionicons name="logo-google" size={24} color="white" />
        <Text style={styles.socialButtonText}>Đăng nhập bằng Google</Text>
      </View>
      <View style={[styles.socialButton, styles.facebookButton]}>
        <Ionicons name="logo-facebook" size={24} color="white" />
        <Text style={styles.socialButtonText}>Đăng nhập bằng Facebook</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
   
    marginBottom: 130,
  },
  logo: {
    width: 350,
    height: 200,
    resizeMode: 'contain',
    marginTop: 0,  
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 40,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#f4b142',
    padding: 15,
    borderRadius: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 22,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  forgotPasswordText: {
    color: '#4285F4',
    marginBottom: 10,
    fontSize: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44285',
    padding: 8,
    borderRadius: 40,
    width: '100%',
    justifyContent: 'center',
    marginTop: 10,
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  baseText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20, 
  },
  textRegister: {
    color: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
