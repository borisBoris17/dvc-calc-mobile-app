import { StyleSheet, Text, View } from 'react-native'; import Constants from 'expo-constants';
import RoomTypeComponent from './RoomTypeComponent';


export default function ResortComponent({resort}) {

  const ViewTypeComponent = ({viewType}) => {
    <View style={styles.viewTypeContainer}>
      <Text style={styles.viewTypeName}>{viewType.view_type_name}</Text>
      <Text>{viewType.totalPoints}</Text>
    </View>
  }


  return (
    <View style={styles.container}>
      <Text style={styles.resortName}>{resort.resort_name}</Text>
      {resort.roomTypes.map((roomType) => (
        <RoomTypeComponent key={roomType.room_type_id} roomType={roomType}></RoomTypeComponent>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    width: '90%',
    margin: 10
  },
  resortName: {
    fontSize: 24,
    padding: 5
  },
  roomTypeContainer: {
    borderWidth: 1,
    width: '90%',
    margin: 10
  }
});