import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { width } = Dimensions.get('window');

interface RouteParams {
  productId: string; 
}

type RootStackParamList = {
  ProductDetailScreen: { productId: number };
  CartScreen: undefined;
};

const ProductDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'ProductDetailScreen'>>();
  const { productId } = route.params as RouteParams; 
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState('');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);  
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Cập nhật state imageUrl

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uZ3V5ZW5kdWN0YWkiLCJpYXQiOjE3MzAxODI2ODAsImV4cCI6MTczMDI2OTA4MH0.KdtED1VAbDANLe1fDPswIRhmR3HSLL_hdAqe4lXtw7k'; 
        const response = await axios.get(`http://172.20.10.8:8080/api/product/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProduct(response.data);

        // Gọi API để lấy ảnh sản phẩm
        const imageResponse = await axios.get(
          `http://172.20.10.8:8080/api/product/${productId}/image`,
          { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
        );

        const imageBlob = URL.createObjectURL(imageResponse.data);
        setImageUrl(imageBlob);  

      } catch (error) {
        console.error('Error fetching product detail:', error);
        setError('Error fetching product detail');
      }
    };

    fetchProductDetail();
  }, [productId]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/logoba.png')} style={styles.Logo} />
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
            <Ionicons name="cart-outline" size={24} color="white" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="menu-outline" size={30} color="yellow" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        </View>
      </View>
    
      <Modal transparent={true} visible={isMenuVisible} animationType="slide">
        <TouchableOpacity style={styles.modalBackground} onPress={toggleMenu}>
          <View style={styles.menu}>
            <Text style={styles.menuItem}>TRANG CHỦ</Text>
            <Text style={styles.menuItem}>SẢN PHẨM</Text>
            <Text style={styles.menuItem}>GIỚI THIỆU</Text>
            <Text style={styles.menuItem}>LIÊN HỆ</Text>
            <Text style={styles.menuItem}>TUYỂN DỤNG</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Kiểm tra và chỉ render ảnh nếu imageUrl không trống */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
      ) : (
        <Text>Không có ảnh sản phẩm</Text>
      )}

      <Text style={styles.productTitle}>{product.name}</Text>
      <Text style={styles.productPrice}>
        {parseFloat(product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
      </Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.orderButton}>
        <Text style={styles.orderButtonText}>Đặt món</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    height: 75,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 1,
  },
  headerRight: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  Logo: {
    width: 130,
    height: 50,
    marginTop: 8,
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  menuItem: {
    marginTop: 25,
    fontSize: 18,
    marginBottom: 15,
  },
  productImage: {
    width: '100%',
    height: 390,
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  productPrice: {
    fontSize: 20,
    color: 'green',
    marginLeft: 16,
  },
  productDescription: {
    fontSize: 16,
    marginVertical: 8,
    marginLeft: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    marginLeft: 16,
  },
  quantityButton: {
    backgroundColor: 'orange',
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 20,
    marginHorizontal: 16,
  },
  orderButton: {
    backgroundColor: 'orange',
    padding: 12,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 22,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ProductDetailScreen;
