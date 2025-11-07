// src/screens/share/ShareLocationScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '@/store/AuthContext';
import { useThemedColors } from '@/hooks/useThemedColors';
import { shareStyles } from '@/styles/features';

interface SharedContact {
  id: string;
  name: string;
  phone: string;
  isActive: boolean;
}

export const ShareLocationScreen = () => {
  const { user } = useAuth();
  const [isSharing, setIsSharing] = useState(false);
  const colors = useThemedColors();
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
    setSharedContacts(prev =>
      prev.map(contact =>
        contact.id === contactId ? { ...contact, isActive: !contact.isActive } : contact,
      ),
    );
  };

  const handleAddContact = () => {
    Alert.alert('Add Contact', 'Contact selection feature coming soon!');
  };

  const handleShareLink = () => {
    Alert.alert('Share Location Link', 'Generate a temporary link to share your location');
  };

  return (
    <ScrollView style={[shareStyles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={[shareStyles.header, { backgroundColor: colors.white }]}>
        <View style={[shareStyles.iconContainer, { backgroundColor: colors.primaryLight }]}>
          <Icon name="location" size={40} color={colors.primary} />
        </View>
        <Text style={[shareStyles.headerTitle, { color: colors.text }]}>Share Your Location</Text>
        <Text style={[shareStyles.headerSubtitle, { color: colors.textMuted }]}>
          Let your friends and family know where you are
        </Text>
      </View>

      {/* Master Toggle */}
      <View style={[shareStyles.card, { backgroundColor: colors.white }]}>
        <View style={shareStyles.toggleRow}>
          <View style={shareStyles.toggleInfo}>
            <Text style={[shareStyles.toggleTitle, { color: colors.text }]}>Location Sharing</Text>
            <Text style={[shareStyles.toggleSubtitle, { color: colors.textMuted }]}>
              {isSharing ? 'Currently sharing' : 'Not sharing location'}
            </Text>
          </View>
          <Switch
            value={isSharing}
            onValueChange={handleToggleSharing}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isSharing ? colors.primary : colors.textMuted}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={shareStyles.section}>
        <Text style={[shareStyles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={shareStyles.actionButtons}>
          <TouchableOpacity
            style={[shareStyles.actionButton, { backgroundColor: colors.white }]}
            onPress={handleShareLink}
            activeOpacity={0.7}
          >
            <Icon name="link" size={24} color={colors.primary} />
            <Text style={[shareStyles.actionButtonText, { color: colors.text }]}>Share Link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[shareStyles.actionButton, { backgroundColor: colors.white }]}
            onPress={handleAddContact}
            activeOpacity={0.7}
          >
            <Icon name="person-add" size={24} color={colors.primary} />
            <Text style={[shareStyles.actionButtonText, { color: colors.text }]}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Shared With Section */}
      {isSharing && (
        <View style={shareStyles.section}>
          <Text style={[shareStyles.sectionTitle, { color: colors.text }]}>Shared With</Text>
          {sharedContacts.map(contact => (
            <View
              key={contact.id}
              style={[shareStyles.contactCard, { backgroundColor: colors.white }]}
            >
              <View style={shareStyles.contactInfo}>
                <View style={[shareStyles.contactAvatar, { backgroundColor: colors.primaryLight }]}>
                  <Icon name="person" size={24} color={colors.primary} />
                </View>
                <View style={shareStyles.contactDetails}>
                  <Text style={[shareStyles.contactName, { color: colors.text }]}>
                    {contact.name}
                  </Text>
                  <Text style={[shareStyles.contactPhone, { color: colors.textMuted }]}>
                    {contact.phone}
                  </Text>
                </View>
              </View>
              <Switch
                value={contact.isActive}
                onValueChange={() => handleToggleContact(contact.id)}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={contact.isActive ? colors.primary : colors.textMuted}
              />
            </View>
          ))}
        </View>
      )}

      {/* Info Section */}
      <View style={[shareStyles.infoCard, { backgroundColor: colors.infoLight }]}>
        <Icon name="information-circle" size={24} color={colors.info} />
        <Text style={[shareStyles.infoText, { color: colors.text }]}>
          Your location will only be shared with people you choose. You can stop sharing at any
          time.
        </Text>
      </View>
    </ScrollView>
  );
};
