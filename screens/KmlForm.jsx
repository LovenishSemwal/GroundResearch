import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import axios from 'axios';

const KmlForm = ({ route, navigation }) => {
  const { researcherData } = route.params || {};

  const [name, setName] = useState('');
  const [researcherMobile, setResearcherMobile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [namesList, setNamesList] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (researcherData) {
      setResearcherMobile(researcherData.researcherMobile || '');
      fetchNames(researcherData.researcherMobile);
    }
  }, [researcherData]);

  const fetchNames = async (mobile) => {
    try {
      const res = await axios.post(
        'https://brandscore.in/api/KmlKm/GetNamesByMobile',
        JSON.stringify(mobile),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('API Response:', res.data);

      const responseData = res.data.data;
      if (Array.isArray(responseData)) {
        setNamesList(responseData);
      } else {
        setNamesList([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch names.');
    }
  };

  const handleSubmit = () => {
    if (!name || !researcherMobile) {
      return Alert.alert('Validation Error', 'Please select a name.');
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      Alert.alert('Success', 'Data submitted successfully');
      navigation.navigate('Select', {
        name,
        researcherMobile,
      });
      setIsSubmitting(false);
    });
  };

  const renderDropdown = () => {
    if (!dropdownVisible) return null;
    return (
      <View style={styles.dropdown}>
        {namesList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.dropdownItem}
            onPress={() => {
              setName(item);
              setDropdownVisible(false);
            }}
          >
            <Text style={styles.dropdownItemText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>KML Distance Form</Text>

        <Text style={styles.label}>Select Name</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text style={{ color: name ? '#000' : 'gray' }}>
            {name || 'Select a name...'}
          </Text>
        </TouchableOpacity>

        {renderDropdown()}

        <Text style={styles.label}>Researcher Mobile</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Researcher Mobile"
          placeholderTextColor="gray"
          value={researcherMobile}
          editable={false}
        />

        <TouchableOpacity
          style={[styles.button, { opacity: isSubmitting ? 0.6 : 1 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Wait...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KmlForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    maxHeight: 150,
    marginBottom: 20,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
});
