import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import axios from 'axios';
import { useFormData } from './FormDataContext';  // import the context

const PartOneQues24 = ({ navigation, route }) => {
  const { selectedLine, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  const [acquisitionDetails, setAcquisitionDetails] = useState(() => formData.part1question24.answer || '');
  const [loading, setLoading] = useState(false);

  // Sync local changes with context
  useEffect(() => {
    updateFormData('part1question24', { answer: acquisitionDetails });
  }, [acquisitionDetails]);

  const handleSubmit = async () => {
    if (!acquisitionDetails) {
      Alert.alert('Validation', 'Please fill in the answer');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        Question: 'What problem could arise in this area?',
        Answer: acquisitionDetails,
        Researcher_Mobile: Number(researcherMobile),
        Kml_Name: selectedLine,
        Form_No: formNumber,
        Dist: selectedDistrict,
        State: selectedState,
        Village_Name: selectedVillage,
        Shape_Id: shapeId,
      };

      // Check if record exists (id available in context)
      if (formData.part1question24.id) {
        // UPDATE existing record
        const updateResponse = await axios.post(
          `https://adfirst.in/api/Part1Question24/update/${formData.part1question24.id}`,
          { ...payload, Id: formData.part1question24.id }
        );

        if (updateResponse.data.success) {
          Alert.alert('Success', 'Record updated successfully!', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('PartTwoQues1', {
                selectedLine,
                researcherMobile,
                formNumber,
                selectedState,
                selectedDistrict,
                selectedVillage,
                shapeId
              }),
            },
          ]);
        } else {
          Alert.alert('Error', 'Failed to update record.');
        }
      } else {
        // CREATE new record
        const createResponse = await axios.post(
          'https://adfirst.in/api/Part1Question24',
          payload
        );

        if (createResponse.status === 200 && createResponse.data.id) {
          updateFormData('part1question24', { id: createResponse.data.id });
          Alert.alert('Success', 'KM Wise Questionnaire is complete', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('LineandVillage', {
                // selectedLine,
                // researcherMobile,
                // formNumber,
                // selectedState,
                // selectedDistrict,
                // selectedVillage,
                // shapeId
              }),
            },
          ]);
        } else {
          Alert.alert('Error', 'Failed to save record.');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while submitting data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.question}>Question 24</Text>
        <Text style={styles.question}>What problem could arise in this area?</Text>
        <Text style={styles.question}>इस क्षेत्र में क्या समस्या आ सकती है</Text>

        <TextInput
          placeholder="अपना उत्तर यहाँ लिखें"
          placeholderTextColor="gray"
          value={acquisitionDetails}
          onChangeText={setAcquisitionDetails}
          multiline
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.nextButton, { opacity: acquisitionDetails ? 1 : 0.5 }]}
          onPress={handleSubmit}
          disabled={!acquisitionDetails || loading}
        >
          <Text style={styles.nextButtonText}>{loading ? 'Wait...' : 'Submit'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PartOneQues24;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  nextButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
