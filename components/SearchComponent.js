import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; import Constants from 'expo-constants';
import { useState } from 'react';
import moment from "moment";
import DateRangePicker from 'react-native-daterange-picker';
import axios from 'axios';

export default function SearchComponent({ navigation }) {
  const [beginDate, setBeginDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [displayedDate, setDisplayedDate] = useState(moment())

  const onDateChange = (dates) => {
    console.log(dates, dates['startDate'], dates['endDate'])
    if (dates['startDate']) {
      setBeginDate(dates['startDate']);
    }
    if (dates['endDate']) {
      setEndDate(dates['endDate']);
    }
  }

  const handleSearch = () => {
    if (beginDate && endDate) {
      const formatedBeginDate = beginDate.format('YYYY-MM-DD');
      const formatedEndDate = endDate.format('YYYY-MM-DD');
      console.log(`https://dvc-calc.tucker-dev.com/dvc-calc-api/pointAmount/${formatedBeginDate}/${formatedEndDate}`)
      axios.get(`https://dvc-calc.tucker-dev.com/dvc-calc-api/pointAmount/${formatedBeginDate}/${formatedEndDate}`).then((response, error) => {
        if (error) {
          console.log('There was an error: ', error);
        }
        navigation.navigate('Results', {results: response.data})
      });

    }
  }

  return (
    <View style={styles.container}>
      <DateRangePicker
        onChange={dates => onDateChange(dates)}
        endDate={endDate}
        startDate={beginDate}
        displayedDate={displayedDate}
        range>
        <View style={styles.button}><Text>Select Dates for your stay!</Text></View>
      </DateRangePicker>
      <Text>{`Begin Date - ${beginDate ? moment(beginDate).format('MM/DD/YYYY') : 'Select a Begin Date'}`}</Text>
      <Text>{`End Date - ${endDate ? moment(endDate).format('MM/DD/YYYY') : 'Select a End Date'}`}</Text>
      <TouchableOpacity onPress={handleSearch}><Text style={styles.button}>Search</Text></TouchableOpacity>
    </View>
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
  button: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: '#c3dddf'
  }
});