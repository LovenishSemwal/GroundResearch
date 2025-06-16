import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { launchCamera } from 'react-native-image-picker';
import { useFormData } from './FormDataContext';

const DynamicFormWithPhotos = ({ navigation, route }) => {
  const { selectedLine, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [count, setCount] = useState(0);
  const [photos, setPhotos] = useState([]);
  const { control, handleSubmit, setValue } = useForm();
  const { formData, updateFormData } = useFormData();
  const [treeCountInput, setTreeCountInput] = useState(count.toString());

  const questionKey = 'part1question9';

  // On load: restore data
  useEffect(() => {
    let isFirstRun = true;

    if (isFirstRun) {
      const savedData = formData[questionKey];
      if (savedData) {
        const savedNames = savedData.names || {};
        const savedPhotos = savedData.photos || [];
        const savedCount = savedPhotos.length || Object.keys(savedNames).length || 0;

        setCount(savedCount);
        setPhotos(savedPhotos);

        for (let i = 0; i < savedCount; i++) {
          setValue(`input_${i}`, savedNames[`input_${i}`] || '');
        }
      }
      isFirstRun = false;
    }
  }, []);


  const handleCountChange = (num) => {
    setCount(num);
    setPhotos(Array(num).fill(null));
    for (let i = 0; i < num; i++) {
      setValue(`input_${i}`, '');
    }

    // Clear the context if count is 0
    if (num === 0) {
      updateFormData(questionKey, { names: {}, photos: [], id: formData[questionKey]?.id || null });
    }
  };

  const handlePhoto = (index) => {
    const options = { mediaType: 'photo', saveToPhotos: true, cameraType: 'back', quality: 1 };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error:', response.errorMessage);
      } else {
        let uri = response.assets && response.assets[0].uri;
        if (Platform.OS === 'android' && !uri.startsWith('file://')) {
          uri = 'file://' + uri;
        }

        const updatedPhotos = [...photos];
        updatedPhotos[index] = uri;
        setPhotos(updatedPhotos);

        // Update context
        const currentData = formData[questionKey] || { names: {}, photos: [], id: null };
        const updatedPhotosInContext = [...currentData.photos];
        updatedPhotosInContext[index] = uri;
        updateFormData(questionKey, { ...currentData, photos: updatedPhotosInContext });
      }
    });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Form_No', formNumber);
      formDataToSend.append('Question', 'What types of trees are there – name and photo');
      formDataToSend.append('Researcher_Mobile', researcherMobile.toString());
      formDataToSend.append('Kml_Name', selectedLine);
      formDataToSend.append('State', selectedState);
      formDataToSend.append('District', selectedDistrict);
      formDataToSend.append('VillageName', selectedVillage);
      formDataToSend.append('Shapeid', shapeId);

      const names = Array(count)
        .fill()
        .map((_, i) => data[`input_${i}`] || '')
        .join(', ');
      formDataToSend.append('Name', names);

      for (let i = 0; i < count; i++) {
        if (photos[i]) {
          let uri = photos[i];
          if (Platform.OS === 'android' && !uri.startsWith('file://')) {
            uri = 'file://' + uri;
          }
          formDataToSend.append('PhotoFiles', {
            uri,
            name: `photo_${i}.jpg`,
            type: 'image/jpeg',
          });
        }
      }

      const existingId = formData[questionKey]?.id;
      let response;
      if (existingId) {
        response = await axios.post(
          `https://adfirst.in/api/Part1Question9/${existingId}`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        response = await axios.post(
          'https://adfirst.in/api/Part1Question9',
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      console.log('Response:', response.data);
      updateFormData(questionKey, {
        id: response.data.id || existingId,
        names: Object.fromEntries(Array(count).fill().map((_, i) => [`input_${i}`, data[`input_${i}`] || ''])),
        photos: photos.filter((p) => p !== null),
      });

      // Alert.alert('Data submitted successfully!');
      navigation.navigate('PartOneQues10', {
        selectedLine,
        researcherMobile,
        formNumber,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId
      });
    } catch (error) {
      console.error('Error posting data:', error.response?.data || error.message || error);
      Alert.alert('Error submitting data. See console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Question 9</Text>
      <Text style={styles.title}>Enter Number of Trees</Text>
      <Text style={styles.title}>(पेड़ों की संख्या दर्ज करें)</Text>

      <View style={[styles.countInputRow, { gap: 10 }]}>
        <TextInput
          style={styles.countInput}
          placeholder="Enter a number"
          keyboardType="numeric"
          value={treeCountInput}
          onChangeText={setTreeCountInput}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#007BFF',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 8,
          }}
          onPress={() => {
            const num = parseInt(treeCountInput, 10);
            if (!isNaN(num) && num >= 0) {
              handleCountChange(num);
            } else {
              Alert.alert('Please enter a valid number');
            }
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Set</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>What types of trees are there – name and photo</Text>
      <Text style={styles.title}>(किस तरह के पेड़ हैं - नाम तथा फोटो)</Text>

      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.inputRow}>
          <Controller
            control={control}
            name={`input_${index}`}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder={`Label ${index + 1}`}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  const currentData = formData[questionKey] || { names: {}, photos: [], id: null };
                  const updatedNames = { ...currentData.names, [`input_${index}`]: text };
                  updateFormData(questionKey, { ...currentData, names: updatedNames });
                }}
              />
            )}
          />
          <TouchableOpacity style={styles.photoButton} onPress={() => handlePhoto(index)}>
            <Text style={styles.photoText}>📷</Text>
          </TouchableOpacity>
          {photos[index] && (
            <Image source={{ uri: photos[index] }} style={styles.imagePreview} />
          )}
        </View>
      ))}

      {(count !== null && count !== '' && !isNaN(count)) && (
        <TouchableOpacity
          style={[styles.submitButton, { opacity: isSubmitting ? 0.6 : 1 }]}
          disabled={
            isSubmitting ||
            (count !== 0 &&
              Array.from({ length: count }).some((_, i) => {
                const fieldValue = control._formValues[`input_${i}`];
                const photoUri = photos[i];
                return !fieldValue || fieldValue.trim() === '' || !photoUri;
              })
            )
          }

          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.submitButtonText}>{isSubmitting ? 'Wait...' : 'Next Page'}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default DynamicFormWithPhotos;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countInputRow: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  countInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    width: 150,
    textAlign: 'center',
    color: 'black'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  photoButton: {
    marginLeft: 10,
    backgroundColor: '#007BFF',
    borderRadius: 6,
    padding: 10,
  },
  photoText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    marginLeft: 10,
    width: 60,
    height: 60,
    borderRadius: 8,
    borderColor: '#999',
    borderWidth: 1,
  },
  submitButton: {
    marginTop: 32,
    backgroundColor: '#28A745',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
