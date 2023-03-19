import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text, TextInput, useTheme } from "react-native-paper";
import { monthToNumberMap, updatePointAllotments } from '../util';

export default function UseYearComponent({ db, fetchContracts, contractsForUseYear, useYear, handleDeleteContract }) {

  const theme = useTheme();
  const [editPoints, setEditPoints] = useState(false)
  const [allotmentsToUpdate, setAllotmentsToUpdate] = useState([])
  const [errorMsg, setErrorMsg] = useState('')

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
    errorContainer: {
      alignItems: 'center',
    },
    errorText: {
      color: 'red',
      fontSize: 18
    },
    availablePoints: {
      fontSize: 16,
      marginRight: 3,
      color: theme.colors.primary,
    },
    pointInput: {
      width: 130,
      textAlign: 'right',
    },
    removeButtonRow: {
      display: 'flex',
      flexDirection: 'row',
      marginVertical: 5,
    },
    editButton: {
      flex: 1,
      margin: 5,
      marginLeft: 'auto'
    },
    saveButton: {
      flex: 1,
      margin: 5,
      marginLeft: 'auto'
    },
    removeButton: {
      margin: 5,
      marginLeft: 'auto'
    },
    removeButtonLabel: {
      color: 'red'
    },
    editButtonLabel: {
      fontWeight: 'bold',
    },
    saveButtonLabel: {
      fontWeight: 'bold',
    },
  });

  const handleAllotmentPointChange = (text, allotment) => {
    if (isNaN(text)) {
      setErrorMsg('Enter a valid number');
    }
    const newAllotmentsToUpdate = allotmentsToUpdate.map(altmnt => {
      if (altmnt.point_allotment_id === allotment.point_allotment_id) {
        return {
          ...altmnt,
          points_available: text,
        };
      } else {
        return altmnt
      }
    });
    setAllotmentsToUpdate(newAllotmentsToUpdate)
  }

  const buildAvailablePointsBlock = (contract) => {
    const availablePoints = filterToRelaventYears(contract)
    return (
      availablePoints?.map((availablePoint, index) => (
        <React.Fragment key={index}>
          <View style={styles.yearRow}>
            <Text style={styles.yearLabel}>{availablePoint.year}</Text>
            <Text style={styles.availablePoints}>{`${availablePoint.points_available} pts`}</Text>
            {editPoints ? <><TextInput label='New Value' style={styles.pointInput} value={`${getMatchingAllotmentToUpdate(availablePoint.point_allotment_id).points_available}`} onChangeText={text => handleAllotmentPointChange(text, availablePoint)}></TextInput></> : ''}
          </View>
        </React.Fragment>
      )))
  }

  const getMatchingAllotmentToUpdate = (allotmentId) => {
    return allotmentsToUpdate.filter(allotment => allotment.point_allotment_id === allotmentId)[0]
  }

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

  const filterToRelaventYears = (contract) => {
    const { contract_id, use_year, points: fullPoints } = contract
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    let yearToDisplay = currentYear
    // convert useYear to - based index
    // for feb its 1 
    const useYearIndex = monthToNumberMap.get(contract.use_year);
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
    return availablePoints;
  }

  const handleEditPointAllotments = (contract) => {
    setAllotmentsToUpdate(filterToRelaventYears(contract))
    setEditPoints(true)
  }

  const handleSavePointAllotments = () => {
    setEditPoints(false)
    updatePointAllotments(db, allotmentsToUpdate);
    fetchContracts()
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
            {errorMsg !== '' ? <View style={styles.errorContainer}><Text style={styles.errorText}>{errorMsg}</Text></View> : ''}
            <View style={styles.availablePoints}>
              {buildAvailablePointsBlock(contract)}
            </View>
            <View style={styles.removeButtonRow}>
              {editPoints ?
                <TouchableOpacity style={styles.saveButton} onPress={() => handleSavePointAllotments(contract)}>
                  <Text style={styles.saveButtonLabel}>Save Yearly Points</Text>
                </TouchableOpacity> :
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditPointAllotments(contract)}>
                  <Text style={styles.editButtonLabel}>Edit Yearly Points</Text>
                </TouchableOpacity>}
              <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveContract(contract.contract_id, contract.use_year)}>
                <Text style={styles.removeButtonLabel}>Remove</Text>
              </TouchableOpacity>
            </View>
          </React.Fragment>
        ))}
      </Card>
    </>
  )
}