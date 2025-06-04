import React, { useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert
} from 'react-native';

const PartOneQues16 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [work, setWork] = useState('');

  const handleSearchPress = () => {
    // Replace this URL with your actual search URL
    const url = 'https://epanjiyan.rajasthan.gov.in/dlcdistrict.aspx';
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const handleNext = async () => {
    setLoading(true); // Start loading
    const payload = {
      question: 'What is the circle rate of this area?',
      answer: work,
      researcher_Mobile: Number(researcherMobile),
      kml_Name: name,
      Form_No: formNumber,
    };

    try {
      const response = await axios.post('https://brandscore.in/api/Part1Question16', payload);
      console.log('Saved successfully:', response.data);
      Alert.alert('Data submitted successfully!');
      navigation.navigate('PartOneQues17', {
        name,
        researcherMobile,
        formNumber
      });
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error submitting data. Check console for details.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

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
          Question 16
        </Text>
        <Text style={styles.question}>
          What is the circle rate of this area?{' '}
          <Text style={styles.linkText} onPress={handleSearchPress}>
            (Search)
          </Text>
          ?
        </Text>

        <Text style={styles.questionHindi}>
          इस क्षेत्र का सर्कल रेट क्या है?{' '}
          <Text style={styles.linkText} onPress={handleSearchPress}>
            (खोजें)
          </Text>
          ?
        </Text>

        <TextInput
          placeholder="circle rate"
          placeholderTextColor="gray"
          value={work}
          onChangeText={setWork}
          style={styles.input}
        />

        <TouchableOpacity
          style={[
            styles.nextButton,
            { opacity: work && !loading ? 1 : 0.5 }
          ]}
          onPress={handleNext}
          disabled={!work || loading}
        >
          <Text style={styles.nextButtonText}>
            {loading ? 'Wait...' : 'Next Page'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PartOneQues16;

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
    marginBottom: 12,
    textAlign: 'center',
  },
  questionHindi: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 24,
    textAlign: 'center',
    color: '#444',
  },
  linkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
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
