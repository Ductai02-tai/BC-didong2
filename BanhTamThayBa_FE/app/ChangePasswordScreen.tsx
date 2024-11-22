import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AuthService from './AuthService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
 
type RootStackParamList = {
  LoginScreen: undefined;
};
type ChangePasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;
const ChangePasswordScreen: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigation = useNavigation<ChangePasswordScreenNavigationProp>();
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      await AuthService.changePassword(currentPassword, newPassword);
      Alert.alert('Thông báo', 'Mật khẩu đã được thay đổi thành công! Vui lòng đăng nhập.');

      await AuthService.logout();
      navigation.navigate('LoginScreen');
    } catch (error) {
      Alert.alert('Lỗi', 'Thay đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mật khẩu hiện tại</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Nhập mật khẩu hiện tại"
      />

      <Text style={styles.label}>Mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Nhập mật khẩu mới"
      />

      <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Nhập lại mật khẩu mới"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#f4b142',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ChangePasswordScreen;
