import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
     
      <Image style={styles.logo} source={require('@/assets/images/logoba.png')} />

       
      <Text style={styles.baseText}>ĐĂNG KÝ TÀI KHOẢN</Text>

 
      <TextInput
        style={styles.input}
        placeholder="Username"
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

      <View style={styles.registerButton}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </View>

      <Text style={styles.loginText}>
        Đã có tài khoản?{' '}
        <TouchableOpacity>
          <Text style={styles.textLogin}>Đăng nhập</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
}

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
});

export default Register;
