import { StyleSheet, Text, View } from 'react-native'; import Constants from 'expo-constants';
import ViewTypeComponent from './ViewTypeComponent';


export default function RoomTypeComponent({roomType}) {

  return (
    <View style={styles.roomTypeContainer}>
      <Text style={styles.roomTypeName}>{roomType.room_type_name}</Text>
      {roomType.viewTypes.map((viewType) => (
        <ViewTypeComponent key={viewType.view_type_id} viewType={viewType}></ViewTypeComponent>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  roomTypeName: {
    fontSize: 18,
    padding: 5
  },
  roomTypeContainer: {
    borderLeftWidth: 1,
    width: '90%',
    margin: 10
  }
});