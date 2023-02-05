import { ScrollView, StyleSheet, Text, View } from 'react-native'; import Constants from 'expo-constants';
import ResortComponent from './ResortComponent';

export default function ResultsComponent({ route, navigation }) {
  const { results } = route.params;
  // console.log(results);
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Here are your results!</Text>
        {results.resorts ? results.resorts.map((resort) => (
          <ResortComponent key={resort.resort_id} resort={resort}></ResortComponent>
        )) : ''}
      </View>
    </ScrollView>
  )
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