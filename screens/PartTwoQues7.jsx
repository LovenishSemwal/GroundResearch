import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import axios from 'axios';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

const PartTwoQues7 = ({ navigation, route }) => {
    const { name, researcherMobile, formNumber } = route.params || {};
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, watch, formState } = useForm({
        defaultValues: {
            mainAnswer: null,
            details: [],
        },
        mode: 'onChange',
    });

    const { append, fields } = useFieldArray({
        control,
        name: 'details',
    });

    const mainAnswer = watch('mainAnswer');
    const details = watch('details');

    const isFormValid = () => {
        if (mainAnswer !== 'yes') return mainAnswer === 'no';
        return (
            details.length > 0 &&
            details.every(
                item =>
                    item.field1?.trim() &&
                    item.field2?.trim() &&
                    item.textarea?.trim() &&
                    /^\d{10}$/.test(item.mobile || '')
            )
        );
    };

    const onSubmit = async (data) => {

        setLoading(true);
        try {
            if (data.mainAnswer === 'no') {
                const payload = {
                    Question: 'Who are the people that may create problems during land acquisition?',
                    Answer: 'No',
                    Name: "",
                    Background: '',
                    Reason: '',
                    Kml_Name: name,
                    Researcher_Mobile: Number(researcherMobile),
                    Form_No: formNumber,
                };
                await axios.post('https://brandscore.in/api/Part2Question7', payload);
            } else if (data.mainAnswer === 'yes') {
                const promises = data.details.map(detail => {
                    const payload = {
                        Question: 'Who are the people that may create problems during land acquisition?',
                        Answer: 'Yes',
                        Name: detail.field1,
                        Background: detail.field2,
                        Reason: detail.textarea,
                        Mobile_No: Number(detail.mobile),
                        Kml_Name: name,
                        Researcher_Mobile: Number(researcherMobile),
                        Form_No: formNumber,
                    };
                    return axios.post('http://apirj.pollfirst.in/api/Part2Question7', payload);
                });

                await Promise.all(promises);
            }

            Alert.alert('Data Submitted!');
            navigation.navigate('PartTwoQues8', { name, researcherMobile, formNumber });
        } catch (error) {
            console.error('Error submitting data:', error);
            Alert.alert('An error occurred while submitting.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <ScrollView style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }} >
            <Text style={styles.question}>Part2: Question 7</Text>
            <Text style={styles.question}>Who are the people that may create problems during land acquisition?</Text>
            <Text style={styles.question}>(कौन से लोग जमीन अधिग्रहण में समस्या खड़ी कर सकते हैं?)</Text>

            {/* Yes/No Buttons */}
            <Controller
                control={control}
                name="mainAnswer"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                    <View style={styles.toggleContainer}>
                        {['yes', 'no'].map(option => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.optionButton,
                                    value === option && styles.optionButtonSelected,
                                ]}
                                onPress={() => {
                                    onChange(option);

                                    if (option === 'yes' && details.length === 0) {
                                        append({
                                            field1: '',
                                            field2: '',
                                            textarea: '',
                                            mobile: '',
                                        });
                                    } else if (option === 'no') {
                                        while (details.length > 0) {
                                            details.pop();
                                        }
                                    }
                                }}

                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        value === option && styles.optionTextSelected,
                                    ]}
                                >
                                    {option === 'yes' ? 'Yes (हाँ)' : 'No one (कोई नहीं)'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />

            {/* Conditional Form Fields */}
            {mainAnswer === 'yes' &&
                fields.map((field, index) => (
                    <View key={field.id} style={styles.formGroup}>
                        <Text style={styles.subHeading}>Form {index + 1}</Text>

                        {/* Field 1 */}
                        <Controller
                            control={control}
                            name={`details.${index}.field1`}
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Name"
                                    placeholderTextColor="gray"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        {/* Field 2 */}
                        <Controller
                            control={control}
                            name={`details.${index}.field2`}
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Background"
                                    placeholderTextColor="gray"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        {/* TextArea */}
                        <Controller
                            control={control}
                            name={`details.${index}.textarea`}
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.textarea}
                                    placeholder="Reason"
                                    placeholderTextColor="gray"
                                    value={value}
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        {/* Mobile Number */}
                        <Controller
                            control={control}
                            name={`details.${index}.mobile`}
                            rules={{
                                required: true,
                                pattern: /^\d{10}$/,
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mobile Number"
                                    placeholderTextColor="gray"
                                    keyboardType="numeric"
                                    maxLength={10}
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                    </View>
                ))}

            {/* Add More Button */}
            {mainAnswer === 'yes' && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                        append({
                            field1: '',
                            field2: '',
                            textarea: '',
                            mobile: '',
                        })
                    }
                >
                    <Text style={styles.addButtonText}>+ Add More</Text>
                </TouchableOpacity>
            )}

            {/* Next Button */}
            <TouchableOpacity
                style={[
                    styles.nextButton,
                    !isFormValid() && styles.nextButtonDisabled,
                ]}
                disabled={!isFormValid() || loading}
                onPress={handleSubmit(onSubmit)}
            >
                <Text style={styles.nextButtonText}>{loading ? 'Submitting...' : 'Next Page'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default PartTwoQues7;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    question: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    optionButton: {
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#aaa',
        marginHorizontal: 10,
        backgroundColor: '#f5f5f5',
    },
    optionButtonSelected: {
        backgroundColor: '#0066cc',
        borderColor: '#0066cc',
    },
    optionText: {
        color: '#333',
        fontSize: 16,
    },
    optionTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    formGroup: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fafafa',
    },
    subHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    textarea: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 6,
        padding: 10,
        height: 100,
        textAlignVertical: 'top',
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    addButton: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        fontSize: 16,
        color: '#007bff',
    },
    nextButton: {
        backgroundColor: '#28a745',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    nextButtonDisabled: {
        backgroundColor: '#ccc',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});