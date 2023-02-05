import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; import Constants from 'expo-constants';
import { useState } from 'react';
import moment from "moment";
import DateRangePicker from 'react-native-daterange-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchComponent from './components/SearchComponent';
import ResultsComponent from './components/ResultsComponent';

const Stack = createNativeStackNavigator();

export default function App() {
  const [input, setInput] = useState('');
  const [beginDate, setBeginDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [displayedDate, setDisplayedDate] = useState(moment())


  const onChangeInput = (text) => {
    setInput(text)
  }

  const onDateChange = (dates) => {
    console.log(dates, dates['startDate'], dates['endDate'])
    if (dates['startDate']) {
      setBeginDate(dates['startDate']);
    }
    if (dates['endDate']) {
      setEndDate(dates['endDate']);
    }
  }

  return (
    <>
      <View style={styles.statusBar}></View>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Search"
            component={SearchComponent}>
          </Stack.Screen>
          <Stack.Screen
            name="Results"
            component={ResultsComponent}>
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: 'red'
  },
  dateRangeButton: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: '#c3dddf'
  }
});
