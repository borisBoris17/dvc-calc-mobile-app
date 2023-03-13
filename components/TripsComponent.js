import { StyleSheet, View, Text, ScrollView } from 'react-native'; import Constants from 'expo-constants';
import { useTheme } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { removeTrip, runTransaction } from '../util';
import { TripComponent } from './TripComponent';

export function TripsComponent({ db, index }) {
  const [trips, setTrips] = useState([])

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
      alignItems: 'center',
      display: 'flex',
    },
    statusBar: {
      height: Constants.statusBarHeight,
      backgroundColor: theme.colors.primaryContainer,
    },
    pageTitle: {
      marginVertical: 20,
      textAlign: 'center'
    },
    scrollContainer: {
      width: '90%',
      height: Constants.height,
      marginBottom: 30,
    }
  });

  const fetchTrips = async () => {
    if (db !== undefined) {
      const foundTrips = await runTransaction(db, 'select * from trip order by check_in_date ASC;');
      let builtTrips = []
      await Promise.all(foundTrips.map(async (trip) => {
        let contractStr = 'No Contract Selected'
        if (trip.contract_id !== null) {
          const contract = (await runTransaction(db, `select * from contract where contract_id = ${trip.contract_id}`))[0]
          const homeResortName = (await runTransaction(db, `select name from resort where resort_id = ${contract.home_resort_id}`))[0].name
          contractStr = homeResortName + ' - ' + contract.use_year?.substring(0, 3) + ' - ' + contract.points
        }
        const newTrip = { trip_id: trip.trip_id, resortName: trip.resort_name, viewTypeName: trip.view_type_name, roomTypeName: trip.room_type_name, checkInDate: trip.check_in_date, checkOutDate: trip.check_out_date, points: trip.points, contract: contractStr, contract_id: trip.contract_id }
        builtTrips = [...builtTrips, newTrip];
      }));
      setTrips(builtTrips)
    }
  }

  useEffect(() => {
    if (db !== undefined) {
      fetchTrips();
    }
  }, [db, index])

  const handleDeleteTrip = (trip) => {
    removeTrip(db, trip);
    const newTrips = trips.filter(tripInState => tripInState.trip_id !== trip.trip_id)
    setTrips(newTrips)
  }

  return (
    <>
      <View style={styles.statusBar}></View>
      <View style={styles.container}>
        <View style={styles.pageTitle}>
          <Text style={{ fontSize: 45, fontWeight: 'bold', textAlign: 'center', color: '#00232c' }}>Trips</Text>
        </View>
        <ScrollView style={styles.scrollContainer}>
          {trips?.map(trip => (<TripComponent key={trip.trip_id} trip={trip} handleDeleteTrip={handleDeleteTrip}/>))}
        </ScrollView>
      </View>
    </>
  )
}
