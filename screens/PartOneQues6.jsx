import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useFormData } from './FormDataContext'; // context hook

const options = [
  { id: 'a', label: 'Sandy (रेतीली)' },
  { id: 'b', label: 'Rocky (पथरीली)' },
  { id: 'c', label: 'Moderate (ठीक-ठाक)' },
  { id: 'd', label: 'Fertile (उपजाऊ)' },
];

const PartOneQues6 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId  } = route.params || {};
  const pageKey = 'part1question6';
  const { formData, updateFormData } = useFormData();

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: { answer: '' },
  });

  const selectedOption = watch('answer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill answer if available
  useEffect(() => {
    if (formData.part1question6?.answer) {
      setValue('answer', formData.part1question6.answer);
    }
  }, [formData.part1question6, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const pageKey = 'part1question6';
    const postData = {
      question: "How is the land?",
      answer: data.answer,
      Kml_Name: name,
      Researcher_Mobile: Number(researcherMobile),
      FormNo: formNumber,
      State:selectedState,
      Dist:selectedDistrict,
      Village_Name:selectedVillage,
      Shape_Id:shapeId
    };

    try {
      // Check if there's an existing record
      const existingId = formData[pageKey]?.id;
      let response;

      if (existingId) {
        // Update existing record
        response = await axios.post(
          `https://adfirst.in/api/Part1Question6/update/${existingId}`,
          { ...postData, id: existingId },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        // Create new record
        response = await axios.post(
          'https://adfirst.in/api/Part1Question6',
          postData,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (response.data.success || response.status === 200) {
        // Save to context with id
        const savedData = response.data.data;
        updateFormData(pageKey, {
          answer: data.answer,
          id: savedData.id,
        });

        // Alert.alert("Success", "Data saved successfully!");
        navigation.navigate("PartOneQues7", {
          name,
          researcherMobile,
          formNumber,
          selectedState,
          selectedDistrict,
          selectedVillage,
          shapeId
        });
      } else {
        Alert.alert("Error", response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Question 6</Text>
      <Text style={styles.question}>How is the land?</Text>
      <Text style={styles.question}>(जमीन कैसी है?)</Text>

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
                  // Live update context (optional)
                  updateFormData(pageKey, { answer: option.id });
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
          {isSubmitting ? "Wait..." : "Next Page"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PartOneQues6;

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
