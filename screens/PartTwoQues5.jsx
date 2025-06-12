import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useFormData } from './FormDataContext'; // import the context

const options = [
  { id: 'a', label: ' No acquisition took place\n(अधिग्रहण नहीं हुआ)' },
  { id: 'b', label: 'Acquisition took place, but there was no issue\n(अधिग्रहण हुआ था, पर कोई समस्या नहीं हुई थी)' },
  { id: 'c', label: 'Acquisition took place\n(अधिग्रहण हुआ था)' },
];

const PartTwoQues5 = ({ navigation, route }) => {
  const { selectedLine, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  // Initialize from context if available
  const initialAnswer = formData.PartTwoQues5?.answer || '';
  const initialOtherReason = formData.PartTwoQues5?.otherReason || '';
  const recordId = formData.PartTwoQues5?.id || null;

  const [answer, setAnswer] = useState(initialAnswer);
  const [otherReason, setOtherReason] = useState(initialOtherReason);
  const [loading, setLoading] = useState(false);

  // Sync local state to context whenever they change
  useEffect(() => {
    updateFormData('PartTwoQues5', {
      answer,
      otherReason,
      id: recordId,
    });
  }, [answer, otherReason]);

  const handleOptionSelect = (value) => {
    setAnswer(value);
    if (value !== 'c') {
      setOtherReason('');
    }
  };

  const handleNext = async () => {
    setLoading(true);

    if (answer === '') {
      Alert.alert('Please select an option.');
      setLoading(false);
      return;
    }

    if (answer === 'c' && otherReason.trim() === '') {
      Alert.alert('Please enter the details of issues that occurred.');
      setLoading(false);
      return;
    }

    const payload = {
      Question: 'Was there any issue during the acquisition?',
      Answer: answer,
      Details: answer === 'c' ? otherReason : '',
      Kml_Name: selectedLine,
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
          `https://adfirst.in/api/Part2Question5/update/${recordId}`,
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
          'https://adfirst.in/api/Part2Question5',
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
          updateFormData('PartTwoQues5', { id: newId });
        }
      }

      console.log('Data submitted:', response.data);
      // Alert.alert('Data submitted successfully!');
      navigation.navigate('PartTwoQues6', {
        selectedLine,
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

  const isNextEnabled = answer !== '' && (answer !== 'c' || (answer === 'c' && otherReason.trim() !== ''));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.mainQuestion}>Part2: Question 5</Text>
        <Text style={styles.mainQuestion}>Was there any issue during the acquisition?</Text>
        <Text style={styles.subText}>(अधिग्रहण में क्या कोई समस्या हुई थी?)</Text>

        <View style={styles.optionContainer}>
          {options.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                answer === option.id && styles.selectedOption,
              ]}
              onPress={() => handleOptionSelect(option.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  answer === option.id && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {answer === 'c' && (
          <TextInput
            style={styles.textArea}
            placeholder="Details of issues that occurred during acquisition/(अधिग्रहण में हुई समस्याओं की जानकारी)"
            placeholderTextColor="gray"
            multiline
            numberOfLines={4}
            value={otherReason}
            onChangeText={(text) => setOtherReason(text)}
          />
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

export default PartTwoQues5;

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
    marginBottom: 16,
  },
  optionButton: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  selectedOption: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textArea: {
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 14,
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
