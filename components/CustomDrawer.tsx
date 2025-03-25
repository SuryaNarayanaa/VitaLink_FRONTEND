import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const router = useRouter();

  const {top,bottom} = useSafeAreaInsets()

  return (
    <View style={styles.menu}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop:top }}
      >
        <DrawerItemList {...props} />
        <DrawerItem
          label="Go Home"
          onPress={() => router.replace('/')}
          labelStyle={styles.drawerItemLabel}
        />
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Dummy Doctor or Patient</Text>
        <Text style={styles.footerSubText}>Position</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    borderBottomEndRadius:0,
    marginTop:100
  },
  drawerItemLabel: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  footerSubText: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});
