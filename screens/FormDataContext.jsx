// import React, { createContext, useState, useContext } from 'react';

// const FormDataContext = createContext();

// export const FormDataProvider = ({ children }) => {
//   const [formData, setFormData] = useState({});

//   const updateFormData = (newData) => {
//     setFormData(prev => ({ ...prev, ...newData }));
//   };

//   const resetFormData = () => {
//     setFormData({});  // Clear everything
//   };

//   return (
//     <FormDataContext.Provider value={{ formData, updateFormData, resetFormData }}>
//       {children}
//     </FormDataContext.Provider>
//   );
// };

// export const useFormData = () => useContext(FormDataContext);



// FormDataContext.jsx
import React, { createContext, useState, useContext } from 'react';

const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    part1question1: { answer: null, id: null },
    part1question2: { latitude: null, longitude: null, id: null },
    part1question3: { photoUri: null, id: null },
    part1question4: { videoUri: null, id: null },
    part1question5: { answer: null, id: null },
    part1question6: { answer: null, id: null },
    part1question7: { answer: null, id: null },
    part1question8: {
      mainAnswer: null,
      additional1: null,
      additional2: null,
      id: null,
    },
    part1question19: { id: null, acquisitionDetails: '' },
    part1question10: {
      id: null,
      acquisitionStatus: '',
      yearAcquired: '',
      compensationRate: '',
      compensationGiven: '',
    },
    part1question11: {
      id: null,
      selectedOption: '',
      details: '',
    },
    part1question12: {
      id: null,
      selectedOption: '',
      details: '',
    },
    part1question13: {
      id: null,
      selectedOption: '',
      details: '',
    },
    part1question14: {
      id: null,
      selectedOption: '',
      details: '',
    },
    part1question15: {
      id: null,
      answer: '',
      personName: '',
      mobileNumber: '',
      details: '',
    },
    part1question16: { id: null, answer: '' },
    part1question17: {
      id: null,
      selectedOption: '',
      details: '',
    },
    
    // part1question20: {
    //   id: null,
    //   hasLocation: '',
    //   locationName: '',
    //   lat: null,
    //   long: null,

    // },
    part1question21: {
      id: null,
      roadCrossing: '',
      roadType: '',
      latitude: null,
      longitude: null,
    },
    part1question22: {
      id: null,
      railwayLine: '',
      latitude: null,
      longitude: null,
    },
    part1question23: {
      id: null,
      selectedOption: '',
      details: '',
    },
    part1question24: { id: null, answer: '' },

    // Part 2 starts

    PartTwoQues3: { selectedOption: '', details: '', id: null },
    PartTwoQues4: {
      answer: '',
      numericInput: '',
      id: null,
    },
    part2Ques5: {
      answer: '',
      otherReason: '',
      id: null,
    },
    PartTwoQues6: {
      selectedOption: '',
      details: '',
      id: null,
    },
    PartTwoQues7: {
      mainAnswer: null,
      details: [
        // example structure of detail objects:
        // { field1: '', field2: '', textarea: '', mobile: '', id: null }
      ],
    },
    part2question8: {
      id: null,
      selectedOptions: [],
    },
    part2question9: {
      id: null,
      selectedOption: '',
      details: '',
    },
  });

  const updateFormData = (key, newData) => {
    setFormData(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        ...newData,
      },
    }));
  };

  const resetFormData = () => {
    setFormData({
      part1question1: { answer: null, id: null },
      part1question2: { latitude: null, longitude: null, id: null },
      part1question3: { photoUri: null, id: null },
      part1question4: { videoUri: null, id: null },
      part1question5: { answer: null, id: null },
      part1question6: { answer: null, id: null },
      part1question7: { answer: null, id: null },
      part1question8: {
        mainAnswer: null,
        additional1: null,
        additional2: null,
        id: null,
      },
      part1question19: { id: null, acquisitionDetails: '' },
      part1question10: {
        id: null,
        acquisitionStatus: '',
        yearAcquired: '',
        compensationRate: '',
        compensationGiven: '',
      },
      part1question11: {
        id: null,
        selectedOption: '',
        details: '',
      },
      part1question12: {
        id: null,
        selectedOption: '',
        details: '',
      },
      part1question13: {
        id: null,
        selectedOption: '',
        details: '',
      },
      part1question14: {
        id: null,
        selectedOption: '',
        details: '',
      },
      part1question15: {
        id: null,
        answer: '',
        personName: '',
        mobileNumber: '',
        details: '',
      },
      part1question16: { id: null, answer: '' },
      part1question17: {
        id: null,
        selectedOption: '',
        details: '',
      },
      
      // part1question20: {
      //   id: null,
      //   hasLocation: '',
      //   locationName: '',
      //   lat: null,
      //   long: null,

      // },
      part1question21: {
        id: null,
        roadCrossing: '',
        roadType: '',
        latitude: null,
        longitude: null,
      },
      part1question22: {
        id: null,
        railwayLine: '',
        latitude: null,
        longitude: null,
      },
      part1question23: {
        id: null,
        selectedOption: '',
        details: '',
      },
      part1question24: { id: null, answer: '' },

      // Part 2 starts 


      PartTwoQues3: { selectedOption: '', details: '', id: null },
      PartTwoQues4: {
        answer: '',
        numericInput: '',
        id: null,
      },
      part2Ques5: {
        answer: '',
        otherReason: '',
        id: null,
      },
      PartTwoQues6: {
        selectedOption: '',
        details: '',
        id: null,
      },
      part2question8: {
        id: null,
        selectedOptions: [],
      },
      
    });
  };


  return (
    <FormDataContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => useContext(FormDataContext);