// src/components/common/CountryPhonePicker.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/constants/colors';

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

interface CountryPhonePickerProps {
  countryCode: string;
  phoneNumber: string;
  country: string;
  onCountryChange: (dialCode: string, country: string) => void;
  onPhoneChange: (phone: string) => void;
  error?: string;
}

// Popular countries list with flags
const COUNTRIES: Country[] = [
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'Ghana', code: 'GH', dialCode: '+233', flag: '🇬🇭' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦' },
];

export const CountryPhonePicker: React.FC<CountryPhonePickerProps> = ({
  countryCode,
  phoneNumber,
  country,
  onCountryChange,
  onPhoneChange,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCountry = COUNTRIES.find(c => c.dialCode === countryCode) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.dialCode.includes(searchQuery),
  );

  const handleCountrySelect = (selectedCountry: Country) => {
    onCountryChange(selectedCountry.dialCode, selectedCountry.name);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone Number</Text>

      <View style={styles.inputContainer}>
        {/* Country Selector */}
        <TouchableOpacity style={styles.countrySelector} onPress={() => setModalVisible(true)}>
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.dialCode}>{selectedCountry.dialCode}</Text>
          <Icon name="chevron-down" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Phone Number Input */}
        <TextInput
          style={styles.phoneInput}
          placeholder="9076434333"
          value={phoneNumber}
          onChangeText={onPhoneChange}
          keyboardType="phone-pad"
          maxLength={10}
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Country Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search country..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            {/* Country List */}
            <FlatList
              data={filteredCountries}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    item.dialCode === countryCode && styles.countryItemSelected,
                  ]}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryDialCode}>{item.dialCode}</Text>
                  {item.dialCode === countryCode && (
                    <Icon name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    gap: 6,
  },
  flag: {
    fontSize: 24,
  },
  dialCode: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 12,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  countryItemSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  countryDialCode: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginRight: 8,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
  },
});
