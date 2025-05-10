import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/ui/CustomButton';
import { HeaderLogos } from '@/components/HeaderLogos';
import { COLORS, FONT_FAMILY } from '@/constants/Theme';

const { width } = Dimensions.get('window');

export default function Home() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const role = await SecureStore.getItemAsync('userRole');
        const name = await SecureStore.getItemAsync('userName') || 'User';
        setUserRole(role);
        setUserName(name);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user info", error);
        setLoading(false);
      }
    };
    getUserInfo();
  }, []);

  const navigateToDashboard = () => {
    if (userRole === 'doctor') {
      router.replace('/doctor');
    } else if (userRole === 'patient') {
      router.replace('/patient/Profile');
    }
  };

  const features = [
    {
      title: "Medication Tracking",
      description: "Track medication schedule and dosage",
      icon: "medkit-outline"
    },
    {
      title: "INR Monitoring",
      description: "Monitor INR levels for effective treatment",
      icon: "analytics-outline"
    },
    {
      title: "Doctor Communication",
      description: "Direct channel to healthcare providers",
      icon: "chatbubbles-outline"
    },
    {
      title: "Health Reports",
      description: "Comprehensive treatment history and reporting",
      icon: "clipboard-outline"
    }
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <ActivityIndicator size="large" color={COLORS.primary_color} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.headerLogoContainer}>
            <HeaderLogos />
          </View>
          
          <View style={styles.welcomeContainer}>
            <Text style={styles.greeting}>Welcome, {userName}</Text>
            <Text style={styles.appTitle}>
              <Text style={styles.appName}>VitaLink</Text> | Anticoagulant Therapy Management
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <Ionicons 
                    name={feature.icon as any} 
                    size={24} 
                    color={COLORS.primary_color} 
                    style={styles.featureIcon}
                  />
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.actionContainer}>
            <CustomButton 
              title={`Go to ${userRole === 'doctor' ? 'Doctor' : 'Patient'} Dashboard`}
              onPress={navigateToDashboard}
              bgVariant="primary"
              textVariant="secondary"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerLogoContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  welcomeContainer: {
    paddingTop: 12,
    paddingBottom: 32,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontFamily: FONT_FAMILY.secondary,
    color: '#333333',
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.secondary,
    color: '#666666',
    textAlign: 'center',
  },
  appName: {
    color: COLORS.primary_color,
    fontFamily: FONT_FAMILY.primary,
    fontWeight: 'bold',
  },
  featuresContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.primary,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 56) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  featureIcon: {
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: FONT_FAMILY.primary,
    color: '#333333',
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.secondary,
    color: '#666666',
  },
  actionContainer: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 16,
  },
});
