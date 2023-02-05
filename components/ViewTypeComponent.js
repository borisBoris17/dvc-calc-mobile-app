import { StyleSheet, Text, View } from 'react-native'; import Constants from 'expo-constants';


export default function ViewTypeComponent({viewType}) {
  return (
    <View style={styles.viewTypeContainer}>
      <Text style={styles.viewTypeName}>{viewType.view_type_name}</Text>
      <Text style={styles.viewTypeName}>Total Points: {viewType.totalPoints}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  viewTypeName: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: 5
  },
  totalPoints: {
    fontSize: 12,
    padding: 5
  },
  viewTypeContainer: {
    width: '90%',
    borderTopWidth: 1,
    margin: 10
  }
});