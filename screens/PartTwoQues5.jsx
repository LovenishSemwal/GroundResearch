import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const options = [
  { id: 'a', label: ' No acquisition took place\n(अधिग्रहण नहीं हुआ)' },
  { id: 'b', label: 'Acquisition took place, but there was no issue\n(अधिग्रहण हुआ था, पर कोई समस्या नहीं हुई थी)' },
  { id: 'c', label: 'Acquisition took place\n(अधिग्रहण हुआ था)' },
];

const PartTwoQues5 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, watch } = useForm({
    defaultValues: { answer: null, otherReason: '' },
  });

  const selectedOption = watch('answer');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepare the payload with only the fields you want to send
      const payload = {
        Question: "Was there any issue during the acquisition?",
        Answer: data.answer,
        Details: data.otherReason || "",
        Kml_Name: name,
        Researcher_Mobile: Number(researcherMobile),
        Form_No: formNumber
      };

      const response = await axios.post('https://brandscore.in/api/Part2Question5', payload);
      console.log('Backend response:', response.data);
      Alert.alert('Data Submitted!');
      navigation.navigate('PartTwoQues6', { name, researcherMobile, formNumber });

    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert('An error occurred while submitting.');
    }finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Part2: Question 5</Text>
      <Text style={styles.question}>Was there any issue during the acquisition?</Text>
      <Text style={styles.question}>(अधिग्रहण में क्या कोई समस्या हुई थी?)</Text>

      <Controller
        control={control}
        name="answer"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.optionsContainer}>
            {options.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  value === option.id && styles.optionButtonSelected,
                ]}
                onPress={() => onChange(option.id)}
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

      {/* Show textarea if "Other" selected */}
      {selectedOption === 'c' && (
        <Controller
          control={control}
          name="otherReason"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.textArea}
              placeholder="Details of issues that occurred during acquisition/(अधिग्रहण में हुई समस्याओं की जानकारी)"
              placeholderTextColor="gray"
              multiline
              numberOfLines={4}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedOption && styles.nextButtonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={!selectedOption || loading}
      >
        <Text style={styles.nextButtonText}>{loading ? 'Submitting...' : 'Next Page'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PartTwoQues5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 16,
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
  textArea: {
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
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
