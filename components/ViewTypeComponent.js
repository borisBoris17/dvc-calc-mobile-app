import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; import Constants from 'expo-constants';
import { useState } from 'react';


export default function ViewTypeComponent({ viewType }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View style={styles.viewTypeContainer}>
      <Text style={styles.viewTypeName}>{viewType.view_type_name}</Text>
      <Text style={styles.totalPoints}>Total Points: {viewType.totalPoints}</Text>
      {showDetails ?
        <TouchableOpacity onPress={() => setShowDetails(false)}><Text style={styles.detailsButton}>Close Details</Text></TouchableOpacity>
        : <TouchableOpacity onPress={() => setShowDetails(true)}><Text style={styles.detailsButton}>Details</Text></TouchableOpacity>
      }
      {showDetails ? 
        viewType.dates.map((detail) => (
          <View style={styles.detail}>
            <Text style={styles.nightlyPoints}>{detail.date}</Text>
            <Text >{detail.points} pts</Text>
          </View>
        ))
      : ''}
    </View>
  )
}

const styles = StyleSheet.create({
  viewTypeName: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5
  },
  totalPoints: {
    fontSize: 14,
    padding: 5
  },
  viewTypeContainer: {
    width: '90%',
    borderTopWidth: 1,
    margin: 10
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
  }
});