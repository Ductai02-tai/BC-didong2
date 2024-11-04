import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

const AddPersonalInfoScreen: React.FC = () => {
  const [info, setInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const addInfo = async () => {
    try {
      const response = await axios.post('http://172.20.10.8:8080/api/profile', info, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uZ3V5ZW5kdWN0YWkiLCJpYXQiOjE3MzA3MjkyOTcsImV4cCI6MTczMDgxNTY5N30._VOd8hFRe7W8wQpgYxoCRJIW9-fTLyHUz_cHBRBrH04', // Replace with your token
        },
      });
      Alert.alert('Thành công', 'Thêm thông tin cá nhân thành công!');
      // Optionally, navigate back or reset fields
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm thông tin cá nhân.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logoba.png')} style={styles.logo} />
      <Text>Tên:</Text>
      <TextInput
        style={styles.input}
        value={info.name}
        onChangeText={(text) => setInfo({ ...info, name: text })}
      />
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={info.email}
        onChangeText={(text) => setInfo({ ...info, email: text })}
      />
      <Text>Số điện thoại:</Text>
      <TextInput
        style={styles.input}
        value={info.phoneNumber}
        onChangeText={(text) => setInfo({ ...info, phoneNumber: text })}
      />
      <Text>Địa chỉ:</Text>
      <TextInput
        style={styles.input}
        value={info.address}
        onChangeText={(text) => setInfo({ ...info, address: text })}
      />
      <Button title="Thêm" color="#f4b142" onPress={addInfo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  logo: { width: 200, height: 100, marginBottom: 20 , alignSelf: 'center',},
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 10 },
});

export default AddPersonalInfoScreen;
