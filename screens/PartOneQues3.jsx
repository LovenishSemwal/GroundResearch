import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { useFormData } from './FormDataContext';  // import the hook

const PartOneQues3 = ({ navigation, route }) => {
  const { selectedLine, researcherMobile, formNumber,
    selectedState, selectedDistrict, selectedVillage, shapeId
  } = route.params || {};
  const { formData, updateFormData } = useFormData();

  // Use stored photoUri from context under key 'part1question3'
  const [photoUri, setPhotoUri] = useState(formData.part1question3?.photoUri || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update context whenever photoUri changes
  useEffect(() => {
    updateFormData('part1question3', { photoUri });
  }, [photoUri]);

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
      cameraType: 'back',
      quality: 1,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error: ', response.errorMessage);
      } else {
        const uri = response.assets && response.assets[0].uri;
        setPhotoUri(uri);
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image picker error: ', response.errorMessage);
      } else {
        const uri = response.assets && response.assets[0].uri;
        setPhotoUri(uri);
      }
    });
  };

  const handleNext = async () => {
    if (isSubmitting) return;
    if (!photoUri) {
      Alert.alert('Validation', 'Please capture or select a photo first.');
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append('question', 'Photo of the land');
      form.append('land_photo', {
        uri: photoUri,
        name: `photo_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });
      form.append('researcherMobile', Number(researcherMobile));
      form.append('kmlName', selectedLine);
      form.append('State', selectedState)
      form.append('District', selectedDistrict)
      form.append('VillageName', selectedVillage)
      form.append('Shapeid', shapeId)
      form.append('FormNo', String(formNumber));

      const existingId = formData.part1question3?.id;
      let response;
      if (existingId) {
        // Update existing record
        response = await axios.post(
          `https://adfirst.in/api/Part1Question3/${existingId}`,
          form,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
      } else {
        // Create new record
        response = await axios.post(
          'https://adfirst.in/api/Part1Question3',
          form,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
      }

      if (response.data.success) {
        // Update context with new id and photoUri
        updateFormData('part1question3', {
          id: response.data.data.id,
          photoUri,
        });

        // Alert.alert('Done', 'Data Submitted');
        navigation.navigate('PartOneQues4', {
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
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'An error occurred while submitting data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Question 3</Text>
        <Text style={styles.title}>Photo of the Land</Text>
        <Text style={styles.title}>(जमीन की फोटो)</Text>

        <TouchableOpacity style={styles.photoButton} onPress={openCamera}>
          <Text style={styles.photoButtonText}>Take Photo (तस्वीर लो)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.photoButton} onPress={openGallery}>
          <Text style={styles.photoButtonText}>Choose from Gallery (गैलरी से चुनें)</Text>
        </TouchableOpacity>

        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.imagePreview} resizeMode="contain" />
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            { opacity: photoUri && !isSubmitting ? 1 : 0.5 }
          ]}
          disabled={!photoUri || isSubmitting}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isSubmitting ? 'Wait...' : 'Next Page'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PartOneQues3;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  photoButton: {
    backgroundColor: '#0066cc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    marginBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
