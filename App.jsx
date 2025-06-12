import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FormDataProvider } from './screens/FormDataContext';
import LoginScreen from './screens/LoginScreen';
import LineandVillage from './screens/LineandVillage';
// import Village from './screens/Village';
import ButtonsScreen from './screens/ButtonsScreen';
import PartOneQues1 from './screens/PartOneQues1';
import PartOneQues2 from './screens/PartOneQues2';
import PartOneQues3 from './screens/PartOneQues3';
import PartOneQues4 from './screens/PartOneQues4';
import PartOneQues5 from './screens/PartOneQues5';
import PartOneQues6 from './screens/PartOneQues6';
import PartOneQues7 from './screens/PartOneQues7';
import PartOneQues8 from './screens/PartOneQues8';
import PartOneQues9 from './screens/PartOneQues9';
import PartOneQues10 from './screens/PartOneQues10';
import PartOneQues11 from './screens/PartOneQues11';
import PartOneQues12 from './screens/PartOneQues12';
import PartOneQues13 from './screens/PartOneQues13';
import PartOneQues14 from './screens/PartOneQues14';
import PartOneQues15 from './screens/PartOneQues15';
import PartOneQues16 from './screens/PartOneQues16';
import PartOneQues17 from './screens/PartOneQues17';
import PartOneQues18 from './screens/PartOneQues18';
import PartOneQues19 from './screens/PartOneQues19';
import PartOneQues20 from './screens/PartOneQues20';
import PartOneQues21 from './screens/PartOneQues21';
import PartOneQues22 from './screens/PartOneQues22';
import PartOneQues23 from './screens/PartOneQues23';
import PartOneQues24 from './screens/PartOneQues24';

import PartTwoQues1 from './screens/PartTwoQues1';
import PartTwoQues2 from './screens/PartTwoQues2';
import PartTwoQues3 from './screens/PartTwoQues3';
import PartTwoQues4 from './screens/PartTwoQues4';
import PartTwoQues5 from './screens/PartTwoQues5';
import PartTwoQues6 from './screens/PartTwoQues6';
import PartTwoQues7 from './screens/PartTwoQues7';
import PartTwoQues8 from './screens/PartTwoQues8';
import PartTwoQues9 from './screens/PartTwoQues9';



const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <FormDataProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Select" component={ButtonsScreen} options={{headerShown: false }} />
          <Stack.Screen name="LineandVillage" component={LineandVillage} options={{ headerShown: true }} />
          {/* <Stack.Screen name="Village" component={Village} options={{ headerShown: true }} /> */}
          <Stack.Screen name="PartOneQues1" component={PartOneQues1} options={{ title:"Previous"}} />

          <Stack.Screen name="PartOneQues2" component={PartOneQues2} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues3" component={PartOneQues3} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues4" component={PartOneQues4} options={{ title:"Previous"}} />

          <Stack.Screen name="PartOneQues5" component={PartOneQues5} options={{ title:"Previous"}} />

          <Stack.Screen name="PartOneQues6" component={PartOneQues6} options={{ title:"Previous"}} />

          <Stack.Screen name="PartOneQues7" component={PartOneQues7} options={{ title:"Previous"}} />

          <Stack.Screen name="PartOneQues8" component={PartOneQues8} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues9" component={PartOneQues9} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues10" component={PartOneQues10} options={{ title:"Previous"}} />

          <Stack.Screen name="PartOneQues11" component={PartOneQues11} options={{ title:"Previous"}} />

          <Stack.Screen name="PartOneQues12" component={PartOneQues12} options={{ title:"Previous"}} />

          <Stack.Screen name="PartOneQues13" component={PartOneQues13} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues14" component={PartOneQues14} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues15" component={PartOneQues15} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues16" component={PartOneQues16} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues17" component={PartOneQues17} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues18" component={PartOneQues18} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues19" component={PartOneQues19} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues20" component={PartOneQues20} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues21" component={PartOneQues21} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues22" component={PartOneQues22} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues23" component={PartOneQues23} options={{ title:"Previous" }} />

          <Stack.Screen name="PartOneQues24" component={PartOneQues24} options={{ title:"Previous" }} />



          <Stack.Screen name="PartTwoQues1" component={PartTwoQues1} options={{ title:"Previous" }} />

          <Stack.Screen name="PartTwoQues2" component={PartTwoQues2} options={{ title:"Previous" }} />

          <Stack.Screen name="PartTwoQues3" component={PartTwoQues3} options={{ title:"Previous" }} />

          <Stack.Screen name="PartTwoQues4" component={PartTwoQues4} options={{ title:"Previous" }} />

          <Stack.Screen name="PartTwoQues5" component={PartTwoQues5} options={{title:"Previous" }} />

          <Stack.Screen name="PartTwoQues6" component={PartTwoQues6} options={{ title:"Previous" }} />

          <Stack.Screen name="PartTwoQues7" component={PartTwoQues7} options={{ title:"Previous" }} />

          <Stack.Screen name="PartTwoQues8" component={PartTwoQues8} options={{ title:"Previous" }} />

          <Stack.Screen name="PartTwoQues9" component={PartTwoQues9} options={{ title:"Previous" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </FormDataProvider>
  );
};

export default App;
