import { ScrollView, StyleSheet, View } from 'react-native'; import Constants from 'expo-constants';
import { Button, Text } from 'react-native-paper';

import { IconButton } from 'react-native-paper';
import ResortComponent from './ResortComponent';
import { LogBox } from 'react-native';
import { useCallback, useState } from 'react';
import ResortModalComponent from './ResortModalComponent';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function ResultsComponent({ route, navigation, resorts, setResorts }) {
  const { results, checkInDate, checkOutDate } = route.params;

  const [openResortFilter, setOpenResortFilter] = useState(false);

  const handleBack = () => {
    navigation.navigate('Search', {})
  }

  const onDismissResorts = useCallback(() => {
    setOpenResortFilter(false);
  }, [setOpenResortFilter]);

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
      <View style={styles.filters}>
        <Button style={styles.filterButton} labelStyle={styles.buttonText} onPress={() => setOpenResortFilter(true)} mode="contained" icon="filter">Resorts</Button>
      </View>
      <ScrollView stickyHeaderIndices={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26]} style={styles.scrollStyle}>
        {resorts?.filter(resort => resort.name === 'Riviera')[0].selected ? <View><Text style={styles.resortHeader}>Riviera</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Riviera')[0].selected ? printResort('Riviera', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Boardwalk')[0].selected ? <View><Text style={styles.resortHeader}>Boardwalk</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Boardwalk')[0].selected ? printResort('Boardwalk', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Beach Club')[0].selected ? <View><Text style={styles.resortHeader}>Beach Club</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Beach Club')[0].selected ? printResort('Beach Club', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Old Key West')[0].selected ? <View><Text style={styles.resortHeader}>Old Key West</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Old Key West')[0].selected ? printResort('Old Key West', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Saratoga Springs')[0].selected ? <View><Text style={styles.resortHeader}>Saratoga Springs</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Saratoga Springs')[0].selected ? printResort('Saratoga Springs', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Grand Floridian')[0].selected ? <View><Text style={styles.resortHeader}>Grand Floridian</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Grand Floridian')[0].selected ? printResort('Grand Floridian', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Bay Lake Tower')[0].selected ? <View><Text style={styles.resortHeader}>Bay Lake Tower</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Bay Lake Tower')[0].selected ? printResort('Bay Lake Tower', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Polynesian')[0].selected ? <View><Text style={styles.resortHeader}>Polynesian</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Polynesian')[0].selected ? printResort('Polynesian', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Copper Creek')[0].selected ? <View><Text style={styles.resortHeader}>Copper Creek</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Copper Creek')[0].selected ? printResort('Copper Creek', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Boulder Ridge')[0].selected ? <View><Text style={styles.resortHeader}>Boulder Ridge</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Boulder Ridge')[0].selected ? printResort('Boulder Ridge', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Animal Kingdom Lodge')[0].selected ? <View><Text style={styles.resortHeader}>Animal Kingdom Lodge</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Animal Kingdom Lodge')[0].selected ? printResort('Animal Kingdom Lodge', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Aulani')[0].selected ? <View><Text style={styles.resortHeader}>Aulani</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Aulani')[0].selected ? printResort('Aulani', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Vero Beach')[0].selected ? <View><Text style={styles.resortHeader}>Vero Beach</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Vero Beach')[0].selected ? printResort('Vero Beach', results.resorts) : ''}
        {resorts?.filter(resort => resort.name === 'Hilton Head Island')[0].selected ? <View><Text style={styles.resortHeader}>Hilton Head Island</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Hilton Head Island')[0].selected ? printResort('Hilton Head Island', results.resorts) : ''}
      </ScrollView>
      <ResortModalComponent openResorts={openResortFilter} onDismissResorts={onDismissResorts} resorts={resorts} setResorts={setResorts} />
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
  },
  filters: {
    backgroundColor: '#d5edf1',
    display: 'flex',
    flexDirection: 'row',
  },
  filterButton: {
    margin: 5,
  },
  buttonText: {
    fontSize: 20
  }
});