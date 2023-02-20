import { useState } from "react";
import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Button, Checkbox, Modal, Text, useTheme } from "react-native-paper";

export default function RoomTypeModalComponent({ openRoomTypes, onDismissRoomTypes, roomTypes, setRoomTypes }) {
  const theme = useTheme();

  const handleUpdateSelected = (roomType) => {
    const updatedRoomTypes = roomTypes.map(oldRoomType => {
      if (oldRoomType.name === roomType.name) {
        return { ...oldRoomType, selected: !roomType.selected }
      } else {
        return oldRoomType;
      }
    });
    setRoomTypes(updatedRoomTypes)
  }

  const handleSelectAll = (currentValue) => {
    const updatedRoomTypes = roomTypes.map(oldRoomType => {
      return { ...oldRoomType, selected: !currentValue }
    });
    setRoomTypes(updatedRoomTypes)
  }

  const styles = StyleSheet.create({
    container: {
      margin: '5%',
      backgroundColor: theme.colors.secondary,
      margin: 20,
      height: 500,
      width: '90%',
      borderRadius: 5,
    },
    roomTypeRow: {
      display: 'flex',
      flexDirection: 'row',
      margin: 10
    },
    roomTypeLabel: {
      flex: 1,
      width: '90%',
      alignItems: 'right',
      fontSize: 24
    },
    modalTitleRow: {
      display: 'flex',
      flexDirection: 'row',
      borderBottomWidth: 3,
      alignItems: 'center'
    },
    modalTitle: {
      flex: 1,
      fontSize: 24,
      margin: 10
    },
    buttonText: {
      fontSize: 20,
    },
    closeButton: {
      margin: 10
    }
  });

  return (
    <Modal visible={openRoomTypes} onDismiss={onDismissRoomTypes} contentContainerStyle={styles.container}>
      <View style={styles.modalTitleRow}>
        <Text style={styles.modalTitle}>Room Types</Text>
        <Button onPress={onDismissRoomTypes} labelStyle={styles.buttonText} style={styles.closeButton}>Close</Button>
      </View>
      <ScrollView>
        <TouchableWithoutFeedback
          onPress={() => handleSelectAll(roomTypes?.filter(roomType => roomType.selected).length === roomTypes.length)}>
          <View style={styles.roomTypeRow}>
            <Checkbox
              status={
                roomTypes?.filter(roomType => roomType.selected).length === roomTypes.length ? 'checked' : 'unchecked'}
              onPress={() => handleSelectAll(roomTypes?.filter(roomType => roomType.selected).length === roomTypes.length)}
            />
            <Text style={styles.roomTypeLabel}>Select All</Text>
          </View>
        </TouchableWithoutFeedback>
        {roomTypes?.map(roomType => (
          <TouchableWithoutFeedback
            key={roomType.name}
            onPress={() => handleUpdateSelected(roomType)}>
            <View style={styles.roomTypeRow}>
              <Checkbox
                status={roomType.selected ? 'checked' : 'unchecked'}
                onPress={() => handleUpdateSelected(roomType)}
              />
              <Text style={styles.roomTypeLabel}>{roomType.name}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </Modal>
  );
}

