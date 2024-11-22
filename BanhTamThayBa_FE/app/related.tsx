import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Updated import

interface RelatedProduct {
  id: number;
  name: string;
  price: number; 
  description: string;
  photo: string; 
}

// Define the navigation parameter list
type RootStackParamList = {
  ProductDetailScreen: { productId: number };
  // Add other screens and their params here as needed
};

// Define the navigation prop type
type RelatedProductsNavigationProp = NativeStackNavigationProp<RootStackParamList>; // Updated type

// The main component
const RelatedProducts = ({ productId }: { productId: number }) => {
  const navigation = useNavigation<RelatedProductsNavigationProp>();
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uZ3V5ZW5kdWN0YWkiLCJpYXQiOjE3MzIyODI3NzUsImV4cCI6MTczMjM2OTE3NX0.AS8ER2glbdVuzwEvOtBF_gSNXij5VEwKrHYZYURr7ws'; // Replace with your token
        const response = await axios.get(`http://172.20.10.8:8080/api/product/${productId}/related`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRelatedProducts(response.data);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setError('Error fetching related products');
      }
    };

    fetchRelatedProducts();
  }, [productId]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  const handlePress = (id: number) => {
    navigation.navigate('ProductDetailScreen', { productId: id }); // Navigate to product detail screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản phẩm liên quan</Text>
      <FlatList
        data={relatedProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item.id)} style={styles.productItem}>
            <Image source={{ uri: item.photo }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>
              {item.price ? parseFloat(item.price.toString()).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Giá chưa có'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productItem: {
    marginBottom: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: 'red',
    borderRadius: 8,
  },
});

export default RelatedProducts;
