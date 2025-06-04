import React, { useState } from 'react';
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

const PartOneQues19 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};
  const [acquisitionDetails, setAcquisitionDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW STATE

  const handleNext = async () => {
    setIsSubmitting(true); // Disable the button and show "Please wait..."
    const payload = {
      Question: "If yes, then when was it acquired and how much compensation was given?",
      Answer: acquisitionDetails,
      Researcher_Mobile: Number(researcherMobile),
      Kml_Name: name,
      Form_No: formNumber,
    };

    try {
      const response = await axios.post('https://brandscore.in/api/Part1Question19', payload);
      if (response.status === 200) {
        Alert.alert('Success', 'Data submitted successfully!');
        navigation.navigate('PartOneQues20', {
          name,
          researcherMobile,
          formNumber
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert("Error", "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.question}>
          Question 19
        </Text>
        <Text style={styles.question}>
          If yes, then when was it acquired and how much compensation was given?
        </Text>
        <Text style={styles.question}>
          अगर हाँ, तो कब अधिग्रहण हुआ था और कितना मुआवजा मिला था?
        </Text>

        <TextInput
          placeholder="अपना उत्तर यहाँ लिखें"
          placeholderTextColor="gray"
          value={acquisitionDetails}
          onChangeText={setAcquisitionDetails}
          multiline
          style={styles.input}
        />

        <TouchableOpacity
          style={[
            styles.nextButton,
            { opacity: acquisitionDetails && !isSubmitting ? 1 : 0.5 },
          ]}
          onPress={handleNext}
          disabled={!acquisitionDetails || isSubmitting} // Disabled while submitting
        >
          <Text style={styles.nextButtonText}>
            {isSubmitting ? 'Please wait...' : 'Next Page'} {/* Dynamic button text */}
          </Text>
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
