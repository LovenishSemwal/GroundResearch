import { ScrollView } from 'react-native';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import axios from 'axios';

const PartTwoQues6 = ({ navigation, route }) => {
    const { name, researcherMobile, formNumber } = route.params || {};
          const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [details, setDetails] = useState('');

    const handleNext = async () => {
        setLoading(true);
        try {
            const payload = {
                Question: selectedOption === 'No' ? 'No (High Risk नहीं है)' : 'Yes (High Risk है)',
                Details: selectedOption === 'Yes' ? details.trim() : '',
                Kml_Name: name,
                Researcher_Mobile: Number(researcherMobile),
                Form_No: formNumber
            };

            const response = await axios.post('https://brandscore.in/api/Part2Question9', payload);

            if (response.status === 200) {
                Alert.alert('Success', 'Your response has been submitted!');
                navigation.navigate('Select', { name, researcherMobile});
            } else {
                Alert.alert('Error', 'Failed to submit. Please try again.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }finally {
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
                    Part2: Question 9
                </Text>
                <Text style={styles.question}>
                    If it is high risk, then what can be done?
                </Text>
                <Text style={styles.question}>
                    अगर हाई रिस्क है तो क्या किया जा सकता है?
                </Text>

                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        selectedOption === 'No' && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedOption('No')}
                >
                    <Text style={styles.optionText}>No (High Risk नहीं है)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        selectedOption === 'Yes' && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedOption('Yes')}
                >
                    <Text style={styles.optionText}>Yes (High Risk है)</Text>
                </TouchableOpacity>

                {selectedOption === 'Yes' && (
                    <TextInput
                        style={styles.textArea}
                        placeholder="Please provide details..."
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
                            { opacity: isNextEnabled ? 1 : 0.5 },
                        ]}
                        onPress={handleNext}
                        disabled={!isNextEnabled || loading}
                    >
                        <Text style={styles.nextButtonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PartTwoQues6;

// (styles remain unchanged)
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