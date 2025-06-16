import React, { useEffect, useState } from 'react';
import { Image as RNImage } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  PermissionsAndroid,
  StyleSheet
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { useFormData } from './FormDataContext';  // import the context

const PartOneQues20 = ({ navigation, route }) => {
  const { selectedLine, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  // Initialize local state with existing form data or defaults
  const initialHasLocation = formData.part1question20?.hasLocation || '';
  const initialLocationName = formData.part1question20?.locationName || '';
  const initialLat = formData.part1question20?.lat || '';
  const initialLong = formData.part1question20?.long || '';
  const initialImageUri = formData.part1question20?.imageUri || null;
  const [recordId, setRecordId] = useState(formData.part1question20?.id || null);

  const [hasLocation, setHasLocation] = useState(initialHasLocation);
  const [locationName, setLocationName] = useState(initialLocationName);
  const [lat, setLat] = useState(initialLat);
  const [long, setLong] = useState(initialLong);
  const [imageUri, setImageUri] = useState(initialImageUri);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync recordId from formData if updated externally
  useEffect(() => {
    setRecordId(formData.part1question20?.id || null);
  }, [formData.part1question20?.id]);

  // When hasLocation === 'Yes', fetch location; else clear location info & image
  useEffect(() => {
    if (hasLocation === 'Yes') {
      requestLocationPermission();
    } else {
      setLocationName('');
      setLat('');
      setLong('');
      setImageUri(null);
      updateFormData('part1question20', { imageUri: null });  // <- explicit clear in context
    }
  }, [hasLocation]);

  // Save to context when any field changes
  useEffect(() => {
    updateFormData('part1question20', {
      hasLocation,
      locationName,
      lat,
      long,
      imageUri,
      id: recordId,
    });
  }, [hasLocation, locationName, lat, long, imageUri, recordId]);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
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
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        Alert.alert('Permission Denied', 'Location permission is required.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to get location permission.');
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
    setIsSubmitting(true);

    const form = new FormData();

    form.append('Question', 'Do you see any permanent structure nearby that would obstruct the transmission line?');
    form.append('Answer', hasLocation);
    form.append('Description', hasLocation === 'Yes' ? locationName : '');
    // form.append('Lat', hasLocation === 'Yes' ? String(lat) : '0');
    // form.append('Long', hasLocation === 'Yes' ? String(long) : '0');
    form.append('Lat', hasLocation === 'Yes' ? lat : 0);
    form.append('Long', hasLocation === 'Yes' ? long : 0);
    form.append('Researcher_Mobile', String(researcherMobile));
    form.append('Kml_Name', selectedLine);
    form.append('Form_No', formNumber);
    form.append('State', selectedState);
    form.append('District', selectedDistrict);
    form.append('VillageName', selectedVillage);
    form.append('Shapeid', shapeId);

    // Append PhotoFile ONLY if hasLocation is "Yes"
    if (hasLocation === 'Yes' && imageUri) {
      const uriParts = imageUri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      const fileType = fileName.split('.').pop().toLowerCase();

      form.append('PhotoFile', {
        uri: imageUri,
        name: fileName,
        type: fileType === 'jpg' || fileType === 'jpeg' ? 'image/jpeg' : `image/${fileType}`,
      });
    }

    try {
      let response;
      if (recordId) {
        response = await axios.post(
          `https://adfirst.in/api/Part1Question20/${recordId}`,
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        response = await axios.post(
          'https://adfirst.in/api/Part1Question20',
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        const newId = response?.data?.id || response?.data?.Id;
        if (newId) {
          updateFormData('part1question20', { id: newId });
          setRecordId(newId);
        }
      }

      // Alert.alert('Success', 'Data submitted successfully');
      navigation.navigate('PartOneQues21', {
        selectedLine,
        researcherMobile,
        formNumber,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId
      });
    } catch (error) {
      Alert.alert('Submission failed', 'Please try again.');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isNextEnabled = hasLocation === 'No' || (hasLocation === 'Yes' && locationName.trim() !== '' && imageUri);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.question}>Question 20</Text>
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
          <Text style={[styles.optionText, hasLocation === 'No' && { color: '#fff' }]}>No (नहीं)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, hasLocation === 'Yes' && styles.selectedOption]}
          onPress={() => setHasLocation('Yes')}
        >
          <Text style={[styles.optionText, hasLocation === 'Yes' && { color: '#fff' }]}>Yes (हाँ)</Text>
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

            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
          </>
        )}

        <TouchableOpacity
          style={[styles.nextButton, { opacity: isNextEnabled && !isSubmitting ? 1 : 0.5 }]}
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
    color: '#000',
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
