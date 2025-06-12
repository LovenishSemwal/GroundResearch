import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, BackHandler } from 'react-native';
import axios from 'axios';
import { useFormData } from './FormDataContext';  // context hook!

const ButtonsScreen = ({ navigation, route }) => {
  const { selectedLine, researcherMobile, selectedState, selectedDistrict, selectedVillage, shapeId, } = route.params || {};
  const { resetFormData } = useFormData();  // Get the reset function

  // Separate loading states!
  const [loadingPart1, setLoadingPart1] = useState(false);
  const [loadingPart2, setLoadingPart2] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  const exitPress = () => {
    navigation.navigate('Login');
  };


  // FOR PART 1
  const handlePress = async () => {
    console.log({
      partType: 'part1'
    });

    resetFormData();
    setLoadingPart1(true);

    try {
      const response = await axios.post('https://adfirst.in/api/FormEntry', {
        selectedLine,
        researcherMobile,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId,
        partType: 'part1'
      });

      const { formNumber } = response.data;

      navigation.navigate('PartOneQues1', {
        formNumber,       
        selectedLine,
        researcherMobile,
        formNumber,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId,
        partType: 'part1'
      });

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingPart1(false);
    }
  };


  //  FOR PART 2 -----
  const villagePress = async () => {
    console.log({
      partType: 'part2'
    });

    resetFormData();
    setLoadingPart2(true);

    try {
      const response = await axios.post('https://adfirst.in/api/FormEntry', {
        
       
        selectedLine,
        researcherMobile,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId,
        partType: 'part2'
      });

      const { formNumber } = response.data;

      navigation.navigate('PartTwoQues1', {
        formNumber,
        selectedLine,
        researcherMobile,
        formNumber,
        selectedState,
        selectedDistrict,
        selectedVillage,
        shapeId,
        partType: 'part2'
      });

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingPart2(false);
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
        <Text style={styles.heading}>Part 1- KM Wise Questionnaire  </Text>
        <Text style={styles.heading}>Part 2- Village Level Report  </Text>

        {/* PART 1 BUTTON */}
        <TouchableOpacity
          style={[styles.button, loadingPart1 && { backgroundColor: '#aaa' }]}
          onPress={handlePress}
          disabled={loadingPart1}
        >
          <Text style={styles.buttonText}>{loadingPart1 ? 'Wait...' : 'Part 1'}</Text>
        </TouchableOpacity>

        {/* PART 2 BUTTON */}
        <TouchableOpacity
          style={[styles.button, loadingPart2 && { backgroundColor: '#aaa' }]}
          onPress={villagePress}
          disabled={loadingPart2}
        >
          <Text style={styles.buttonText}>{loadingPart2 ? 'Wait...' : 'Part 2'}</Text>
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
