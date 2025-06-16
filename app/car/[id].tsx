import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock car data as Convex is being removed
  const [car, setCar] = useState<any>({
    _id: id,
    title: "Voiture d'exemple",
    make: "Marque",
    model: "Modèle",
    year: 2020,
    price: 25000,
    currency: "EUR",
    mileage: 50000,
    condition: "used",
    location: "Paris, France",
    description: "Ceci est une description de voiture d'exemple. Elle est en excellent état et prête à rouler. Contactez le vendeur pour plus d'informations.",
    imageUrls: [
      "https://via.placeholder.com/400x300?text=Car+Image+1",
      "https://via.placeholder.com/400x300?text=Car+Image+2",
      "https://via.placeholder.com/400x300?text=Car+Image+3",
    ],
    videoId: null,
    type: "sale",
    rentPeriod: null,
    status: "active",
    isFeatured: true,
    views: 123,
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    seller: {
      _id: "mock_seller_id",
      name: "Vendeur Exemple",
      location: "Paris",
      isVerified: true,
    },
  });

  useEffect(() => {
    // Original incrementViews logic removed as Convex is gone
    // if (car && id) {
    //   incrementViews({ carId: id as Id<'cars'> });
    // }
  }, [car, id]);

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleContact = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // In real app, this would open messaging
    console.log('Contact seller');
  };

  const handleBuyNow = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    // Navigating to checkout will now use the mock car ID
    router.push(`/checkout/${id}`);
  };

  const formatPrice = (price: number, currency: string, type?: string, period?: string) => {
    const periodText = type === 'rent' && period 
      ? (period === 'daily' ? '/jour' : period === 'weekly' ? '/semaine' : '/mois')
      : '';
    return `${price.toLocaleString()} ${currency}${periodText}`;
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new': return 'Neuf';
      case 'used': return 'Occasion';
      case 'certified': return 'Certifié';
      default: return condition;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          {car.imageUrls && car.imageUrls.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentImageIndex(index);
              }}
            >
              {car.imageUrls.map((url: string, index: number) => (
                <Image key={index} source={{ uri: url }} style={styles.carImage} />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.carImage, styles.placeholderImage]}>
              <Ionicons name="car" size={80} color="#E5E5E5" />
            </View>
          )}
          
          {car.imageUrls && car.imageUrls.length > 1 && (
            <View style={styles.imageIndicators}>
              {car.imageUrls.map((_: string, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}

          {car.seller?.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              <Text style={styles.verifiedText}>Vérifié</Text>
            </View>
          )}
        </View>

        {/* Car Info */}
        <View style={styles.carInfo}>
          <Text style={styles.carTitle}>{car.title}</Text>
          <Text style={styles.carPrice}>
            {formatPrice(car.price, car.currency, car.type, car.rentPeriod)}
          </Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Année</Text>
              <Text style={styles.detailValue}>{car.year}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kilométrage</Text>
              <Text style={styles.detailValue}>{car.mileage.toLocaleString()} km</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>État</Text>
              <Text style={styles.detailValue}>{getConditionText(car.condition)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Localisation</Text>
              <Text style={styles.detailValue}>{car.location}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            {/* Using mock views as incrementViews is removed */}
            <Text style={styles.statText}>{car.views} vues</Text>
            <Text style={styles.statText}>
              {new Date(car.createdAt).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{car.description}</Text>
        </View>

        {/* Seller Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendeur</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>
                {car.seller?.name?.split(' ').map((n: string) => n[0]).join('') || 'V'}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerNameContainer}>
                <Text style={styles.sellerName}>{car.seller?.name || 'Vendeur'}</Text>
                {car.seller?.isVerified && (
                  <Ionicons name="checkmark-circle" size={16} color="#FF3D00" />
                )}
              </View>
              <Text style={styles.sellerLocation}>
                {car.seller?.location || car.location}
              </Text>
            </View>
            <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
              <Ionicons name="chatbubble-outline" size={20} color="#FF3D00" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>


      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.messageButton} onPress={handleContact}>
          <Ionicons name="chatbubble-outline" size={20} color="#000000" />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
          <Text style={styles.buyButtonText}>
            {car.type === 'rent' ? 'Louer' : 'Acheter'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGallery: {
    position: 'relative',
  },
  carImage: {
    width: width,
    height: 320,
    backgroundColor: '#F8F8F8',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 70,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3D00',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  carInfo: {
    padding: 24,
  },
  carTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  carPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF3D00',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  detailsGrid: {
    gap: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statText: {
    fontSize: 14,
    color: '#999999',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sellerAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
  
  color: '#000000',
  },
  sellerLocation: {
    fontSize: 14,
    color: '#666666',
  },
  contactButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#FF3D00',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999999',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginTop: 16,
  },
});