import { ScrollView } from 'react-native';

import axios from 'axios';
import React, { useState } from 'react';
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

const PartOneQues17 = ({ navigation, route }) => {
    const { name, researcherMobile, formNumber } = route.params || {};
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [details, setDetails] = useState('');

    const handleNext = async () => {
        setLoading(true);
        const payload = {
            question: "Is there any dispute or legal case on the land (as per local information)?",
            answer: selectedOption === 'Yes' ? `Yes - ${details}` : 'No',
            Researcher_Mobile: Number(researcherMobile),
            Kml_Name: name,
            Form_No: formNumber,
        };

        try {
            const response = await axios.post('https://brandscore.in/api/Part1Question17', payload);
            console.log(" Submitted successfully:", response.data);
            Alert.alert('Data submitted successfully!');
            navigation.navigate('PartOneQues18', {
                name,
                researcherMobile,
                formNumber
            });
        } catch (error) {
            Alert.alert('Error submitting data. Check console for details.');
            console.error(" Submission error:", error);
        } finally {
            setLoading(false); // Re-enable the button
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
                    Question 17
                </Text>
                <Text style={styles.question}>
                    Is there any dispute or legal case on the land (as per local information)?
                </Text>
                <Text style={styles.question}>
                    (क्या जमीन पर कोई विवाद या मुकदमा है (स्थानीय जानकारी के अनुसार)?)
                </Text>


                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        selectedOption === 'No' && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedOption('No')}
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
                        placeholder="If Yes Details..."
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
                        disabled={!isNextEnabled || loading} // Disable if loading
                    >
                        <Text style={styles.nextButtonText}>
                            {loading ? 'Please wait...' : 'Next Page'}
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAvoidingView>

    );
};

export default PartOneQues17;

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
