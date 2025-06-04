import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';

const PartOneQues20 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hasLocation, setHasLocation] = useState('');
  const [locationName, setLocationName] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [imageUri, setImageUri] = useState(null);



  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            setLat(position.coords.latitude);
            setLong(position.coords.longitude);
          },
          error => {
            console.log('Location Error:', error);
            Alert.alert('Error getting location', error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        Alert.alert('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleOpenCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: true,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Camera error');
        } else {
          const uri = response.assets[0].uri;
          setImageUri(uri);
        }
      }
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        Question: 'Do you see any permanent structure nearby that would obstruct the transmission line?',
        Answer: hasLocation,
        Description: hasLocation === 'Yes' ? locationName : '',
        photo: imageUri,
        Lat: lat,
        Long: long,
        Researcher_Mobile: Number(researcherMobile),
        Kml_Name: name,
        Form_No: formNumber,
      };

      await axios.post('https://brandscore.in/api/Part1Question20', payload); // Replace with your IP:PORT
      Alert.alert('Success', 'Data submitted successfully');
      navigation.navigate('PartOneQues21', {
        name,
        researcherMobile,
        formNumber
      });
    } catch (error) {
      console.log('Submit error:', error);
      Alert.alert('Error', 'Failed to submit data');
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  const isNextEnabled = hasLocation === 'No' || (hasLocation === 'Yes' && locationName);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.question}>
          Question 20
        </Text>
        <Text style={styles.question}>
          Do you see any permanent structure nearby that would obstruct the transmission line?
        </Text>
        <Text style={styles.question}>
          (क्या आपको आस-पास कोई ऐसा स्थायी संरचना नजर आ रही है जो ट्रांसमिशन लाइन को बाधित करेगी?)
        </Text>

        <TouchableOpacity
          style={[styles.optionButton, hasLocation === 'No' && styles.selectedOption]}
          onPress={() => setHasLocation('No')}
        >
          <Text style={styles.optionText}>No (नहीं)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, hasLocation === 'Yes' && styles.selectedOption]}
          onPress={() => setHasLocation('Yes')}
        >
          <Text style={styles.optionText}>Yes (हाँ)</Text>
        </TouchableOpacity>

        {hasLocation === 'Yes' && (
          <>
            <TextInput
              placeholder="Describe the structure"
              placeholderTextColor="gray"
              value={locationName}
              multiline
              onChangeText={setLocationName}
              style={styles.input}
            />

            <View style={styles.coordContainer}>
              <Text style={styles.label}>Latitude:</Text>
              <Text style={styles.coord}>{lat || 'Fetching...'}</Text>
            </View>

            <View style={styles.coordContainer}>
              <Text style={styles.label}>Longitude:</Text>
              <Text style={styles.coord}>{long || 'Fetching...'}</Text>
            </View>

            <TouchableOpacity style={styles.cameraButton} onPress={handleOpenCamera}>
              <Text style={styles.cameraButtonText}>📷 Open Camera</Text>
            </TouchableOpacity>

            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.image} />
            )}
          </>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            { opacity: isNextEnabled && !isSubmitting ? 1 : 0.5 },
          ]}
          onPress={handleSubmit}
          disabled={!isNextEnabled || isSubmitting}
        >
          <Text style={styles.nextButtonText}>
            {isSubmitting ? 'Wait...' : 'Next Page'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PartOneQues20;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#ccc',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: '#007bff',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  coordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  coord: {
    fontSize: 16,
    color: '#333',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginTop: 16,
    alignSelf: 'center',
  },
  cameraButton: {
    backgroundColor: '#f0ad4e',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
