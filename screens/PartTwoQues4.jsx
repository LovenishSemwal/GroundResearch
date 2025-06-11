import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { useFormData } from './FormDataContext'; // import the context

const PartTwoQuesFour = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  // Initialize from context if available
  const initialAnswer = formData.PartTwoQuesFour?.answer || '';
  const initialAmount = formData.PartTwoQuesFour?.amount || '';
  const recordId = formData.PartTwoQuesFour?.id || null;

  const [answer, setAnswer] = useState(initialAnswer);
  const [numericInput, setNumericInput] = useState(initialAmount);
  const [loading, setLoading] = useState(false);

  // Sync local state to context
  useEffect(() => {
    updateFormData('PartTwoQuesFour', {
      answer,
      amount: numericInput,
      id: recordId, // keep id if it exists
    });
  }, [answer, numericInput]);

  const handleOptionSelect = (value) => {
    setAnswer(value);
    if (value === 'No') {
      setNumericInput('');
    }
  };

  const handleNext = async () => {
    setLoading(true);

    if (answer === '') {
      Alert.alert('Please select Yes or No');
      setLoading(false);
      return;
    }

    if (answer === 'Yes' && numericInput.trim() === '') {
      Alert.alert('Please enter the compensation amount');
      setLoading(false);
      return;
    }

    const payload = {
      Question: 'How much compensation was received?',
      Answer: answer,
      Amount: answer === 'Yes' ? Number(numericInput) : null,
      Kml_Name: name,
      Researcher_Mobile: Number(researcherMobile),
      Form_No: formNumber,
      Dist: selectedDistrict,
      State: selectedState,
      Village_Name: selectedVillage,
      Shape_Id: shapeId,
    };

    try {
      let response;

      if (recordId) {
        // Update existing record
        response = await axios.post(
          `https://adfirst.in/api/Part2Question4/update/${recordId}`,
          { ...payload, Id: recordId },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        // Create new record
        response = await axios.post(
          'https://adfirst.in/api/Part2Question4',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Save new record id to context
        if (response?.data?.id || response?.data?.Id) {
          const newId = response.data.id || response.data.Id;
          updateFormData('PartTwoQuesFour', { id: newId });
        }
      }

      console.log('Data submitted:', response.data);
      // Alert.alert('Data submitted successfully!');
      navigation.navigate('PartTwoQues5', {
        name,
        researcherMobile,
        formNumber,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error submitting data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const isNextEnabled =
    answer === 'No' || (answer === 'Yes' && numericInput.trim() !== '');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.mainQuestion}>Part2: Question 4</Text>
        <Text style={styles.mainQuestion}>How much compensation was received?</Text>
        <Text style={styles.subText}>(कितना मुआवजा मिला था?)</Text>

        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[styles.optionButton, answer === 'Yes' && styles.selectedOption]}
            onPress={() => handleOptionSelect('Yes')}
          >
            <Text style={[styles.optionText, answer === 'Yes' && styles.selectedOptionText]}>
              Yes (हाँ)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, answer === 'No' && styles.selectedOption]}
            onPress={() => handleOptionSelect('No')}
          >
            <Text style={[styles.optionText, answer === 'No' && styles.selectedOptionText]}>
              No (नहीं)
            </Text>
          </TouchableOpacity>
        </View>

        {answer === 'Yes' && (
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputWithRupee}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="gray"
              value={numericInput}
              onChangeText={(text) => {
                const numeric = text.replace(/[^0-9]/g, '');
                setNumericInput(numeric);
              }}
            />
            <Text style={styles.rupeeSymbol}>₹</Text>
          </View>
        )}

        {answer !== '' && (
          <TouchableOpacity
            style={[
              styles.nextButton,
              { opacity: isNextEnabled && !loading ? 1 : 0.5 },
            ]}
            onPress={handleNext}
            disabled={!isNextEnabled || loading}
          >
            <Text style={styles.nextText}>
              {loading ? 'Wait...' : 'Next Page'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PartTwoQuesFour;

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainQuestion: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  inputWithRupee: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  rupeeSymbol: {
    fontSize: 18,
    color: '#333',
    marginLeft: 6,
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
