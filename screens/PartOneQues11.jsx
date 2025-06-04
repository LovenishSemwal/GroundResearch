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

const PartOneQues11 = ({ navigation, route }) => {
    const { name, researcherMobile, formNumber } = route.params || {};
    const [selectedOption, setSelectedOption] = useState('');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);  // <-- add loading state

    const handleNext = async () => {
        setLoading(true);  // disable button and show wait
        // navigation.navigate('PartOneQues12', {
        //         name,
        //         researcherMobile,
        //         formNumber
        //     });
        try {
            const payload = {
                Question: "Is there any dispute or legal case on the land?",
                Answer: selectedOption === 'Yes' ? `${selectedOption}: ${details}` : selectedOption,
                Researcher_Mobile: Number(researcherMobile),
                Kml_Name: name,
                Form_No: formNumber,
            };

            const response = await axios.post(
                'https://brandscore.in/api/Part1Question11',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Data submitted:', response.data);
            Alert.alert('Data submitted successfully!');
            navigation.navigate('PartOneQues12', {
                name,
                researcherMobile,
                formNumber
            });
        } catch (error) {
            Alert.alert('Error submitting data. Check console for details.');
            console.error('Error submitting data:', error);
        } finally {
            setLoading(false);  // re-enable button no matter success or failure
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
                    Question 11
                </Text>
                <Text style={styles.question}>
                    Is there any dispute or legal case on the land?
                </Text>
                <Text style={styles.question}>
                    (क्या जमीन पर कोई विवाद है या कानूनी केस है?)
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
                            { opacity: isNextEnabled && !loading ? 1 : 0.5 },
                        ]}
                        onPress={handleNext}
                        disabled={!isNextEnabled || loading}  // disable button when loading
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
