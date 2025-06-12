import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useFormData } from './FormDataContext';

const PartOneQues8 = ({ navigation, route }) => {
  const { selectedLine, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const pageKey = 'part1question8';
  const { formData, updateFormData } = useFormData();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      mainQuestion: '',
      additionalQuestion1: '',
      additionalQuestion2: '',
    }
  });

  const mainAnswer = watch('mainQuestion');

 useEffect(() => {
  const existingData = formData[pageKey];
  if (existingData) {
    if (!watch('mainQuestion')) setValue('mainQuestion', existingData.mainAnswer || '');
    if (!watch('additionalQuestion1')) setValue('additionalQuestion1', existingData.additional1 || '');
    if (!watch('additionalQuestion2')) setValue('additionalQuestion2', existingData.additional2 || '');
  }
}, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      Form_No: formNumber,
      Researcher_Mobile: Number(researcherMobile),
      Kml_Name: selectedLine,
      State:selectedState,
      District:selectedDistrict,
      VillageName:selectedVillage,
      Shapeid:shapeId,
      Question: "Do crops grow?",
      Answer: data.mainQuestion === 'Yes'
        ? `Yes | Types: ${data.additionalQuestion1}, Names: ${data.additionalQuestion2}`
        : "No",
    };

    const pageKey = 'part1question8';
    const existingId = formData[pageKey]?.id;

    try {
      let response;
      if (existingId) {
        // Update existing record
        response = await axios.post(
          `https://adfirst.in/api/Part1Question8/update/${existingId}`,
          { ...payload, Id: existingId },
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Create new record
        response = await axios.post(
          'https://adfirst.in/api/Part1Question8',
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (response.data && (response.data.success || response.data.Id || response.data.id)) {
        const recordId = response.data.id || response.data.Id || response.data.data?.id;
        updateFormData(pageKey, {
          mainAnswer: data.mainQuestion,
          additional1: data.additionalQuestion1,
          additional2: data.additionalQuestion2,
          id: recordId,
        });

        // Alert.alert('Done', 'Data submitted successfully');
        console.log('Submitted:', response.data);
        navigation.navigate('PartOneQues9', {
          selectedLine,
          researcherMobile,
          formNumber,
          selectedState,
          selectedDistrict,
          selectedVillage,
          shapeId
        });
      } else {
        Alert.alert('Error', response.data.message || 'Unknown error');
      }
    } catch (error) {
      // console.error('Error submitting form:', error.response?.data || error.message);
      Alert.alert('Error', 'Something went wrong while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Question 8</Text>
      <Text style={styles.title}>Do crops grow?</Text>
      <Text style={styles.title}>(क्या फसल उगती है?)</Text>

      <View style={styles.optionsContainer}>
        <Controller
          control={control}
          name="mainQuestion"
          rules={{ required: 'Please select an option' }}
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                style={[styles.option, value === 'Yes' && styles.optionSelected]}
                onPress={() => {
                  onChange('Yes');
                  updateFormData(pageKey, { mainAnswer: 'Yes' });
                }}
              >
                <Text style={styles.optionText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.option, value === 'No' && styles.optionSelected]}
                onPress={() => {
                  onChange('No');
                  updateFormData(pageKey, {
                    mainAnswer: 'No',
                    additional1: '',
                    additional2: '',
                  });
                }}
              >
                <Text style={styles.optionText}>No</Text>
              </TouchableOpacity>
            </>
          )}
        />
      </View>
      {errors.mainQuestion && <Text style={styles.error}>{errors.mainQuestion.message}</Text>}

      {mainAnswer === 'Yes' && (
        <>
          <Text style={styles.label}>How many types of (कितने प्रकार के):</Text>
          <Controller
            control={control}
            name="additionalQuestion1"
            rules={{
              required: 'This question is required',
              pattern: { value: /^[0-9]+$/, message: 'Please enter a valid number' },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter number"
                onChangeText={(text) => {
                  const filtered = text.replace(/[^0-9]/g, '');
                  onChange(filtered);
                  updateFormData(pageKey, { additional1: filtered });
                }}
                value={value}
                keyboardType="numeric"
              />
            )}
          />
          {errors.additionalQuestion1 && <Text style={styles.error}>{errors.additionalQuestion1.message}</Text>}

          <Text style={styles.label}>Name all the types of (सभी प्रकारों के नाम बताएं):</Text>
          <Controller
            control={control}
            name="additionalQuestion2"
            rules={{ required: 'This question is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => {
                  onChange(text);
                  updateFormData(pageKey, { additional2: text });
                }}
                value={value}
                placeholder=""
                textAlignVertical="top"
              />
            )}
          />
          {errors.additionalQuestion2 && <Text style={styles.error}>{errors.additionalQuestion2.message}</Text>}
        </>
      )}

      <TouchableOpacity
        style={[
          styles.nextButton,
          (!isSubmitting &&
            (mainAnswer === 'No' ||
              (mainAnswer === 'Yes' && watch('additionalQuestion1') && watch('additionalQuestion2'))))
            ? {}
            : styles.nextButtonDisabled
        ]}
        disabled={
          isSubmitting ||
          !(mainAnswer === 'No' ||
            (mainAnswer === 'Yes' && watch('additionalQuestion1') && watch('additionalQuestion2')))
        }
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.nextButtonText}>{isSubmitting ? 'Wait...' : 'Next Page'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PartOneQues8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#0066cc',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  optionSelected: {
    backgroundColor: '#0066cc',
  },
  optionText: {
    color: '#0066cc',
    fontWeight: '600',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "black"
  },
  textArea: {
    height: 100,
  },
  error: {
    color: 'red',
    marginTop: 4,
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
