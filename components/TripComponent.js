import moment from 'moment';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { tr } from 'react-native-paper-dates';
import { formatDate } from '../util';

export function TripComponent({ trip, handleDeleteTrip }) {

  const theme = useTheme();

  const handleRemoveTrip = () => {
    Alert.alert('Remove Trip', 'Proceed with deleting Trip?', [
      {
        text: 'Cancel',
        onPress: () => { },
        style: 'cancel',
      },
      { text: 'OK', onPress: () => handleDeleteTrip(trip) },
    ]);
  }

  const calculateDaysUntilTrip = (checkInDate) => {
    const today = moment();
    const checkInDateObj = moment(checkInDate)
    return checkInDateObj.diff(today, 'days')
  }

  const daysUntilTrip = calculateDaysUntilTrip(trip.checkInDate)

  const styles = StyleSheet.create({
    container: {
      padding: 10,
      marginVertical: 10,
      marginHorizontal: 5,
    },
    tripContainer: {
      display: 'flex',
    },
    titleRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    resortNameStyle: {
      margin: 5,
      fontSize: 34,
      flex: 1,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    daysAwayStyle: {
      fontSize: 24,
      color: theme.colors.primary,
    },
    viewAndRoomStyle: {
      marginHorizontal: 5,
      fontSize: 20
    },
    dateRangeStyle: {
      marginHorizontal: 5,
      fontSize: 20
    },
    pointsStyle: {
      marginHorizontal: 5,
      fontSize: 20
    },
    removeButtonRow: {
      display: 'flex',
      flexDirection: 'flex',
      justifyContent: 'right',
      alignContent: 'flex-end'
    },
    removeButton: {
      margin: 5,
      marginLeft: 'auto'
    },
    removeButtonLabel: {
      color: 'red'
    }
  });

  return (
    <Card style={styles.container}>
      <View style={styles.tripContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.resortNameStyle}>{trip.resortName}</Text>
          {daysUntilTrip > 0 ? <Text style={styles.daysAwayStyle}>{daysUntilTrip} Days</Text> : daysUntilTrip === 0 ? <Text style={styles.daysAwayStyle}>It's Disney Day!</Text> : ''}
        </View>
        <Text style={styles.viewAndRoomStyle}>{trip.viewTypeName} - {trip.roomTypeName}</Text>
        <Text style={styles.dateRangeStyle}>{formatDate(moment(trip.checkInDate))} - {formatDate(moment(trip.checkOutDate))}</Text>
        <Text style={styles.pointsStyle}>{trip.points} points</Text>
        <Text style={styles.pointsStyle}>Contract: {trip.contract}</Text>
        <View style={styles.removeButtonRow}>
          <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveTrip()}>
            <Text style={styles.removeButtonLabel}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>

    </Card>
  )
}
