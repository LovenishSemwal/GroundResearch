import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import { useFormData } from './FormDataContext'; // import context hook

const PartOneQues2 = ({ navigation, route }) => {
  const { selectedLine, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({
    latitude: formData.part1question2?.latitude || null,
    longitude: formData.part1question2?.longitude || null,
  });

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This app needs to access your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS
    }
  };

  useEffect(() => {
    const getCurrentLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Location permission is required to get current location.');
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const latStr = latitude.toString();
          const lonStr = longitude.toString();

          setLocation({ latitude: latStr, longitude: lonStr });

          // Update formData context
          updateFormData('part1question2', {
            latitude: latStr,
            longitude: lonStr,
          });
        },
        error => {
          Alert.alert('Error', 'Unable to fetch location: ' + error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    getCurrentLocation();
  }, []);

  const handleNext = async () => {
    if (!location.latitude || !location.longitude) {
      Alert.alert('Error', 'Location not available yet.');
      return;
    }

    setLoading(true);

    const payload = {
      question: 'Latitude and Longitude',
      latitude: location.latitude,
      longitude: location.longitude,
      kmlName: selectedLine,
      researcherMobile: Number(researcherMobile),
      State:selectedState,
      Dist:selectedDistrict,
      VillageName:selectedVillage,
      ShapeId:shapeId,
      FormNo: String(formNumber),
    };

    try {
      const pageKey = 'part1question2';
      const existingId = formData[pageKey]?.id;

      let response;
      if (existingId) {
        // Update existing record via POST update
        response = await axios.post(
          `https://adfirst.in/api/Part1Question2/update/${existingId}`,
          { ...payload, id: existingId },
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Create new record via POST create
        response = await axios.post(
          'https://adfirst.in/api/Part1Question2',
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (response.data.success) {
        console.log('Response:', response.data.data);

        // Update context with id and coordinates
        updateFormData(pageKey, {
          id: response.data.data.id,
          latitude: location.latitude,
          longitude: location.longitude,
        });

        // Alert.alert('Done', 'Data Submitted');
        navigation.navigate('PartOneQues3', { 
          selectedLine,
          researcherMobile,
          formNumber,
          selectedState,
          selectedDistrict,
          selectedVillage,
          shapeId
         });
      } else {
        Alert.alert('Error', response.data.message || 'Failed to submit data.');
      }
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      Alert.alert('API Error', 'Something went wrong while submitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Question 2</Text>
      <Text style={styles.title}>Latitude and Longitude</Text>
      <Text style={styles.title}>(अक्षांश या देशांतर)</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Latitude (अक्षांश):</Text>
        <Text style={styles.value}>{location.latitude ?? 'Fetching...'}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Longitude (देशांतर):</Text>
        <Text style={styles.value}>{location.longitude ?? 'Fetching...'}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#ccc' }]}
        onPress={handleNext}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Wait...' : 'Next Page'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PartOneQues2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  infoBox: {
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
