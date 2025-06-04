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
    const [loading, setLoading] = useState(false); // NEW STATE

    const handleNext = async () => {
        setLoading(true); // Show loading state
        const payload = {
            question: "Does the area fall within a historically significant region?",
            answer: selectedOption === 'Yes' ? `Yes - ${details}` : 'No',
            Researcher_Mobile: Number(researcherMobile),
            Kml_Name: name,
            Form_No: formNumber,
        };

        try {
            const response = await axios.post('https://brandscore.in/api/Part1Question13', payload);
            console.log(" Submitted successfully:", response.data);
            Alert.alert('Data submitted successfully!');
            navigation.navigate('PartOneQues14', {
                name,
                researcherMobile,
                formNumber
            });
        } catch (error) {
            Alert.alert('Error submitting data. Check console for details.');
            console.error(" Submission error:", error);
        } finally {
            setLoading(false); // Reset loading state after response
        }
    };

    const isNextEnabled =
        (selectedOption === 'No' || (selectedOption === 'Yes' && details.trim() !== '')) && !loading;

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
                    Question 13
                </Text>
                <Text style={styles.question}>
                    Does the area fall within a historically significant region?
                </Text>
                <Text style={styles.question}>
                    (क्या क्षेत्र ऐतिहासिक रूप से महत्वपूर्ण क्षेत्र में आता है?)
                </Text>

                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        selectedOption === 'No' && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedOption('No')}
                    disabled={loading}
                >
                    <Text style={styles.optionText}>No (नहीं)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        selectedOption === 'Yes' && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedOption('Yes')}
                    disabled={loading}
                >
                    <Text style={styles.optionText}>Yes (हाँ)</Text>
                </TouchableOpacity>

                {selectedOption === 'Yes' && (
                    <TextInput
                        style={styles.textArea}
                        placeholder="name of the monument..."
                        placeholderTextColor="gray"
                        value={details}
                        onChangeText={setDetails}
                        multiline
                        numberOfLines={4}
                        editable={!loading} // Prevent editing during submission
                    />
                )}

                {selectedOption !== '' && (
                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            { opacity: isNextEnabled ? 1 : 0.5 },
                        ]}
                        onPress={handleNext}
                        disabled={!isNextEnabled}
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
