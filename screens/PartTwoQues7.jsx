import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import axios from 'axios';
import { useFormData } from './FormDataContext'; // use the context

const PartTwoQues7 = ({ navigation, route }) => {
    const { selectedLine, researcherMobile, formNumber, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};
    const { formData: contextData, updateFormData } = useFormData();

    // Initialize problemMakers with context data if available or default value
    const [problemMakers, setProblemMakers] = useState([{ id: null, name: '', background: '', mobile: '', reason: '' }]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Array.isArray(contextData.PartTwoQues7)) {
            setProblemMakers(contextData.PartTwoQues7);
        }
    }, [contextData.PartTwoQues7]);

    // Keep context updated whenever problemMakers changes
    useEffect(() => {
        updateFormData('PartTwoQues7', [...problemMakers]); // clone to avoid unintended mutations
    }, [problemMakers]);

    const addMore = () => {
        setProblemMakers([
            ...problemMakers,
            { id: null, name: '', background: '', mobile: '', reason: '' }
        ]);
    };

    const removeForm = (index) => {
        if (problemMakers.length > 1) {
            const updated = [...problemMakers];
            updated.splice(index, 1);
            setProblemMakers(updated);
        } else {
            Alert.alert("You must have at least one form filled out.");
        }
    };

    const handleChange = (index, field, value) => {
        const updated = [...problemMakers];
        updated[index][field] = value;
        setProblemMakers(updated);
    };

    const isNextEnabled = problemMakers.every(
        (item) =>
            item.name.trim() !== '' &&
            item.background.trim() !== '' &&
            item.mobile.trim() !== '' &&
            item.reason.trim() !== ''
    );

    const handleNext = async () => {
        if (!isNextEnabled) {
            Alert.alert('Please fill in all fields for each entry.');
            return;
        }

        setLoading(true);

        try {
            const updated = [...problemMakers]; // Clone to safely assign new IDs

            for (let index = 0; index < updated.length; index++) {
                const entry = updated[index];

                const payload = {
                    ...(entry.id ? { Id: entry.id } : {}),
                    question: 'Who can create problems in land acquisition?',
                    answer: null,
                    name: entry.name,
                    background: entry.background,
                    mobile_No: Number(entry.mobile),
                    reason: entry.reason,
                    kml_Name: selectedLine,
                    researcher_Mobile: Number(researcherMobile),
                    form_No: formNumber,
                    state: selectedState,
                    dist: selectedDistrict,
                    village_Name: selectedVillage,
                    shape_Id: shapeId
                };

                let response;
                if (entry.id) {
                    response = await axios.post(`https://adfirst.in/api/Part2Question7/update/${entry.id}`, payload);
                } else {
                    response = await axios.post('https://adfirst.in/api/Part2Question7', payload);
                }

                const returnedId = response.data?.id || response.data?.data?.id;
                if (returnedId) {
                    updated[index].id = returnedId;
                }
            }

            setProblemMakers(updated);
            updateFormData('PartTwoQues7', updated);
            // Alert.alert('All entries saved successfully!');
            navigation.navigate('PartTwoQues8', {
                selectedLine,
                researcherMobile,
                formNumber,
                selectedState,
                selectedDistrict,
                selectedVillage,
                shapeId
            });
        } catch (error) {
            console.error('Error submitting entries:', error.response?.data || error.message);
            Alert.alert('Error submitting entries. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.question}>Part2: Question 7</Text>
                <Text style={styles.question}>Who can create problems in land acquisition?</Text>
                <Text style={styles.question}>(कौन जमीन अधिग्रहण में समस्या खड़ी कर सकता है?)</Text>

                {problemMakers.map((item, index) => (
                    <View key={index} style={styles.formSet}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor="gray"
                            value={item.name}
                            onChangeText={(text) => handleChange(index, 'name', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Background and work"
                            placeholderTextColor="gray"
                            value={item.background}
                            onChangeText={(text) => handleChange(index, 'background', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mobile"
                            placeholderTextColor="gray"
                            keyboardType="phone-pad"
                            value={item.mobile}
                            onChangeText={(text) => handleChange(index, 'mobile', text)}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Reason"
                            placeholderTextColor="gray"
                            multiline
                            numberOfLines={4}
                            value={item.reason}
                            onChangeText={(text) => handleChange(index, 'reason', text)}
                        />

                        {problemMakers.length > 1 && (
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeForm(index)}
                            >
                                <Text style={styles.removeButtonText}>Remove Form</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.addMoreButton}
                    onPress={addMore}
                >
                    <Text style={styles.addMoreText}>Add More</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.nextButton, { opacity: isNextEnabled && !loading ? 1 : 0.5 }]}
                    onPress={handleNext}
                    disabled={!isNextEnabled || loading}
                >
                    <Text style={styles.nextButtonText}>{loading ? 'Wait...' : 'Next Page'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PartTwoQues7;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    question: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    formSet: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#aaa',
        marginBottom: 12,
        paddingVertical: 6,
        paddingHorizontal: 8,
        fontSize: 16,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    addMoreButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    addMoreText: {
        color: '#fff',
        fontSize: 16,
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
    removeButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 8,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 14,
    },
});
