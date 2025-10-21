import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const getRandomOrderNumber = () => {
  return Math.floor(Math.random() * 1000000);
};

export default function Cart({ cartItems, setShowCart }) {
  const [name, setName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  const handleOrder = () => {
    if (paymentMethod !== 'Cash' && (cardNumber === '' || cardExpiry === '' || cardCVC === '')) {
      alert('Please enter complete card information');
      return;
    }
    setOrderNumber(getRandomOrderNumber());
  };

  const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cartItems.map((item, index) => (
          <Text key={index} style={styles.cartItem}>
            {item.quantity} x {item.itemName} – R{item.price * item.quantity}
          </Text>
        ))}
        <Text style={styles.totalCost}>Total: R{totalCost}</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Select Payment Method:</Text>
        <TouchableOpacity
          style={paymentMethod === 'Cash' ? styles.selectedMethod : styles.paymentMethod}
          onPress={() => setPaymentMethod('Cash')}
        >
          <Text style={styles.methodText}>Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={paymentMethod === 'Visa' ? styles.selectedMethod : styles.paymentMethod}
          onPress={() => setPaymentMethod('Visa')}
        >
          <Text style={styles.methodText}>Visa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={paymentMethod === 'Mastercard' ? styles.selectedMethod : styles.paymentMethod}
          onPress={() => setPaymentMethod('Mastercard')}
        >
          <Text style={styles.methodText}>Mastercard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={paymentMethod === 'Paypal' ? styles.selectedMethod : styles.paymentMethod}
          onPress={() => setPaymentMethod('Paypal')}
        >
          <Text style={styles.methodText}>Paypal</Text>
        </TouchableOpacity>

        {paymentMethod !== 'Cash' && paymentMethod !== '' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Expiry Date (MM/YY)"
              value={cardExpiry}
              onChangeText={setCardExpiry}
            />
            <TextInput
              style={styles.input}
              placeholder="CVC"
              value={cardCVC}
              onChangeText={setCardCVC}
              keyboardType="numeric"
            />
          </>
        )}

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleOrder}
        >
          <Text style={styles.confirmButtonText}>Confirm Order</Text>
        </TouchableOpacity>

        {orderNumber && (
          <Text style={styles.orderNumber}>
            Thank you, {name}! Your order number is #{orderNumber}.
          </Text>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowCart(false)}
        >
          <Text style={styles.backButtonText}>Back to Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  cartItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  totalCost: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  paymentMethod: {
    backgroundColor: '#d3d3d3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedMethod: {
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  methodText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});


