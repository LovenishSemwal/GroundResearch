import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { launchCamera } from 'react-native-image-picker';

const DynamicFormWithPhotos = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [count, setCount] = useState(0);
  const [photos, setPhotos] = useState([]);
  const { control, handleSubmit, setValue, watch } = useForm();

  const handleCountChange = num => {
    setCount(num);
    // Reset photos and form fields
    setPhotos(Array(num).fill(null));
    for (let i = 0; i < num; i++) {
      setValue(`input_${i}`, '');
    }
  };

  const handlePhoto = index => {
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
        console.log('Camera error:', response.errorMessage);
      } else {
        const uri = response.assets && response.assets[0].uri;
        const updatedPhotos = [...photos];
        updatedPhotos[index] = uri;
        setPhotos(updatedPhotos);
      }
    });
  };

  const onSubmit = async data => {
    setIsSubmitting(true);
    const entries = Array(count).fill(0).map((_, i) => ({
      label: data[`input_${i}`],
      image: photos[i],
    }));

    try {
      for (let i = 0; i < entries.length; i++) {
        const payload = {
          Id: Date.now() + i, // Or generate with UUID if needed
          Form_No: formNumber,
          Question: "What types of trees are there – name and photo",
          Name: entries[i].label,
          Photo: entries[i].image,
          Researcher_Mobile: Number(researcherMobile),
          Kml_Name: name,
        };

        await axios.post('https://brandscore.in/api/Part1Question9', payload);
      }

      Alert.alert('Data submitted successfully!');
      navigation.navigate('PartOneQues10', {
        name,
        researcherMobile,
        formNumber
      });
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert('Error submitting data. Check console for details.');
    } finally {
      setIsSubmitting(false);  // Enable button back after submission finished
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Question 9</Text>
      <Text style={styles.title}>Enter Number of Trees</Text>
      <Text style={styles.title}>(पेड़ों की संख्या दर्ज करें)</Text>

      <View style={styles.countInputRow}>
        <TextInput
          style={styles.countInput}
          placeholder="Enter a number"
          keyboardType="numeric"
          onChangeText={(text) => {
            const num = parseInt(text, 10);
            if (!isNaN(num) && num >= 0) {
              handleCountChange(num);
            }
          }}
        />
      </View>
      <Text style={styles.title}>What types of trees are there – name and photo</Text>
      <Text style={styles.title}>(किस तरह के पेड़ हैं - नाम तथा फोटो)</Text>

      {/* Dynamic Form Fields */}
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
                onChangeText={onChange}
              />
            )}
          />

          {/*For Now No Need to Select Photo  */}
          {/* <Controller
            control={control}
            name={`input_${index}`}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder={`Label ${index + 1}`}
                value={value}
                onChangeText={onChange}
              />
            )}
          /> */}

          <TouchableOpacity style={styles.photoButton} onPress={() => handlePhoto(index)}>
            <Text style={styles.photoText}>📷</Text>
          </TouchableOpacity>

          {photos[index] && (
            <Image
              source={{ uri: photos[index] }}
              style={styles.imagePreview}
            />
          )}
        </View>
      ))}

      {/* Submit */}
      {count > 0 && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            { opacity: isSubmitting ? 0.6 : 1 }
          ]}
          disabled={isSubmitting}
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
  countSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  countButton: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginHorizontal: 6,
  },
  countButtonSelected: {
    backgroundColor: '#007BFF',
  },
  countText: {
    fontSize: 16,
    color: '#000',
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
    color: "black"
  },

});
