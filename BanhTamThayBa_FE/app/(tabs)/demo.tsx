import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AuthService from '../AuthService';

interface UserResponse {
  username: string;
  accessToken: string;
  avatar?: string;  
  id?: string;  
  personalInfo?: string;  // Thêm thuộc tính này để kiểm tra thông tin cá nhân
  [key: string]: any;  
}

const ProfileScreen: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const navigation = useNavigation<any>(); 

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
      };
      fetchUser();
    }, [])
  );

  const handleLogout = async () => {
    await AuthService.logout();
    setCurrentUser(null);  
    Alert.alert('Đăng xuất thành công', 'Bạn đã đăng xuất.');
    navigation.navigate('index');  
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logoba.png')} style={styles.logo} />

      <View style={styles.userInfoContainer}>
        {currentUser ? (
          <>
            {currentUser.avatar ? (
              <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
            ) : (
              <Image source={require('../../assets/images/download.jpg')} style={styles.avatar} />
            )}
            <Text style={styles.userName}>{currentUser.username}</Text>
          </>
        ) : (
          <>
            <Image source={require('../../assets/images/download.jpg')} style={styles.avatar} />
            <Text style={styles.userName}>Khách</Text>
          </>
        )}
      </View>

      <View style={styles.infoContainer}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            if (currentUser && currentUser.id) {
              navigation.navigate('Profile', { userId: currentUser.id });  
            } else {
              Alert.alert('Thông báo', 'Chưa có thông tin.');
            }
          }}
        >
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.infoText}>Thông tin cá nhân</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('ChangePasswordScreen')}
        >
          <Text style={styles.icon}>🔒</Text>
          <Text style={styles.infoText}>Thay đổi mật khẩu</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.icon}>📞</Text>
          <Text style={styles.infoText}>Liên hệ hỗ trợ</Text>
        </View>

        {/* Kiểm tra nếu người dùng có thông tin cá nhân thì không hiển thị phần này */}
        {!currentUser?.personalInfo ? ( // Kiểm tra thông tin cá nhân
          <TouchableOpacity
            style={styles.addInfoContainer}
            onPress={() => navigation.navigate('AddPersonalInfoScreen')}
          >
            <Text style={styles.icon}>➕</Text>
            <Text style={styles.addInfoText}>Thêm thông tin cá nhân ở đây</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.buttonContainer}>
        {!currentUser ? (
          <>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Đăng xuất</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  logo: {
    width: 250,  
    height: 100,
    marginBottom: 20,
    marginTop: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',  
    alignItems: 'center',  
    marginBottom: 20,
  },
  avatar: {
    width: 70,  
    height: 70,
    borderRadius: 35, 
    marginRight: 10,  
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#f4b142',
    borderRadius: 20,
    padding: 15,
    margin: 5,
    alignItems: 'center',
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#f4b142',
    borderRadius: 20,
    padding: 15,
    margin: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
     
  },
  //
  addInfoContainer: { flexDirection: 'row', 
  alignItems: 'center', 
  paddingVertical: 10, 
  borderWidth: 1, borderRadius: 10, 
  padding: 10 },
  addInfoText: { fontSize: 16, color: '#f4b142' },
});

export default ProfileScreen;
