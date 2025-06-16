import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface Car {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  image: string;
  year: number;
  mileage: number;
  type: 'sale' | 'rent';
  rentPeriod?: 'daily' | 'weekly' | 'monthly';
  seller?: { isVerified: boolean };
  enabled: boolean;
}

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMode, setActiveMode] = useState<'sale' | 'rent'>('sale');

  // Replaced useQuery with useState for now as Convex is being removed
  const mockCars: Car[] = [
    {
      id: '1',
      title: 'Toyota Camry 2020',
      price: 25000,
      currency: 'FCFA',
      location: 'Douala, Cameroon',
      image: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Toyota+Camry',
      year: 2020,
      mileage: 50000,
      type: 'sale',
      seller: { isVerified: true },
      enabled: true,
    },
    {
      id: '2',
      title: 'Mercedes C-Class 2022',
      price: 45000,
      currency: 'FCFA',
      location: 'Yaounde, Cameroon',
      image: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Mercedes+C-Class',
      year: 2022,
      mileage: 20000,
      type: 'sale',
      seller: { isVerified: false },
      enabled: false,
    },
    {
      id: '3',
      title: 'BMW X5 2021',
      price: 60000,
      currency: 'FCFA',
      location: 'Douala, Cameroon',
      image: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=BMW+X5',
      year: 2021,
      mileage: 30000,
      type: 'sale',
      seller: { isVerified: true },
      enabled: true,
    },
    {
      id: '4',
      title: 'Honda Civic 2019',
      price: 15000,
      currency: 'FCFA',
      location: 'Bafoussam, Cameroon',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Honda+Civic',
      year: 2019,
      mileage: 75000,
      type: 'rent',
      rentPeriod: 'daily',
      seller: { isVerified: false },
      enabled: true,
    },
    {
      id: '5',
      title: 'Nissan Rogue 2018',
      price: 300,
      currency: 'FCFA',
      location: 'Douala, Cameroon',
      image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Nissan+Rogue',
      year: 2018,
      mileage: 90000,
      type: 'rent',
      rentPeriod: 'monthly',
      seller: { isVerified: true },
      enabled: true,
    },
  ];

  const [featuredCars, setFeaturedCars] = useState<Car[]>(
    mockCars.filter((car) => car.seller?.isVerified && car.enabled && car.type === activeMode)
  );
  const [cars, setCars] = useState<Car[]>(
    mockCars.filter((car) => car.enabled && car.type === activeMode)
  );

  const formatPrice = (price: number, currency: string, type?: string, period?: string) => {
    const periodText = type === 'rent' && period 
      ? (period === 'daily' ? '/jour' : period === 'weekly' ? '/semaine' : '/mois')
      : '';
    return `${price.toLocaleString()} ${currency}${periodText}`;
  };

  const handleCarPress = (carId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/car/${carId}`);
  };

  const handleProfilePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/profile');
  };

  const handleModeChange = (mode: 'sale' | 'rent') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveMode(mode);
    // Filter cars based on the selected mode and enabled status
    setFeaturedCars(mockCars.filter((car) => car.seller?.isVerified && car.enabled && car.type === mode));
    setCars(mockCars.filter((car) => car.enabled && car.type === mode));
  }

  const renderCarCard = ({ item }: { item: Car }, isGrid = false) => (
    <TouchableOpacity
      style={isGrid ? styles.gridCarCard : styles.carCard}
      onPress={() => handleCarPress(item.id)}
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.carImage} />
        ) : (
          <View style={[styles.carImage, styles.placeholderImage]}>
            <Ionicons name="car" size={32} color="#E5E5E5" />
          </View>
        )}
        {item.seller?.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>
      
      <View style={styles.carInfo}>
        <Text style={styles.carTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.carPrice}>
          {formatPrice(item.price, item.currency, item.type, item.rentPeriod)}
        </Text>
        <Text style={styles.carDetails}>
          {item.year} • {item.mileage.toLocaleString()} km
        </Text>
        <Text style={styles.carLocation}>
          {item.location}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explorer</Text>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <Ionicons name="person-circle-outline" size={28} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Mode Selector */}
        <View style={styles.modeSelectorContainer}>
          <TouchableOpacity 
            style={[styles.modeButton, activeMode === 'sale' && styles.modeButtonActive]}
            onPress={() => handleModeChange('sale')}
          >
            <Text style={[styles.modeButtonText, activeMode === 'sale' && styles.modeButtonTextActive]}>
              Acheter
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, activeMode === 'rent' && styles.modeButtonActive]}
            onPress={() => handleModeChange('rent')}
          >
            <Text style={[styles.modeButtonText, activeMode === 'rent' && styles.modeButtonTextActive]}>
              Louer
            </Text>
          </TouchableOpacity>
        </View>

        {/* Featured Section (Only for Sale) */}
        {activeMode === 'sale' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Annonces de confiance</Text>
            
            {featuredCars === undefined ? (
              <ActivityIndicator color="#FF3D00" style={{marginTop: 20}}/>
            ) : featuredCars.length === 0 ? (
              <View style={styles.emptyContainerHorizontal}>
                <Text style={styles.emptyText}>Aucune annonce de confiance</Text>
              </View>
            ) : (
              <FlatList
                data={featuredCars}
                renderItem={(props) => renderCarCard(props, false)}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            )}
          </View>
        )}

        {/* All Cars */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {activeMode === 'sale' ? 'Toutes les annonces' : 'Disponibles à la location'}
          </Text>
          
          {cars === undefined ? (
            <ActivityIndicator color="#FF3D00" style={{marginTop: 20}}/>
          ) : cars.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="car-outline" size={48} color="#E5E5E5" />
              <Text style={styles.emptyText}>Aucune voiture disponible</Text>
            </View>
          ) : (
            <FlatList
              data={cars}
              renderItem={(props) => renderCarCard(props, true)}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.gridList}
            />
          )}
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  profileButton: {
    padding: 4,
  },
  modeSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 4,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  modeButtonTextActive: {
    color: '#FF3D00',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  horizontalList: {
    paddingLeft: 24,
  },
  gridList: {
    paddingHorizontal: 18,
  },
  carCard: {
    width: width * 0.75,
    height: 250,
    marginRight: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridCarCard: {
    width: (width / 2) - 30,
    height: 220,
    marginHorizontal: 6,
    marginBottom: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#F0F0F0',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#28A745',
    borderRadius: 10,
    padding: 2,
  },
  carInfo: {
    padding: 10,
  },
  carTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  carPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF3D00',
    marginBottom: 2,
  },
  carDetails: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  carLocation: {
    fontSize: 12,
    color: '#999999',
  },
  emptyContainerHorizontal: {
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    marginHorizontal: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    marginHorizontal: 24,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999999',
  },
});
