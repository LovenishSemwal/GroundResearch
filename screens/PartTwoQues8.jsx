import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

// Import your context hook
import { useFormData } from './FormDataContext';  // import the context

const optionsList = [
  'Legal disputes are ongoing in the area\n(क्षेत्र में कानूनी विवाद चल रहा है)',
  'There has been opposition to projects\n(परियोजनाओं का विरोध हुआ है)',
  'It is a sensitive area (near temples, schools, graveyards)\n(संवेदनशील क्षेत्र हैं (मंदिरों, स्कूलों, कब्रिस्तानों के पास))',
  'There have been internal conflicts within the community\n(समाज में आपसी संघर्ष हुआ है)',
  'A prominent political leader has a house or land in the area\n(क्षेत्र में किसी बड़े नेता का घर या जमीन है)',
];

const PartTwoQues8 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData, updateFormData } = useFormData();

  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      selectedOptions: formData.part2question8.selectedOptions || [],
    },
  });

  const selectedOptions = watch('selectedOptions');

  useEffect(() => {
    // Set form defaults from context when navigating back
    if (formData.part2question8.selectedOptions) {
      setValue('selectedOptions', formData.part2question8.selectedOptions);
    }
  }, [formData.part2question8.selectedOptions, setValue]);

  const toggleOption = (option) => {
    const newSelected = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];
    setValue('selectedOptions', newSelected);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    // Save data to context
    updateFormData('part2question8', {
      selectedOptions: data.selectedOptions,
    });

    // Prepare payload
    const payload = {
      Question:
        "It is the land area through which the transmission line will pass. Here, our objective is to identify the villages and areas where the project team might face opposition. According to you, in which category should this village be placed?",
      Answer: data.selectedOptions.join('; '),
      Kml_Name: name,
      Researcher_Mobile: Number(researcherMobile),
      Form_No: formNumber,
      Dist: selectedDistrict,
      State: selectedState,
      Village_Name: selectedVillage,
      Shape_Id: shapeId,
    };

    try {
      let response;
      if (formData.part2question8.id) {
        // UPDATE existing record
        const updatePayload = {
          id: formData.part2question8.id,
          ...payload,
        };

        response = await axios.post(
          `https://adfirst.in/api/Part2Question8/update/${formData.part2question8.id}`,
          updatePayload
        );
        console.log('Updated entry:', response.data);

        // Update the context with the latest ID and data
        updateFormData('part2question8', {
          id: response.data.data.id,
          selectedOptions: data.selectedOptions,
        });
        Alert.alert('Data Updated!');
      } else {
        // CREATE new record
        response = await axios.post(
          'https://adfirst.in/api/Part2Question8',
          payload
        );
        console.log('Created new entry:', response.data);

        // Save the generated ID
        updateFormData('part2question8', {
          id: response.data.id,
          selectedOptions: data.selectedOptions,
        });
        // Alert.alert('Data Submitted!');
      }

      navigation.navigate('PartTwoQues9', {
        name,
        researcherMobile,
        formNumber,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('An error occurred while submitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Main Heading */}
      <View style={styles.header}>
        <Text style={styles.heading}>Part2: Question 8</Text>
        <Text style={styles.heading}>RISK SCORE – ROW (Right of Way)</Text>
        <Text style={styles.heading}>(जोखिम स्कोर – रास्ते का अधिकार)</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.question}>
          It is the land area through which the transmission line will pass.
          Here, our objective is to identify the villages and areas where the
          project team might face opposition. According to you, in which category
          should this village be placed?
        </Text>
        <Text style={styles.question}>
          (वो भू-भाग वह क्षेत्र है जहाँ से ट्रांसमिशन लाइन गुजरेगी। यहाँ हमारा
          लक्ष्य उन गांवों और क्षेत्रों की पहचान करना है जहाँ प्रोजेक्ट टीम को
          विरोध का सामना करना पड़ सकता है। आपके अनुसार इस गांव को किस श्रेणी में
          रखा जाए?)
        </Text>

        <Controller
          control={control}
          name="selectedOptions"
          render={() => (
            <View>
              {optionsList.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.checkboxContainer}
                  onPress={() => toggleOption(option)}
                >
                  <View style={styles.checkbox}>
                    {selectedOptions.includes(option) && (
                      <View style={styles.checked} />
                    )}
                  </View>
                  <Text style={styles.label}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />

        {/* Note Box */}
        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteItem}>• High Risk: यहद इनमें से कोई भी समस्या है</Text>
          <Text style={styles.noteItem}>• Low Risk: यहद इनमें से कोई भी समस्या नहीं है</Text>
        </View>

        {/* Spacer so Next button is not hidden by keyboard or edges */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>{loading ? 'Wait...' : 'Next Page'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PartTwoQues8;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  question: {
    fontSize: 16,
    marginBottom: 14,
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#888',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#007bff',
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  noteBox: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    borderRadius: 6,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteItem: {
    fontSize: 15,
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
