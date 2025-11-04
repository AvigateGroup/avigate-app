// src/screens/share/ShareLocationScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '@/store/AuthContext';
import { COLORS } from '@/constants/colors';

interface SharedContact {
  id: string;
  name: string;
  phone: string;
  isActive: boolean;
}

export const ShareLocationScreen = () => {
  const { user } = useAuth();
  const [isSharing, setIsSharing] = useState(false);
  const [sharedContacts, setSharedContacts] = useState<SharedContact[]>([
    { id: '1', name: 'John Doe', phone: '+234 801 234 5678', isActive: true },
    { id: '2', name: 'Jane Smith', phone: '+234 802 345 6789', isActive: false },
  ]);

  const handleToggleSharing = () => {
    if (!isSharing) {
      Alert.alert(
        'Enable Location Sharing',
        'This will allow your selected contacts to see your real-time location.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: () => setIsSharing(true),
          },
        ],
      );
    } else {
      setIsSharing(false);
    }
  };

  const handleToggleContact = (contactId: string) => {
    setSharedContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId
          ? { ...contact, isActive: !contact.isActive }
          : contact,
      ),
    );
  };

  const handleAddContact = () => {
    Alert.alert('Add Contact', 'Contact selection feature coming soon!');
  };

  const handleShareLink = () => {
    Alert.alert(
      'Share Location Link',
      'Generate a temporary link to share your location',
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="location" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.headerTitle}>Share Your Location</Text>
        <Text style={styles.headerSubtitle}>
          Let your friends and family know where you are
        </Text>
      </View>

      {/* Master Toggle */}
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Location Sharing</Text>
            <Text style={styles.toggleSubtitle}>
              {isSharing ? 'Currently sharing' : 'Not sharing location'}
            </Text>
          </View>
          <Switch
            value={isSharing}
            onValueChange={handleToggleSharing}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
            thumbColor={isSharing ? COLORS.primary : COLORS.textMuted}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShareLink}
            activeOpacity={0.7}
          >
            <Icon name="link" size={24} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Share Link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddContact}
            activeOpacity={0.7}
          >
            <Icon name="person-add" size={24} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Shared With Section */}
      {isSharing && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shared With</Text>
          {sharedContacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <View style={styles.contactAvatar}>
                  <Icon name="person" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
              </View>
              <Switch
                value={contact.isActive}
                onValueChange={() => handleToggleContact(contact.id)}
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={contact.isActive ? COLORS.primary : COLORS.textMuted}
              />
            </View>
          ))}
        </View>
      )}

      {/* Info Section */}
      <View style={styles.infoCard}>
        <Icon name="information-circle" size={24} color={COLORS.info} />
        <Text style={styles.infoText}>
          Your location will only be shared with people you choose. You can stop
          sharing at any time.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
  },
  contactCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.infoLight,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    lineHeight: 20,
  },
});