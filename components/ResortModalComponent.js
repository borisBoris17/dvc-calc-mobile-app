import { useState } from "react";
import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Button, Checkbox, Modal, Text, useTheme } from "react-native-paper";

export default function ResortModalComponent({ openResorts, onDismissResorts, resorts, setResorts }) {
  const theme = useTheme();

  const handleUpdateSelected = (resort) => {
    const updatedResorts = resorts.map(oldResort => {
      if (oldResort.name === resort.name) {
        return { ...oldResort, selected: !resort.selected }
      } else {
        return oldResort;
      }
    });
    setResorts(updatedResorts)
  }

  const handleSelectAll = (currentValue) => {
    const updatedResorts = resorts.map(oldResort => {
      return { ...oldResort, selected: !currentValue }
    });
    setResorts(updatedResorts)
  }

  const styles = StyleSheet.create({
    container: {
      margin: '5%',
      backgroundColor: theme.colors.tertiary,
      margin: 20,
      height: 500,
      width: '90%',
      borderRadius: 5,
    },
    resortRow: {
      display: 'flex',
      flexDirection: 'row',
      margin: 10
    },
    resortLabel: {
      flex: 1,
      width: '90%',
      alignItems: 'right',
      fontSize: 24,
      color: theme.colors.primary,
    },
    modalTitleRow: {
      display: 'flex',
      flexDirection: 'row',
      borderBottomWidth: 3,
      borderBottomColor: theme.colors.primary,
      alignItems: 'center'
    },
    modalTitle: {
      flex: 1,
      fontSize: 24,
      margin: 10,
      color: theme.colors.primary,
    },
    buttonText: {
      fontSize: 20,
      color: theme.colors.primary,
    },
    closeButton: {
      margin: 10
    }
  });

  return (
    <Modal visible={openResorts} onDismiss={onDismissResorts} contentContainerStyle={styles.container}>
      <View style={styles.modalTitleRow}>
        <Text style={styles.modalTitle}>Resorts</Text>
        <Button onPress={onDismissResorts} labelStyle={styles.buttonText} style={styles.closeButton}>Close</Button>
      </View>
      <ScrollView>
        <TouchableWithoutFeedback
          onPress={() => handleSelectAll(resorts?.filter(resort => resort.selected).length === resorts.length)}>
          <View style={styles.resortRow}>
            <Checkbox
              status={
                resorts?.filter(resort => resort.selected).length === resorts.length ? 'checked' : 'unchecked'}
              onPress={() => handleSelectAll(resorts?.filter(resort => resort.selected).length === resorts.length)}
            />
            <Text style={styles.resortLabel}>Select All</Text>
          </View>
        </TouchableWithoutFeedback>
        {resorts?.map(resort => (
          <TouchableWithoutFeedback
            key={resort.name}
            onPress={() => handleUpdateSelected(resort)}>
            <View style={styles.resortRow}>
              <Checkbox
                status={resort.selected ? 'checked' : 'unchecked'}
                onPress={() => handleUpdateSelected(resort)}
              />
              <Text style={styles.resortLabel}>{resort.name}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </Modal>
  );
}

