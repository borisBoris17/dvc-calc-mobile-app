import React from 'react';
import { Alert, StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import PointAllotmentsComponent from './PointAllotmentsComponent';

export default function UseYearComponent({ db, fetchContracts, contractsForUseYear, useYear, handleDeleteContract }) {

  const theme = useTheme();

  const styles = StyleSheet.create({
    useYearContainer: {
      padding: 10,
      marginVertical: 10,
      marginHorizontal: 5,
    },
    useYearLabel: {
      fontSize: 18,
      color: theme.colors.primary,
    },
    resortRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    homeResortLabel: {
      fontSize: 24,
      flex: 1,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    contractPoints: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
  });

  const handleRemoveContract = (contractId, useYear) => {
    Alert.alert('Remove Contract', 'Proceed with deleting Contract?', [
      {
        text: 'Cancel',
        onPress: () => { },
        style: 'cancel',
      },
      { text: 'OK', onPress: () => handleDeleteContract(contractId, useYear) },
    ]);
  }

  return (
    <>
      <Card style={styles.useYearContainer} >
        <Text style={styles.useYearLabel}>{useYear}</Text>
        {contractsForUseYear?.map((contract, index) => (
          <React.Fragment key={index}>
            <View style={styles.resortRow}>
              <Text style={styles.homeResortLabel}>{contract.homeResort}</Text>
              <Text style={styles.contractPoints}>{`${contract.points} pts`} </Text>
            </View>
            <PointAllotmentsComponent db={db} contract={contract} handleRemoveContract={handleRemoveContract} fetchContracts={fetchContracts}/>
          </React.Fragment>
        ))}
      </Card>
    </>
  )
}