import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import axios from 'axios';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { width } = Dimensions.get('window');

const loadFonts = async () => {
  await Font.loadAsync({
    'Refile': require('./../assets/fonts/Refile.otf'),  
  });
};

interface Category {
  id: number; 
  title: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl?: string;  
}

type RootStackParamList = {
  ProductDetailScreen: { productId: number };
  CartScreen: undefined;
};

export default function MenuCate() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'ProductDetailScreen'>>();

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);  

  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uZ3V5ZW5kdWN0YWkiLCJpYXQiOjE3MzIyODI3NzUsImV4cCI6MTczMjM2OTE3NX0.AS8ER2glbdVuzwEvOtBF_gSNXij5VEwKrHYZYURr7ws';  

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://172.20.10.8:8080/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching categories:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      setError('Error fetching categories');
    }
  };

  const fetchProductsByCategory = async (categoryId: number) => {
    setSelectedCategoryId(categoryId);  
    try {
      const response = await axios.get(`http://172.20.10.8:8080/api/products/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const productsWithImages = await Promise.all(response.data.map(async (product: Product) => {
        try {
          const imageResponse = await axios.get(
            `http://172.20.10.8:8080/api/product/${product.id}/image`,
            { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
          );
          const imageUrl = URL.createObjectURL(imageResponse.data);
          return { ...product, imageUrl };
        } catch (error) {
          console.error("Error fetching image for product ID:", product.id, error);
          return { ...product, imageUrl: "placeholder-image-url" };  
        }
      }));

      setProducts(productsWithImages);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching products:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      setError('Error fetching products');
    }
  };

  useEffect(() => {
    const loadResources = async () => {
      await SplashScreen.preventAutoHideAsync();
      await loadFonts();
      setFontsLoaded(true);
      await SplashScreen.hideAsync();
    };

    fetchCategories();
    loadResources();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.MenuContainer}>
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Menu</Text>
          <View style={styles.menuCategories}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={[
                  styles.categoryButton, 
                  selectedCategoryId === category.id && styles.selectedCategoryButton  
                ]} 
                onPress={() => fetchProductsByCategory(category.id)}
              >
                <Text style={styles.categoryText}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productContainer}
              onPress={() => navigation.navigate('ProductDetailScreen', { productId: item.id })}
            >
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.productImage} 
                resizeMode="cover" 
              />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                {parseFloat(item.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </Text>
            </TouchableOpacity>
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.productList}
        />

        {/* Thanh ngang thêm vào */}
        <View style={styles.horizontalLine} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  MenuContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  menuSection: {
    marginTop: 26,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Refile',
  },
  menuCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  categoryButton: {
    backgroundColor: '#fec524',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 35,
  },
  selectedCategoryButton: {
    backgroundColor: '#ffeb3b',  
  },
  categoryText: {
    color: '#555555',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productList: {
    width: '100%',
    paddingVertical: 10,
  },
  productContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    width: (width / 2) - 30,
  },
  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
  productInfo: {
    width: '100%',
    marginTop: 10,
  },
  productName: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 12,
    color: 'red',
  },
  horizontalLine: {
    width: '50%',
    height: 5,
    backgroundColor: '#ddd', 
    marginTop: 10,  
    borderRadius: 20,
  },
});
