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
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

export default function PostCarScreen() {
  const [formData, setFormData] = useState({
    title: '',
    make: '',
    model: '',
    year: '',
    price: '',
    currency: 'FCFA',
    mileage: '',
    condition: 'used',
    location: '',
    description: '',
    type: 'sale',
    rentPeriod: 'daily',
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const conditions = [
    { value: 'new', label: 'Neuf' },
    { value: 'used', label: 'Occasion' },
    { value: 'certified', label: 'Certifié' },
  ];

  const rentPeriods = [
    { value: 'daily', label: 'Jour' },
    { value: 'weekly', label: 'Semaine' },
    { value: 'monthly', label: 'Mois' },
  ];

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleAddImages = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Veuillez accorder l\'accès à votre galerie pour choisir des photos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImages(result.assets.map(asset => asset.uri));
    }
  };

  const handleRemoveImage = (uriToRemove: string) => {
    setSelectedImages(prevImages => prevImages.filter(uri => uri !== uriToRemove));
  };

  const handleTypeChange = (type: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    updateFormData('type', type);
  };

  const handleConditionChange = (condition: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }

    updateFormData('condition', condition);
  };

  const handlePeriodChange = (period: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    updateFormData('rentPeriod', period);
  };

  const handleSubmit = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (!formData.title || !formData.make || !formData.model || !formData.year || !formData.price) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (selectedImages.length === 0) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('Erreur', 'Veuillez ajouter au moins une photo pour votre annonce.');
      return;
    }

    console.log("Form Data:", formData);
    console.log("Selected Images:", selectedImages);

    Alert.alert(
      'Annonce soumise',
      'Votre annonce sera vérifiée avant publication.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Publier une annonce</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type d'annonce</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, formData.type === 'sale' && styles.typeButtonActive]}
                onPress={() => handleTypeChange('sale')}
              >
                <Ionicons 
                  name="car-outline" 
                  size={20} 
                  color={formData.type === 'sale' ? '#FFFFFF' : '#666666'} 
                />
                <Text style={[styles.typeButtonText, formData.type === 'sale' && styles.typeButtonTextActive]}>
                  Vendre
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, formData.type === 'rent' && styles.typeButtonActive]}
                onPress={() => handleTypeChange('rent')}
              >
                <Ionicons 
                  name="key-outline" 
                  size={20} 
                  color={formData.type === 'rent' ? '#FFFFFF' : '#666666'} 
                />
                <Text style={[styles.typeButtonText, formData.type === 'rent' && styles.typeButtonTextActive]}>
                  Louer
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations de base</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Titre de l'annonce</Text>
              <TextInput
                style={styles.textInput}
                value={formData.title}
                onChangeText={(value) => updateFormData('title', value)}
                placeholder="Ex: Toyota Camry 2020 en excellent état"
                placeholderTextColor="#CCCCCC"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Marque</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.make}
                  onChangeText={(value) => updateFormData('make', value)}
                  placeholder="Toyota"
                  placeholderTextColor="#CCCCCC"
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Modèle</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.model}
                  onChangeText={(value) => updateFormData('model', value)}
                  placeholder="Camry"
                  placeholderTextColor="#CCCCCC"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Année</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.year}
                  onChangeText={(value) => updateFormData('year', value)}
                  placeholder="2020"
                  keyboardType="numeric"
                  placeholderTextColor="#CCCCCC"
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Kilométrage</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.mileage}
                  onChangeText={(value) => updateFormData('mileage', value)}
                  placeholder="50000"
                  keyboardType="numeric"
                  placeholderTextColor="#CCCCCC"
                />
              </View>
            </View>
          </View>

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prix</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Prix {formData.type === 'rent' ? 'de location' : 'de vente'}
              </Text>
              <TextInput
                style={styles.textInput}
                value={formData.price}
                onChangeText={(value) => updateFormData('price', value)}
                placeholder="5000000"
                keyboardType="numeric"
                placeholderTextColor="#CCCCCC"
              />
            </View>

            {formData.type === 'rent' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Période</Text>
                <View style={styles.periodSelector}>
                  {rentPeriods.map((period) => (
                    <TouchableOpacity
                      key={period.value}
                      style={[
                        styles.periodButton,
                        formData.rentPeriod === period.value && styles.periodButtonActive
                      ]}
                      onPress={() => handlePeriodChange(period.value)}
                    >
                      <Text style={[
                        styles.periodButtonText,
                        formData.rentPeriod === period.value && styles.periodButtonTextActive
                      ]}>
                        {period.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Condition & Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>État et localisation</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>État du véhicule</Text>
              <View style={styles.conditionSelector}>
                {conditions.map((condition) => (
                  <TouchableOpacity
                    key={condition.value}
                    style={[
                      styles.conditionButton,
                      formData.condition === condition.value && styles.conditionButtonActive
                    ]}
                    onPress={() => handleConditionChange(condition.value)}
                  >
                    <Text style={[
                      styles.conditionButtonText,
                      formData.condition === condition.value && styles.conditionButtonTextActive
                    ]}>
                      {condition.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Localisation</Text>
              <TextInput
                style={styles.textInput}
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
                placeholder="Abidjan, Côte d'Ivoire"
                placeholderTextColor="#CCCCCC"
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => updateFormData('description', value)}
                placeholder="Décrivez votre véhicule en détail..."
                placeholderTextColor="#CCCCCC"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <TouchableOpacity style={styles.imageUpload} onPress={handleAddImages}>
              <Ionicons name="camera-outline" size={32} color="#CCCCCC" />
              <Text style={styles.imageUploadText}>Ajouter des photos</Text>
              <Text style={styles.imageUploadSubtext}>Jusqu'à 10 photos</Text>
            </TouchableOpacity>
            {selectedImages.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                <FlatList
                  data={selectedImages}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <View style={styles.imagePreviewWrapper}>
                      <Image source={{ uri: item }} style={styles.imagePreview} />
                      <TouchableOpacity onPress={() => handleRemoveImage(item)} style={styles.removeImageButton}>
                        <Ionicons name="close-circle" size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}
          </View>

          {/* Notice */}
          <View style={styles.notice}>
            <Ionicons name="information-circle-outline" size={20} color="#FF3D00" />
            <Text style={styles.noticeText}>
              Votre annonce sera vérifiée avant publication.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Publier l'annonce</Text>
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
  form: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#FF3D00',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
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
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#FF3D00',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  conditionSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  conditionButton: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  conditionButtonActive: {
    backgroundColor: '#FF3D00',
  },
  conditionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  conditionButtonTextActive: {
    color: '#FFFFFF',
  },
  imageUpload: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingVertical: 40,
    alignItems: 'center',
  },
  imageUploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginTop: 12,
  },
  imageUploadSubtext: {
    fontSize: 14,
    color: '#999999',
  },
  imagePreviewContainer: {
    marginTop: 20,
  },
  imagePreviewWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 32,
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    color: '#FF3D00',
  },
  bottomActions: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  submitButton: {
    backgroundColor: '#FF3D00',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
