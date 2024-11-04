import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './App'; // Điều chỉnh đường dẫn nhập khẩu nếu cần

type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>; // Điều chỉnh theo tên màn hình chính xác

const Profile: React.FC = () => {
  const route = useRoute<ProfileRouteProp>();
  const { userId } = route.params || {}; // Cung cấp fallback nếu params không xác định

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!userId) {
      setError('Không tìm thấy userId');
      return;
    }

    try {
      const response = await axios.get(`http://172.20.10.8:8080/api/profile/${userId}`, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uZ3V5ZW5kdWN0YWkiLCJpYXQiOjE3MzA3MjkyOTcsImV4cCI6MTczMDgxNTY5N30._VOd8hFRe7W8wQpgYxoCRJIW9-fTLyHUz_cHBRBrH04', // Đảm bảo thay thế bằng token đúng
        },
      });
      setProfile(response.data);
    } catch (err) {
      setError('Bạn chưa có thông tin hồ sơ');
    }
  };

  const updateProfile = async () => {
    if (!userId) {
      setError('Không tìm thấy userId');
      return;
    }

    try {
      await axios.put(`http://172.20.10.8:8080/api/profile/${userId}`, profile, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uZ3V5ZW5kdWN0YWkiLCJpYXQiOjE3MzA3MjkyOTcsImV4cCI6MTczMDgxNTY5N30._VOd8hFRe7W8wQpgYxoCRJIW9-fTLyHUz_cHBRBrH04', // Đảm bảo thay thế bằng token đúng
        },
      });
      alert('Cập nhật hồ sơ thành công');
    } catch (err) {
      setError('Không thể cập nhật hồ sơ');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logoba.png')} style={styles.logo} />
      {error && <Text style={styles.error}>{error}</Text>}
      <Text>Tên:</Text>
      <TextInput
        style={styles.input}
        value={profile.name}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
      />
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={profile.email}
        onChangeText={(text) => setProfile({ ...profile, email: text })}
      />
      <Text>Số điện thoại:</Text>
      <TextInput
        style={styles.input}
        value={profile.phoneNumber}
        onChangeText={(text) => setProfile({ ...profile, phoneNumber: text })}
      />
      <Text>Địa chỉ:</Text>
      <TextInput
        style={styles.input}
        value={profile.address}
        onChangeText={(text) => setProfile({ ...profile, address: text })}
      />
      <Button title="Cập nhật hồ sơ" onPress={updateProfile} color="#f4b142" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  logo: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10, // Bo góc
    padding: 10,
    marginVertical: 10,
    borderColor: '#ccc', // Màu viền
  },
  error: { color: 'red' },
});

export default Profile;
