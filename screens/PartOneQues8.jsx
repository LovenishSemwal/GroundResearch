import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const PartOneQues8 = ({ navigation, route }) => {
  const { name, researcherMobile, formNumber } = route.params || {};
  const [isSubmitting, setIsSubmitting] = useState(false);  // <-- new state
    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            mainQuestion: '',
            additionalQuestion1: '',
            additionalQuestion2: '',
        }
    });

    const mainAnswer = watch('mainQuestion');

    const onSubmit = async (data) => {
        setIsSubmitting(true);  // disable button right away
    const payload = {
        Form_No: formNumber,
        Researcher_Mobile: Number(researcherMobile),
        Kml_Name: name,
        Question: "Do crops grow?",
        Answer: data.mainQuestion === 'Yes'
            ? `Yes | Types: ${data.additionalQuestion1}, Names: ${data.additionalQuestion2}`
            : "No"
    };

    try {
        const response = await axios.post('https://brandscore.in/api/Part1Question8', payload);
        Alert.alert('Done', 'Data submitted successfully');
        console.log('Submitted:', response.data);
        navigation.navigate('PartOneQues9', {
          name,
          researcherMobile,
          formNumber
        });
    } catch (error) {
        console.error('Error submitting form:', error.message);
        Alert.alert(error, 'Something went wrong while submitting.');
    } finally {
      setIsSubmitting(false);  // re-enable button after response/error
    }
};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Question 8</Text>
            <Text style={styles.title}>Do crops grow?</Text>
            <Text style={styles.title}>(क्या फसल उगती है?)</Text>

            {/* Main Question Yes/No */}
            <View style={styles.optionsContainer}>
                <Controller
                    control={control}
                    name="mainQuestion"
                    rules={{ required: 'Please select an option' }}
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TouchableOpacity
                                style={[styles.option, value === 'Yes' && styles.optionSelected]}
                                onPress={() => onChange('Yes')}
                            >
                                <Text style={styles.optionText}>Yes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.option, value === 'No' && styles.optionSelected]}
                                onPress={() => onChange('No')}
                            >
                                <Text style={styles.optionText}>No</Text>
                            </TouchableOpacity>
                        </>
                    )}
                />
            </View>
            {errors.mainQuestion && <Text style={styles.error}>{errors.mainQuestion.message}</Text>}

            {/* Additional Questions if 'Yes' */}
            {mainAnswer === 'Yes' && (
                <>
                    
                    <Text style={styles.label}>How many types of (कितने प्रकार के):</Text>
                    <Controller
                        control={control}
                        name="additionalQuestion1"
                        rules={{
                            required: 'This question is required',
                            pattern: {
                                value: /^[0-9]+$/,  // regex to allow only digits
                                message: 'Please enter a valid number',
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter number"
                                onChangeText={text => {
                                    // optionally filter non-digit characters here before calling onChange
                                    const filtered = text.replace(/[^0-9]/g, '');
                                    onChange(filtered);
                                }}
                                value={value}
                                keyboardType="numeric"
                            />
                        )}
                    />
                    {errors.additionalQuestion1 && <Text style={styles.error}>{errors.additionalQuestion1.message}</Text>}

                    <Text style={styles.label}>Name all the types of (सभी प्रकारों के नाम बताएं):</Text>
                    <Controller
                        control={control}
                        name="additionalQuestion2"
                        rules={{ required: 'This question is required' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={onChange}
                                value={value}
                                placeholder=""  // empty placeholder or remove
                                textAlignVertical="top"  // so text starts at top-left
                            />
                        )}
                    />
                    {errors.additionalQuestion2 && <Text style={styles.error}>{errors.additionalQuestion2.message}</Text>}
                </>
            )}

            {/* Next Button */}
            <TouchableOpacity
                style={[
                    styles.nextButton,
                    {
                        opacity:
                            mainAnswer === 'No' ||
                                (mainAnswer === 'Yes' && watch('additionalQuestion1') && watch('additionalQuestion2'))
                                ? 1 : 0.5
                    }
                ]}
                disabled={
                    !(mainAnswer === 'No' ||
                        (mainAnswer === 'Yes' && watch('additionalQuestion1') && watch('additionalQuestion2')))
                }
                onPress={handleSubmit(onSubmit)}
            >
                <Text style={styles.nextButtonText}>Next Page</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PartOneQues8;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderWidth: 1,
        borderColor: '#0066cc',
        borderRadius: 8,
        marginHorizontal: 10,
    },
    optionSelected: {
        backgroundColor: '#0066cc',
    },
    optionText: {
        color: '#0066cc',
        fontWeight: '600',
        fontSize: 16,
    },
    label: {
        fontSize: 16,
        marginTop: 16,
        marginBottom: 6,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    textArea: {
        height: 100,
    },
    error: {
        color: 'red',
        marginTop: 4,
    },
    nextButton: {
        backgroundColor: '#28a745',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});
