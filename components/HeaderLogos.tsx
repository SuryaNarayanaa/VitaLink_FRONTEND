import { View, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
const psgLogo = require('../assets/images/right-logo.png')
const psgIMSLogo = require('../assets/images/PSG_Institute_of_Medical_Sciences_&_Research_Logo.svg.png')


export const HeaderLogos = () => {
    return (
      <View style={styles.headerContainer}>
        <Image
          style={styles.psgIMSLogo}
          source={psgIMSLogo}
          resizeMode='contain'
        />
        <View style={styles.divider} />
        <Image
          style={styles.psgLogo}
          source={psgLogo}
          resizeMode='contain'
        />
      </View>
    );
  };


const styles = StyleSheet.create(
    {     headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
      },
        divider: {
            width: 2,
            height: 100,
            backgroundColor: '#ddd',
            marginHorizontal: 20,
          },
          psgIMSLogo: {
            width: 100,
            height: 100,
          },
          psgLogo: {
            width: 100,
            height: 100,
          },
    }
);