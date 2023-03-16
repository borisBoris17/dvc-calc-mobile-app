import { StyleSheet, View } from 'react-native'; import Constants from 'expo-constants';
import RoomTypeComponent from './RoomTypeComponent';

export default function ResortComponent({resort, roomTypes, setOpenSaveTrip, setTrip}) {

  return (
    <View style={styles.container}>
      {resort.roomTypes.map((roomType) => (
        <RoomTypeComponent key={roomType.room_type_id} roomType={roomType} roomTypes={roomTypes} setOpenSaveTrip={setOpenSaveTrip} setTrip={setTrip} resortName={resort.resort_name}></RoomTypeComponent>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    margin: 10
  }
});