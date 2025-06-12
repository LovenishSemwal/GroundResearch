import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useFormData } from './FormDataContext';  // context import

const options = [
  { id: 'a', label: 'Empty or agricultural or forest (खाली या कृषि या जंगल)' },
  { id: 'b', label: 'Populated - village (आबादी- गांव)' },
  { id: 'c', label: 'Populated - town (आबादी- कस्बा)' },
  { id: 'd', label: 'Populated - city (आबादी- शहर)' },
];

const PartOneQues5 = ({ navigation, route }) => {
  const { selectedLine, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: { answer: '' }
  });

  const selectedOption = watch('answer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // On mount, load existing answer if any from context
  useEffect(() => {
    // Assuming context stores answer and id with key 'part1question5'
    if (formData.part1question5?.answer) {
      setValue('answer', formData.part1question5.answer);
    }
  }, [formData.part1question5, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Prepare payload data
    const payload = {
      question: "How is the area?",
      answer: data.answer,
      Kml_Name: selectedLine,
      Researcher_Mobile: Number(researcherMobile),
      Form_No: formNumber,
      State: selectedState,
      Dist: selectedDistrict,
      Village_Name: selectedVillage,
      Shape_Id: shapeId
    };

    try {
      let response;

      // Check if existing record id is present in context for this question
      const existingId = formData.part1question5?.id;

      if (existingId) {
        // Update existing record
        response = await axios.post(
          `https://adfirst.in/api/Part1Question5/update/${existingId}`,
          { ...payload, Id: existingId }, // Pass Id in body as well
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Create new record
        response = await axios.post(
          'https://adfirst.in/api/Part1Question5',
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check API success status
      if (response.data.success) {
        // Save updated answer and id in context for future use
        updateFormData('part1question5', {
          answer: data.answer,
          id: response.data.data.id,  // id from backend response
        });

        // Alert.alert("Success", "Data saved successfully!");
        navigation.navigate("PartOneQues6", {
          selectedLine,
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
      Alert.alert("Network Error", "Could not connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.question}>Question 5</Text>
        <Text style={styles.question}>How is the area?</Text>
        <Text style={styles.question}>(क्षेत्र कैसा है?)</Text>

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
                    updateFormData('part1question5', { answer: option.id });  // update context live!
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
    </ScrollView>
  );
};

export default PartOneQues5;

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
