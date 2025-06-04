import React,{useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const options = [
  { id: 'a', label: 'Empty or agricultural or forest (खाली या कृषि या जंगल)' },
  { id: 'b', label: 'Populated - village (आबादी- गांव)' },
  { id: 'c', label: 'Populated - town (आबादी- कस्बा)' },
  { id: 'd', label: 'Populated - city (आबादी- शहर)' },
];

const PartOneQues5 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};

  const { control, handleSubmit, watch } = useForm({
    defaultValues: { answer: null }
  });

  const selectedOption = watch('answer');
  const [isSubmitting, setIsSubmitting] = useState(false); // <-- new state

  const onSubmit = async (data) => {
    setIsSubmitting(true);  // <-- disable button right away
    try {
      const payload = {
        question: "How is the area?",
        answer: data.answer,
        Kml_Name: name,
        Researcher_Mobile: Number(researcherMobile),
        FormNo: formNumber
      };

      const response = await axios.post("https://brandscore.in/api/Part1Question5", payload);

      if (response.data.success) {
        Alert.alert("Success", "Data saved successfully!");
        navigation.navigate("PartOneQues6", {
          name,
          researcherMobile,
          formNumber
        }); 
      } else {
        Alert.alert("Error", response.data.message || "Something went wrong.");
      }

    } catch (error) {
      console.error("Axios Error:", error);
      Alert.alert("Network Error", "Could not connect to server.");
    }finally {
      setIsSubmitting(false);  // <-- re-enable button after response/error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Question 5</Text>
      <Text style={styles.question}>How is the area?</Text>
      <Text style={styles.question}>(क्षेत्र कैसा है?)</Text>

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

      <TouchableOpacity
        style={[
          styles.nextButton,
          (!selectedOption || isSubmitting) && styles.nextButtonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={!selectedOption || isSubmitting} // disable while submitting
      >
        <Text style={styles.nextButtonText}>
          {isSubmitting ? "Wait..." : "Next Page"}  {/* show "Wait..." */}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PartOneQues5;

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
