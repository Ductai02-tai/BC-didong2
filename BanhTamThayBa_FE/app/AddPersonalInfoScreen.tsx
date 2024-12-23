import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const AddPersonalInfoScreen: React.FC = () => {
  const [message, setMessage] = useState('');
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
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uZ3V5ZW5kdWN0YWkiLCJpYXQiOjE3MzIyODI3NzUsImV4cCI6MTczMjM2OTE3NX0.AS8ER2glbdVuzwEvOtBF_gSNXij5VEwKrHYZYURr7ws', // Replace with your token
        },
      });
      setTimeout(() => {
        Alert.alert("Thông báo", "Thêm thành công", [
          { text: "OK", onPress: () => setMessage('') }
        ]);
      }, 1000);
   
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm thông tin cá nhân.');
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
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
      <TouchableOpacity style={styles.addnButton} onPress={addInfo}>
      <Text style={styles.buttonText}>Thêm</Text>
      </TouchableOpacity>
     
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,
     padding: 20 
    },
  logo:
   { width: 200,
     height: 100, 
     marginBottom: 20 ,
      alignSelf: 'center',},
  input: 
  { borderWidth: 1, 
    padding: 10, marginVertical: 10,
     borderRadius: 10
     },
  addnButton:
  {
    backgroundColor: '#f4b142',
    padding: 10,
    borderRadius: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 22,
  },
  buttonText:{
    color: 'white',
    fontSize: 18,
  },
});

export default AddPersonalInfoScreen;
