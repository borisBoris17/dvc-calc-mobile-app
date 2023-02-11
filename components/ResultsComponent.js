import { ScrollView, StyleSheet, View } from 'react-native'; import Constants from 'expo-constants';
import { Text } from 'react-native-paper';

import { IconButton } from 'react-native-paper';
import ResortComponent from './ResortComponent';

export default function ResultsComponent({ route, navigation }) {
  const { results, checkInDate, checkOutDate } = route.params;

  const handleBack = () => {
    navigation.navigate('Search', {})
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })
  }

  const printResort = (resortName, resorts) => {
    const filteredArray = resorts.filter(function (resort) {
      return resort.resort_name === resortName;
    });

    if (filteredArray.length > 0) {
      return (
        <ResortComponent resort={filteredArray[0]}></ResortComponent>
      )
    }
    return '';
  }

  const getResortFromList = (resortName, resorts) => {
    const filteredArray = resorts.filter(function (resort) {
      return resort.resort_name === resortName;
    });

    if (filteredArray.length > 0) {
      return filteredArray[0];
    }
    return undefined;
  }

  return (
    <>
      <View style={styles.statusBar}></View>
      <View style={styles.backButton}>
        <IconButton
          icon="arrow-left"
          iconColor="#000"
          size={20}
          onPress={handleBack}
        />
        <Text style={styles.dateDisplay}>{`${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`}</Text>
      </View>
      <ScrollView stickyHeaderIndices={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]} style={styles.scrollStyle}>
        <View><Text style={styles.resortHeader}>Riviera</Text></View>
        {printResort('Riviera', results.resorts)}
        <View><Text style={styles.resortHeader}>Beach Club</Text></View>
        {printResort('Beach Club', results.resorts)}
        <View><Text style={styles.resortHeader}>Animal Kingdom Lodge</Text></View>
        {printResort('Animal Kingdom Lodge', results.resorts)}
        <View><Text style={styles.resortHeader}>Boardwalk</Text></View>
        {printResort('Boardwalk', results.resorts)}
        <View><Text style={styles.resortHeader}>Polynesian</Text></View>
        {printResort('Polynesian', results.resorts)}
        <View><Text style={styles.resortHeader}>Grand Floridian</Text></View>
        {printResort('Grand Floridian', results.resorts)}
        <View><Text style={styles.resortHeader}>Saratoga Springs</Text></View>
        {printResort('Saratoga Springs', results.resorts)}
        <View><Text style={styles.resortHeader}>Old Key West</Text></View>
        {printResort('Old Key West', results.resorts)}
        <View><Text style={styles.resortHeader}>Bay Lake Tower</Text></View>
        {printResort('Bay Lake Tower', results.resorts)}
        <View><Text style={styles.resortHeader}>Boulder Ridge</Text></View>
        {printResort('Boulder Ridge', results.resorts)}
        <View><Text style={styles.resortHeader}>Copper Creek</Text></View>
        {printResort('Copper Creek', results.resorts)}
      </ScrollView>
    </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d5edf1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: '#d5edf1',
  },
  backButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d5edf1',
  },
  dateDisplay: {
    flex: 1,
    textAlign: 'right',
    color: '#00232c',
    paddingRight: 20,
    fontSize: 24
  },
  dateRangeButton: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: '#c3dddf'
  },
  scrollStyle: {
    flex: 1,
    backgroundColor: '#d5edf1',
  },
  resortHeader: {
    backgroundColor: '#00232c',
    color: 'white',
    fontSize: 24,
    padding: 10,
  }
});