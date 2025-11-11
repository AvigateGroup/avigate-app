// app/privacy/index.tsx

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/common/Button';
import { useThemedColors } from '@/hooks/useThemedColors';

export default function PrivacyScreen() {
  const router = useRouter();
  const colors = useThemedColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Button
          title="Back"
          onPress={() => router.back()}
          variant="outline"
          leftIcon="arrow-back"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        <Text style={[styles.title, { color: colors.text }]}>Privacy Policy</Text>
        <Text style={[styles.version, { color: colors.textMuted }]}>
          Version 1.0 - Last Updated: November 2025
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Introduction</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Welcome to Avigate ("we," "our," or "us"). Avigate is a mobile application designed to help 
          residents and visitors navigate Nigerian cities using local transportation systems including 
          Keke Napep, commercial buses, taxis, and okada. We are committed to protecting your privacy 
          and ensuring transparency about how we collect, use, and safeguard your personal information.
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          This Privacy Policy explains what information we collect, how we use it, who we share it with, 
          and your rights regarding your personal data. By using Avigate, you agree to the collection 
          and use of information in accordance with this policy.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Information We Collect</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>2.1 Information You Provide</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          When you create an account or use our services, we collect:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Personal identification: First name, last name, email address
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Contact information: Phone number (optional for local registration, required for Google sign-up users)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Demographic information: Sex/gender, country, preferred language
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Authentication credentials: Email and encrypted password (for local registration) or Google account information (for Google Sign-In)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Profile picture: If you choose to upload one
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>2.2 Automatically Collected Information</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          When you use Avigate, we automatically collect:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Device information: Device model, operating system, unique device identifiers, mobile network information
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Location data: Real-time GPS location when you use navigation features, search for routes, or request directions (only when app is in use and with your permission)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Usage data: App features accessed, search queries, routes viewed, interaction with advertisements, session duration
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Device tokens: Firebase Cloud Messaging (FCM) tokens for push notifications
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • IP address and general location information for security and service improvement
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>2.3 Information from Third Parties</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          If you sign in using Google Sign-In, we receive:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Your Google account email address
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Your name (first and last)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Your Google profile picture (if available)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Your Google account ID
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>3. How We Use Your Information</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We use the collected information for the following purposes:
        </Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>3.1 Service Provision</Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Create and manage your account
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Provide personalized route planning and navigation services
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Display real-time transportation information and fare estimates
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Offer step-by-step directions for local transportation
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Save your favorite routes and frequently visited locations
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>3.2 Communication</Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Send account verification emails and OTP codes
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Provide customer support and respond to your inquiries
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Send push notifications about service updates, new features, or transportation alerts (with your consent)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Communicate important changes to our Terms or Privacy Policy
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>3.3 Advertising</Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Display relevant advertisements to support our free service
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Personalize ad content based on your usage patterns and preferences
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Measure ad performance and effectiveness
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Work with advertising partners to deliver targeted advertisements
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>3.4 Service Improvement</Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Analyze usage patterns to improve app functionality
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Develop new features based on user needs
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Enhance route accuracy and transportation information
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Optimize app performance and user experience
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>3.5 Security and Fraud Prevention</Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Verify user identity through email and phone verification
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Detect and prevent fraudulent activities
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Monitor device security and unauthorized access attempts
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Comply with legal obligations and enforce our Terms of Service
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Advertising and Third-Party Services</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Avigate is a free service supported by advertising revenue. We work with third-party advertising 
          partners to display ads within the app. These partners may collect information about your device 
          and usage to serve relevant advertisements.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>4.1 Advertising Partners</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We may use the following types of advertising services:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Google AdMob: For in-app advertising
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Google Analytics: For usage analytics and advertising optimization
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Other advertising networks as we expand our services
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>4.2 Information Shared with Advertisers</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Advertising partners may receive:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Anonymous device identifiers (Advertising ID)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • General demographic information (age range, gender, location)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Usage patterns and interests (anonymized)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Ad interaction data (views, clicks)
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>4.3 Controlling Personalized Ads</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You can limit personalized advertising through:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Android: Settings → Google → Ads → Opt out of Ads Personalization
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • iOS: Settings → Privacy → Tracking → Limit Ad Tracking
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Note: Opting out will not remove ads but may make them less relevant to you.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>5. How We Share Your Information</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We do not sell your personal information. We share your information only in the following circumstances:
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>5.1 Service Providers</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We share information with trusted third-party service providers who assist us in:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Cloud hosting and data storage
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Email delivery services
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Push notification services (Firebase Cloud Messaging)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Analytics and app performance monitoring
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Customer support tools
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>5.2 Legal Requirements</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We may disclose your information if required to:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Comply with applicable laws, regulations, or legal processes
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Respond to lawful requests from government authorities
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Protect the rights, property, or safety of Avigate, our users, or others
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Enforce our Terms of Service
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Investigate fraud or security issues
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>5.3 Business Transfers</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          In the event of a merger, acquisition, or sale of assets, your information may be transferred 
          to the new entity. We will notify you via email and/or prominent notice in the app before 
          your information becomes subject to a different privacy policy.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Data Storage and Security</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>6.1 Data Storage</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Your data is stored on secure servers. We use industry-standard security measures including:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Encrypted data transmission (HTTPS/TLS)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Encrypted password storage using bcrypt hashing
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Secure database with access controls
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Regular security audits and updates
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Device-level security through OTP verification
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>6.2 Data Retention</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We retain your information for as long as necessary to:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Provide our services to you
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Comply with legal obligations (typically 7 years for financial records)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Resolve disputes and enforce agreements
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Maintain security and prevent fraud
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          When you delete your account, we will delete or anonymize your personal information within 
          30 days, except where we are required to retain it for legal purposes.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>6.3 Security Measures</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          While we implement strong security measures, no system is completely secure. We cannot 
          guarantee absolute security of your information. You are responsible for maintaining the 
          confidentiality of your account credentials.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>7. Your Rights and Choices</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>7.1 Access and Update</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You have the right to:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Access your personal information through the app's Profile section
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Update your account information at any time
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Change your password and security settings
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Update your communication preferences
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>7.2 Data Portability</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You can request a copy of your data by contacting us at hello@avigate.co. We will provide 
          your data in a commonly used, machine-readable format within 30 days.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>7.3 Account Deletion</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You can delete your account at any time through:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • App Settings → Profile → Delete Account
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Contacting our support team at hello@avigate.co
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Upon deletion, we will remove your personal information except where retention is required 
          by law or for legitimate business purposes.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>7.4 Location Permissions</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You can control location access through your device settings:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Android: Settings → Apps → Avigate → Permissions → Location
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • iOS: Settings → Privacy → Location Services → Avigate
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Note: Disabling location access will limit core navigation features.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>7.5 Marketing Communications</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You can opt out of promotional emails by:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Clicking "Unsubscribe" in any promotional email
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Adjusting notification settings in the app
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Note: You will still receive essential service-related communications (account verification, 
          security alerts, policy changes).
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>8. Children's Privacy</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Avigate is not intended for children under 13 years of age. We do not knowingly collect 
          personal information from children under 13. If we discover that we have collected information 
          from a child under 13, we will promptly delete such information.
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          If you are a parent or guardian and believe your child has provided us with personal information, 
          please contact us at helo@avigate.co.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>9. International Users</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Avigate is designed primarily for users in Nigeria. If you access our services from outside 
          Nigeria, your information may be transferred to, stored, and processed in Nigeria. By using 
          our services, you consent to this transfer.
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We comply with the Nigeria Data Protection Regulation (NDPR) 2019 and applicable data 
          protection laws.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>10. Changes to This Privacy Policy</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We may update this Privacy Policy periodically to reflect changes in our practices or for 
          legal, operational, or regulatory reasons. When we make changes, we will:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Update the "Last Updated" date at the top of this policy
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Notify you via email or push notification for material changes
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Display a prominent notice in the app
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Your continued use of Avigate after changes become effective constitutes acceptance of the 
          revised policy. We encourage you to review this policy periodically.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>11. Contact Us</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, 
          please contact us:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Email: helo@avigate.co
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Support: hello@avigate.co
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Address: Port Harcourt
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          For data protection inquiries specific to NDPR compliance, you may also contact the National 
          Information Technology Development Agency (NITDA).
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>12. Consent</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          By creating an account and using Avigate, you acknowledge that you have read, understood, 
          and agree to this Privacy Policy. You consent to the collection, use, and sharing of your 
          information as described herein.
        </Text>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  version: {
    fontSize: 12,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
    textAlign: 'justify',
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
    paddingLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});