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

const PartOneQues24 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};
  const [acquisitionDetails, setAcquisitionDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        Question: 'What problem could arise in this area?',
        Answer: acquisitionDetails,
        Researcher_Mobile: Number(researcherMobile),
        Kml_Name: name,
        Form_No: formNumber,
      };

      const response = await axios.post('https://brandscore.in/api/Part1Question24', payload);

      if (response.status === 200) {
        Alert.alert(
          'Success',
          'KM Wise Questionnaire is complete',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('PartTwoQues1', {
                name,
                researcherMobile,
                formNumber
              }),
            },
          ]
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while submitting data');
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
        <Text style={styles.question}>
          Question 24
        </Text>
        <Text style={styles.question}>
          What problem could arise in this area?
        </Text>
        <Text style={styles.question}>
          इस क्षेत्र में क्या समस्या आ सकती है
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
          style={[styles.nextButton, { opacity: acquisitionDetails ? 1 : 0.5 }]}
          onPress={handleSubmit}
          disabled={!acquisitionDetails || loading}
        >
          <Text style={styles.nextButtonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
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
