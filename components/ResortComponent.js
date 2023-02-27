import { StyleSheet, View } from 'react-native'; import Constants from 'expo-constants';
import RoomTypeComponent from './RoomTypeComponent';

export default function ResortComponent({resort, roomTypes}) {

  return (
    <View style={styles.container}>
      {resort.roomTypes.map((roomType) => (
        <RoomTypeComponent key={roomType.room_type_id} roomType={roomType} roomTypes={roomTypes}></RoomTypeComponent>
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