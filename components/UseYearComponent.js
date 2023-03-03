import Constants from 'expo-constants';
import React, { useEffect } from 'react';
import { StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { monthToNumberMap } from '../util';


// const yearlyPoints = [{
//   yearlyPointsId: 1,
//   contractId: 1,
//   year: 2023,
//   amountAvailable: 154,
//   amountBanked: 0,
//   amountBorrowed: 0
// }, {
//   yearlyPointsId: 2,
//   contractId: 1,
//   year: 2024,
//   amountAvailable: 200,
//   amountBanked: 0,
//   amountBorrowed: 0
// }, {
//   yearlyPointsId: 3,
//   contractId: 1,
//   year: 2025,
//   amountAvailable: 200,
//   amountBanked: 0,
//   amountBorrowed: 0
// }, {
//   yearlyPointsId: 4,
//   contractId: 2,
//   year: 2023,
//   amountAvailable: 0,
//   amountBanked: 0,
//   amountBorrowed: 0
// }, {
//   yearlyPointsId: 5,
//   contractId: 2,
//   year: 2024,
//   amountAvailable: 150,
//   amountBanked: 0,
//   amountBorrowed: 0
// }, {
//   yearlyPointsId: 6,
//   contractId: 2,
//   year: 2025,
//   amountAvailable: 150,
//   amountBanked: 0,
//   amountBorrowed: 0
// }, {
//   yearlyPointsId: 7,
//   contractId: 3,
//   year: 2023,
//   amountAvailable: 0,
//   amountBanked: 50,
//   amountBorrowed: 0
// }, {
//   yearlyPointsId: 8,
//   contractId: 3,
//   year: 2024,
//   amountAvailable: 150,
//   amountBanked: 0,
//   amountBorrowed: 0
// }, {
//   yearlyPointsId: 9,
//   contractId: 3,
//   year: 2025,
//   amountAvailable: 100,
//   amountBanked: 0,
//   amountBorrowed: 0
// }]

export default function UseYearComponent({ contractsForUseYear, useYear }) {

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
  });

  useEffect(() => {

  }, [contractsForUseYear])

  const buildAvailablePointsBlock = (contract) => {
    const { contractId, useYear, points: fullPoints } = contract
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

      const foundYearlyPoints = contract.allotments.filter(yearlyPoint => yearlyPoint.contractId === contractId && yearlyPoint.year === yearToDisplay)[0]
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
            <View style={styles.resortRow}><Text style={styles.homeResortLabel}>{contract.homeResort}</Text><Text style={styles.contractPoints}>{`${contract.points} pts`} </Text></View>
            <View style={styles.availablePoints}>
              {buildAvailablePointsBlock(contract)}
            </View>
          </React.Fragment>
        ))}
      </Card>
    </>
  )
}