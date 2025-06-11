import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useFormData } from './FormDataContext'; // import the context

const PartTwoQues1 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
  const { formData: contextData, updateFormData } = useFormData();

  const [formData, setFormData] = useState({
    id: contextData.PartTwoQues1?.id || 0,
    question: 'Information about the village',
    villageName: '',
    panchayat: '',
    block: '',
    district: '',
    population: '',
    totalLand: '',
    majorCrops: '',
    politicalInclination: '',
    fiveMostInfluentialFamilies: '',
    internalDisputeInVillage: '',
    internalDisputeInVillageDetails: '',
    influentialCommunitiesAndCastes: '',
    ResearcherMobile: Number(researcherMobile),
    KmlName: name,
    FormNo: formNumber,
    State: selectedState,
    Dist: selectedDistrict,
    VillageName1: selectedVillage,
    ShapeId: shapeId,
    ...contextData.PartTwoQues1
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateFormData('PartTwoQues1', formData);
  }, [formData]);

  const questions = [
    { key: 'villageName', label: 'Name of the village (गांव का नाम)' },
    { key: 'panchayat', label: 'Panchayat (पंचायत)' },
    { key: 'block', label: 'Block (ब्लॉक)' },
    { key: 'district', label: 'District (जिला)' },
    { key: 'population', label: 'Population (जनसंख्या)' },
    { key: 'totalLand', label: 'Total land (कुल जमीन)' },
    { key: 'majorCrops', label: 'Major crops (मुख्य फसलें)' },
    { key: 'politicalInclination', label: 'Political inclination (राजनीतिक झुकाव)' },
  ];

  const handleChange = (field, value) => {
    if (field === 'internalDisputeInVillage' && value === 'No') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        internalDisputeInVillageDetails: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNext = async () => {
    setLoading(true);

    for (const field of [
      'villageName',
      'panchayat',
      'block',
      'district',
      'population',
      'totalLand',
      'majorCrops',
      'politicalInclination',
      'fiveMostInfluentialFamilies',
      'internalDisputeInVillage',
      'influentialCommunitiesAndCastes'
    ]) {
      if (!formData[field]) {
        Alert.alert('Please fill in all the fields.');
        setLoading(false);
        return;
      }
    }

    if (formData.internalDisputeInVillage === 'Yes' && !formData.internalDisputeInVillageDetails) {
      Alert.alert('Please provide details for the internal dispute.');
      setLoading(false);
      return;
    }

    try {
      let apiUrl = '';
      if (formData.id === 0) {
        apiUrl = 'https://adfirst.in/api/TblPart2Question1/Insert';
      } else {
        apiUrl = 'https://adfirst.in/api/TblPart2Question1/Update';
      }

      const response = await axios.post(apiUrl, formData);

      if (response.data.success) {
        // Alert.alert('Data saved successfully!');
        const updatedData = response.data.data;

        setFormData(prev => ({ ...prev, ...updatedData }));
        updateFormData('PartTwoQues1', updatedData);

        navigation.navigate('PartTwoQues2', {
          name,
          researcherMobile,
          formNumber,
          selectedState,
          selectedDistrict,
          selectedVillage,
          shapeId
        });
      } else {
        Alert.alert('Failed to save data.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error saving data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mainQuestion}>Part2: Question 1</Text>
      <Text style={styles.mainQuestion}>Information about the Village</Text>
      <Text style={styles.mainQuestion}>(गांव के बारे में जानकारी)</Text>

      {questions.map((q) => (
        <View key={q.key} style={styles.inputGroup}>
          <Text style={styles.label}>{q.label}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={`Answer for: ${q.label}`}
            value={formData[q.key]}
            onChangeText={(text) => handleChange(q.key, text)}
            keyboardType={q.key === 'population' ? 'numeric' : 'default'}
          />
        </View>
      ))}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Five most influential families in the panchayat</Text>
        <Text style={styles.label}>(पंचायत के 5 सबसे प्रभावशाली परिवार)</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Answer for Question 9"
          value={formData.fiveMostInfluentialFamilies}
          onChangeText={(text) => handleChange('fiveMostInfluentialFamilies', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Has there been any internal dispute in the village?</Text>
        <Text style={styles.label}>(क्या गांव में किसी बात पर आपसी झगड़ा हुआ है?)</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.internalDisputeInVillage === 'Yes' && styles.optionButtonSelected
            ]}
            onPress={() => handleChange('internalDisputeInVillage', 'Yes')}
          >
            <Text style={styles.optionText}>Yes (हाँ)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.internalDisputeInVillage === 'No' && styles.optionButtonSelected
            ]}
            onPress={() => handleChange('internalDisputeInVillage', 'No')}
          >
            <Text style={styles.optionText}>No (नहीं)</Text>
          </TouchableOpacity>
        </View>

        {formData.internalDisputeInVillage === 'Yes' && (
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Please explain..."
            value={formData.internalDisputeInVillageDetails}
            onChangeText={(text) => handleChange('internalDisputeInVillageDetails', text)}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Influential communities and castes</Text>
        <Text style={styles.label}>(प्रभावशाली समाज और जातियां)</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Answer for Question 11"
          value={formData.influentialCommunitiesAndCastes}
          onChangeText={(text) => handleChange('influentialCommunitiesAndCastes', text)}
        />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleNext}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>{loading ? 'Wait...' : 'Next Page'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PartTwoQues1;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  mainQuestion: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ccc',
  },
  optionButtonSelected: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  optionText: {
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});