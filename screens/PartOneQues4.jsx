import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Video from 'react-native-video';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { useFormData } from './FormDataContext';

const PartOneQues4 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  // Directly use context video URI
  const [videoUri, setVideoUri] = useState(formData.part1question4?.videoUri || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save videoUri in context
  useEffect(() => {
    updateFormData('part1question4', { videoUri });
  }, [videoUri]);

  const openCameraForVideo = () => {
    const options = { mediaType: 'video', videoQuality: 'high', durationLimit: 60, saveToPhotos: true };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled video recording');
      } else if (response.errorCode) {
        console.error('Camera error:', response.errorMessage);
      } else {
        const uri = response.assets && response.assets[0].uri;
        setVideoUri(uri);
      }
    });
  };

  const openGalleryForVideo = () => {
    const options = { mediaType: 'video' };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.errorCode) {
        console.error('Gallery error:', response.errorMessage);
      } else {
        const uri = response.assets && response.assets[0].uri;
        setVideoUri(uri);
      }
    });
  };

  const handleNext = async () => {
    if (isSubmitting || !videoUri) return;
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('FormNo', String(formNumber));
      formDataToSend.append('Question', '360-degree video of the land');
      formDataToSend.append('ResearcherMobile', Number(researcherMobile));
      formDataToSend.append('KmlName', name);
      formDataToSend.append('State', selectedState);
      formDataToSend.append('District', selectedDistrict);
      formDataToSend.append('VillageName', selectedVillage);
      formDataToSend.append('Shapeid', shapeId);
      formDataToSend.append('Land360VideoFile', {
        uri: videoUri,
        name: `video_${Date.now()}.mp4`,
        type: 'video/mp4',
      });

      // Use existing ID directly from context
      const existingId = formData.part1question4?.id;

      let response;
      if (existingId) {
        response = await axios.post(`https://adfirst.in/api/Part1Question4/${existingId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post('https://adfirst.in/api/Part1Question4', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response.data.success) {
        // Alert.alert('Done', 'Data Submitted');
        console.log('Data saved:', response.data.data);

        // Update context with new videoUri & id
        updateFormData('part1question4', {
          videoUri,
          id: response.data.data.id,
        });

        navigation.navigate('PartOneQues5', {
          name,
          researcherMobile,
          formNumber,
          selectedState,
          selectedDistrict,
          selectedVillage,
          shapeId
        });
      } else {
        console.error('Save failed:', response.data.message);
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error sending data:', error.message);
      Alert.alert('Error', 'Failed to submit data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.container}>
      <Text style={styles.title}>Question 4</Text>
      <Text style={styles.title}>360-degree video of the land</Text>
      <Text style={styles.title}>(जमीन का 360 डिग्री वीडियो।)</Text>

      <TouchableOpacity style={styles.button} onPress={openCameraForVideo}>
        <Text style={styles.buttonText}>Take Video (वीडियो लें)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={openGalleryForVideo}>
        <Text style={styles.buttonText}>Choose from Gallery (गैलरी से चुनें)</Text>
      </TouchableOpacity>

      {videoUri && (
        <View style={styles.videoPreviewContainer}>
          <Text style={{ marginBottom: 10 }}>Video Preview:</Text>
          <Video
            source={{ uri: videoUri }}
            style={styles.videoPreview}
            controls
            paused={false}
            resizeMode="contain"
            repeat={false}
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.nextButton, { opacity: videoUri && !isSubmitting ? 1 : 0.5 }]}
        onPress={handleNext}
        disabled={!videoUri || isSubmitting}
      >
        <Text style={styles.nextButtonText}>{isSubmitting ? 'Wait...' : 'Next Page'}</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

export default PartOneQues4;

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
  button: {
    backgroundColor: '#0066cc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  videoPreviewContainer: {
    marginVertical: 16,
    height: 250,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
