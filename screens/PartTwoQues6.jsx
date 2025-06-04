import axios from 'axios';
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
    Alert
} from 'react-native';

const PartTwoQues6 = ({ navigation, route }) => {
    const { name, researcherMobile, formNumber } = route.params || {};
      const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [details, setDetails] = useState('');



    const handleNext = async () => {
    setLoading(true);
        const dataToSend = {
            Question: 'Is any major project ongoing or being planned nearby (airport, roads, dams, solar, wind, defence, etc.)?',
            Answer: selectedOption,
            Details: selectedOption === 'Yes' ? details : '',
            Kml_Name: name,
            Researcher_Mobile: Number(researcherMobile),
            Form_No: formNumber
        };

        try {
            const response = await axios.post('https://brandscore.in/api/Part2Question6', dataToSend);
            console.log('Data submitted successfully:', response.data);
            Alert.alert('Data Submitted!');
            navigation.navigate('PartTwoQues7', { name, researcherMobile, formNumber });
        } catch (error) {
            console.error('Error submitting data:', error);
            Alert.alert('An error occurred while submitting.');
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
                    Part2: Question 6
                </Text>
                <Text style={styles.question}>
                    Is any major project ongoing or being planned nearby (airport, roads, dams, solar, wind, defence, etc.)?
                </Text>
                <Text style={styles.question}>
                    (क्या आस-पास किसी बड़े प्रोजेक्ट पर काम चल रहा है या आने की बात चल रही है (एयरपोर्ट, सड़कें, बांध, सोलर, विंड, डिफेंस आदि)?)
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
                            { opacity: isNextEnabled ? 1 : 0.5 },
                        ]}
                        onPress={handleNext}
                        disabled={!isNextEnabled || loading}
                    >
                        <Text style={styles.nextButtonText}>{loading ? 'Submitting...' : 'Next Page'}</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PartTwoQues6;

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
