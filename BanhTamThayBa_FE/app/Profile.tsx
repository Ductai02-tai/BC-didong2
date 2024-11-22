import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './App';  
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;  

const Profile: React.FC = () => {
  const route = useRoute<ProfileRouteProp>();
  const { userId } = route.params || {};  
  const [message, setMessage] = useState('');
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
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uZ3V5ZW5kdWN0YWkiLCJpYXQiOjE3MzIyODI3NzUsImV4cCI6MTczMjM2OTE3NX0.AS8ER2glbdVuzwEvOtBF_gSNXij5VEwKrHYZYURr7ws',
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
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uZ3V5ZW5kdWN0YWkiLCJpYXQiOjE3MzIyODI3NzUsImV4cCI6MTczMjM2OTE3NX0.AS8ER2glbdVuzwEvOtBF_gSNXij5VEwKrHYZYURr7ws',
        },
      });
      setTimeout(() => {
        Alert.alert("Thông báo", "Cập nhật thành công", [
          { text: "OK", onPress: () => setMessage('') }
        ]);
      }, 1000);
    
    } catch (err) {
      setError('Không thể cập nhật hồ sơ');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
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
     
      <TouchableOpacity style={styles.addnButton} onPress={updateProfile}>
        <Text style={styles.buttonText}>Cập nhật hồ sơ</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
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
    borderRadius: 10,  
    padding: 10,
    marginVertical: 10,
    borderColor: '#ccc', 
  },
  error: { color: 'red' },

  addnButton: {
    backgroundColor: '#f4b142',
    padding: 10,
    borderRadius: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 22,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Profile;
