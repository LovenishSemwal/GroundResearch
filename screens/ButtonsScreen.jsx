// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// const ButtonsScreen = ({navigation}) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.mainheading}>Ground Research & RoW Intelligence</Text>
//       <Text style={styles.heading}>Part 1- KM Wise Questionnaire</Text>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate('PartOneQues1')}>
//         <Text style={styles.buttonText}>Select</Text>
//       </TouchableOpacity>

//       <Text style={styles.heading}>Part 2- Village Level Report</Text>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate('PartTwoQues1')}>
//         <Text style={styles.buttonText}>Select</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default ButtonsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//    mainheading: {
//     fontSize: 32,
//     fontWeight: 'black',
//     marginBottom: 32,
//     textAlign: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   button: {
//     backgroundColor: '#28a745',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 24,
//     marginTop: 4,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
// });

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import axios from 'axios';

const ButtonsScreen = ({ navigation, route }) => {
  const { name, researcherMobile } = route.params || {};

  const [loading, setLoading] = useState(false);  // Add loading state

  const exitPress = () => {
    navigation.navigate('Login');
  }

  const handlePress = async () => {

    setLoading(true);  // Start loading

    try {
      const response = await axios.post('https://brandscore.in/api/FormEntry', {
        name,
        researcherMobile,
      });

      const { formNumber } = response.data;
      Alert.alert('Success', 'Data submitted successfully');
      navigation.navigate('PartOneQues1', {
        name,
        researcherMobile,
        formNumber,
      });
    } catch (error) {
      if (error.response) {
        console.error('Server responded with:', error.response.status);
        console.error('Data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }finally {
      setLoading(false); // Stop loading no matter what
    }

  };
  return (
    <ImageBackground
      source={require('../assets/images/rajasthan-map.jpg')}  // adjust the path accordingly
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.mainheading}>Ground Research & RoW Intelligence</Text>
        <Text style={styles.heading}>Part 1- KM Wise Questionnaire & Part 2- Village Level Report</Text>

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#aaa' }]}
          onPress={handlePress}
          disabled={loading} // Disable while loading
        >
          <Text style={styles.buttonText}>{loading ? 'Wait...' : 'Click'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button} onPress={exitPress}>
          <Text style={styles.buttonText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ButtonsScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  mainheading: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 32,
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

