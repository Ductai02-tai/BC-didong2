import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const loadFonts = async () => {
  await Font.loadAsync({
    'Refile': require('./../assets/fonts/Refile.otf'),  
  });
};

export default function FooterApp() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      await SplashScreen.preventAutoHideAsync(); // Ngăn màn hình splash tự ẩn
      await loadFonts();
      setFontsLoaded(true);
      await SplashScreen.hideAsync(); // Ẩn màn hình splash sau khi tải xong
    };

    loadResources();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.textBlack}>
        Tại sao chọn <Text style={styles.textYellow}>Bánh Tằm Thầy Ba</Text>
      </Text>

      {/* Item 1 */}
      <View style={styles.supportItem}>
        <Image source={require('./../assets/images/img_item_support_home_1.png')} style={styles.supportImage} />
        <Text style={styles.supportTitle}>Giao hàng nhanh chóng</Text>
        <Text style={styles.supportDescription}>Giao hàng từ 30-40 phút kể từ lúc đặt hàng</Text>
      </View>
      <View style={styles.separator} />

      {/* Item 2 */}
      <View style={styles.supportItem}>
        <Image source={require('./../assets/images/img_item_support_home_2.png')} style={styles.supportImage} />
        <Text style={styles.supportTitle}>Sản phẩm chất lượng</Text>
        <Text style={styles.supportDescription}>Sản phẩm uy tín, chất lượng đến từ nhà Thầy Ba</Text>
      </View>
      <View style={styles.separator} />

      {/* Item 3 */}
      <View style={styles.supportItem}>
        <Image source={require('./../assets/images/img_item_support_home_3.png')} style={styles.supportImage} />
        <Text style={styles.supportTitle}>Hỗ trợ nhiệt tình</Text>
        <Text style={styles.supportDescription}>Hỗ trợ và lắng nghe các ý kiến của khách hàng</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  textBlack: {
    color: 'black',
    fontSize: 25,
    fontFamily: 'Refile',
    textAlign: 'center',
    marginBottom: 20,
  },
  textYellow: {
    color: '#fec524',
    fontSize: 25,
    fontFamily: 'Refile',
  },
  supportItem: {
    alignItems: 'center',
    marginVertical: 15,
  },
  supportImage: {
    width: 80, 
    height: 80,  
    marginBottom: 10,
  },
  supportTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
  supportDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  separator: {
    width: '20%',  
    height: 2, 
    backgroundColor: '#fec524',  
    marginVertical: 15,
  },
});
