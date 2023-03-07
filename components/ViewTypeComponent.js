import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { Card, useTheme, Button } from 'react-native-paper';


export default function ViewTypeComponent({ viewType, setOpenSaveTrip, roomTypeName, resortName, setTrip }) {
  const [showDetails, setShowDetails] = useState(false);

  const theme = useTheme();

  const styles = StyleSheet.create({
    viewTypeName: {
      flex: 1,
      fontSize: 14,
      fontWeight: 'bold',
      padding: 5
    },
    totalPoints: {
      padding: 5
    },
    totalPointsText: {
      fontSize: 34,
      textAlign: 'center',
      marginBottom: -5
    },
    pointsLabel: {
      fontSize: 14,
      textAlign: 'center'
    },
    viewTypeContainer: {
      width: '90%',
      borderRadius: 5,
      margin: 10,
      marginRight: 0,
      padding: 5,
      backgroundColor: theme.colors.tertiary,
    },
    totalPointSection: {
      display: 'flex',
      flexDirection: 'row',
    },
    detailsContainer: {
      marginBottom: 5,
    },
    detailsButton: {
      fontSize: 14,
      textDecorationLine: 'underline',
      padding: 5
    },
    detail: {
      flexDirection: 'row',
      margin: 5
    },
    nightlyPoints: {
      flex: 1,
    },
    saveTripLabel: {
      fontSize: 18,
    },
    saveButtonContainer: {
      display: 'flex',
      flexDirection: 'flex',
      justifyContent: 'right',
      alignContent: 'flex-end',
      margin: -5
    },
    saveButton: {
      marginRight: 5,
      marginLeft: 'auto'
    }
  });

  const handleSave = () => {
    const trip = {
      resortName: resortName,
      roomTypeName: roomTypeName,
      viewTypeName: viewType.view_type_name,
      points: viewType.totalPoints,
    }
    setTrip(trip)
    setOpenSaveTrip(true)
  }

  return (
    <Card style={styles.viewTypeContainer}>
      <View style={styles.totalPointSection}>
        <Text style={styles.viewTypeName}>{viewType.view_type_name}</Text>
        <View style={styles.totalPoints}>
          <Text style={styles.totalPointsText}>{viewType.totalPoints}</Text>
          <Text style={styles.pointsLabel}>points</Text>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        {showDetails ?
          <TouchableOpacity onPress={() => setShowDetails(false)}><Text style={styles.detailsButton}>Close Details</Text></TouchableOpacity>
          : <TouchableOpacity onPress={() => setShowDetails(true)}><Text style={styles.detailsButton}>Details</Text></TouchableOpacity>
        }
        {showDetails ?
          viewType.dates.map((detail, index) => (
            <View key={index} style={styles.detail}>
              <Text style={styles.nightlyPoints}>{detail.date}</Text>
              <Text >{detail.points} pts</Text>
            </View>
          ))
          : ''}
      </View>
      <View style={styles.saveButtonContainer}>
        <Button style={styles.saveButton} onPress={() => handleSave()} labelStyle={styles.saveTripLabel}>Save</Button>
      </View>
    </Card>
  )
}

