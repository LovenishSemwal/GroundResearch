import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFormData } from './FormDataContext';

const createInitialForm = () => ({
  uniqueId: Date.now(),
  name: '',
  designation: '',
  opinion: '',
  actionsSupport: '',
  actionsOpposition: '',
  concerns: {
    compensation: false,
    landImpact: false,
    health: false,
    cropImpact: false,
    pollution: false,
    other: false,
    otherText: '',
  },
});

const PartTwoQues2 = ({ navigation, route }) => {
  const {
    selectedLine,
    researcherMobile,
    formNumber,
    selectedState,
    selectedDistrict,
    selectedVillage,
    shapeId,
  } = route.params || {};
  const { formData, updateFormData } = useFormData();

  const [forms, setForms] = useState(() => {
    if (formData.partTwoQues2Forms && Array.isArray(formData.partTwoQues2Forms)) {
      return formData.partTwoQues2Forms;
    }
    return [createInitialForm()];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateFormData({ partTwoQues2Forms: forms });
  }, [forms, updateFormData]);

  const handleChange = (index, field, value) => {
    const updated = [...forms];
    updated[index][field] = value;
    setForms(updated);
  };

  const handleConcernChange = (index, concernKey, value) => {
    const updated = [...forms];
    updated[index].concerns[concernKey] = value;
    setForms(updated);
  };

  const addForm = () => {
    setForms([...forms, createInitialForm()]);
  };

  const removeForm = (index) => {
    Alert.alert(
      'Remove Form',
      'Are you sure you want to remove this form?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedForms = forms.filter((_, i) => i !== index);
            setForms(updatedForms);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleNextPage = async () => {
    setLoading(true);

    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      if (!form.name.trim()) {
        Alert.alert(`Form ${i + 1}: Name is required`);
        setLoading(false);
        return;
      }
      if (!form.designation.trim()) {
        Alert.alert(`Form ${i + 1}: Designation is required`);
        setLoading(false);
        return;
      }
      if (!form.opinion) {
        Alert.alert(`Form ${i + 1}: Opinion is required`);
        setLoading(false);
        return;
      }
      if (form.opinion === 'support' && !form.actionsSupport.trim()) {
        Alert.alert(`Form ${i + 1}: Support reason is required`);
        setLoading(false);
        return;
      }
      if (form.opinion === 'oppose' && !form.actionsOpposition.trim()) {
        Alert.alert(`Form ${i + 1}: Opposition reason is required`);
        setLoading(false);
        return;
      }
      if (form.concerns.other && !form.concerns.otherText.trim()) {
        Alert.alert(`Form ${i + 1}: Please specify the 'Other' concern`);
        setLoading(false);
        return;
      }
    }

    try {
      const updatedForms = [...forms];
      for (let i = 0; i < forms.length; i++) {
        const form = forms[i];
        const dataToSend = {
          Id: form.id,
          Name: form.name,
          Position: form.designation,
          OpinionAboutTheProjectInVillage: form.opinion,
          OpinionCause: form.opinion === 'support' ? form.actionsSupport : form.actionsOpposition,
          ConcernsRegardingTheProject: JSON.stringify(form.concerns),
          ResearcherMobile: Number(researcherMobile),
          KmlName: selectedLine,
          FormNo: formNumber,
          State: selectedState,
          Dist: selectedDistrict,
          VillageName1: selectedVillage,
          ShapeId: shapeId,
        };

        let response;
        if (form.id) {
          response = await fetch(
            `https://adfirst.in/api/TblPart2Question2/Update/${form.id}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(dataToSend),
            }
          );
        } else {
          response = await fetch('https://adfirst.in/api/TblPart2Question2/Insert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
          });
        }

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Form ${i + 1} submission failed: ${errorData}`);
        }

        const result = await response.json();
        if (!form.id && result.data && result.data.id) {
          updatedForms[i].id = result.data.id;
        }
      }

      setForms(updatedForms);
      updateFormData({ partTwoQues2Forms: updatedForms });

      // Alert.alert('Success', 'All data submitted successfully!');
      navigation.navigate('PartTwoQues3', {
        selectedLine,
        researcherMobile,
        formNumber,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to submit data');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = (form, index) => (
    <View key={form.uniqueId} style={styles.formBlock}>
      <Text style={styles.subHeading}>Form {index + 1}</Text>

      <Text style={styles.label}>Name (नाम)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={form.name}
        onChangeText={(text) => handleChange(index, 'name', text)}
      />

      <Text style={styles.label}>Designation/Position (पद)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter designation"
        value={form.designation}
        onChangeText={(text) => handleChange(index, 'designation', text)}
      />

      <Text style={styles.label}>Opinion about the project in the village –</Text>
      <Text style={styles.label}>(गांव में परियोजना के बारे में धारणा –)</Text>
      <View style={styles.optionsRow}>
        {['support', 'neutral', 'oppose'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              form.opinion === option && styles.selectedOption,
            ]}
            onPress={() => handleChange(index, 'opinion', option)}
          >
            <Text style={styles.optionText}>
              {option === 'support'
                ? 'Support (समर्थन)'
                : option === 'neutral'
                  ? 'Neutral (तटस्थ)'
                  : 'Opposition (विरोध)'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {form.opinion === 'support' && (
        <>
          <Text style={styles.label}>Reasons given in support</Text>
          <Text style={styles.label}>(समर्थन के लिए दिए गए कारण)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            numberOfLines={4}
            placeholder="Describe support actions"
            value={form.actionsSupport}
            onChangeText={(text) => handleChange(index, 'actionsSupport', text)}
          />
        </>
      )}

      {form.opinion === 'oppose' && (
        <>
          <Text style={styles.label}>Reasons given in opposition</Text>
          <Text style={styles.label}>(विरोध के दिए गए कारण)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            numberOfLines={4}
            placeholder="Describe opposition actions"
            value={form.actionsOpposition}
            onChangeText={(text) => handleChange(index, 'actionsOpposition', text)}
          />
        </>
      )}

      <Text style={styles.label}>Concerns regarding the project -</Text>
      <Text style={styles.label}>(परियोजना को लेकर उनकी चिंताएँ क्या हैं –)</Text>

      {[
        { key: 'compensation', label: 'Inadequate compensation will be given\n(उचित मुआवजा नहीं मिलेगा)' },
        { key: 'landImpact', label: 'Negative impact on our land\n(हमारी जमीन पर खराब असर पड़ेगा)' },
        { key: 'health', label: 'Health concerns – risk of disease\n(स्वास्थ्य पर प्रभाव – इससे बीमारी का खतरा है)' },
        { key: 'cropImpact', label: 'Long-term impact on crops\n(फसल पर दूरगामी असर)' },
        { key: 'pollution', label: 'Fear of pollution\n(प्रदूषण का डर)' },
        { key: 'other', label: 'Other (please specify)\n(अन्य (निर्दिष्ट किया जाना है))' },
      ].map(({ key, label }) => (
        <View key={key} style={styles.checkboxRow}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
              handleConcernChange(index, key, !form.concerns[key])
            }
          >
            <Text style={styles.checkboxMark}>{form.concerns[key] ? '✓' : ''}</Text>
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>{label}</Text>
        </View>
      ))}

      {form.concerns.other && (
        <TextInput
          style={styles.input}
          placeholder="Please specify other concerns"
          value={form.concerns.otherText}
          onChangeText={(text) => handleConcernChange(index, 'otherText', text)}
        />
      )}

      {forms.length > 1 && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeForm(index)}
        >
          <Text style={styles.removeButtonText}>Remove This Form</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Part2: Question 2</Text>
      <Text style={styles.heading}>Village-wise Perception Mapping</Text>
      <Text style={styles.heading}>(गांव-वार धारणा मानचित्रण)</Text>

      {forms.map((form, index) => renderForm(form, index))}

      <TouchableOpacity style={styles.addButton} onPress={addForm}>
        <Text style={styles.addButtonText}>+ Add More</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNextPage}
        disabled={loading}
      >
        <Text style={styles.nextButtonText}>
          {loading ? 'Wait...' : 'Next Page'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PartTwoQues2;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20,
  },
  formBlock: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    elevation: 2,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  optionButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxMark: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
