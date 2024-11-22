import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AuthService from './AuthService';

 
type RootStackParamList = {
  RegisterScreen: undefined;  
  LoginScreen: undefined;   
  
};

 
type RegisterScreenNavigationProp = NavigationProp<RootStackParamList, 'RegisterScreen'>;

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  
 
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = async () => {
 
    setMessage('');
    setSuccessful(false);
    
   
    if (username.length < 3 || username.length > 20) {
      setMessage("Tên người dùng phải từ 3 đến 20 ký tự.");
      return;
    }
    if (password.length < 6 || password.length > 40) {
      setMessage("Mật khẩu phải từ 6 đến 40 ký tự.");
      return;
    }
    if (!email.includes('@')) {
      setMessage("Email không hợp lệ.");
      return;
    }
    
    try {
      const response = await AuthService.register(username, email, password);
      Alert.alert("Đăng ký thành công!");
      
      setUsername('');
      setEmail('');
      setPassword('');
      setMessage('');  
      setSuccessful(true);
      
      navigation.navigate('LoginScreen');  
    } catch (error: any) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
      setSuccessful(false);
      Alert.alert("Đăng ký thất bại", resMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('@/assets/images/logoba.png')} />
      <Text style={styles.baseText}>ĐĂNG KÝ TÀI KHOẢN</Text>
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
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
      {message ? (
        <Text style={successful ? styles.successText : styles.errorText}>{message}</Text>
      ) : null}
      <Text style={styles.loginText}>
        Đã có tài khoản?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.textLogin}>Đăng nhập</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingTop: 3,
  },
  logo: {
    width: 350,
    height: 200,
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 20,
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
  registerButton: {
    backgroundColor: '#f4b142',
    padding: 15,
    borderRadius: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  baseText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 30,
  },
  loginText: {
    color: '#4285F4',
    marginTop: 20,
    fontSize: 16,
  },
  textLogin: {
    color: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  successText: {
    color: 'green',
    marginTop: 10,
  },
});

export default Register;
