import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';


const options = [
  { id: 'a', label: 'Private (प्राईवेट)' },
  { id: 'b', label: 'Government (सरकारी)' },
  { id: 'c', label: 'Forest (जंगल)' },
  { id: 'd', label: 'Village Council (ग्राम सभा)' },
];

const PartOneQues1 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {}; //  receive values

  const { control, handleSubmit, watch } = useForm({
    defaultValues: { answer: null },
  });

  const selectedOption = watch('answer');
  const [loading, setLoading] = useState(false); // <-- Add loading state

  const onSubmit = async (data) => {
    setLoading(true); // Start loading
    try {
      const postData = {
        Question: 'Whose land is it?',
        Answer: data.answer,
        KmlName: name,
        ResearcherMobile: Number(researcherMobile),
        FormNo: String(formNumber)
      };

      const response = await axios.post(
        'https://brandscore.in/api/Part1Question1',
        postData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        console.log('Data posted:', response.data);
        Alert.alert('Done', 'Data Submitted');
        navigation.navigate('PartOneQues2', {
          name,
          researcherMobile,
          formNumber
        });
      } else {
        Alert.alert('Error', response.data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error posting data:', error.response?.data || error.message);
      Alert.alert('Error', 'Something went wrong while submitting.');
    }
    finally {
      setLoading(false); // Stop loading no matter what
    }
  };


  return (
    <View style={styles.container}>


      <Text style={styles.question}>Question 1</Text>
      <Text style={styles.question}> Whose land is it?</Text>
      <Text style={styles.question}>(जमीन किसकी है?)</Text>


       <Controller
        control={control}
        name="answer"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  value === option.id && styles.optionButtonSelected,
                ]}
                onPress={() => onChange(option.id)}
                disabled={loading} // disable options while loading
              >
                <Text
                  style={[
                    styles.optionText,
                    value === option.id && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />

      <TouchableOpacity
        style={[
          styles.nextButton,
          (!selectedOption || loading) && styles.nextButtonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={!selectedOption || loading} // disable button if no selection or loading
      >
        <Text style={styles.nextButtonText}>{loading ? 'Wait...' : 'Next Page'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PartOneQues1;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  optionButtonSelected: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
}); 