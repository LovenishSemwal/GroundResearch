import { ScrollView } from 'react-native';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { useFormData } from './FormDataContext';  // import the context

const PartOneQues14 = ({ navigation, route }) => {
    const { selectedLine, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
    const { formData, updateFormData } = useFormData(); // use the context
    const [loading, setLoading] = useState(false);

    // Use part1question14 data from context or fallback to empty
    const initialSelectedOption = formData.part1question14?.selectedOption || '';
    const initialDetails = formData.part1question14?.details || '';
    const recordId = formData.part1question14?.id || null;

    const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
    const [details, setDetails] = useState(initialDetails);

    // Sync local state with context
    useEffect(() => {
        updateFormData('part1question14', {
            selectedOption,
            details,
            id: recordId,  // keep id intact
        });
    }, [selectedOption, details]);

    const handleNext = async () => {
        setLoading(true);

        const payload = {
            Question: 'Does the area fall within a Defence Zone?',
            Answer: selectedOption === 'Yes' ? `${selectedOption}: ${details}` : selectedOption,
            Researcher_Mobile: Number(researcherMobile),
            Kml_Name: selectedLine,
            Form_No: formNumber,
            State: selectedState,
            Dist: selectedDistrict,
            Village_Name: selectedVillage,
            Shape_Id: shapeId
        };

        try {
            let response;

            if (recordId) {
                // Update existing record
                response = await axios.post(
                    `https://adfirst.in/api/Part1Question14/update/${recordId}`,
                    { ...payload, Id: recordId },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } else {
                // Create new record
                response = await axios.post(
                    'https://adfirst.in/api/Part1Question14',
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                // Save new id to context for future updates
                if (response?.data?.id || response?.data?.Id) {
                    const newId = response.data.id || response.data.Id;
                    updateFormData('part1question14', { id: newId });
                }
            }

            console.log('Data submitted:', response.data);
            // Alert.alert('Data submitted successfully!');
            navigation.navigate('PartOneQues15', {
                selectedLine,
                researcherMobile,
                formNumber,
                selectedState,
                selectedDistrict,
                selectedVillage,
                shapeId
            });
        } catch (error) {
            Alert.alert('Error submitting data. Check console for details.');
            console.error('Error submitting data:', error);
        } finally {
            setLoading(false);
        }
    };

    const isNextEnabled =
        selectedOption === 'No' || (selectedOption === 'Yes' && details.trim() !== '');

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
                    Question 14
                </Text>
                <Text style={styles.question}>
                    Does the area fall within a Defence Zone?
                </Text>
                <Text style={styles.question}>
                    (क्या क्षेत्र डिफेंस ज़ोन में आता है?)
                </Text>

                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        selectedOption === 'No' && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedOption('No')}
                >
                    <Text style={[styles.optionText, selectedOption === 'No' && { color: '#fff' }]}>
                        No (नहीं)
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        selectedOption === 'Yes' && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedOption('Yes')}
                >
                    <Text style={[styles.optionText, selectedOption === 'Yes' && { color: '#fff' }]}>
                        Yes (हाँ)
                    </Text>
                </TouchableOpacity>

                {selectedOption === 'Yes' && (
                    <TextInput
                        style={styles.textArea}
                        placeholder="name of the reserve..."
                        placeholderTextColor="gray"
                        value={details}
                        onChangeText={setDetails}
                        multiline
                        numberOfLines={4}
                    />
                )}

                {selectedOption !== '' && (
                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            { opacity: isNextEnabled && !loading ? 1 : 0.5 },
                        ]}
                        onPress={handleNext}
                        disabled={!isNextEnabled || loading}
                    >
                        <Text style={styles.nextButtonText}>
                            {loading ? 'Wait...' : 'Next Page'}
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PartOneQues14;

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
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginTop: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    nextButton: {
        backgroundColor: '#28a745',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});
