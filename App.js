import { StyleSheet, View } from 'react-native'; import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchComponent from './components/SearchComponent';
import ResultsComponent from './components/ResultsComponent';
import {
  enGB,
  registerTranslation,
} from 'react-native-paper-dates'
registerTranslation('en-GB', enGB)

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="Search"
            component={SearchComponent}>
          </Stack.Screen>
          <Stack.Screen
            options={{headerShown: false}}
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
