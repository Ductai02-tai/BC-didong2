import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Load custom fonts
const loadFonts = async () => {
  await Font.loadAsync({
    'Refile': require('./../assets/fonts/Refile.otf'),
  });
};

const { width } = Dimensions.get('window');

// Define types
type Product = {
  id: number;
  name: string;
  price: string;
  imageUrl?: string;
};

type CartItem = Product & { quantity: number };

interface Category {
  id: number;
  title: string;
}

type RootStackParamList = {
  ProductDetailScreen: { productId: number };
  CartScreen: { cartItems: CartItem[] };
};

export default function ProductList() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'ProductDetailScreen'>>();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Toggle search bar visibility
  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  // Add product to cart and show confirmation message
  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      ToastAndroid.show('Đã thêm vào giỏ hàng', ToastAndroid.SHORT);
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  useEffect(() => {
    const loadResources = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadFonts();
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
        fetchProducts(); 
      } catch (e) {
        console.warn(e);
      }
    };
    loadResources();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uZ3V5ZW5kdWN0YWkiLCJpYXQiOjE3MzA3MjkyOTcsImV4cCI6MTczMDgxNTY5N30._VOd8hFRe7W8wQpgYxoCRJIW9-fTLyHUz_cHBRBrH04'; // Replace with your actual token
    try {
      const response = await axios.get<Product[]>('http://172.20.10.8:8080/api/products', {
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
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products');
    }
  };

  // Handle search functionality
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      fetchProducts();
      return;
    }
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uZ3V5ZW5kdWN0YWkiLCJpYXQiOjE3MzA3MjkyOTcsImV4cCI6MTczMDgxNTY5N30._VOd8hFRe7W8wQpgYxoCRJIW9-fTLyHUz_cHBRBrH04'; // Replace with your actual token
    try {
      const response = await axios.get<Product[]>(`http://172.20.10.8:8080/api/products/search?keyword=${encodeURIComponent(searchTerm)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productsWithImages = await Promise.all(
        response.data.map(async (product: Product) => {
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
        })
      );

      setSearchResults(productsWithImages);
    } catch (error) {
      console.error('Error searching products:', error);
      setError('Error searching products');
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  // Render product item
  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => navigation.navigate('ProductDetailScreen', { productId: item.id })}
    >
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage} />
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.productDetails}>
          <Text style={styles.productPrice}>
            {parseFloat(item.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </Text>
          <TouchableOpacity style={styles.orderButton} onPress={() => addToCart(item)}>
            <Text style={styles.orderButtonText}>Đặt món +</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('./../assets/images/logoba.png')} style={styles.Logo} />
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={toggleSearch}>
              <Ionicons name="search-outline" size={24} color="white" style={{ marginLeft: 15 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CartScreen', { cartItems })}>
              <Ionicons name="cart-outline" size={24} color="white" style={{ marginLeft: 15 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMenu}>
              <Ionicons name="menu-outline" size={30} color="yellow" style={{ marginLeft: 15 }} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Product Title */}
        <Text style={styles.productTitle}>
          Tất Cả <Text style={styles.textYellow}> Sản Phẩm</Text>
        </Text>
        {/* Search Bar */}
        {isSearchVisible && (
          <>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={handleSearch}
            />
            {searchResults.length > 0 && (
              <Text style={styles.searchResultText}>
                Kết quả tìm kiếm cho: "{searchTerm}"
              </Text>
            )}
          </>
        )}
        {/* Product List */}
        <FlatList
          data={searchResults.length > 0 ? searchResults : products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.container}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  textYellow: {
    color: '#fec524',
    fontSize: 25,
    fontFamily: 'Refile',
      
  },
  placeholderImage: {
    width: width / 2 - 20,  
    height: 150,  
    backgroundColor: '#ccc', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5, 
  },
  header: {
    height: 75,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 1,
    marginBottom: 30,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'Refile',
    marginBottom: 30,
  },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    justifyContent: 'center',  
  },
  
  productContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    width: (width / 2) - 30,  // Tính toán căn đúng 2 cột
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
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 14,
    color: 'red',
  },

  orderButton: {
    borderWidth: 1,
    borderColor: '#fec524',
    borderRadius: 10,

    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  orderButtonText: {
    color: '#c88738',
    fontSize: 14,

  },
  //----------
  Logo: {
    width: 130,
    height: 50,
    marginTop: 8,
  },
  headerRight: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 8,
    alignItems: 'center',
     marginRight: 30,
     marginLeft: 30,

  },
  
  searchResultText: {
    fontSize: 16,
    fontFamily: 'Refile',
    color: 'gray',
    marginVertical: 10,
    textAlign: 'center',
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});
