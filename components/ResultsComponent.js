import { ScrollView, StyleSheet, View } from 'react-native'; import Constants from 'expo-constants';
import { Button, Text, useTheme } from 'react-native-paper';

import { IconButton } from 'react-native-paper';
import ResortComponent from './ResortComponent';
import { LogBox } from 'react-native';
import { useCallback, useState } from 'react';
import ResortModalComponent from './ResortModalComponent';
import RoomTypeModalComponent from './RoomTypeModalComponent';
import SaveTripComponent from './SaveTripComponent';
import { formatDate } from '../util';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function ResultsComponent({ route, navigation, resorts, setResorts, roomTypes, setRoomTypes, db }) {
  const { results, checkInDate, checkOutDate } = route.params;

  const [openResortFilter, setOpenResortFilter] = useState(false);
  const [openRoomTypeFilter, setOpenRoomTypeFilter] = useState(false);
  const [openSaveTrip, setOpenSaveTrip] = useState(false)
  const [trip, setTrip] = useState({})

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusBar: {
      height: Constants.statusBarHeight,
      backgroundColor: theme.colors.primaryContainer,
    },
    backButton: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryContainer,
    },
    dateDisplay: {
      flex: 1,
      textAlign: 'right',
      color: theme.colors.primary,
      paddingRight: 20,
      fontSize: 24
    },
    scrollStyle: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
    },
    resortHeader: {
      backgroundColor: theme.colors.primary,
      color: 'white',
      fontSize: 24,
      padding: 10,
    },
    filters: {
      backgroundColor: theme.colors.primaryContainer,
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

  const handleBack = () => {
    navigation.navigate('Search', {})
  }

  const onDismissResorts = useCallback(() => {
    setOpenResortFilter(false);
  }, [setOpenResortFilter]);

  const onDismissRoomTypes = useCallback(() => {
    setOpenRoomTypeFilter(false);
  }, [setOpenResortFilter]);

  const printResort = (resortName, resorts) => {
    const filteredArray = resorts.filter(function (resort) {
      return resort.resort_name === resortName;
    });

    if (filteredArray.length > 0) {
      return (
        <ResortComponent resort={filteredArray[0]} roomTypes={roomTypes} setOpenSaveTrip={setOpenSaveTrip} setTrip={setTrip} trip={trip}></ResortComponent>
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
        <Button style={styles.filterButton} labelStyle={styles.buttonText} onPress={() => setOpenRoomTypeFilter(true)} mode="contained" icon="filter">Room Types</Button>
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
        {resorts?.filter(resort => resort.name === 'Grand Californian')[0].selected ? <View><Text style={styles.resortHeader}>Grand Californian</Text></View> : ''}
        {resorts?.filter(resort => resort.name === 'Grand Californian')[0].selected ? printResort('Grand Californian', results.resorts) : ''}
      </ScrollView>
      <ResortModalComponent openResorts={openResortFilter} onDismissResorts={onDismissResorts} resorts={resorts} setResorts={setResorts} />
      <RoomTypeModalComponent openRoomTypes={openRoomTypeFilter} onDismissRoomTypes={onDismissRoomTypes} roomTypes={roomTypes} setRoomTypes={setRoomTypes} />
      <SaveTripComponent db={db} openSaveTrip={openSaveTrip} setOpenSaveTrip={setOpenSaveTrip} setTrip={setTrip} trip={trip} checkInDate={checkInDate} checkOutDate={checkOutDate}></SaveTripComponent>
    </>
  )
}
