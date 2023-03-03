import Constants from 'expo-constants';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";
import { monthToNumberMap } from '../util';

export default function UseYearComponent({ contractsForUseYear, useYear, handleDeleteContract }) {

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
    yearRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
    },
    yearLabel: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.primary,
    },
    availablePoints: {
      fontSize: 16,
      color: theme.colors.primary,
    },
    removeButtonRow: {
      display: 'flex',
      flexDirection: 'flex',
      justifyContent: 'right',
      alignContent: 'flex-end'
    },
    removeButton: {
      margin: 5,
      marginLeft: 'auto'
    },
    removeButtonLabel: {
      color: 'red'
    }
  });

  const buildAvailablePointsBlock = (contract) => {
    const { contract_id, use_year, points: fullPoints } = contract
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    let yearToDisplay = currentYear
    // convert useYear to - based index
    // for feb its 1 
    const useYearIndex = monthToNumberMap.get(contract.useYear);
    // fetch all the yearly point rows for the contract - display the current and the next two (3 total)
    if (useYearIndex > currentMonth) {
      yearToDisplay = currentYear - 1;
    }
    const lastYearToDisplay = yearToDisplay + 2;
    const availablePoints = [];
    while (yearToDisplay <= lastYearToDisplay) {
      // fetch yearly point for contract and year

      const foundYearlyPoints = contract.allotments.filter(yearlyPoint => yearlyPoint.contract_id === contract_id && yearlyPoint.year === yearToDisplay)[0]
      if (foundYearlyPoints != undefined) {
        availablePoints.push(foundYearlyPoints);
      }
      yearToDisplay++;
    }
    return (
      availablePoints?.map((availablePoint, index) => (
        <React.Fragment key={index}>
          <View style={styles.yearRow}><Text style={styles.yearLabel}>{availablePoint.year}</Text><Text style={styles.availablePoints}>{`${availablePoint.points_available} pts`}</Text></View>
        </React.Fragment>
      )))
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
            <View style={styles.availablePoints}>
              {buildAvailablePointsBlock(contract)}
            </View>
            <View style={styles.removeButtonRow}>
              <TouchableOpacity style={styles.removeButton} onPress={() => handleDeleteContract(contract.contract_id, contract.use_year)}>
                <Text style={styles.removeButtonLabel}>Remove</Text>
              </TouchableOpacity>
            </View>
          </React.Fragment>
        ))}
      </Card>
    </>
  )
}