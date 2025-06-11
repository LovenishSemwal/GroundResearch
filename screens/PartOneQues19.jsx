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
import { useFormData } from './FormDataContext';

const PartOneQues19 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  // Local state
  const [acquisitionDetails, setAcquisitionDetails] = useState(() => formData.part1question19.acquisitionDetails || '');
  const [loading, setLoading] = useState(false);

  // Sync local state to context
  useEffect(() => {
    updateFormData('part1question19', { acquisitionDetails });
  }, [acquisitionDetails]);

  const handleSubmit = async () => {
    if (!acquisitionDetails) {
      Alert.alert('Validation', 'Please fill in the answer');
      return;
    }

    setLoading(true);

    const payload = {
      Question: "If yes, then when was it acquired and how much compensation was given?",
      Answer: acquisitionDetails,
      Researcher_Mobile: Number(researcherMobile),
      Kml_Name: name,
      Form_No: formNumber,
      Dist: selectedDistrict,
      State: selectedState,
      Village_Name: selectedVillage,
      Shape_Id: shapeId,
    };

    try {
      if (formData.part1question19.id) {
        // Update existing record
        const updateResponse = await axios.post(
          `https://adfirst.in/api/Part1Question19/update/${formData.part1question19.id}`,
          { ...payload, Id: formData.part1question19.id }
        );

        if (updateResponse.data.success) {
          Alert.alert('Success', 'Record updated successfully!', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('PartOneQues20', {
                name,
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
        // Create new record
        const createResponse = await axios.post(
          'https://adfirst.in/api/Part1Question19',
          payload
        );

        if (createResponse.status === 200 && createResponse.data.id) {
          updateFormData('part1question19', { id: createResponse.data.id });
          Alert.alert('Success', 'Data saved successfully!', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('PartOneQues20', {
                name,
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
        <Text style={styles.question}>Question 19</Text>
        <Text style={styles.question}>If yes, then when was it acquired and how much compensation was given?</Text>
        <Text style={styles.question}>अगर हाँ, तो कब अधिग्रहण हुआ था और कितना मुआवजा मिला था?</Text>

        <TextInput
          placeholder="अपना उत्तर यहाँ लिखें"
          placeholderTextColor="gray"
          value={acquisitionDetails}
          onChangeText={setAcquisitionDetails}
          multiline
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.nextButton, { opacity: acquisitionDetails && !loading ? 1 : 0.5 }]}
          onPress={handleSubmit}
          disabled={!acquisitionDetails || loading}
        >
          <Text style={styles.nextButtonText}>{loading ? 'Please wait...' : 'Next Page'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PartOneQues19;

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