import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('flutterwave');

  // Mock car data as Convex is being removed
  const [car, setCar] = useState<any>({
    _id: id,
    title: "Voiture d'exemple pour l'achat",
    make: "Marque",
    model: "Modèle",
    year: 2020,
    price: 25000,
    currency: "EUR",
    mileage: 50000,
    condition: "used",
    location: "Abidjan, Côte d'Ivoire",
    description: "Ceci est une description de voiture d'exemple.",
    imageUrls: ["https://via.placeholder.com/400x300?text=Car+Image"],
    videoId: null,
    type: "sale",
    rentPeriod: null,
    status: "active",
    isFeatured: true,
    views: 123,
    createdAt: Date.now(),
    seller: {
      _id: "mock_seller_id",
      name: "Vendeur Exemple",
      location: "Abidjan",
      isVerified: true,
    },
  });

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handlePaymentMethodChange = (method: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setPaymentMethod(method);
  };

  const handleInputFocus = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const calculateTotal = () => {
    // Use the mock car data
    const subtotal = car.price;
    const platformFee = Math.round(subtotal * 0.05); // 5% platform fee
    const total = subtotal + platformFee;
    
    return { subtotal, platformFee, total };
  };

  const handlePayment = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    if (!buyerInfo.name || !buyerInfo.email || !buyerInfo.phone) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    Alert.alert(
      'Paiement sécurisé',
      'Vos fonds seront conservés en séquestre jusqu\'à confirmation.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Procéder',
          onPress: () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            Alert.alert(
              'Paiement réussi',
              'Votre paiement est maintenant en séquestre.',
              [{ text: 'OK', onPress: () => router.push('/') }]
            );
          },
        },
      ]
    );
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const { subtotal, platformFee, total } = calculateTotal();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paiement sécurisé</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Car Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé</Text>
          <View style={styles.carSummary}>
            <Text style={styles.carTitle}>{car.title}</Text>
            <Text style={styles.carDetails}>
              {car.year} • {car.mileage.toLocaleString()} km • {car.location}
            </Text>
            <View style={styles.sellerRow}>
              <Text style={styles.sellerText}>Vendeur: {car.seller?.name}</Text>
              {car.seller?.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color="#FF3D00" />
              )}
            </View>
          </View>
        </View>

        {/* Buyer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations acheteur</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom complet</Text>
            <TextInput
              style={styles.textInput}
              value={buyerInfo.name}
              onChangeText={(value) => setBuyerInfo(prev => ({ ...prev, name: value }))}
              onFocus={handleInputFocus}
              placeholder="Jean Kouassi"
              placeholderTextColor="#CCCCCC"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={buyerInfo.email}
              onChangeText={(value) => setBuyerInfo(prev => ({ ...prev, email: value }))}
              onFocus={handleInputFocus}
              placeholder="jean.kouassi@email.com"
              keyboardType="email-address"
              placeholderTextColor="#CCCCCC"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Téléphone</Text>
            <TextInput
              style={styles.textInput}
              value={buyerInfo.phone}
              onChangeText={(value) => setBuyerInfo(prev => ({ ...prev, phone: value }))}
              onFocus={handleInputFocus}
              placeholder="+225 07 12 34 56 78"
              keyboardType="phone-pad"
              placeholderTextColor="#CCCCCC"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adresse</Text>
            <TextInput
              style={styles.textInput}
              value={buyerInfo.address}
              onChangeText={(value) => setBuyerInfo(prev => ({ ...prev, address: value }))}
              onFocus={handleInputFocus}
              placeholder="123 Rue de la Paix"
              placeholderTextColor="#CCCCCC"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Ville</Text>
              <TextInput
                style={styles.textInput}
                value={buyerInfo.city}
                onChangeText={(value) => setBuyerInfo(prev => ({ ...prev, city: value }))}
                onFocus={handleInputFocus}
                placeholder="Abidjan"
                placeholderTextColor="#CCCCCC"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Pays</Text>
              <TextInput
                style={styles.textInput}
                value={buyerInfo.country}
                onChangeText={(value) => setBuyerInfo(prev => ({ ...prev, country: value }))}
                onFocus={handleInputFocus}
            placeholder="Côte d'Ivoire"
                placeholderTextColor="#CCCCCC"
              />
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Méthode de paiement</Text>
          
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'flutterwave' && styles.paymentOptionActive]}
            onPress={() => handlePaymentMethodChange('flutterwave')}
          >
            <View style={styles.paymentOptionLeft}>
              <View style={styles.paymentIcon}>
                <Ionicons name="card-outline" size={24} color="#FF3D00" />
              </View>
              <View>
                <Text style={styles.paymentTitle}>Flutterwave</Text>
                <Text style={styles.paymentSubtitle}>Carte, Mobile Money</Text>
              </View>
            </View>
            <View style={[styles.radio, paymentMethod === 'flutterwave' && styles.radioActive]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'paystack' && styles.paymentOptionActive]}
            onPress={() => handlePaymentMethodChange('paystack')}
          >
            <View style={styles.paymentOptionLeft}>
              <View style={styles.paymentIcon}>
                <Ionicons name="wallet-outline" size={24} color="#FF3D00" />
              </View>
              <View>
                <Text style={styles.paymentTitle}>Paystack</Text>
                <Text style={styles.paymentSubtitle}>Carte, Virement</Text>
              </View>
            </View>
            <View style={[styles.radio, paymentMethod === 'paystack' && styles.radioActive]} />
          </TouchableOpacity>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail du paiement</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Prix du véhicule</Text>
              <Text style={styles.priceValue}>{formatPrice(subtotal, car.currency)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Frais de plateforme (5%)</Text>
              <Text style={styles.priceValue}>{formatPrice(platformFee, car.currency)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(total, car.currency)}</Text>
            </View>
          </View>
        </View>

        {/* Escrow Notice */}
        <View style={styles.escrowNotice}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#FF3D00" />
          <View style={styles.escrowText}>
            <Text style={styles.escrowTitle}>Paiement sécurisé</Text>
            <Text style={styles.escrowDescription}>
              Vos fonds seront conservés en séquestre jusqu'à confirmation de la réception.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Payment Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
          <Text style={styles.payButtonText}>
            Payer {formatPrice(total, car.currency)}
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
  carSummary: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
  },
  carTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  carDetails: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellerText: {
    fontSize: 14,
    color: '#666666',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000000',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  paymentOptionActive: {
    backgroundColor: '#FFF8F6',
    borderWidth: 2,
    borderColor: '#FF3D00',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  radioActive: {
    borderColor: '#FF3D00',
    backgroundColor: '#FF3D00',
  },
  priceBreakdown: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF3D00',
  },
  escrowNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  escrowText: {
    flex: 1,
  },
  escrowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 4,
  },
  escrowDescription: {
    fontSize: 14,
    color: '#4CAF50',
    lineHeight: 20,
  },
  bottomActions: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3D00',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  payButtonText: {
    fontSize: 18,
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