import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://adfirst.in/api/VillageCsv/LoginResearcher',
        { mobile: data.phone }
      );

      if (response.data.success) {
        const researcherData = response.data.data;

        // Save to AsyncStorage for use in LineandVillage
        await AsyncStorage.setItem('researcherData', JSON.stringify(researcherData));

        // Navigate without passing any data
        navigation.navigate('LineandVillage');
      } else {
        Alert.alert('Error', response.data.message || 'Invalid login');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Something went wrong');
      } else {
        Alert.alert('Error', 'Could not connect to the server');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainheading}>Ground Research & RoW Intelligence</Text>
      <Text style={styles.heading}>Login</Text>

      <Text style={styles.label}>Phone Number</Text>
      <Controller
        control={control}
        name="phone"
        rules={{
          required: 'Phone number is required',
          pattern: {
            value: /^[0-9]{10}$/,
            message: 'Enter a valid 10-digit phone number',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Enter phone number"
            style={styles.input}
            onChangeText={onChange}
            value={value}
            keyboardType="phone-pad"
            maxLength={10}
          />
        )}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#aaa' }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Please wait...' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  mainheading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
