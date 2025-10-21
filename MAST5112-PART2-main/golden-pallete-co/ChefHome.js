import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Picker, Image, FlatList, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ChefHome({ chefInfo, onLogout, onSaveMeal, menuItems = [] }) {
  const [darkTheme, setDarkTheme] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [addMealModalVisible, setAddMealModalVisible] = useState(false);
  const [editMenuModalVisible, setEditMenuModalVisible] = useState(false);
  const [mealDetails, setMealDetails] = useState({
    category: 'Starters',
    name: '',
    description: '',
    price: '',
    image: null
  });

  // Toggle between dark and light theme
  const toggleDarkTheme = () => {
    setDarkTheme(!darkTheme);
  };

  // Handle adding a meal
  const handleAddMeal = () => {
    onSaveMeal(mealDetails);
    setAddMealModalVisible(false);
    setMealDetails({ category: 'Starters', name: '', description: '', price: '', image: null });
  };

  // Image picker for selecting a meal image
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setMealDetails({ ...mealDetails, image: result.uri });
    }
  };

  return (
    <ScrollView style={[styles.container, darkTheme ? styles.darkContainer : styles.lightContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('./assets/chef-hat.png')} style={styles.headerLogo} />
        <TouchableOpacity onPress={() => setShowOptions(!showOptions)} style={styles.optionsButton}>
          <Text style={styles.optionsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Options Menu */}
      {showOptions && (
        <View style={styles.optionsMenu}>
          <TouchableOpacity onPress={toggleDarkTheme} style={styles.menuItem}>
            <Text style={styles.menuText}>{darkTheme ? 'Light Theme' : 'Dark Theme'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout} style={styles.menuItem}>
            <Text style={styles.menuText}>Log out</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={[styles.greeting, { color: darkTheme ? '#FFFFFF' : '#000000' }]}>
        Welcome, Chef {chefInfo?.email || 'Guest'}!
      </Text>

      {/* Add Meal Button */}
      <TouchableOpacity style={styles.addMealButton} onPress={() => setAddMealModalVisible(true)}>
        <Text style={styles.addMealText}>Add New Meal</Text>
      </TouchableOpacity>

      {/* Edit Menu Button */}
      <TouchableOpacity style={styles.editMenuButton} onPress={() => setEditMenuModalVisible(true)}>
        <Text style={styles.editMenuText}>Edit Menu</Text>
      </TouchableOpacity>

      {/* Add Meal Modal */}
      <Modal visible={addMealModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Meal</Text>

            {/* Select Category */}
            <Picker
              selectedValue={mealDetails.category}
              style={styles.picker}
              onValueChange={(itemValue) => setMealDetails({ ...mealDetails, category: itemValue })}
            >
              <Picker.Item label="Starters" value="Starters" />
              <Picker.Item label="Main Menu" value="Main Menu" />
              <Picker.Item label="Desserts" value="Desserts" />
            </Picker>

            {/* Meal Name */}
            <TextInput
              placeholder="Meal Name"
              style={styles.input}
              value={mealDetails.name}
              onChangeText={(text) => setMealDetails({ ...mealDetails, name: text })}
            />

            {/* Meal Description */}
            <TextInput
              placeholder="Meal Description"
              style={styles.input}
              value={mealDetails.description}
              onChangeText={(text) => setMealDetails({ ...mealDetails, description: text })}
            />

            {/* Meal Price */}
            <TextInput
              placeholder="Price (R)"
              style={styles.input}
              keyboardType="numeric"
              value={mealDetails.price}
              onChangeText={(text) => setMealDetails({ ...mealDetails, price: text })}
            />

            {/* Image Picker */}
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>Pick an Image</Text>
            </TouchableOpacity>

            {mealDetails.image && (
              <Image source={{ uri: mealDetails.image }} style={styles.previewImage} />
            )}

            {/* Add Meal Button */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
              <Text style={styles.addButtonText}>Add Meal</Text>
            </TouchableOpacity>

            {/* Close Modal */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setAddMealModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Menu Modal */}
      <Modal visible={editMenuModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Menu</Text>
            <Text style={styles.totalItemsText}>Total Items: {menuItems.length}</Text>

            {/* Menu Items List */}
            <FlatList
              data={menuItems}
              renderItem={({ item }) => (
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemText}>{item.name} - {item.price} R</Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />

            {/* Close Modal */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setEditMenuModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f04e4e',
  },
  headerLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  optionsButton: {
    padding: 10,
  },
  optionsIcon: {
    fontSize: 25,
    color: '#ffffff',
  },
  optionsMenu: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    position: 'absolute',
    top: 60,
    right: 10,
    zIndex: 1,
    borderRadius: 10,
  },
  menuItem: {
    marginBottom: 10,
  },
  menuText: {
    fontSize: 18,
  },
  greeting: {
    fontSize: 24,
    margin: 20,
    textAlign: 'center',
  },
  addMealButton: {
    backgroundColor: '#F4A300',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  addMealText: {
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
  },
  editMenuButton: {
    backgroundColor: '#F4A300',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  editMenuText: {
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  imageButton: {
    backgroundColor: '#F4A300',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  imageButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: '#F04E4E',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#000',
    textAlign: 'center',
  },
  totalItemsText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  menuItemText: {
    fontSize: 16,
  },
});



 



