import React, { useState } from 'react';
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
  Alert
} from 'react-native';

const PartTwoQuesFour = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};
  const [loading, setLoading] = useState(false);

  const [answer, setAnswer] = useState('');
  const [numericInput, setNumericInput] = useState('');

  const handleOptionSelect = (value) => {
    setAnswer(value);
    if (value === 'No') setNumericInput(''); // Clear if No
  };

  const handleNext = async () => {

    setLoading(true);
    if (answer === '') {
      Alert.alert('Please select Yes or No');
      return;
    }

    if (answer === 'Yes' && numericInput.trim() === '') {
      Alert.alert('Please enter the compensation amount');
      return;
    }

    try {
      // Prepare payload
      const payload = {
        Question: "How much compensation was received?",
        Answer: answer,
        Amount: answer === 'Yes' ? Number(numericInput) : null,
        Kml_Name: name,
        Researcher_Mobile: Number(researcherMobile),
        Form_No: formNumber
      };

      // Send data to backend
      const response = await axios.post('https://brandscore.in/api/Part2Question4', payload);

      console.log('Response:', response.data);

      Alert.alert('Data Submitted!');
      navigation.navigate('PartTwoQues5', { name, researcherMobile, formNumber });
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('An error occurred while submitting.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.mainQuestion}>
          Part2: Question 4
        </Text>
        <Text style={styles.mainQuestion}>
          How much compensation was received?
        </Text>
        <Text style={styles.subText}>(कितना मुआवजा मिला था?)</Text>

        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[styles.optionButton, answer === 'Yes' && styles.selectedOption]}
            onPress={() => handleOptionSelect('Yes')}
          >
            <Text style={[styles.optionText, answer === 'Yes' && styles.selectedOptionText]}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, answer === 'No' && styles.selectedOption]}
            onPress={() => handleOptionSelect('No')}
          >
            <Text style={[styles.optionText, answer === 'No' && styles.selectedOptionText]}>No</Text>
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

        <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={loading}>
          <Text style={styles.nextText}>{loading ? 'Submitting...' : 'Next Page'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PartTwoQuesFour;

// StyleSheet
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

  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
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
    marginBottom: 16
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
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

