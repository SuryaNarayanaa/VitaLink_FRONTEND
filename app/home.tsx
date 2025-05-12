import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import CustomButton from '@/components/ui/CustomButton';
import { HeaderLogos } from '@/components/HeaderLogos';
import { COLORS, FONT_FAMILY } from '@/constants/Theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 80;
const CARD_SPACING = 20;

const features = [
  {
    title: "Medication Tracking",
    description: "Never miss a dose with smart reminders",
    lottie: require('@/assets/lottie-icons/medication.json'),
    icon: "medkit-outline",
  },
  {
    title: "INR Monitoring",
    description: "Stay informed with real-time blood analysis.",
    lottie: require('@/assets/lottie-icons/heartbeat.json'),
    icon: "analytics-outline",
  },
  {
    title: "Doctor Connect",
    description: "Instant communication with your care team.",
    lottie: require('@/assets/lottie-icons/communication.json'),
    icon: "chatbubbles-outline",
  },
  {
    title: "Health Reports",
    description: "Comprehensive tracking of your treatment.",
    lottie: require('@/assets/lottie-icons/report.json'),
    icon: "clipboard-outline",
  },
];

export default function Home() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const role = await SecureStore.getItemAsync('userRole');
        setUserRole(role);
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

  const handleNext = () => {
  if (currentIndex < features.length - 1) {
    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
    setCurrentIndex((prevIndex) => prevIndex + 1); // Increment the index safely
  } else {
    navigateToDashboard(); // Navigate to the dashboard if it's the last item
  }
};

const handlePrev = () => {
  if (currentIndex > 0) {
    flatListRef.current?.scrollToIndex({
      index: currentIndex - 1,
      animated: true,
    });
    setCurrentIndex((prevIndex) => prevIndex - 1); // Decrement the index safely
  }
};

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (e: any) => {
    const contentOffset = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + CARD_SPACING));
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <ActivityIndicator size="large" color={COLORS.primary_color} />
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={['#f9fbff', '#fdfcff']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f9fbff" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          <View className='flex-row justify-end items-center px-3 py-4'>
            <TouchableOpacity style={styles.skipButton} onPress={navigateToDashboard}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

          <View className='px-10'>
            <HeaderLogos />
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.appTitle}>
              <Text style={styles.appName}>VitaLink</Text> | Anticoagulant Therapy Management
            </Text>
          </View>

          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={features}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              onMomentumScrollEnd={(e) => {
                const contentOffset = e.nativeEvent.contentOffset.x;
                const index = Math.round(contentOffset / (CARD_WIDTH + CARD_SPACING));
                setCurrentIndex(index);
              }}
              renderItem={({ item }) => (
                <LinearGradient
                  colors={['#ffffff', '#fdfcff']}
                  className="w-screen flex items-center justify-center rounded-lg p-4"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View
                    style={{
                      width: '90%',
                      marginHorizontal: 10,
                      shadowColor: COLORS.primary_color,
                      shadowOffset: { width: 0, height: 10 },
                      shadowOpacity: 0.1,
                      shadowRadius: 20,
                      elevation: 5,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }}
                    className="bg-white py-6 rounded-2xl"
                  >
                    <View style={styles.iconContainer}>
                      <Ionicons name={item.icon as any} size={32} color={COLORS.primary_color} />
                    </View>
                    <View className="items-center mb-5">
                      <LottieView source={item.lottie} autoPlay loop style={{ width: 150, height: 150 }} />
                    </View>
                    <Text style={styles.featureTitle}>{item.title}</Text>
                    <Text style={styles.featureDescription}>{item.description}</Text>
                  </View>
                </LinearGradient>
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.carouselContent}
            />
          </View>

          <View style={styles.pagination}>
            {features.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.paginationDot,
                  index === currentIndex && styles.paginationDotActive
                ]}
              />
            ))}
          </View>

          <View style={styles.navigationControls}>
            <TouchableOpacity 
              onPress={handlePrev} 
              disabled={currentIndex === 0}
              style={[
                styles.navButton,
                currentIndex === 0 && { opacity: 0.5 }
              ]}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={currentIndex === 0 ? '#ccc' : COLORS.primary_color} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleNext} 
              disabled={currentIndex === features.length - 1}
              style={[
                styles.navButton,
                currentIndex === features.length - 1 && { opacity: 0.5 }
              ]}
            >
              <Ionicons 
                name={currentIndex === features.length - 1 ? "checkmark" : "arrow-forward"}
                size={24} 
                color={currentIndex === features.length - 1 ? '#ccc' : COLORS.primary_color} 
              />
            </TouchableOpacity>
          </View>
          
          <View className='flex items-center justify-start'>
            <Text>Copyrights reserved ©</Text>
            <Text>© 2025 PSG College of Technology.</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: COLORS.primary_color,
    fontFamily: FONT_FAMILY.secondary,
    fontSize: 16,
  },
  welcomeContainer: {
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.secondary,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  appName: {
    color: COLORS.primary_color,
    fontFamily: FONT_FAMILY.primary,
    fontWeight: 'bold',
  },
  carouselContainer: {
    position: 'relative',
    height: 380,
    marginBottom: 20,
    width: '100%',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(245, 248, 255)',
  },
  carouselContent: {
    alignItems: 'center',
  },
  featureCard: {
    borderRadius: 20,
    
    shadowColor: COLORS.primary_color,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    position: 'absolute',
    top: -30,
    left: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 1,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: FONT_FAMILY.primary,
    color: COLORS.primary_color,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONT_FAMILY.secondary,
    color: '#666666',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: COLORS.primary_color,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  navButton: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  actionContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 16,
  },
});