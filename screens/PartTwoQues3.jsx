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

const PartTwoQues3 = ({ navigation, route }) => {
    const { name, researcherMobile, formNumber } = route.params || {};
      const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [details, setDetails] = useState('');

    const handleNext = async () => {
    setLoading(true);
        try {
            // Prepare the payload for the backend
            const payload = {
                Question: "Was land acquired in the panchayat for any major project?",
                Was_Land_Acquired_In_Project: selectedOption,
                Details: selectedOption === 'Yes' ? details : '',
                Researcher_Mobile: Number(researcherMobile),
                Kml_Name: name,
                Form_No: formNumber
            };

            // Send data to your backend using Axios
            const response = await axios.post('https://brandscore.in/api/Part2Question3', payload);

            console.log('Response from backend:', response.data);
             Alert.alert('Data Submitted');
            navigation.navigate('PartTwoQues4', {
                name,
                researcherMobile,
                formNumber
            });
        } catch (error) {
            console.error('Error sending data to backend:', error);
            Alert.alert('An error occurred while submitting data.');
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
                    Part2: Question 3
                </Text>
                <Text style={styles.question}>
                    Was land acquired in the panchayat for any major project?
                </Text>
                <Text style={styles.question}>
                    (क्या पंचायत में किसी बड़ी परियोजना के लिए जमीन का अधिग्रहण किया गया था?)
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

export default PartTwoQues3;

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
