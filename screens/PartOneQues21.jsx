import React, { useEffect, useState } from 'react';
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

const PartOneQues21 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [roadCrossing, setRoadCrossing] = useState('');
  const [roadType, setRoadType] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const roadTypes = [
    'National Highway (राष्ट्रीय राजमार्ग )',
    'State Highway (राज्य राजमार्ग)',
    'MDR (MDR – मुख्य जिला मार्ग)',
    'Other road (अन्य सड़क)',
  ];

  const isNextEnabled = roadCrossing === 'No' || (roadCrossing === 'Yes' && roadType);

  const getLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const fetchLocation = async () => {
    const hasPermission = await getLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.log('Geolocation error:', error);
        Alert.alert('Location Error', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      const dataToSend = {
        Question: 'Road Crossing',
        Answer: roadCrossing,
        Lat: latitude,
        Long: longitude,
        Type_Of_Road: roadCrossing === 'Yes' ? roadType : null,
        Researcher_Mobile: Number(researcherMobile),
        Kml_Name: name,
        Form_No: formNumber,
      };

      await axios.post('https://brandscore.in/api/Part1Question21', dataToSend);
      Alert.alert('Success', 'Data submitted successfully');
      navigation.navigate('PartOneQues22', {
        name,
        researcherMobile,
        formNumber
      });
    } catch (error) {
      console.error('Failed to submit data:', error);
      Alert.alert('Submission Failed', 'Unable to submit data to the server');
    }finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.question}>Question 21</Text>
      <Text style={styles.question}>Road crossing</Text>
      <Text style={styles.question}>(सड़क क्रॉसिंग)</Text>

      {/* Yes/No */}
      <TouchableOpacity
        style={[styles.optionButton, roadCrossing === 'No' && styles.selectedOption]}
        onPress={() => {
          setRoadCrossing('No');
          setRoadType('');
        }}
      >
        <Text style={[styles.optionText, roadCrossing === 'No' && styles.selectedText]}>
          No (नहीं)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionButton, roadCrossing === 'Yes' && styles.selectedOption]}
        onPress={() => setRoadCrossing('Yes')}
      >
        <Text style={[styles.optionText, roadCrossing === 'Yes' && styles.selectedText]}>
          Yes (हाँ)
        </Text>
      </TouchableOpacity>

      {roadCrossing === 'Yes' && (
        <>
          <View style={styles.geoContainer}>
            <Text style={styles.geoLabel}>Geo coordinates:</Text>
            <Text style={styles.geoValue}>
              Latitude: {latitude ?? 'Fetching...'}
            </Text>
            <Text style={styles.geoValue}>              
              Longitude: {longitude ?? 'Fetching...'}
            </Text>
          </View>

          <Text style={styles.subQuestion}>Type of Road</Text>
          <Text style={styles.subQuestion}>(सड़क का प्रकार)</Text>
          {roadTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.optionButton, roadType === type && styles.selectedOption]}
              onPress={() => setRoadType(type)}
            >
              <Text style={[styles.optionText, roadType === type && styles.selectedText]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </>
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

export default PartOneQues21;

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
  subQuestion: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
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