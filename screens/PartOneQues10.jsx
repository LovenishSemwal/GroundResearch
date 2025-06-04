import { ScrollView } from 'react-native';
import axios from 'axios';
import React, { useState } from 'react';
import {
  View,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const PartOneQues11 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};
  const [loading, setLoading] = useState(false); // <-- new loading state
  const [acquisitionStatus, setAcquisitionStatus] = useState('');
  const [yearAcquired, setYearAcquired] = useState('');
  const [compensationRate, setCompensationRate] = useState('');
  const [compensationGiven, setCompensationGiven] = useState('');


  const handleNext = async () => {
    setLoading(true);  // Disable button / show wait message
  try {
    const response = await axios.post('https://brandscore.in/api/Part1Question10', {
      Question: acquisitionStatus,
      Date_Of_Acquire: yearAcquired ? new Date(`${yearAcquired}-01-01`) : null,
      Compensation: compensationGiven === 'Yes' ? compensationRate : 'No',
      Researcher_Mobile: Number(researcherMobile),
        Kml_Name: name,
      Form_No: formNumber,
    });

    console.log('Data saved:', response.data);

    Alert.alert('Data submitted successfully!');
    navigation.navigate('PartOneQues11', {
          name,
          researcherMobile,
          formNumber
        });
  } catch (error) {
    console.error('Error saving data:', error);
    Alert.alert('Error submitting data. Check console for details.');
  }finally {
      setLoading(false);  // Enable button again
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
       <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.question}>
        Question 10
      </Text>
      <Text style={styles.question}>
        Has the nearby land been acquired for any government project?
      </Text>
      <Text style={styles.question}>
        (क्या आस-पास की जमीन किसी सरकारी प्रोजेक्ट के लिए अधिग्रहित की गई है?)
      </Text>

      <TouchableOpacity
        style={[
          styles.optionButton,
          acquisitionStatus === 'No land acquired' && styles.selectedOption,
        ]}
        onPress={() => setAcquisitionStatus('No land acquired')}
      >
        <Text style={styles.optionText}>a. No land acquired (कोई जमीन अधिग्रहित नहीं की गई)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionButton,
          acquisitionStatus === 'Yes, Acquired' && styles.selectedOption,
        ]}
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
            style={[
              styles.optionButton,
              compensationGiven === 'No' && styles.selectedOption,
            ]}
            onPress={() => {
              setCompensationGiven('No');
              setCompensationRate('');
            }}
          >
            <Text style={styles.optionText}>No (नहीं)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              compensationGiven === 'Yes' && styles.selectedOption,
            ]}
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
              onChangeText={text =>
                setCompensationRate(text.replace(/[^0-9]/g, ''))
              }
              keyboardType="numeric"
              style={styles.input}
            />
          )}
        </>
      )}

      <TouchableOpacity
      style={[
        styles.nextButton,
        { opacity: isNextEnabled && !loading ? 1 : 0.5 }, // button faded if loading or disabled
      ]}
      onPress={handleNext}
      disabled={!isNextEnabled || loading} // disable if not enabled or loading
    >
      <Text style={styles.nextButtonText}>
        {loading ? 'Wait...' : 'Next Page'}  {/* Show Wait... if loading */}
      </Text>
    </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PartOneQues11;

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