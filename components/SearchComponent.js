import { StyleSheet, TouchableOpacity, View, Image } from 'react-native'; import Constants from 'expo-constants';
import { useState, useCallback } from 'react';
import { Button, Text, IconButton, Modal } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import axios from 'axios';
import {
  en,
  registerTranslation,
} from 'react-native-paper-dates'
registerTranslation('en', en)

export default function SearchComponent({ navigation }) {
  const [range, setRange] = useState({ startDate: undefined, endDate: undefined })
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);
      setRange({ startDate, endDate });
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

  const handleSearch = () => {
    if (range.startDate && range.endDate) {
      setIsLoading(true);
      const formatedBeginDate = formatDate(range.startDate);
      const formatedEndDate = formatDate(range.endDate);
      axios.get(`https://dvc-calc.tucker-dev.com/dvc-calc-api/pointAmount/${formatedBeginDate}/${formatedEndDate}`).then((response, error) => {
        if (error) {
          console.log('There was an error: ', error);
        }
        setIsLoading(false);
        navigation.navigate('Results', { results: response.data, checkInDate: range.startDate, checkOutDate: range.startDate })
      });
    }
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
              size={30}
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
        <Button onPress={handleSearch} labelStyle={styles.searchText} mode="contained" style={styles.searchButton}>Search</Button>
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
    height: '80%' , 
    width: '90%',
    borderRadius: 5,
  }
});