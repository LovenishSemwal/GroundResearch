import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert, BackHandler } from 'react-native';
import axios from 'axios';

import { useFormData } from './FormDataContext';  // context hook!

const ButtonsScreen = ({ navigation, route }) => {
  const { researcherMobile, selectedState, selectedDistrict, selectedVillage, shapeId } = route.params || {};

  const { resetFormData } = useFormData();  // Get the reset function

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    return () => backHandler.remove();
  }, []);


  const exitPress = () => {
    navigation.navigate('Login');
  }

  const handlePress = async () => {
    console.log({
    selectedState,
    selectedDistrict,
    selectedVillage,
    shapeId,
    researcherMobile,
  });
    // if (!selectedState || !selectedDistrict || !selectedVillage || !shapeId || !researcherMobile ) {
    //   Alert.alert('Error', 'Please make sure all fields are selected and filled.');
    //   // return;  // Stop further execution if validation fails
    // }
    //  Reset all forms!
    resetFormData();

    setLoading(true);

    try {
      const response = await axios.post('https://adfirst.in/api/FormEntry', {
        State: selectedState,
        Dist: selectedDistrict,
        Village_Name: selectedVillage,
        Shape_Id: shapeId,
        ResearcherMobile: researcherMobile,
      });

      const { formNumber } = response.data;

      navigation.navigate('PartOneQues1', {

        formNumber,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId,
        researcherMobile,
      });

    } catch (error) {
      if (error.response) {
        console.error('Server responded with:', error.response.status);
        console.error('Data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/rajasthan-map.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.mainheading}>Ground Research & RoW Intelligence</Text>
        <Text style={styles.heading}>Part 1- KM Wise Questionnaire & Part 2- Village Level Report</Text>

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#aaa' }]}
          onPress={handlePress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Wait...' : 'Click'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={exitPress}>
          <Text style={styles.buttonText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ButtonsScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  mainheading: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 32,
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
