import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

const PartOneQues22 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};
      const [isSubmitting, setIsSubmitting] = useState(false);
  const [railwayLine, setRailwayLine] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required.');
        }
      } else {
        getCurrentLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn(error.code, error.message);
        Alert.alert('Error', 'Unable to get location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const handleNext = async () => {
    setIsSubmitting(true);
    const payload = {
      Question: 'Railway line',
      Answer: railwayLine,
      Lat: location.latitude,
      Long: location.longitude,
      Researcher_Mobile: Number(researcherMobile),
      Kml_Name: name,
      Form_No: formNumber,
    };

    try {
      await axios.post('https://brandscore.in/api/Part1Question22', payload);
      Alert.alert('Success', 'Data submitted successfully');
      navigation.navigate('PartOneQues23', {
        name,
        researcherMobile,
        formNumber
      });
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert('Error', 'Failed to submit data');
    }finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  const isNextEnabled = railwayLine === 'No' || railwayLine === 'Yes';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.question}>Question 22</Text>
      <Text style={styles.question}>Railway line</Text>
      <Text style={styles.question}>(रेलवे लाइन)</Text>

      <TouchableOpacity
        style={[styles.optionButton, railwayLine === 'No' && styles.selectedOption]}
        onPress={() => setRailwayLine('No')}
      >
        <Text style={[styles.optionText, railwayLine === 'No' && styles.selectedText]}>
          No (नहीं)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionButton, railwayLine === 'Yes' && styles.selectedOption]}
        onPress={() => setRailwayLine('Yes')}
      >
        <Text style={[styles.optionText, railwayLine === 'Yes' && styles.selectedText]}>
          Yes (हाँ)
        </Text>
      </TouchableOpacity>

      {railwayLine === 'Yes' && (
        <View style={styles.geoContainer}>
          <Text style={styles.geoLabel}>Geo coordinates:</Text>
          <Text style={styles.geoValue}>
            Latitude: {location.latitude ?? 'Loading...'}
          </Text>
          <Text style={styles.geoValue}>
            Longitude: {location.longitude ?? 'Loading...'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.nextButton, { opacity: isNextEnabled ? 1 : 0.5 }]}
        onPress={handleNext}
        disabled={!isNextEnabled || isSubmitting}
      >
        <Text style={styles.nextButtonText}>{isSubmitting ? 'Wait...' : 'Next Page'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PartOneQues22;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#eee',
    paddingVertical: 14,
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 20,
  },
  selectedOption: {
    backgroundColor: '#007bff',
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  geoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  geoLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  geoValue: {
    fontSize: 16,
    color: '#555',
  },
  nextButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 30,
    marginHorizontal: 50,
  },
  nextButtonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
});
