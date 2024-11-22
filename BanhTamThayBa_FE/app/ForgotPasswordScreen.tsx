import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, Image } from 'react-native';
import AuthService from './AuthService';
import { useNavigation } from '@react-navigation/native';
import { AxiosError } from 'axios';
import { ForgotPasswordScreenNavigationProp } from './types';  

interface ApiResponse {
  message?: string;  
}

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>(); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');  
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); 

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await AuthService.requestOtp(email);  
      Alert.alert("Thông báo", "Mã OTP đã được gửi đến email của bạn.");
      setIsOtpSent(true); 
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại."; 
      
      if (axiosError.response) {
        errorMessage = axiosError.response.data?.message || errorMessage;
      }
      
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false); 
    }
  };

  const handleVerifyAndResetPassword = async () => {
    setLoading(true);
    try {
      await AuthService.verifyOtp(email, otp);  
     
      await AuthService.resetPassword(email, otp, newPassword);
      Alert.alert("Thông báo", "Đặt lại mật khẩu thành công.");
      navigation.navigate('LoginScreen'); 
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
      
      if (axiosError.response) {
        errorMessage = axiosError.response.data?.message || errorMessage;
      }
      
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logoba.png')} style={styles.logo} />
      
      {/* Hiển thị phần nhập email chỉ khi mã OTP chưa được gửi */}
      {!isOtpSent ? (
        <>
          <Text style={styles.label}>Vui lòng nhập Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email của bạn"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Đang gửi...' : 'Gửi mã OTP'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Hiển thị phần nhập mã OTP và mật khẩu mới sau khi mã OTP đã được gửi */}
          <Text style={styles.label}>Nhập mã OTP:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mã OTP"
            value={otp}
            onChangeText={setOtp}
          />
          <Text style={styles.label}>Nhập mật khẩu mới:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyAndResetPassword} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Đang xử lý...' : 'Xác thực và Đặt lại mật khẩu'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, marginBottom: 300 },
  logo: { width: 250, height: 130, alignSelf: 'center', marginBottom: 100 },
  input: { 
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 20, 
    marginBottom: 12, 
    padding: 8 
  },
  button: { 
    backgroundColor: '#f4b142',  
    padding: 12, 
    borderRadius: 20  
  },
  buttonText: { color: 'white', textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 8, fontWeight: 'bold' },
});

export default ForgotPasswordScreen;
