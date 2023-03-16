import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { formatDate } from '../util';

export function TripComponent({ trip, handleDeleteTrip }) {

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: 10,
      marginVertical: 10,
      marginHorizontal: 5,
    },
    tripContainer: {
      display: 'flex',
    },
    resortNameStyle: {
      margin: 5,
      fontSize: 34
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
        <Text style={styles.resortNameStyle}>{trip.resortName}</Text>
        <Text style={styles.viewAndRoomStyle}>{trip.viewTypeName} - {trip.roomTypeName}</Text>
        <Text style={styles.dateRangeStyle}>{formatDate(new Date(trip.checkInDate))} - {formatDate(new Date(trip.checkOutDate))}</Text>
        <Text style={styles.pointsStyle}>{trip.points} points</Text>
        <Text style={styles.pointsStyle}>Contract: {trip.contract}</Text>
        <View style={styles.removeButtonRow}>
          <TouchableOpacity style={styles.removeButton} onPress={() => handleDeleteTrip(trip)}>
            <Text style={styles.removeButtonLabel}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>

    </Card>
  )
}
