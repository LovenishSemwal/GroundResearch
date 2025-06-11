import axios from 'axios';
import { ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useFormData } from './FormDataContext';  // import the context

const PartTwoQues6 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  const initialSelectedOption = formData.PartTwoQues6?.selectedOption || '';
  const initialDetails = formData.PartTwoQues6?.details || '';
  const recordId = formData.PartTwoQues6?.id || null;

  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  const [details, setDetails] = useState(initialDetails);
  const [loading, setLoading] = useState(false);

  // Sync local state with context
  useEffect(() => {
    updateFormData('PartTwoQues6', {
      selectedOption,
      details,
      id: recordId,  // keep existing id intact
    });
  }, [selectedOption, details]);

  const handleNext = async () => {
    setLoading(true);

    const payload = {
      Question: 'Is any major project ongoing or being planned nearby (airport, roads, dams, solar, wind, defence, etc.)?',
      Answer: selectedOption,
      Details: selectedOption === 'Yes' ? details : '',
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
          `https://adfirst.in/api/Part2Question6/update/${recordId}`,
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
          'https://adfirst.in/api/Part2Question6',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Save new id from response into context
        if (response?.data?.id || response?.data?.Id) {
          const newId = response.data.id || response.data.Id;
          updateFormData('PartTwoQues6', { id: newId });
        }
      }

      console.log('Data submitted:', response.data);
      // Alert.alert('Data submitted successfully!');
      navigation.navigate('PartTwoQues7', {
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
      Alert.alert('An error occurred while submitting.');
    } finally {
      setLoading(false);
    }
  };

  const isNextEnabled =
    selectedOption === 'No' || (selectedOption === 'Yes' && details.trim() !== '');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.question}>Part2: Question 6</Text>
        <Text style={styles.question}>
          Is any major project ongoing or being planned nearby (airport, roads, dams, solar, wind, defence, etc.)?
        </Text>
        <Text style={styles.question}>
          (क्या आस-पास किसी बड़े प्रोजेक्ट पर काम चल रहा है या आने की बात चल रही है?)
        </Text>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'No' && styles.selectedOption,
          ]}
          onPress={() => setSelectedOption('No')}
        >
          <Text style={[styles.optionText, selectedOption === 'No' && { color: '#fff' }]}>
            No (नहीं)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'Yes' && styles.selectedOption,
          ]}
          onPress={() => setSelectedOption('Yes')}
        >
          <Text style={[styles.optionText, selectedOption === 'Yes' && { color: '#fff' }]}>
            Yes (हाँ)
          </Text>
        </TouchableOpacity>

        {selectedOption === 'Yes' && (
          <TextInput
            style={styles.textArea}
            placeholder="Please provide details..."
            placeholderTextColor="gray"
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={4}
          />
        )}

        {selectedOption !== '' && (
          <TouchableOpacity
            style={[
              styles.nextButton,
              { opacity: isNextEnabled && !loading ? 1 : 0.5 },
            ]}
            onPress={handleNext}
            disabled={!isNextEnabled || loading}
          >
            <Text style={styles.nextButtonText}>
              {loading ? 'Wait...' : 'Next Page'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PartTwoQues6;

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
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  nextButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
