// app/terms/index.tsx

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/common/Button';
import { useThemedColors } from '@/hooks/useThemedColors';

export default function TermsScreen() {
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
        <Text style={[styles.title, { color: colors.text }]}>Terms of Service</Text>
        <Text style={[styles.version, { color: colors.textMuted }]}>
          Version 1.0 - Last Updated: November 2025
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Acceptance of Terms</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Welcome to Avigate. These Terms of Service ("Terms") constitute a legally binding agreement 
          between you and Avigate ("we," "us," or "our") regarding your use of the Avigate mobile 
          application and related services (collectively, the "Service").
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          By creating an account, accessing, or using Avigate, you acknowledge that you have read, 
          understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree 
          to these Terms, you must not use our Service.
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You must be at least 13 years old to use Avigate. By using the Service, you represent and 
          warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Description of Service</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Avigate is a mobile navigation application designed to help residents and visitors navigate 
          Nigerian cities using local transportation systems, including:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Keke Napep (tricycles)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Commercial buses (danfo, molue)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Taxis
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Okada (motorcycle taxis)
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Avigate provides:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Real-time route planning and navigation
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Step-by-step directions for using local transport
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Fare estimates and cost guidance
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Information about transportation options and routes
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Location-based services for navigation assistance
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Important: Avigate is NOT an e-hailing or ride-booking platform. We do not arrange, facilitate, 
          or provide transportation services. We are an information and navigation tool that helps you 
          use existing public transportation systems.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>3. User Accounts</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>3.1 Account Creation</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          To use Avigate, you must create an account by providing:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • A valid email address
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Your first and last name
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • A secure password (for local registration)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Optional: Phone number, gender, preferred language
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Alternatively, you may register using Google Sign-In. When using Google Sign-In, you must 
          subsequently provide a phone number for account security purposes.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>3.2 Account Security</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You are responsible for:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Maintaining the confidentiality of your account credentials
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • All activities that occur under your account
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Notifying us immediately of any unauthorized access or security breach
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Using a strong, unique password
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We implement security measures including email verification, OTP verification, device tracking, 
          and password encryption. However, you acknowledge that no system is completely secure, and we 
          cannot guarantee absolute security of your account.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>3.3 Account Information</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You agree to:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Provide accurate, current, and complete information
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Update your information promptly when it changes
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Not impersonate another person or entity
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Not create multiple accounts for fraudulent purposes
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Not share your account with others
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>3.4 Account Termination</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You may delete your account at any time through the app settings. We reserve the right to 
          suspend or terminate your account if you violate these Terms or engage in prohibited activities.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Acceptable Use</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>4.1 Permitted Use</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You may use Avigate for:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Personal, non-commercial navigation and transportation planning
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Finding routes and directions within Nigerian cities
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Getting fare estimates and transportation information
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Exploring new areas using local transportation
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>4.2 Prohibited Activities</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You must NOT:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Use the Service for any illegal purpose or in violation of any laws
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Attempt to gain unauthorized access to our systems or other users' accounts
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Reverse engineer, decompile, or disassemble the app
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Use automated systems (bots, scrapers) to access the Service
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Interfere with or disrupt the Service or servers
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Transmit viruses, malware, or harmful code
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Harass, abuse, or harm other users
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Submit false, misleading, or fraudulent information
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Circumvent or manipulate our advertising systems
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Use the Service for commercial purposes without our written consent
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Collect or store personal data of other users
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Remove, obscure, or alter any legal notices, including copyright or trademark notices
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Free Service and Advertising</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>5.1 Free Service Model</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Avigate is provided free of charge to users. To maintain and improve the Service, we display 
          advertisements within the app. By using Avigate, you acknowledge and accept that:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Advertisements are an integral part of the free service
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Ads may appear in various locations throughout the app
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Ad content is provided by third-party advertisers
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • We may personalize ads based on your usage patterns and preferences
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>5.2 Ad Revenue Model</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Similar to services like Duolingo, advertising revenue helps us:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Keep Avigate free for all users
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Maintain and improve our servers and infrastructure
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Develop new features and expand coverage to more Nigerian cities
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Update transportation information and routes
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Provide customer support
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>5.3 Third-Party Advertisements</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We use third-party advertising partners (such as Google AdMob) to display ads. You acknowledge that:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • We are not responsible for the content of third-party advertisements
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Clicking on ads may redirect you to external websites or apps
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Third-party advertisers may collect data about your device and usage (see Privacy Policy)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • We do not endorse products or services advertised through the app
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Your interactions with advertisers are solely between you and the advertiser
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>5.4 No Ad-Free Option</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Currently, Avigate does not offer a paid, ad-free subscription option. All users access the 
          Service with advertisements. We may introduce premium features or subscriptions in the future, 
          and will notify users of any such changes.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Intellectual Property Rights</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>6.1 Ownership</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Avigate and all its content, features, and functionality are owned by Avigate and are protected 
          by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          This includes, but is not limited to:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • The Avigate app design, layout, and user interface
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Source code, algorithms, and software
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Logos, trademarks, and branding
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Route data, transportation information, and databases
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Content, text, graphics, and images
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>6.2 Limited License</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable 
          license to access and use the Service for personal, non-commercial purposes. This license 
          does not permit you to:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Copy, modify, or distribute the app or its content
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Create derivative works based on the Service
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Use the Service for commercial purposes without authorization
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Extract, scrape, or harvest data from the Service
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>6.3 User Content</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Any feedback, suggestions, or contributions you provide to Avigate may be used by us without 
          compensation or attribution. By submitting such content, you grant us a worldwide, perpetual, 
          irrevocable, royalty-free license to use, modify, reproduce, and incorporate such content into 
          the Service.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>7. Location Services and Accuracy</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>7.1 Location Permission</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Avigate requires access to your device's location services to provide navigation features. 
          You grant us permission to:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Access your real-time GPS location when using the app
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Use location data to provide route planning and directions
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Store location history to improve service quality
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You can revoke location permissions through your device settings, but this will significantly 
          limit app functionality.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>7.2 Information Accuracy</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          While we strive to provide accurate and up-to-date information, we cannot guarantee that:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Routes, directions, or navigation information are always accurate or current
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Fare estimates reflect actual costs (prices may vary)
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Transportation options are always available as indicated
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Real-time information is completely reliable
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Transportation systems, routes, and fares can change without notice. You should verify critical 
          information independently and exercise personal judgment when using the Service.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>7.3 User Responsibility</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You acknowledge that:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • You use Avigate's navigation information at your own risk
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • You are responsible for your safety and making appropriate transportation decisions
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • You should remain alert and aware of your surroundings
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • You must obey all traffic laws and local regulations
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Avigate is a tool to assist navigation, not a substitute for personal judgment
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>8. Disclaimers and Limitations of Liability</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>8.1 Service "As Is"</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR 
          A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY.
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We do not warrant that:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • The Service will be uninterrupted, timely, secure, or error-free
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Information provided will be accurate, reliable, or complete
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Defects will be corrected
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • The Service is free from viruses or harmful components
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>8.2 No Transportation Provider</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          AVIGATE IS NOT A TRANSPORTATION PROVIDER. We do not:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Provide, arrange, or facilitate transportation services
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Employ or control drivers, vehicle operators, or transportation providers
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Guarantee the safety, quality, or availability of any transportation
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Take responsibility for the actions of third-party transportation providers
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Your interactions with transportation providers are solely between you and them. We are not 
          liable for any disputes, injuries, damages, or losses arising from your use of transportation 
          services.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>8.3 Limitation of Liability</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          TO THE FULLEST EXTENT PERMITTED BY LAW, AVIGATE AND ITS AFFILIATES, OFFICERS, DIRECTORS, 
          EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Any indirect, incidental, special, consequential, or punitive damages
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Loss of profits, revenue, data, or business opportunities
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Personal injury, property damage, or death arising from your use of transportation
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Errors, inaccuracies, or omissions in Service information
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Unauthorized access to or alteration of your data
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Third-party conduct or content, including advertisements
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Service interruptions or technical failures
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, 
          AND WHETHER OR NOT WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT OF ONE HUNDRED NAIRA (₦100) OR THE 
          EQUIVALENT IN YOUR LOCAL CURRENCY.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>8.4 Jurisdictional Limitations</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability 
          for incidental or consequential damages. In such jurisdictions, the above limitations may not 
          apply to you, and our liability shall be limited to the greatest extent permitted by law.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>9. Indemnification</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You agree to defend, indemnify, and hold harmless Avigate, its affiliates, officers, directors, 
          employees, agents, licensors, and suppliers from and against any claims, liabilities, damages, 
          losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Your use or misuse of the Service
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Your violation of these Terms
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Your violation of any third-party rights, including intellectual property or privacy rights
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Your interactions with transportation providers
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Any content you submit or transmit through the Service
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Your violation of any applicable laws or regulations
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>10. Changes to Service and Terms</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>10.1 Service Modifications</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We reserve the right to:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Modify, suspend, or discontinue the Service at any time
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Change features, functionality, or availability
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Update app requirements, including minimum supported OS versions
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Add or remove coverage areas
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We may make these changes with or without notice. We shall not be liable to you or any third 
          party for any modification, suspension, or discontinuation of the Service.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>10.2 Terms Updates</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We may revise these Terms at any time by updating this document. When we make material changes, 
          we will:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Update the "Last Updated" date
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Notify you via email or push notification
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Display a prominent notice in the app
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Your continued use of the Service after changes become effective constitutes acceptance of the 
          revised Terms. If you do not agree to the new Terms, you must stop using the Service and delete 
          your account.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>11. Termination</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>11.1 Termination by You</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You may terminate your account at any time by:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Deleting your account through app settings
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Contacting our support team
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Upon termination, your right to use the Service will immediately cease, and we will delete your 
          account data in accordance with our Privacy Policy.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>11.2 Termination by Us</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We may suspend or terminate your account immediately, without notice, if:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • You breach these Terms
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • We suspect fraudulent, abusive, or illegal activity
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Required by law or legal process
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • We decide to discontinue the Service
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>11.3 Effect of Termination</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Upon termination:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • All licenses and rights granted to you will immediately terminate
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • You must cease all use of the Service
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Provisions that should survive termination (including liability limitations, indemnification, 
          and dispute resolution) will remain in effect
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>12. Governing Law and Dispute Resolution</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>12.1 Governing Law</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          These Terms shall be governed by and construed in accordance with the laws of the Federal 
          Republic of Nigeria, without regard to its conflict of law provisions.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>12.2 Dispute Resolution</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          In the event of any dispute, controversy, or claim arising out of or relating to these Terms 
          or the Service:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • You agree to first attempt to resolve the dispute informally by contacting us at 
          helo@avigate.co
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • If informal resolution fails within 30 days, either party may initiate arbitration or 
          court proceedings
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Any legal action must be brought in the courts of Lagos State, Nigeria
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • You consent to the exclusive jurisdiction and venue of such courts
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>12.3 Class Action Waiver</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          To the extent permitted by law, you agree that any dispute resolution proceedings will be 
          conducted only on an individual basis and not in a class, consolidated, or representative action.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>13. General Provisions</Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>13.1 Entire Agreement</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          These Terms, together with our Privacy Policy, constitute the entire agreement between you and 
          Avigate regarding the Service and supersede all prior agreements and understandings.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>13.2 Severability</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions 
          will continue in full force and effect. The invalid provision will be modified to reflect the 
          parties' intention to the greatest extent permitted by law.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>13.3 Waiver</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          No waiver of any term or condition shall be deemed a continuing waiver of such term or any 
          other term. Our failure to enforce any right or provision shall not constitute a waiver of 
          such right or provision.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>13.4 Assignment</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You may not assign or transfer these Terms or your rights hereunder without our prior written 
          consent. We may assign these Terms at any time without restriction, including to any affiliate 
          or in connection with a merger, acquisition, or sale of assets.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>13.5 Force Majeure</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          We shall not be liable for any failure or delay in performance due to circumstances beyond our 
          reasonable control, including acts of God, war, terrorism, riots, pandemic, internet failures, 
          or governmental actions.
        </Text>

        <Text style={[styles.subsectionTitle, { color: colors.text }]}>13.6 Language</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          These Terms are written in English. Any translations provided are for convenience only. In the 
          event of any conflict between the English version and a translation, the English version shall 
          prevail.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>14. Contact Information</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          For questions, concerns, or notices regarding these Terms, please contact us:
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Email: hello@avigate.co
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Support: hello@avigate.co
        </Text>
        <Text style={[styles.bulletText, { color: colors.text }]}>
          • Address: Port Harcourt
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>15. Acknowledgment and Consent</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          BY CREATING AN ACCOUNT, ACCESSING, OR USING AVIGATE, YOU ACKNOWLEDGE THAT YOU HAVE READ, 
          UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE AND OUR PRIVACY POLICY.
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          You represent that you have the legal capacity to enter into these Terms and that you are 
          at least 13 years old.
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          If you do not agree to these Terms, you must not use the Service.
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