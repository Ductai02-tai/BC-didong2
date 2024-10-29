import React, { useState, useEffect, useRef } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import FooterApp from '../FooterApp';
import MenuCate from '../MenuCate';

const loadFonts = async () => {
  await Font.loadAsync({
    'Refile': require('../../assets/fonts/Refile.otf'),  
  });
};

const { width } = Dimensions.get('window');

interface Product {
  id: number;
  title: string;
  description: string;
  photo: any;
  price: number;  
}

const products: Product[] = [
  { id: 1, title: 'Bò pi tet', description: 'Delicious spring rolls', photo: require('@/assets/images/Sanpham1.png'), price: 10000 },
  { id: 2, title: 'Chả Cá/miếng', description: 'Fish cakes', photo: require('@/assets/images/Sản phẩm 2.png'), price: 150000 },
  { id: 3, title: 'Xíu Mại/Viên', description: 'Pork meatballs', photo: require('@/assets/images/Sanpham3.png'), price: 200000 },
  { id: 4, title: 'Bánh Tằm Bì Xíu Mại', description: 'Noodles with pork', photo: require('@/assets/images/Sanpham4.png'), price: 250000 },
];

export default function HomeScreen() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation<NavigationProp<any>>();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };

  useEffect(() => {
    const loadResources = async () => {
      await SplashScreen.preventAutoHideAsync();  
      await loadFonts();
      setFontsLoaded(true);
      await SplashScreen.hideAsync();  
    };

    loadResources(); 
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prevBanner) => {
        const nextBanner = prevBanner === 3 ? 0 : prevBanner + 1;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: nextBanner * width, animated: true });
        }
        return nextBanner;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!fontsLoaded) {
    return null;  
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productContainer}>
      <Image source={item.photo} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.title}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()}đ</Text>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('@/assets/images/logoba.png')} style={styles.Logo} />
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleSearch}>
            <Ionicons name="search-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
            <Ionicons name="cart-outline" size={24} color="white" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="menu-outline" size={30} color="yellow" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {isSearchVisible && (
        <View style={styles.searchBar}>
          <TextInput placeholder="Tìm kiếm..." style={styles.searchInput} placeholderTextColor="#999" />
        </View>
      )}

      <Modal transparent={true} visible={isMenuVisible} animationType="slide">
        <TouchableOpacity style={styles.modalBackground} onPress={toggleMenu}>
          <View style={styles.menu}>
            <Text style={styles.menuItem}>TRANG CHỦ</Text>
            <TouchableOpacity onPress={() => {
              toggleMenu();  
              navigation.navigate('ProductList');
            }}>
              <Text style={styles.menuItem}>SẢN PHẨM</Text>
            </TouchableOpacity>
            <Text style={styles.menuItem}>GIỚI THIỆU</Text>
            <Text style={styles.menuItem}>LIÊN HỆ</Text>
            <Text style={styles.menuItem}>TUYỂN DỤNG</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Main Content */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        ListHeaderComponent={
          <View style={{ flex: 1 }}>
            {/* Banners */}
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} ref={scrollViewRef} style={styles.bannerContainer}>
              <Image source={require('@/assets/images/slideshow_1.png')} style={styles.banner} />
              <Image source={require('@/assets/images/slideshow_2.png')} style={styles.banner} />
              <Image source={require('@/assets/images/slideshow_3.png')} style={styles.banner} />
              <Image source={require('@/assets/images/slideshow_4.png')} style={styles.banner} />
            </ScrollView>
            <Image source={require('@/assets/images/img_home_welcome.png')} style={styles.welcomeImage} resizeMode="contain" />
            <Text style={styles.welcomeText}>Chào mừng đến với Bánh Tằm Thầy Ba</Text>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                <Image source={require('@/assets/images/img_icon_home_welcome_1.png')} style={styles.iconImage} />
              </View>
              <View style={styles.iconWrapper}>
                <Image source={require('@/assets/images/img_icon_home_welcome_2.png')} style={styles.iconImage} />
              </View>
              <View style={styles.iconWrapper}>
                <Image source={require('@/assets/images/img_icon_home_welcome_3.png')} style={styles.iconImage} />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Text style={styles.descriptionText}>
                Mở cửa 6:00 - 21:30 hằng ngày tại địa chỉ 344 Tên Lửa, Phường Bình Trị Đông B, Quận Bình Tân, Tp.HCM
              </Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.buttonText}>Đặt Món ngay</Text>
              </TouchableOpacity>

              <View style={styles.bannerSection}>
                <Image source={require('@/assets/images/img_home_banner_1.png')} style={styles.homeBanner} />
                <Image source={require('@/assets/images/img_home_banner_3.png')} style={styles.homeBanner} />
              </View>
            </View>

            {/* Menu Section */}
            {<MenuCate />}  
     {/* Banner with Button */}
     <View style={styles.bannerWithButtonContainer}>
              <Image source={require('@/assets/images/slideshow_4.png')} style={styles.fullWidthImage} />
              <TouchableOpacity style={styles.seeMoreButton}>
                <Text style={styles.seeMoreButtonText}>Xem thêm</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.featuredText}>
              Sản Phẩm <Text style={styles.textYellow}> Bán Chạy</Text>
            </Text>
          </View>
        }
        ListFooterComponent={<FooterApp />} 
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  header: {
    height: 75,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 1,

  },
  textYellow: {
    color: '#fec524',
    fontSize: 23,
    fontFamily: 'Refile',
      
  },

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
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
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
  //----
  bannerContainer: {
    width: '100%',
    height: 200,
    marginBottom: 15,


  },
  banner: {
    width: width,
    height: 200,

  },
  //----
  welcomeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  welcomeImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 47,
    textAlign: 'center',
    fontFamily: 'Refile'
  },
  //----
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginBottom: 20,

  },
  iconWrapper: {
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: 'black',
    padding: 27,
    marginHorizontal: 10,


  },
  iconImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  featuredText: {
    fontSize: 23,
    fontWeight: 'bold',
    marginVertical: 10,
    marginBottom: 30,
    fontFamily: 'Refile',
     textAlign: 'center',
  },
  //-----
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    justifyContent: 'center',  
    marginBottom: 25,
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
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  descriptionText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  exploreButton: {
    backgroundColor: '#fec524',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fec524',
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,

  },
  //----
  bannerSection: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 13,
  },
  homeBanner: {
    width: width - 40,
    height: 160,
    marginVertical: 10,
    borderRadius: 15,
    borderWidth: 5,
    borderColor: '#FFD700',

  },
//----
bannerWithButtonContainer: {
  position: 'relative',
  marginVertical: 20,
},
fullWidthImage: {
  width: '100%',
  height: 150,
},
seeMoreButton: {
  position: 'absolute',
  top: '75%',  
  left: '50%',  
 
  transform: [{ translateX: -50 }, { translateY: -50 }],  
  backgroundColor: '#FFD700',  
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
},

seeMoreButtonText: {
  color: '#000', 
  fontWeight: 'bold',
  fontSize: 16,
},

});
