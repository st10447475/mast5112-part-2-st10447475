import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Cart from './Cart';

export default function MainMenu({ menuData, addToCart, navigateToCart }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuItemQuantities, setMenuItemQuantities] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [menuItems, setMenuItems] = useState({ starters: [], mains: [], desserts: [] });

  // Update menu items when menuData changes
  useEffect(() => {
    if (menuData) {
      setMenuItems({
        starters: menuData.filter(item => item.category === 'Starters'),
        mains: menuData.filter(item => item.category === 'Main Menu'),
        desserts: menuData.filter(item => item.category === 'Desserts'),
      });
    }
  }, [menuData]);

  const addItemToCart = (itemName, price, section, quantity, image) => {
    const itemExists = cartItems.find(item => item.itemName === itemName);

    if (itemExists) {
      const updatedCartItems = cartItems.map(item =>
        item.itemName === itemName
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCartItems(updatedCartItems);
    } else {
      const updatedCartItems = [...cartItems, { itemName, price, section, quantity, image }];
      setCartItems(updatedCartItems);
      setCartCount(cartCount + quantity);
    }
  };

  const handleQuantityChange = (itemName, value) => {
    setMenuItemQuantities(prevState => ({
      ...prevState,
      [itemName]: value,
    }));
  };

  const renderMenuItem = (item, section) => {
    const quantity = menuItemQuantities[item.name] || 1;
    return (
      <View key={item.name} style={styles.menuItem}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.itemTitle}>{item.name} – R{item.price}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.quantityContainer}>
            <Text>Quantity:</Text>
            <Picker
              selectedValue={quantity}
              style={styles.picker}
              onValueChange={(itemValue) => handleQuantityChange(item.name, itemValue)}
            >
              {[...Array(10)].map((_, i) => (
                <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => addItemToCart(item.name, item.price, section, quantity, item.image)}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCartModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cart Items</Text>
          {cartItems.length === 0 ? (
            <Text style={styles.modalText}>Your cart is empty.</Text>
          ) : (
            cartItems.map((item, index) => (
              <Text key={index} style={styles.modalText}>
                {item.quantity} x {item.itemName} – R{item.price * item.quantity}
              </Text>
            ))
          )}
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={() => {
              setModalVisible(false);
              setShowCart(true);
            }}
          >
            <Text style={styles.proceedButtonText}>Proceed to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (showCart) {
    return <Cart cartItems={cartItems} setShowCart={setShowCart} />;
  }

  return (
    <View style={styles.container}>
      {/* Header with chef-hat and cart */}
      <View style={styles.header}>
        <Image source={require('./assets/chef-hat.png')} style={styles.chefHat} />
        <Text style={styles.headerTitle}>Menu</Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.cartText}>🛒 {cartCount}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Starters Section */}
        <Text style={styles.sectionTitle}>Starters</Text>
        {renderMenuItem(
          {
            name: 'Smoked Salmon Carpaccio',
            price: 85,
            description: 'Delicate slices of smoked salmon with a lemon-dill dressing.',
            image: require('./assets/salmon.jpg'),
          },
          'Starters'
        )}
        {renderMenuItem(
          {
            name: 'Stuffed Portobello Mushrooms',
            price: 70,
            description: 'Large mushrooms stuffed with goat cheese and herbs.',
            image: require('./assets/Vegetable-Stuffed-Portabella-Mushrooms-4-720x1080.jpg'),
          },
          'Starters'
        )}
        {renderMenuItem(
          {
            name: 'Butternut Squash Soup',
            price: 60,
            description: 'Creamy roasted butternut squash soup with crispy croutons.',
            image: require('./assets/Creamy-Butternut-Squash-Soup-Recipe-Plated-Cravings-3.jpg'),
          },
          'Starters'
        )}

        {/* Main Menu Section */}
        <Text style={styles.sectionTitle}>Main Menu</Text>
        {renderMenuItem(
          {
            name: 'Lamb Kofta with tzatziki',
            price: 240,
            description: 'Succulent lamb skewers with creamy tzatziki.',
            image: require('./assets/VEGAN.jpg'),
          },
          'Main Menu'
        )}
        {renderMenuItem(
          {
            name: 'Lemon-herb couscous',
            price: 190,
            description: 'A light and zesty couscous dish with fresh herbs and pomegranate.',
            image: require('./assets/Easy-Couscous.jpg'),
          },
          'Main Menu'
        )}
        {renderMenuItem(
          {
            name: 'Grilled Branzino',
            price: 180,
            description: 'A whole grilled branzino served with lemon-garlic sauce.',
            image: require('./assets/LEMON.jpg'),
          },
          'Main Menu'
        )}

        {/* Desserts Section */}
        <Text style={styles.sectionTitle}>Desserts</Text>
        {renderMenuItem(
          {
            name: 'Malva Pudding',
            price: 60,
            description: 'Traditional South African dessert served with custard.',
            image: require('./assets/BD-Malva-Pudding-095.jpg'),
          },
          'Desserts'
        )}
        {renderMenuItem(
          {
            name: 'Chocolate Fondant',
            price: 75,
            description: 'Molten chocolate cake with vanilla ice cream.',
            image: require('./assets/Chocolate-fondants-115-500x500.jpg'),
          },
          'Desserts'
        )}
        {renderMenuItem(
          {
            name: 'Lemon Cheesecake',
            price: 65,
            description: 'Zesty lemon cheesecake on a biscuit base.',
            image: require('./assets/Lemon-Dream-Cheesecake_EXPS_FT24_93312_0329_JR_1.jpg'),
          },
          'Desserts'
        )}
      </ScrollView>

      {renderCartModal()}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chefHat: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cartButton: {
    backgroundColor: '#f04e4e',
    borderRadius: 20,
    padding: 5,
  },
  cartText: {
    fontSize: 20,
    color: '#fff',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  picker: {
    height: 30,
    width: 100,
    marginLeft: 10,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  proceedButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  proceedButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#f04e4e',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});





