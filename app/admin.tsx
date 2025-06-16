import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface Car {
  id: string;
  name: string;
  price: number;
  location: string;
  image: string;
  enabled: boolean;
}

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState<'messages' | 'users' | 'cars'>('messages');

  // Mock car data - will be replaced by Firebase data
  const [cars, setCars] = useState<Car[]>([
    {
      id: '1',
      name: 'Toyota Camry',
      price: 25000,
      location: 'Douala, Cameroon',
      image: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Toyota+Camry',
      enabled: true,
    },
    {
      id: '2',
      name: 'Mercedes C-Class',
      price: 45000,
      location: 'Yaounde, Cameroon',
      image: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Mercedes+C-Class',
      enabled: false,
    },
    {
      id: '3',
      name: 'BMW X5',
      price: 60000,
      location: 'Douala, Cameroon',
      image: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=BMW+X5',
      enabled: true,
    },
  ]);

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleToggleCarEnabled = (carId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Placeholder for Firebase update logic
    setCars((prevCars) =>
      prevCars.map((car) =>
        car.id === carId ? { ...car, enabled: !car.enabled } : car
      )
    );
    console.log(`Toggle enabled for car: ${carId}`);
  };

  const handleDeleteCar = (carId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Placeholder for Firebase delete logic
    setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
    console.log(`Delete car: ${carId}`);
  };

  const handleViewCar = (carId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/car/${carId}`);
  };

  const renderMessagesTab = () => {
    // This will be where Firebase (Firestore) messaging integration goes
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabContentText}>Admin Messages View (Ready for Firebase)</Text>
        <Text style={styles.tabDescription}>Here, you would see a list of user conversations and have the ability to start new ones.</Text>
        {/* Placeholder for message list or conversation UI */}
      </View>
    );
  };

  const renderUsersTab = () => {
    // This will be where Firebase (Firestore) user management goes
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabContentText}>Admin Users View (Ready for Firebase)</Text>
        <Text style={styles.tabDescription}>Manage users, view profiles, and access more details.</Text>
        {/* Placeholder for user list UI */}
      </View>
    );
  };

  const renderCarsTab = () => {
    // This will be where Firebase (Firestore) car management goes
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabContentText}>Admin Cars View (Ready for Firebase)</Text>
        <Text style={styles.tabDescription}>Approve/reject listings, edit car details, etc.</Text>
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.carItemContainer}>
              <Image source={{ uri: item.image }} style={styles.carImage} />
              <Text style={styles.carItemName}>{item.name}</Text>
              <Text style={styles.carItemDetails}>Price: ${item.price.toLocaleString()}</Text>
              <Text style={styles.carItemDetails}>Location: {item.location}</Text>
              <Text style={styles.carItemDetails}>Status: {item.enabled ? 'Enabled' : 'Disabled'}</Text>
              <View style={styles.carItemActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.viewButton]}
                  onPress={() => handleViewCar(item.id)}
                >
                  <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, item.enabled ? styles.disableButton : styles.enableButton]}
                  onPress={() => handleToggleCarEnabled(item.id)}
                >
                  <Text style={styles.actionButtonText}>
                    {item.enabled ? 'Disable' : 'Enable'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteCar(item.id)}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.carListContent}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin View</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.tabSelectorContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'messages' && styles.tabButtonActive]}
            onPress={() => setActiveTab('messages')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'messages' && styles.tabButtonTextActive]}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'users' && styles.tabButtonActive]}
            onPress={() => setActiveTab('users')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'users' && styles.tabButtonTextActive]}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'cars' && styles.tabButtonActive]}
            onPress={() => setActiveTab('cars')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'cars' && styles.tabButtonTextActive]}>Cars</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'messages' && renderMessagesTab()}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'cars' && renderCarsTab()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 44,
  },
  tabSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#FF3D00',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  tabContentText: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333333',
  },
  tabDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  carListContent: {
    width: '100%',
  },
  carItemContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  carImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  carItemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333333',
  },
  carItemDetails: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 3,
  },
  carItemActions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButton: {
    backgroundColor: '#007BFF',
  },
  enableButton: {
    backgroundColor: '#28A745',
  },
  disableButton: {
    backgroundColor: '#FFC107',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
}); 