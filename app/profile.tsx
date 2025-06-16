import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function ProfileTab() {
  // Mock user data - in real app this would come from authentication
  const user = {
    name: 'Jean Kouassi',
    email: 'jean.kouassi@email.com',
    phone: '+225 07 12 34 56 78',
    location: 'Abidjan, Côte d\'Ivoire',
    isVerified: false,
    totalListings: 0,
    totalSales: 0,
    rating: 4.8,
    isAdmin: true, // Mock admin flag
  };

  const handleMenuPress = (route: string, isHighlight = false) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(
        isHighlight 
          ? Haptics.ImpactFeedbackStyle.Medium 
          : Haptics.ImpactFeedbackStyle.Light
      );
    }
    router.push(route as any);
  };

  const handleEditPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Edit profile');
  };

  const handleVerifyPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    console.log('Verify account');
  };

  const handleLogoutPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    console.log('Logout');
  };

  const handleAdminViewPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Placeholder for actual admin view navigation
    router.push('/admin');
  };

  const menuItems = [
    {
      icon: 'car-outline',
      title: 'Mes annonces',
      subtitle: `${user.totalListings} voitures`,
      onPress: () => handleMenuPress('/my-listings'),
      visible: true,
    },
    {
      icon: 'add-circle-outline',
      title: 'Publier une annonce',
      subtitle: 'Vendez votre voiture',
      onPress: () => handleMenuPress('/post-car'),
      highlight: true,
      visible: true,
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Vérification du compte',
      subtitle: user.isVerified ? 'Compte vérifié' : 'En attente',
      onPress: () => handleMenuPress('/verification'),
      badge: !user.isVerified,
      visible: true,
    },
    {
      icon: 'receipt-outline',
      title: 'Mes transactions',
      subtitle: `${user.totalSales} ventes`,
      onPress: () => handleMenuPress('/transactions'),
      visible: true,
    },
    {
      icon: 'chatbubble-outline',
      title: 'Messages',
      subtitle: 'Conversations',
      onPress: () => handleMenuPress('/messages'),
      visible: true,
    },
    {
      icon: 'settings-outline',
      title: 'Paramètres',
      subtitle: 'Préférences',
      onPress: () => handleMenuPress('/settings'),
      visible: true,
    },
    {
        icon: 'cog-outline',
        title: 'Admin View',
        subtitle: 'Gérer le contenu',
        onPress: handleAdminViewPress,
        highlight: true,
        visible: user.isAdmin,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Ionicons name="create-outline" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </Text>
          </View>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userLocation}>{user.location}</Text>
          
          {!user.isVerified && (
            <TouchableOpacity 
              style={styles.verifyButton}
              onPress={handleVerifyPress}
            >
              <Ionicons name="shield-checkmark-outline" size={16} color="#FF3D00" />
              <Text style={styles.verifyButtonText}>Vérifier le compte</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.totalListings}</Text>
            <Text style={styles.statLabel}>Annonces</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.totalSales}</Text>
            <Text style={styles.statLabel}>Ventes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.rating}</Text>
            <Text style={styles.statLabel}>Note</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.filter(item => item.visible).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                item.highlight && styles.menuItemHighlight,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={() => item.onPress()}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[
                  styles.menuIcon,
                  item.highlight && styles.menuIconHighlight,
                ]}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={22} 
                    color={item.highlight ? '#FFFFFF' : '#000000'} 
                  />
                </View>
                <View style={styles.menuText}>
                  <Text style={[
                    styles.menuTitle,
                    item.highlight && styles.menuTitleHighlight,
                  ]}>
                    {item.title}
                  </Text>
                  <Text style={[
                    styles.menuSubtitle,
                    item.highlight && styles.menuSubtitleHighlight,
                  ]}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <View style={styles.badge} />
                )}
                <Ionicons 
                  name="chevron-forward" 
                  size={18} 
                  color={item.highlight ? '#FFFFFF' : '#CCCCCC'} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  editButton: {
    padding: 4,
  },
  userSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#666666',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  userLocation: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  verifyButtonText: {
    color: '#FF3D00',
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 24,
  },
  menuContainer: {
    marginHorizontal: 24,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemHighlight: {
    backgroundColor: '#FF3D00',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIconHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  menuTitleHighlight: {
    color: '#FFFFFF',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  menuSubtitleHighlight: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3D00',
  },
  logoutContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3D00',
    fontWeight: '500',
  },
});