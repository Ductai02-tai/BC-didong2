import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: any;
  selected: boolean;
}

const initialCartItems: CartItem[] = [
  { id: '1', name: 'Bò Bía', price: '100.000000đ', quantity: 2, image: require('@/assets/images/Sanpham1.png'), selected: false },
  { id: '2', name: 'Chả Cá/miếng', price: '150.000đ', quantity: 1, image: require('@/assets/images/Sản phẩm 2.png'), selected: false },
  { id: '3', name: 'Xíu Mại/Viên', price: '200.000đ', quantity: 1, image: require('@/assets/images/Sanpham3.png'), selected: false },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === id ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item
      )
    );
  };

  const toggleSelectItem = (id: string) => {
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const totalAmount = cartItems.reduce((total, item) => 
    item.selected ? total + parseInt(item.price.replace('.', '').replace('đ', '')) * item.quantity : total, 
    0
  );

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItemContainer}>
      <TouchableOpacity onPress={() => toggleSelectItem(item.id)} style={styles.checkbox}>
        {item.selected ? <Ionicons name="checkmark-circle" size={24} color="green" /> : <Ionicons name="radio-button-off" size={24} color="gray" />}
      </TouchableOpacity>
      <Image source={item.image} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityDisplay}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.cartItemPrice}>{item.price}</Text>
      <TouchableOpacity style={styles.removeButton}>
        <Ionicons name="close-circle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Giỏ Hàng</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cartList}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng tiền: {totalAmount.toLocaleString()}đ</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartList: {
    paddingBottom: 20,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  checkbox: {
    marginRight: 10,
  },
  cartItemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 10,
    alignItems: 'flex-start',
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityDisplay: {
    fontSize: 15,
    marginHorizontal: 10,
  },
  removeButton: {
    marginLeft: 10,
  },
  cartItemPrice: {
    fontSize: 16,
    color: 'red',
    textAlign: 'right',
    marginRight: 10,
  },
  totalContainer: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#fec524',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 25,
    marginVertical: 10,
    alignSelf: 'center',
  },
  checkoutButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

