import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import axios from 'axios';

const PartOneQues11 = ({ navigation, route }) => {
    const { name, researcherMobile, formNumber } = route.params || {};
    const [selectedOption, setSelectedOption] = useState('');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);

    const QUESTION_TEXT = 'Any other infrastructure project in the area?';

    const handleNext = async () => {
        if (selectedOption === '') return;

        const payload = {
            Question: QUESTION_TEXT,
            Answer: selectedOption,
            Details: selectedOption === 'Yes' ? details.trim() : '',
            Researcher_Mobile: Number(researcherMobile),
            Kml_Name: name,
            Form_No: formNumber,
        };

        try {
            setLoading(true);
            const response = await axios.post(
                'https://brandscore.in/api/Part1Question23',
                payload
            );
            Alert.alert('Success', 'Data submitted successfully');
            console.log('Submitted:', response.data);
            navigation.navigate('PartOneQues24', {
                name,
                researcherMobile,
                formNumber
            });
        } catch (error) {
            console.error('Submission failed:', error.message);
            Alert.alert('Error', 'Failed to submit the form.');
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
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.question}>
                    Question 23
                </Text>
                <Text style={styles.question}>
                    Any other infrastructure project in the area?
                </Text>
                <Text style={styles.question}>
                    (क्षेत्र में कोई और Infrastructure Project?)
                </Text>

                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        selectedOption === 'No' && styles.selectedOption,
                    ]}
                    onPress={() => {
                        setSelectedOption('No');
                        setDetails('');
                    }}
                >
                    <Text style={styles.optionText}>No (नहीं)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        selectedOption === 'Yes' && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedOption('Yes')}
                >
                    <Text style={styles.optionText}>Yes (हाँ)</Text>
                </TouchableOpacity>

                {selectedOption === 'Yes' && (
                    <TextInput
                        style={styles.textArea}
                        placeholder="If Yes, provide details..."
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
                            {loading ? 'Submitting...' : 'Next Page'}
                        </Text>
                    </TouchableOpacity>
                )}
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
