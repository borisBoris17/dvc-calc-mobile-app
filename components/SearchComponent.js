import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Constants from 'expo-constants';
import { useState, useCallback, useEffect } from 'react';
import { Button, Text, IconButton, Modal } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import {
  en,
  registerTranslation,
} from 'react-native-paper-dates'
registerTranslation('en', en)

export default function SearchComponent({ db, navigation }) {

  const [range, setRange] = useState({ startDate: undefined, endDate: undefined })
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({ startDate, endDate }) => {
      const checkInDate = new Date(startDate.toLocaleDateString())
      const checkOutDate = new Date(endDate.toLocaleDateString())
      setOpen(false);
      setRange({ startDate: checkInDate, endDate: checkOutDate });
    },
    [setOpen, setRange]
  );

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  const runTransaction = (sql) => {
    return new Promise(resolve => {
      db.transaction(tx => {
        tx.executeSql(
          sql,
          undefined,
          (_, { rows: { _array } }) => resolve(_array),
          (txObj, error) => console.log('Error ', error)
        );
      })
    })
  }

  function fetchPointsForNight(viewTypeId, dateStr, date) {
    return new Promise(resolve => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM point_value WHERE view_type_id = ? and start_date <= ? and end_date >= ? ORDER BY view_type_id ASC',
          [viewTypeId, dateStr, dateStr],
          (_, { rows: { _array } }) => {
            if (date.getDay() == 5 || date.getDay() == 6) {
              resolve(_array[0]?.weekend_rate);
            }
            resolve(_array[0]?.weekday_rate);
          },
          (txObj, error) => console.log('Error fetch points ', error)
        );
      })
    });
  }

  const handleSearch = async () => {
    if (range.startDate && range.endDate) {
      setIsLoading(true)
      const foundResorts = await runTransaction('select * from resort;');
      const resortArray = [];
      await Promise.all(foundResorts.map(async resort => {
        const foundRoomTypes = await runTransaction(`SELECT * FROM room_type WHERE resort_id = ${resort.resort_id} ORDER BY room_type_id ASC`);
        let roomTypeArray = [];
        await Promise.all(foundRoomTypes.map(async roomType => {
          const foundViewTypes = await runTransaction(`SELECT * FROM view_type WHERE room_type_id = ${roomType.room_type_id} ORDER BY view_type_id ASC`)
          const viewTypeArray = [];
          await Promise.all(foundViewTypes.map(async viewType => {
            let currentDate = new Date(range.startDate);
            let totalPointsNeeded = 0;
            let dates = [];
            while (currentDate < range.endDate) {
              const amountForDay = await fetchPointsForNight(viewType.view_type_id, formatDate(currentDate), currentDate);
              // add the date need for that day to the response obj

              // total the amount for the whole stay
              totalPointsNeeded = totalPointsNeeded + amountForDay;
              // add the points need for that day to the response obj
              dates.push({
                date: currentDate.toLocaleDateString(),
                points: amountForDay
              })
              currentDate.setDate(currentDate.getDate() + 1);
            }
            viewTypeArray.push({
              view_type_id: viewType.view_type_id,
              view_type_name: viewType.name,
              totalPoints: totalPointsNeeded,
              dates: dates
            });
          }))
          roomTypeArray.push({
            room_type_id: roomType.room_type_id,
            room_type_name: roomType.name,
            viewTypes: viewTypeArray
          })
        }))
        resortArray.push({
          resort_id: resort.resort_id,
          resort_name: resort.name,
          roomTypes: roomTypeArray
        })
      }))
      const responseObj = {
        'resorts': resortArray
      }
      setIsLoading(false)
      navigation.navigate('Results', { results: responseObj, checkInDate: range.startDate, checkOutDate: range.endDate })    }
  }

  return (
    <>
      <View style={styles.statusBar}></View>
      <View style={styles.container}>
        <View style={styles.appTitle}>
          <Text style={{ fontSize: 65, fontWeight: 'bold', textAlign: 'center', marginBottom: -20, color: '#00232c' }} variant="displayLarge">DVC</Text>
          <Text style={{ fontSize: 30, textAlign: 'center', color: '#00232c' }} variant="headlineMedium">Calculator</Text>
        </View>
        <View style={styles.dateTitle}><Text variant="bodyLarge">Dates</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setOpen(true)}>
            <Text style={styles.button}>
              {range.startDate && range.endDate ?
                `${range.startDate.toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })} - ${range.endDate.toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}`
                : `Select Dates for your stay!`}
            </Text>
            {range.endDate && range.startDate ? <IconButton
              style={styles.closeButton}
              icon="close"
              iconColor="#000"
              size={22}
              onPress={() => setRange({ startDate: undefined, endDate: undefined })}
            /> : ''}
          </TouchableOpacity>
        </View>
        <DatePickerModal
          locale="en"
          mode="range"
          visible={open}
          onDismiss={onDismiss}
          startDate={range.startDate}
          endDate={range.endDate}
          onConfirm={onConfirm}
        />
        <Button onPress={range.startDate === undefined && range.endDate === undefined ? () => {} : () => {handleSearch()}} labelStyle={styles.searchText} mode="contained" style={range.startDate === undefined && range.endDate === undefined ? styles.disabledButton : styles.searchButton}>Search</Button>
        <Modal visible={isLoading} dismissable={false} contentContainerStyle={styles.loadingIndicator}>
          <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            source={require('../assets/loading.gif')}
          />
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d5edf1',
    padding: 10,
    alignItems: 'center'
  },
  statusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: '#d5edf1',
  },
  appTitle: {
    marginTop: 50,
    marginBottom: 150,
    color: '#00232c',
    textAlign: 'center'
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 22,
    flex: 1,
  },
  dateTitle: {
    borderBottomColor: '#0D45A0',
    borderBottomWidth: 3,
    width: '95%'
  },
  dateInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchButton: {
    marginTop: 80,
    backgroundColor: '#0D45A0',
  },
  disabledButton: {
    marginTop: 80,
    color: '#666666',
    backgroundColor: '#cccccc',
  },
  searchText: {
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  closeButton: {
    marginBottom: 5
  },
  loadingIndicator: {
    margin: '5%',
    backgroundColor: 'white',
    padding: 20,
    height: '80%',
    width: '90%',
    borderRadius: 5,
  }
});