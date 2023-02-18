import { StyleSheet, View } from 'react-native'; import Constants from 'expo-constants';
import RoomTypeComponent from './RoomTypeComponent';

export default function ResortComponent({resort}) {

  return (
    <View style={styles.container}>
      {resort.roomTypes.map((roomType) => (
        <RoomTypeComponent key={roomType.room_type_id} roomType={roomType}></RoomTypeComponent>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    margin: 10
  },
  resortName: {
    backgroundColor: '#00232c',
    color: 'white',
    fontSize: 24,
    padding: 5,
  },
  roomTypeContainer: {
    borderWidth: 1,
    width: '90%',
    margin: 10
  }
});