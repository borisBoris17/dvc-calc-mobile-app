import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Constants from 'expo-constants';
import { useState, useCallback, useEffect } from 'react';
import { Button, Text, IconButton, Modal, Checkbox } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { PaperSelect } from 'react-native-paper-select';
import {
  en,
  registerTranslation,
} from 'react-native-paper-dates'
registerTranslation('en', en)
import ResortModalComponent from './ResortModalComponent';
import { fetchResults } from '../util';

export default function SearchComponent({ db, navigation, resorts, setResorts }) {

  const [range, setRange] = useState({ startDate: undefined, endDate: undefined })
  const [open, setOpen] = useState(false);
  const [openResorts, setOpenResorts] = useState(false);
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

  const onDismissResorts = useCallback(() => {
    setOpenResorts(false);
  }, [setOpen]);

  const handleSearch = async () => {
    if (range.startDate && range.endDate) {
      setIsLoading(true)
      const responseObj = await fetchResults(db, range);
      setIsLoading(false)
      navigation.navigate('Results', { 
        results: responseObj, 
        checkInDate: range.startDate, 
        checkOutDate: range.endDate, 
        resorts: resorts, 
        setResorts: setResorts 
      })
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
        <View style={styles.dateTitle}>
          <Text variant="bodyLarge">Dates</Text>
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
        <View style={styles.dateTitle}>
          <Text variant="bodyLarge">Resorts</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setOpenResorts(true)}>
            <Text style={styles.button}>
              {resorts?.filter(resort => resort.selected).length === 0 ?
                `Select Resorts...`
                : resorts?.filter(resort => resort.selected).length === 1 ? `1 Resort Selected...` : `${resorts?.filter(resort => resort.selected).length} Resorts Selected...`}
            </Text>
          </TouchableOpacity>
        </View>
        <Button
          onPress={(range.startDate === undefined && range.endDate === undefined) || resorts?.filter(resort => resort.selected).length === 0 ? () => { } : () => { handleSearch() }} 
          labelStyle={styles.searchText} 
          mode="contained" 
          style={(range.startDate === undefined && range.endDate === undefined) || resorts?.filter(item => item.selected).length === 0 ? styles.disabledButton : styles.searchButton}>Search</Button>
        <ResortModalComponent openResorts={openResorts} onDismissResorts={onDismissResorts} resorts={resorts} setResorts={setResorts} />
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
    width: '95%',
    marginBottom: 20,
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

