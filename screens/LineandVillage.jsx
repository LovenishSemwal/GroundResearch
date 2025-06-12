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
} from 'react-native';
import axios from 'axios';

const LineandVillage = ({ route, navigation }) => {
  const { researcherData } = route.params || {};


  // const [logs,setlogs]=useState([]);
  const logs = useRef([])



  const [researcherMobile, setResearcherMobile] = useState('');
  const [researcherName, setResearcherName] = useState('');

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [shapeId, setShapeId] = useState('');
  const [selectedLine, setSelectedLine] = useState('');

  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [villagesList, setVillagesList] = useState([]);
  const [lineList, setLineList] = useState([]);

  const [dropdownVillagesVisible, setDropdownVillagesVisible] = useState(false);
  const [dropdownLinesVisible, setDropdownLinesVisible] = useState(false);

  const villageRef = useRef(null);

  useEffect(() => {
    if (researcherData) {
      setResearcherName(researcherData.researcher_Name || '');
      setResearcherMobile(researcherData.researcher_Mobile || '');
    }
  }, [researcherData]);

  useEffect(() => {
    if (researcherMobile) {
      fetchStates();
      fetchLines();
    }
  }, [researcherMobile]);

  const fetchStates = async () => {
    try {
      const res = await axios.get('https://adfirst.in/api/VillageCsv/UniqueStates');
      const states = res.data.data || [];
      setStatesList(states);
      const firstState = states[0] || '';
      setSelectedState(firstState);
      if (firstState) {
        fetchDistricts(firstState);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDistricts = async (state) => {
    if (!researcherMobile) return;
    try {
      const res = await axios.get('https://adfirst.in/api/VillageCsv/FilteredUniqueDists', {
        params: {
          state,
          researcherMobile,
        },
      });
      const districts = res.data.data || [];
      setDistrictsList(districts);
      const firstDistrict = districts[0] || '';
      setSelectedDistrict(firstDistrict);
      if (firstDistrict) {
        fetchVillages(firstDistrict);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVillages = async (dist) => {
    if (!researcherMobile) return;
    try {
      const res = await axios.get(
        `https://adfirst.in/api/VillageCsv/FilteredUniqueVillages?dist=${encodeURIComponent(
          dist
        )}&researcherMobile=${encodeURIComponent(researcherMobile)}`
      );
      setVillagesList(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };


  const fetchLines = async () => {
    try {
      const res = await axios.post('https://adfirst.in/api/VillageCsv/GetDistinctLineByResearcher', {
        Researcher_Mobile: researcherMobile,
      });
      setLineList(res.data || []);
    } catch (error) {
      console.error('Error fetching lines:', error.response?.data || error.message);
    }
  };

  const fetchShapeId = () => {
  axios
    .post('https://adfirst.in/api/VillageCsv/GetVillageAndShapeByLine', {
      LINE: selectedLine,
      Researcher_Mobile: researcherMobile,
    })
    .then((res) => {
      // logs.current.push(`there is a response: ${JSON.stringify(res.data)}`);
      // logs.current.push(`shape id value: ${JSON.stringify(res.data.shapE_ID)}`);
      
      // const shape = res.data.SHAPE_ID || '';
      setShapeId(res.data.shapE_ID);
      // logs.current.push(`SHAPE_ID: ${shape}`);
    })
    .catch((error) => {
      // logs.current.push(`it is in the catch block: ${JSON.stringify(error)}`);
    });
};

  const handleLineSelect = (line) => {
    // console.log('Selected Line:  before setting', line);
    // logs.current.push(`Selected Line:  before setting ${line}`)
    setSelectedLine(prev => line);
    // console.log('Selected Line:  after setting', selectedLine);
    // logs.current.push(`Selected Line:  after setting ${selectedLine}`)
    setDropdownLinesVisible(false);
    if (selectedVillage != '') {
      fetchShapeId();
      // console.log(selectedVillage);
      // logs.current.push(selectedVillage)
    }
    else {
      console.log('Selected Village is empty, not fetching shape ID');
    }
  };

  const handleVillageSelect = (village) => {
    setSelectedVillage(village);
    setDropdownVillagesVisible(false);
    if (selectedLine!== '') 
    {
        // logs.current.push(`Selected Village: ${selectedLine}`);
        fetchShapeId();
    }
    else{
            // logs.current.push(`Selected Village:  the village is not sekectref ${selectedLine}`);

    }
  };


  const handleSubmit = () => {
    if (!selectedVillage || !selectedLine) {
      Alert.alert('Validation Error', 'Please select village and line.');
      return;
    }

    navigation.navigate('Select', {
      selectedState,
      selectedDistrict,
      selectedVillage,
      selectedLine,
      shapeId,
      researcherMobile,
    });
  };

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
        {/* <Text style={styles.MainHeading}>Line Wise Questionnaire</Text> */}
        <Text style={styles.heading}>Welcome</Text>
        <Text style={styles.headingname}>{researcherName}</Text>

        <Text style={styles.label}>Select Line</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => {
            setDropdownLinesVisible(!dropdownLinesVisible);
            setDropdownVillagesVisible(false);
          }}
        >
          <Text style={{ color: selectedLine ? '#000' : 'gray' }}>
            {selectedLine || 'Select a line...'}
          </Text>
        </TouchableOpacity>
        {renderDropdown(dropdownLinesVisible, lineList, handleLineSelect)}

        <Text style={styles.label}>Select Village</Text>
        <TouchableOpacity
          ref={villageRef}
          style={styles.input}
          onPress={() => {
            setDropdownVillagesVisible(!dropdownVillagesVisible);
            setDropdownLinesVisible(false);
          }}
        >
          <Text style={{ color: selectedVillage ? '#000' : 'gray' }}>
            {selectedVillage || 'Select a village...'}
          </Text>
        </TouchableOpacity>
        {renderDropdown(dropdownVillagesVisible, villagesList, handleVillageSelect)}

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




         {/* <View style={styles.logger}>
        {logs.current.map((log, index) => (
          <Text key={index} style={{ color: 'red' }}>{log}</Text>
        ))}
      </View> */}
      </ScrollView>

     

    </KeyboardAvoidingView>
  );
};

export default LineandVillage;

const styles = StyleSheet.create({

  logger:
  {
    padding: 13,
    fontSize: 14,
    fontColor: "red",
    backgroundColor: '#000',


  },

  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  MainHeading: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  headingname: {
    fontSize: 28,
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
