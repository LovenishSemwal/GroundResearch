import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useFormData } from './FormDataContext';

const PartOneQues10 = ({ navigation, route }) => {
  const { selectedLine, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  // Pull part1question10 data from context
  const {
    id,
    acquisitionStatus: initialAcquisitionStatus = '',
    yearAcquired: initialYearAcquired = '',
    compensationRate: initialCompensationRate = '',
    compensationGiven: initialCompensationGiven = '',
  } = formData.part1question10 || {};

  const [loading, setLoading] = useState(false);
  const [acquisitionStatus, setAcquisitionStatus] = useState(initialAcquisitionStatus);
  const [yearAcquired, setYearAcquired] = useState(initialYearAcquired);
  const [compensationRate, setCompensationRate] = useState(initialCompensationRate);
  const [compensationGiven, setCompensationGiven] = useState(initialCompensationGiven);

  // Sync local state to context
  useEffect(() => {
    updateFormData('part1question10', {
      acquisitionStatus,
      yearAcquired,
      compensationRate,
      compensationGiven,
      id, // keep id in context too
    });
  }, [acquisitionStatus, yearAcquired, compensationRate, compensationGiven, id]);

  const handleNext = async () => {
    setLoading(true);

    try {
      const payload = {
        Question: acquisitionStatus,
        Date_Of_Acquire: yearAcquired ? new Date(`${yearAcquired}`) : null,
        Compensation: compensationGiven === 'Yes' ? compensationRate : 'No',
        Researcher_Mobile: Number(researcherMobile),
        Kml_Name: selectedLine,
        Form_No: formNumber,
        State: selectedState,
        Dist: selectedDistrict,
        Village_Name: selectedVillage,
        Shape_Id: shapeId,
      };

      let response;

      if (id) {
        // Update existing record
        response = await axios.post(
          `https://adfirst.in/api/Part1Question10/Update/${id}`,
          payload
        );
      } else {
        // Create new record
        response = await axios.post('https://adfirst.in/api/Part1Question10', payload);
      }

      const savedData = response.data.data || response.data;

      // Update id in context from response
      updateFormData('part1question10', {
        id: savedData.id || savedData.ID || savedData.Id || id,
      });

      // Alert.alert('Data saved successfully!');

      navigation.navigate('PartOneQues11', {
        selectedLine,
        researcherMobile,
        formNumber,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId
      });
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error submitting data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const isNextEnabled =
    acquisitionStatus === 'No land acquired' ||
    (acquisitionStatus === 'Yes, Acquired' &&
      yearAcquired &&
      compensationGiven &&
      (compensationGiven === 'No' || (compensationGiven === 'Yes' && compensationRate)));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.question}>Question 10</Text>
        <Text style={styles.question}>
          Has the nearby land been acquired for any government project?
        </Text>
        <Text style={styles.question}>(क्या आस-पास की जमीन किसी सरकारी प्रोजेक्ट के लिए अधिग्रहित की गई है?)</Text>

        <TouchableOpacity
          style={[styles.optionButton, acquisitionStatus === 'No land acquired' && styles.selectedOption]}
          onPress={() => setAcquisitionStatus('No land acquired')}
        >
          <Text style={styles.optionText}>a. No land acquired (कोई जमीन अधिग्रहित नहीं की गई)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, acquisitionStatus === 'Yes, Acquired' && styles.selectedOption]}
          onPress={() => setAcquisitionStatus('Yes, Acquired')}
        >
          <Text style={styles.optionText}>b. Yes, Acquired (हाँ, अधिग्रहित की गई है)</Text>
        </TouchableOpacity>

        {acquisitionStatus === 'Yes, Acquired' && (
          <>
            <Text style={styles.question}>Date of Acquire</Text>
            <Text style={styles.question}>(अधिग्रहण की तिथि)</Text>
            <TextInput
              placeholder="Year acquired (YYYY)"
              placeholderTextColor="gray"
              value={yearAcquired}
              onChangeText={text => setYearAcquired(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              style={styles.input}
              maxLength={4}
            />

            <Text style={styles.question}>Was any compensation given?</Text>
            <Text style={styles.question}>(क्या कोई मुआवजा दिया गया था?)</Text>

            <TouchableOpacity
              style={[styles.optionButton, compensationGiven === 'No' && styles.selectedOption]}
              onPress={() => {
                setCompensationGiven('No');
                setCompensationRate('');
              }}
            >
              <Text style={styles.optionText}>No (नहीं)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, compensationGiven === 'Yes' && styles.selectedOption]}
              onPress={() => {
                setCompensationGiven('Yes');
                setCompensationRate('');
              }}
            >
              <Text style={styles.optionText}>Yes (हाँ)</Text>
            </TouchableOpacity>

            {compensationGiven === 'Yes' && (
              <TextInput
                placeholder="Compensation rate (₹)"
                placeholderTextColor="gray"
                value={compensationRate}
                onChangeText={text => setCompensationRate(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                style={styles.input}
              />
            )}
          </>
        )}

        <TouchableOpacity
          style={[styles.nextButton, { opacity: isNextEnabled && !loading ? 1 : 0.5 }]}
          onPress={handleNext}
          disabled={!isNextEnabled || loading}
        >
          <Text style={styles.nextButtonText}>{loading ? 'Wait...' : 'Next Page'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PartOneQues10;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
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
    color: '#fff',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
