import React, { useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert
} from 'react-native';

const PartOneQues15 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};
  const [answer, setAnswer] = useState('');
  const [personName, setPersonName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false); // New: loading state

  const handleNext = async () => {
    setLoading(true); // Start loading
    try {
      const payload = {
        question: 'Is this land or the nearby land owned by any local leader or influential person?',
        answer: answer,
        researcher_Mobile: Number(researcherMobile),
        kml_Name: name,
        Form_No: formNumber,
        Name: answer === 'Yes' ? personName : null,  
        Mobile: answer === 'Yes' ? mobileNumber : null,
        Details: answer === 'Yes' ? details : null
      };

      const response = await axios.post(
        'https://brandscore.in/api/Part1Question15',
        payload
      );

      console.log('Saved successfully:', response.data);
      Alert.alert('Data submitted successfully!');
      navigation.navigate('PartOneQues16', {
        name,
        researcherMobile,
        formNumber
      });
    } catch (error) {
      console.error('Error saving data:', error.message);
      Alert.alert('Error submitting data. Check console for details.');
    } finally {
      setLoading(false); // Stop loading after completion
    }
  };

  const isNextEnabled =
    (answer === 'No' ||
      (answer === 'Yes' &&
        personName.trim().length > 0 &&
        mobileNumber.trim().length === 10 &&
        details.trim().length > 0))
    && !loading; // Disable if loading

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.question}>
          Question 15
        </Text>
        <Text style={styles.question}>
          Is this land or the nearby land owned by any local leader or influential person?
        </Text>
        <Text style={styles.question}>
          (क्या यह जमीन या आस-पास की जमीन किसी स्थानीय नेता या प्रभावशाली व्यक्ति की है?)
        </Text>

        <TouchableOpacity
          style={[styles.optionButton, answer === 'No' && styles.selectedOption]}
          onPress={() => {
            setAnswer('No');
            setPersonName('');
            setMobileNumber('');
            setDetails('');
          }}
          disabled={loading} // Disable while loading
        >
          <Text style={styles.optionText}>No (नहीं)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, answer === 'Yes' && styles.selectedOption]}
          onPress={() => setAnswer('Yes')}
          disabled={loading} // Disable while loading
        >
          <Text style={styles.optionText}>Yes (हाँ)</Text>
        </TouchableOpacity>

        {answer === 'Yes' && (
          <>
            <TextInput
              placeholder="Name of Person (व्यक्ति का नाम)"
              placeholderTextColor="gray"
              value={personName}
              onChangeText={setPersonName}
              style={styles.input}
              editable={!loading} // Disable while loading
            />

            <TextInput
              placeholder="Mobile Number (मोबाइल नंबर)"
              placeholderTextColor="gray"
              value={mobileNumber}
              onChangeText={text => setMobileNumber(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
              editable={!loading} // Disable while loading
            />

            <TextInput
              placeholder="Details (विवरण)"
              placeholderTextColor="gray"
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
              editable={!loading} // Disable while loading
            />
          </>
        )}

        <TouchableOpacity
          style={[styles.nextButton, { opacity: isNextEnabled ? 1 : 0.5 }]}
          onPress={handleNext}
          disabled={!isNextEnabled}
        >
          <Text style={styles.nextButtonText}>
            {loading ? 'Please wait...' : 'Next Page'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PartOneQues15;

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
    marginBottom: 20,
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
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
