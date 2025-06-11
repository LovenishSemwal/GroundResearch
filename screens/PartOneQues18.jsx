import React, { useState, useEffect } from 'react';
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
import { useFormData } from './FormDataContext';

const PartOneQues18 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  // Initialize local states with context data or defaults
  const initialHasLocation = formData.part1question18?.hasLocation || '';
  const initialLocationName = formData.part1question18?.locationName || '';
  const initialLat = formData.part1question18?.lat || '';
  const initialLong = formData.part1question18?.long || '';
  const initialImageUri = formData.part1question18?.imageUri || null;
  const [recordId, setRecordId] = useState(formData.part1question18?.id || null);

  const [hasLocation, setHasLocation] = useState(initialHasLocation);
  const [locationName, setLocationName] = useState(initialLocationName);
  const [lat, setLat] = useState(initialLat);
  const [long, setLong] = useState(initialLong);
  const [imageUri, setImageUri] = useState(initialImageUri);
  const [loading, setLoading] = useState(false);

  // Request location and update lat/long
  const getLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            setLat(position.coords.latitude.toString());
            setLong(position.coords.longitude.toString());
          },
          error => {
            Alert.alert('Location Error', error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        Alert.alert('Permission Denied', 'Location permission is required.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to get location permission.');
    }
  };

  // Sync local state to context on any change
  useEffect(() => {
    setRecordId(formData.part1question18?.id || null);
  }, [formData.part1question18?.id]);

  // When hasLocation is 'Yes', fetch location automatically
  useEffect(() => {
    if (hasLocation === 'Yes') {
      getLocation();
    } else {
      setLocationName('');
      setLat('');
      setLong('');
      setImageUri(null);
    }
  }, [hasLocation]);

  const handleOpenCamera = () => {
    launchCamera(
      { mediaType: 'photo', cameraType: 'back', saveToPhotos: true },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Camera Error', response.errorMessage || 'Error opening camera');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri);
        }
      }
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    const form = new FormData();

    form.append('Question', 'Can you see any transmission line?');
    form.append('Answer', hasLocation);
    form.append('Transmission_Line_Name', hasLocation === 'Yes' ? locationName : null);
    form.append('Researcher_Mobile', String(researcherMobile));
    form.append('Kml_Name', name);
    form.append('Form_No', formNumber);
    form.append('State', selectedState);
    form.append('District', selectedDistrict);
    form.append('VillageName', selectedVillage);
    form.append('Shapeid', shapeId);


    form.append('Lat', hasLocation === 'Yes' ? String(lat) : '0');
    form.append('Long', hasLocation === 'Yes' ? String(long) : '0');

    // Image logic
    if (hasLocation === 'Yes' && imageUri) {
      const uriParts = imageUri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      const fileType = fileName.split('.').pop();

      form.append('ImagePh', {
        uri: imageUri,
        name: fileName,
        type: `image/${fileType}`,
      });
    } else {
      form.append('ImagePh', '');
    }

    try {
      let response;

      if (recordId) {
        // Update existing record
        response = await axios.post(
          `https://adfirst.in/api/Part1Question18/${recordId}`,
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        // Create new record
        response = await axios.post(
          'https://adfirst.in/api/Part1Question18',
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        const newId = response?.data?.data?.id || response?.data?.data?.Id;
        if (newId) {
          setRecordId(newId);
          updateFormData('part1question18', { id: newId });
        }
      }

      // After update or create, update context state
      const idToUse = recordId || response?.data?.data?.id || response?.data?.data?.Id;
      if (idToUse) {
        setRecordId(idToUse);
        updateFormData('part1question18', {
          id: idToUse,
          hasLocation,
          locationName,
          lat: hasLocation === 'Yes' ? lat : '',
          long: hasLocation === 'Yes' ? long : '',
          imageUri: imageUri || null,
        });
      }

      // Alert.alert('Success', recordId ? 'Record updated!' : 'Record created!');
      navigation.navigate('PartOneQues19', {
        name,
        researcherMobile,
        formNumber,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId
      });
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit data.');
    } finally {
      setLoading(false);
    }
  };
  // Enable submit if No selected or if Yes selected and locationName filled
  const isNextEnabled = hasLocation === 'No' || (hasLocation === 'Yes' && locationName.trim() !== '');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.question}>Question 18</Text>
        <Text style={styles.question}>Can you see any transmission line?</Text>
        <Text style={styles.question}>(क्या आपको कोई ट्रांसमिशन लाइन नजर आ रही है?)</Text>

        <TouchableOpacity
          style={[styles.optionButton, hasLocation === 'No' && styles.selectedOption]}
          onPress={() => setHasLocation('No')}
        >
          <Text style={[styles.optionText, hasLocation === 'No' && { color: '#fff' }]}>
            No (नहीं)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, hasLocation === 'Yes' && styles.selectedOption]}
          onPress={() => setHasLocation('Yes')}
        >
          <Text style={[styles.optionText, hasLocation === 'Yes' && { color: '#fff' }]}>
            Yes (हाँ)
          </Text>
        </TouchableOpacity>

        {hasLocation === 'Yes' && (
          <>
            <TextInput
              placeholder="Enter Transmission name"
              placeholderTextColor="gray"
              value={locationName}
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

            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
          </>
        )}

        <TouchableOpacity
          style={[styles.nextButton, { opacity: isNextEnabled && !loading ? 1 : 0.5 }]}
          onPress={handleSubmit}
          disabled={!isNextEnabled || loading}
        >
          <Text style={styles.nextButtonText}>{loading ? 'Wait...' : 'Next Page'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PartOneQues18;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  innerContainer: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  question: { fontSize: 20, fontWeight: '600', marginBottom: 24, textAlign: 'center' },
  optionButton: {
    backgroundColor: '#ccc',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedOption: { backgroundColor: '#007bff' },
  optionText: { color: '#000', fontSize: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  coordContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: { fontWeight: 'bold', marginRight: 8, fontSize: 16 },
  coord: { fontSize: 16, color: '#333' },
  cameraButton: {
    backgroundColor: '#f0ad4e',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  cameraButtonText: { color: '#fff', fontSize: 16 },
  image: { width: 200, height: 200, borderRadius: 12, marginTop: 16, alignSelf: 'center' },
  nextButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  nextButtonText: { color: '#fff', fontSize: 18 },
});
