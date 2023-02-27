import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchComponent from './SearchComponent';
import ResultsComponent from './ResultsComponent';
import {
  enGB,
  registerTranslation
} from 'react-native-paper-dates'
import { useEffect, useState } from 'react';
registerTranslation('en-GB', enGB)
import { runTransaction } from '../util'
import { useTheme } from "react-native-paper";

const Stack = createNativeStackNavigator();

export default function CalculatorComponent({ db }) {
  const [resorts, setResorts] = useState([]);
  const [roomTypes, setRoomTypes] = useState([
    { selected: 'true', number_bedrooms: 0, name: 'Studio' },
    { selected: 'true', number_bedrooms: 1, name: 'One Bedroom' },
    { selected: 'true', number_bedrooms: 2, name: 'Two Bedroom' },
    { selected: 'true', number_bedrooms: 3, name: 'Three Bedroom' },
  ]);

  const fetchResorts = async () => {
    if (db !== undefined) {
      const foundResorts = await runTransaction(db, 'select * from resort order by resort_id ASC;');
      const builtResorts = foundResorts.map(resort => {
        return { selected: true, name: resort.name }
      });
      setResorts(builtResorts)
    }
  }

  useEffect(() => {
    if (db !== undefined) {
      fetchResorts();
    }
  }, [db])

  const theme = useTheme()

  return (
    <NavigationContainer>
      <Stack.Navigator screenProps={{ db: db }}>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Search"
        >
          {(props) => <SearchComponent {...props} db={db} resorts={resorts} setResorts={setResorts} roomTypes={roomTypes} setRoomTypes={setRoomTypes} />}
        </Stack.Screen>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Results">
          {(props) => <ResultsComponent {...props} resorts={resorts} setResorts={setResorts} roomTypes={roomTypes} setRoomTypes={setRoomTypes} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
