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

const PartOneQues14 = ({ navigation, route }) => {
    const { name, researcherMobile, formNumber } = route.params || {};
    const [selectedOption, setSelectedOption] = useState('');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const handleNext = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.post('https://brandscore.in/api/Part1Question14', {
                Question: 'Does the area fall within a Defence Zone?',
                Answer: selectedOption === 'Yes' ? `Yes - ${details}` : 'No',
                Researcher_Mobile: Number(researcherMobile),
                Kml_Name: name,
                Form_No: formNumber,
            });
            Alert.alert('Data saved successfully!');
            console.log('Saved:', response.data);
            navigation.navigate('PartOneQues15', {
                name,
                researcherMobile,
                formNumber
            });
        } catch (error) {
            console.error('Error saving data:', error.message);
            Alert.alert('Error saving data:', error.message);
        } finally {
            setLoading(false); // Stop loading
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
                            {loading ? 'wait...' : 'Next Page'}
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
