import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  UIManager,
  findNodeHandle,
} from 'react-native';
import axios from 'axios';

const KmlForm = ({ route, navigation }) => {
  const { researcherData, } = route.params || {};

  const [researcherMobile, setResearcherMobile] = useState('');
  const [researcherName, setResearcherName] = useState('');

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [shapeId, setShapeId] = useState('');

  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [villagesList, setVillagesList] = useState([]);

  const [dropdownStatesVisible, setDropdownStatesVisible] = useState(false);
  const [dropdownDistsVisible, setDropdownDistsVisible] = useState(false);
  const [dropdownVillagesVisible, setDropdownVillagesVisible] = useState(false);

  const [dropdownTop, setDropdownTop] = useState(0);

  const stateRef = useRef(null);
  const districtRef = useRef(null);
  const villageRef = useRef(null);

  useEffect(() => {
    if (researcherData) {
      setResearcherName(researcherData.researcher_Name || '');
      setResearcherMobile(researcherData.researcher_Mobile || '');
    }

    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const res = await axios.get('https://adfirst.in/api/VillageCsv/UniqueStates');
      setStatesList(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Use the correct backend API with researcherMobile for districts
  const fetchDistricts = async (state) => {
    if (!researcherMobile) {
      Alert.alert('Error', 'Researcher mobile is required to fetch districts.');
      return;
    }
    try {
      const res = await axios.get('https://adfirst.in/api/VillageCsv/FilteredUniqueDists', {
        params: {
          state: state,  // lowercase 'state'
          researcherMobile: researcherMobile,  // camelCase
        }
      });
      setDistrictsList(res.data.data || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load districts.');
    }
  };


  const fetchVillages = async (dist) => {
    if (!researcherMobile) {
      Alert.alert('Error', 'Researcher mobile is required to fetch villages.');
      return;
    }
    try {
      const res = await axios.get(
        `https://adfirst.in/api/VillageCsv/FilteredUniqueVillages?dist=${encodeURIComponent(dist)}&researcherMobile=${encodeURIComponent(researcherMobile)}`
      );
      setVillagesList(res.data.data || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load villages.');
    }
  };

  const fetchVillageDetails = async (villageName) => {
    try {
      const res = await axios.get(`https://adfirst.in/api/VillageCsv/GetVillageDetails?villageName=${encodeURIComponent(villageName)}`);
      const data = res.data.data;
      if (Array.isArray(data) && data.length > 0) {
        setShapeId(data[0].SHAPE_ID || '');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch village details.');
    }
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setSelectedDistrict('');
    setSelectedVillage('');
    setDistrictsList([]);
    setVillagesList([]);
    setDropdownStatesVisible(false);
    fetchDistricts(state);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSelectedVillage('');
    setVillagesList([]);
    setDropdownDistsVisible(false);
    fetchVillages(district);
  };

  const handleVillageSelect = (village) => {
    setSelectedVillage(village);
    setDropdownVillagesVisible(false);
    fetchVillageDetails(village);
  };

  const handleSubmit = () => {
    if (!selectedState || !selectedDistrict || !selectedVillage) {
      Alert.alert('Validation Error', 'Please select state, district, and village.');
      return;
    }
    navigation.navigate('Select', {
      selectedState,
      selectedDistrict,
      selectedVillage,
      shapeId,
      researcherMobile,
    });
  };

  // const measureDropdownTop = (ref) => {
  //   if (ref.current) {
  //     UIManager.measure(findNodeHandle(ref.current), (x, y, width, height, pageX, pageY) => {
  //       setDropdownTop(pageY + height);
  //     });
  //   }
  // };

  const renderDropdown = (visible, list, onSelect) => {
    if (!visible) return null;
    return (
      <View style={styles.dropdownWrapper}>
        <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
          {list.map((item, index) => (
            <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => onSelect(item)}>
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Welcome</Text>
        <Text style={styles.headingname}>{researcherName}</Text>

        <Text style={styles.label}>Select State</Text>
        <TouchableOpacity
          ref={stateRef}
          style={styles.input}
          onPress={() => {
            setDropdownStatesVisible(!dropdownStatesVisible);
            setDropdownDistsVisible(false);
            setDropdownVillagesVisible(false);
            // measureDropdownTop(stateRef);
          }}
        >
          <Text style={{ color: selectedState ? '#000' : 'gray' }}>{selectedState || 'Select a state...'}</Text>
        </TouchableOpacity>
        {renderDropdown(dropdownStatesVisible, statesList, handleStateSelect)}

        {selectedState ? (
          <>
            <Text style={styles.label}>Select District</Text>
            <TouchableOpacity
              ref={districtRef}
              style={styles.input}
              onPress={() => {
                setDropdownDistsVisible(!dropdownDistsVisible);
                setDropdownStatesVisible(false);
                setDropdownVillagesVisible(false);
                // measureDropdownTop(districtRef);
              }}
            >
              <Text style={{ color: selectedDistrict ? '#000' : 'gray' }}>{selectedDistrict || 'Select a district...'}</Text>
            </TouchableOpacity>
            {renderDropdown(dropdownDistsVisible, districtsList, handleDistrictSelect)}
          </>
        ) : null}

        {selectedDistrict ? (
          <>
            <Text style={styles.label}>Select Village</Text>
            <TouchableOpacity
              ref={villageRef}
              style={styles.input}
              onPress={() => {
                setDropdownVillagesVisible(!dropdownVillagesVisible);
                setDropdownStatesVisible(false);
                setDropdownDistsVisible(false);
                // measureDropdownTop(villageRef);
              }}
            >
              <Text style={{ color: selectedVillage ? '#000' : 'gray' }}>{selectedVillage || 'Select a village...'}</Text>
            </TouchableOpacity>
            {renderDropdown(dropdownVillagesVisible, villagesList, handleVillageSelect)}
          </>
        ) : null}

        <Text style={styles.label}>Researcher Mobile</Text>
        <TextInput
          style={styles.input}
          placeholder="Researcher Mobile"
          placeholderTextColor="gray"
          value={researcherMobile}
          editable={false}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Next</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  headingname: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
    fontWeight: 'bold',
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
  dropdownContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  dropdownScroll: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
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
  dropdownWrapper: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 6,
  backgroundColor: '#fff',
  maxHeight: 200,
  marginBottom: 20,
},
dropdownScroll: {
  maxHeight: 200,
},
});
