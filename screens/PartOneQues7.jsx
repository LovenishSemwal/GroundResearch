import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useFormData } from './FormDataContext';

const options = [
  { id: 'a', label: 'None (कोई नही)' },
  { id: 'b', label: '1' },
  { id: 'c', label: '2' },
  { id: 'd', label: '3 or more (3 या अधिक)' },
];

const PartOneQues7 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId   } = route.params || {};
  const { formData, updateFormData } = useFormData();

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: { answer: '' },
  });

  const selectedOption = watch('answer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.part1question7?.answer) {
      setValue('answer', formData.part1question7.answer);
    }
  }, [formData.part1question7, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const pageKey = 'part1question7';
    const postData = {
      Question: 'How many crops are grown in a year?',
      Answer: data.answer,
      Kml_Name: name,
      Researcher_Mobile: Number(researcherMobile),
      Form_No: formNumber,
      State:selectedState,
      Dist:selectedDistrict,
      Village_Name:selectedVillage,
      Shape_Id:shapeId
    };

    // Check if record exists
    const existingId = formData[pageKey]?.id;

    let response;
    try {
      if (existingId) {
        // Update existing record
        response = await axios.post(
          `https://adfirst.in/api/Part1Question7/update/${existingId}`,
          { ...postData, Id: existingId },
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Create new record
        response = await axios.post(
          'https://adfirst.in/api/Part1Question7',
          postData,
          { headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (response.data?.id || response.data?.data?.id) {
        // Save id and answer to context
        updateFormData(pageKey, {
          answer: data.answer,
          id: response.data.id || response.data.data.id,
        });

        console.log('Data saved:', response.data);
        // Alert.alert('Done', 'Data submitted successfully');
        navigation.navigate('PartOneQues8', {
          name,
          researcherMobile,
          formNumber,
          selectedState,
          selectedDistrict,
          selectedVillage,
          shapeId
        });
      } else {
        Alert.alert('Error', 'Submission failed. Try again.');
      }
    } catch (error) {
      const errorMessage = JSON.stringify(error.response?.data || { message: error.message });
      console.error('Error submitting:', errorMessage);
      Alert.alert('Submission Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Question 7</Text>
      <Text style={styles.question}>How many crops are grown in a year?</Text>
      <Text style={styles.question}>(साल में कितनी फसल होती है?)</Text>

      <Controller
        control={control}
        name="answer"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.optionsContainer}>
            {options.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  value === option.id && styles.optionButtonSelected,
                ]}
                onPress={() => {
                  onChange(option.id);
                  updateFormData('part1question7', { answer: option.id }); // Live update to context
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    value === option.id && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />

      <TouchableOpacity
        style={[
          styles.nextButton,
          (!selectedOption || isSubmitting) && styles.nextButtonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={!selectedOption || isSubmitting}
      >
        <Text style={styles.nextButtonText}>
          {isSubmitting ? 'Wait...' : 'Next Page'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PartOneQues7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  optionButtonSelected: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
