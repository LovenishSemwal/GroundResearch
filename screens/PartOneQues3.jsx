import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const PartOneQues3 = ({ navigation, route }) => {
    const { name, researcherMobile, formNumber } = route.params || {};

    const [photoUri, setPhotoUri] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Track button state

    const openCamera = () => {
        const options = {
            mediaType: 'photo',
            saveToPhotos: true,
            cameraType: 'back',
            quality: 1,
        };

        launchCamera(options, response => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                console.log('Camera error: ', response.errorMessage);
            } else {
                const uri = response.assets && response.assets[0].uri;
                setPhotoUri(uri);
            }
        });
    };

    const openGallery = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('Image picker error: ', response.errorMessage);
            } else {
                const uri = response.assets && response.assets[0].uri;
                setPhotoUri(uri);
            }
        });
    };

    const handleNext = async () => {
        if (isSubmitting) return; // Prevent double submission

        setIsSubmitting(true); // Disable the button and show "Wait..."

        try {
            const payload = {
                question: "Photo of the land",
                landPhoto: photoUri,
                researcherMobile: Number(researcherMobile),
                kmlName: name,
                FormNo: String(formNumber)
            };

            const response = await axios.post("https://brandscore.in/api/Part1Question3", payload);

            if (response.data.success) {
                console.log('Data submitted successfully:', response.data);
                Alert.alert('Done', 'Data Submitted');
                navigation.navigate('PartOneQues4', {
                    name,
                    researcherMobile,
                    formNumber
                });
            } else {
                console.error('Submission failed:', response.data.message);
                Alert.alert('Error', response.data.message || 'Failed to submit data.');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            Alert.alert('Error', 'An error occurred while submitting data.');
        } finally {
            setIsSubmitting(false); // Re-enable button regardless of success or error
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Question 3</Text>
            <Text style={styles.title}>Photo of the Land</Text>
            <Text style={styles.title}>(जमीन की फोटो)</Text>

            <TouchableOpacity style={styles.photoButton} onPress={openCamera}>
                <Text style={styles.photoButtonText}>Take Photo (तस्वीर लो)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.photoButton} onPress={openGallery}>
                <Text style={styles.photoButtonText}>Choose from Gallery (गैलरी से चुनें)</Text>
            </TouchableOpacity>

            {photoUri && (
                <Image source={{ uri: photoUri }} style={styles.imagePreview} resizeMode="contain" />
            )}

            <TouchableOpacity
                style={[
                    styles.nextButton,
                    { opacity: photoUri && !isSubmitting ? 1 : 0.5 }
                ]}
                disabled={!photoUri || isSubmitting}
                onPress={handleNext}
            >
                <Text style={styles.nextButtonText}>
                    {isSubmitting ? 'Wait...' : 'Next Page'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default PartOneQues3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 32,
        textAlign: 'center',
    },
    photoButton: {
        backgroundColor: '#0066cc',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    photoButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    imagePreview: {
        width: '100%',
        height: 300,
        marginBottom: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    nextButton: {
        backgroundColor: '#28a745',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});
