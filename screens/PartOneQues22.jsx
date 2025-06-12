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
import { useFormData } from './FormDataContext';

const PartOneQues22 = ({ navigation, route }) => {
  const { selectedLine, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  const [railwayLine, setRailwayLine] = useState(formData.part1question22.railwayLine || '');
  const [location, setLocation] = useState({
    latitude: formData.part1question22.latitude,
    longitude: formData.part1question22.longitude,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (railwayLine === 'Yes') {
      updateFormData('part1question22', { latitude: location.latitude, longitude: location.longitude });
    } else {
      // Clear lat/long in context when railwayLine is No
      updateFormData('part1question22', { latitude: null, longitude: null });
    }
  }, [location, railwayLine]);


  useEffect(() => {
    updateFormData('part1question22', { latitude: location.latitude, longitude: location.longitude });
  }, [location]);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
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
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
      },
      (error) => {
        console.warn(error.code, error.message);
        Alert.alert('Error', 'Unable to get location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
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
      Kml_Name: selectedLine,
      Form_No: formNumber,
      Dist: selectedDistrict,
      State: selectedState,
      Village_Name: selectedVillage,
      Shape_Id: shapeId,
    };

    try {
      let response;

      if (formData.part1question22?.id) {
        // We have an ID, so update existing record
        response = await axios.post(
          `https://adfirst.in/api/Part1Question22/update/${formData.part1question22.id}`,
          { ...payload, Id: formData.part1question22.id } // make sure Id is included in body
        );
      } else {
        // No ID, create new record
        response = await axios.post('https://adfirst.in/api/Part1Question22', payload);
      }

      // Save returned id in context (update or new)
      const returnedId = response.data.data?.Id ?? response.data.id ?? response.data.Id;
      if (returnedId) {
        updateFormData('part1question22', { id: returnedId });
      }

      // Alert.alert('Success', 'Data submitted successfully');
      navigation.navigate('PartOneQues23', {
        selectedLine,
        researcherMobile,
        formNumber,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId
      });
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert('Error', 'Failed to submit data');
    } finally {
      setIsSubmitting(false);
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
        onPress={() => {
          setRailwayLine('No');
          setLocation({ latitude: null, longitude: null }); // clear location when No selected
        }}
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
          <Text style={styles.geoValue}>Latitude: {location.latitude ?? 'Loading...'}</Text>
          <Text style={styles.geoValue}>Longitude: {location.longitude ?? 'Loading...'}</Text>
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

// styles remain unchanged
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
